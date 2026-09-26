import { prisma } from "../db/prisma";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export interface DiagnosisResult {
  caseId: string;
  status: "DIAGNOSED";
  problemTypeId: string;
  problemType: string;
  category: string;
  stage: string;
  cause: string;
  diagnosis: string;
  requiredSkills: string[];
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  confidenceWeight: number;
}

export interface AskAnalysisResult {
  isGibberish?: boolean;
  error?: string;
  domain: string;
  subdomain: string;
  skills: string[];
  recommendedDuration: 5 | 10 | 15;
  durationReasoning: string;
  clarifyingQuestions: string[];
  problemSummary: string;
}

export interface DissatisfactionReportResult {
  reportId: string;
  previousExpertId: string;
  newExpertId: string;
  newExpertName: string;
  dissatisfactionSummary: string;
  unresolvedTopics: string[];
  remediationBrief: string;
  suggestedFocusArea: string;
  createdAt: string;
}


export async function runDiagnosisEngine(caseId: string): Promise<DiagnosisResult> {
  const deploymentCase = await prisma.deploymentCase.findUnique({
    where: { id: caseId },
    include: { problemType: true }
  });

  if (!deploymentCase) {
    throw new Error(`Deployment case with id ${caseId} not found.`);
  }

  const textToAnalyze = `${deploymentCase.title} ${deploymentCase.description} ${deploymentCase.technology} ${deploymentCase.deploymentPlatform} ${deploymentCase.ciCdTool}`.toLowerCase();

  // Load all rules with problem type and category
  const rules = await prisma.diagnosisRule.findMany({
    include: {
      problemType: {
        include: { category: true }
      }
    }
  });

  let bestMatchRule: (typeof rules)[0] | null = null;
  let highestScore = -1;

  for (const rule of rules) {
    let keywords: string[] = [];
    try {
      keywords = JSON.parse(rule.keywords);
    } catch (e) {
      keywords = [];
    }

    let matchCount = 0;
    for (const kw of keywords) {
      if (textToAnalyze.includes(kw.toLowerCase())) {
        matchCount++;
      }
    }

    // Give extra weight if technology/ciCdTool explicitly match keyword
    if (textToAnalyze.includes(rule.problemType.category.name.toLowerCase())) {
      matchCount += 2;
    }

    if (matchCount > highestScore) {
      highestScore = matchCount;
      bestMatchRule = rule;
    }
  }

  // Fallback to Docker Build Failed if no keywords hit
  if (!bestMatchRule || highestScore <= 0) {
    const fallbackRule = rules.find(r => r.problemTypeId === "PT_DOCKER_8") || rules[0];
    bestMatchRule = fallbackRule;
  }

  const problemType = bestMatchRule.problemType;
  let requiredSkills: string[] = [];
  try {
    requiredSkills = JSON.parse(bestMatchRule.requiredSkills);
  } catch (e) {
    requiredSkills = ["DevOps", "CI/CD"];
  }

  const diagnosisSummary = `Automated Diagnosis: ${problemType.name}. Stage: ${problemType.category.name}. Likely cause: ${problemType.cause}. Identified required skills: ${requiredSkills.join(", ")}.`;

  const structuredDiagnosis: DiagnosisResult = {
    caseId: deploymentCase.id,
    status: "DIAGNOSED",
    problemTypeId: problemType.id,
    problemType: problemType.name,
    category: problemType.category.name,
    stage: problemType.category.name,
    cause: problemType.cause,
    diagnosis: diagnosisSummary,
    requiredSkills,
    priority: (deploymentCase.priority as any) || bestMatchRule.priority,
    confidenceWeight: Math.min(0.98, 0.70 + highestScore * 0.05)
  };

  // Update deployment case in database
  await prisma.deploymentCase.update({
    where: { id: caseId },
    data: {
      problemTypeId: problemType.id,
      status: "DIAGNOSED",
      diagnosis: JSON.stringify(structuredDiagnosis)
    }
  });

  return structuredDiagnosis;
}

export interface ExpertMatchResult {
  expertId: string;
  name: string;
  avatar: string;
  headline: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  pricing10: number;
  score: number;
  matchReasons: string[];
  relevantSkills: string[];
}

export async function matchExpertsForCase(caseId: string): Promise<ExpertMatchResult[]> {
  const deploymentCase = await prisma.deploymentCase.findUnique({
    where: { id: caseId }
  });

  if (!deploymentCase) {
    throw new Error(`Deployment case ${caseId} not found.`);
  }

  let requiredSkills: string[] = ["DevOps", "CI/CD", "Docker"];
  if (deploymentCase.diagnosis) {
    try {
      const parsed = JSON.parse(deploymentCase.diagnosis);
      if (Array.isArray(parsed.requiredSkills) && parsed.requiredSkills.length > 0) {
        requiredSkills = parsed.requiredSkills;
      }
    } catch (e) {
      // fallback
    }
  }

  // Add technology and CI/CD tool to relevant skill set
  if (deploymentCase.ciCdTool && !requiredSkills.includes(deploymentCase.ciCdTool)) {
    requiredSkills.push(deploymentCase.ciCdTool);
  }
  if (deploymentCase.deploymentPlatform && !requiredSkills.includes(deploymentCase.deploymentPlatform)) {
    requiredSkills.push(deploymentCase.deploymentPlatform);
  }

  // Load only APPROVED experts
  const experts = await prisma.expertProfile.findMany({
    where: {
      verificationStatus: "APPROVED"
    },
    include: {
      user: true,
      skills: {
        include: { skill: true }
      }
    }
  });

  const matches: ExpertMatchResult[] = [];

  for (const expert of experts) {
    const expertSkillNames = expert.skills.map(s => s.skill.name);
    
    // Calculate primary factor: RELEVANT EXPERTISE
    const matchedSkills = requiredSkills.filter(req => 
      expertSkillNames.some(es => es.toLowerCase() === req.toLowerCase())
    );

    // If expert has no matching skills and requiredSkills is non-empty, give lower priority unless general DevOps
    const hasDevOps = expertSkillNames.includes("DevOps");
    if (matchedSkills.length === 0 && !hasDevOps) {
      continue;
    }

    const matchReasons: string[] = [...matchedSkills];
    if (hasDevOps && !matchReasons.includes("DevOps")) {
      matchReasons.push("DevOps");
    }

    // Scoring formula: (Primary expertise match count * 40) + (Rating * 10) + (Experience * 2) + (Discoverability * 0.2)
    const score = Math.round(
      matchedSkills.length * 40 + expert.rating * 10 + expert.yearsExperience * 2 + expert.discoverabilityScore * 0.2
    );

    matches.push({
      expertId: expert.id,
      name: `${expert.user.firstName} ${expert.user.lastName}`,
      avatar: expert.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      headline: expert.headline,
      rating: expert.rating,
      reviewCount: expert.reviewCount,
      experienceYears: expert.yearsExperience,
      pricing10: expert.pricing10,
      score,
      matchReasons,
      relevantSkills: expertSkillNames
    });
  }

  // Sort by score descending
  matches.sort((a, b) => b.score - a.score);

  // Store top matches in database (expert_matches table)
  const topMatches = matches.slice(0, 10);
  for (const m of topMatches) {
    await prisma.expertMatch.create({
      data: {
        deploymentCaseId: caseId,
        expertId: m.expertId,
        score: m.score,
        matchReasons: JSON.stringify(m.matchReasons)
      }
    });
  }

  // Update case status to MATCHED
  await prisma.deploymentCase.update({
    where: { id: caseId },
    data: { status: "MATCHED" }
  });

  return topMatches;
}

import { validateDeploymentQuery, DEPLOYMENT_VALIDATION_ERROR_MESSAGE } from "../../lib/validation/deploymentQueryValidator";

/**
 * Gemini LLM Problem Triage & Gibberish / Relevance Detection
 */
export async function analyzeAskQueryWithGemini(query: string): Promise<AskAnalysisResult> {
  const trimmed = query ? query.trim() : "";

  // Centralized Domain Relevance & Gibberish Check
  const validation = validateDeploymentQuery(trimmed);
  if (!validation.isValid) {
    return {
      isGibberish: true,
      error: validation.errorMessage || DEPLOYMENT_VALIDATION_ERROR_MESSAGE,
      domain: "Out of Scope",
      subdomain: "Unrelated Query",
      skills: [],
      recommendedDuration: 10,
      durationReasoning: "Unable to evaluate duration for out-of-scope query.",
      clarifyingQuestions: [],
      problemSummary: trimmed
    };
  }

  // Attempt Gemini API invocation if available
  if (ai) {
    try {
      const prompt = `You are the lead DevOps & System Architecture triage engine for HumanAPI.
Analyze the following user problem query:
"${trimmed}"

Determine if it is a valid technical/code issue or gibberish.
Return ONLY valid JSON matching this schema:
{
  "isGibberish": false,
  "domain": "e.g. Frontend Architecture / DevOps & Kubernetes / Database Optimization / Backend Microservices",
  "subdomain": "e.g. React State Sync / K8s Ingress Controller / Postgres Locking",
  "skills": ["Skill1", "Skill2", "Skill3"],
  "recommendedDuration": 5 | 10 | 15,
  "durationReasoning": "Concise reasoning for session duration",
  "clarifyingQuestions": ["Question 1", "Question 2"],
  "problemSummary": "Clean 1-sentence technical summary"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

      const responseText = response.text || "";
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.isGibberish) {
          return {
            isGibberish: true,
            error: "The provided prompt does not contain a recognizable technical or software engineering issue.",
            domain: "Unclear Query",
            subdomain: "Invalid Request",
            skills: [],
            recommendedDuration: 10,
            durationReasoning: "Invalid input",
            clarifyingQuestions: [],
            problemSummary: trimmed
          };
        }
        return {
          domain: parsed.domain || "DevOps & Cloud",
          subdomain: parsed.subdomain || "System Deployment",
          skills: Array.isArray(parsed.skills) ? parsed.skills : ["DevOps", "Infrastructure"],
          recommendedDuration: [5, 10, 15].includes(parsed.recommendedDuration) ? parsed.recommendedDuration : 10,
          durationReasoning: parsed.durationReasoning || "A 10-minute targeted consultation is recommended.",
          clarifyingQuestions: Array.isArray(parsed.clarifyingQuestions) ? parsed.clarifyingQuestions : ["Could you provide additional logs?"],
          problemSummary: parsed.problemSummary || trimmed
        };
      }
    } catch (err) {
      console.warn("Gemini API call failed, falling back to rule-based triage:", err);
    }
  }

  // Smart fallback triage rules
  const lower = trimmed.toLowerCase();
  let domain = "Software Development";
  let subdomain = "Fullstack Architecture";
  let skills = ["TypeScript", "System Architecture", "Debugging"];
  let duration: 5 | 10 | 15 = 10;
  let durationReasoning = "10 minutes is optimal for inspecting logs and isolating root cause.";

  if (lower.includes("k8s") || lower.includes("kubernetes") || lower.includes("docker") || lower.includes("pod") || lower.includes("ci/cd") || lower.includes("deploy")) {
    domain = "DevOps & Cloud Infrastructure";
    subdomain = "Container Orchestration & CI/CD";
    skills = ["Docker", "Kubernetes", "CI/CD Pipelines", "Terraform"];
    duration = 15;
    durationReasoning = "Deployment container failures usually require manifest inspection (+15m).";
  } else if (lower.includes("postgres") || lower.includes("sql") || lower.includes("db") || lower.includes("query") || lower.includes("mongo")) {
    domain = "Database Engineering";
    subdomain = "Query Optimization & Indexing";
    skills = ["PostgreSQL", "Database Indexing", "SQL Tuning", "Performance"];
    duration = 10;
    durationReasoning = "10 minutes is sufficient to analyze execution plans and index recommendations.";
  } else if (lower.includes("react") || lower.includes("state") || lower.includes("hook") || lower.includes("css") || lower.includes("next")) {
    domain = "Frontend Architecture";
    subdomain = "React State & Component Lifecycle";
    skills = ["React 19", "TypeScript", "State Management", "Performance"];
    duration = 5;
    durationReasoning = "Targeted 5-minute teardown is ideal for component state synchronization bugs.";
  }

  return {
    domain,
    subdomain,
    skills,
    recommendedDuration: duration,
    durationReasoning,
    clarifyingQuestions: [
      `What error codes or stack traces are appearing when this occurs?`,
      `Is this reproducible locally or exclusively in production environment?`
    ],
    problemSummary: trimmed
  };
}

/**
 * Past Session Feedback & Dissatisfaction Re-matching System
 */
export async function generateDissatisfactionReportAndRematch(params: {
  sessionId: string;
  previousExpertId: string;
  comment: string;
  rating: number;
  problemResolved: boolean;
}): Promise<DissatisfactionReportResult> {
  const { sessionId, previousExpertId, comment, rating, problemResolved } = params;

  // Load previous expert profile
  const prevExpert = await prisma.expertProfile.findUnique({
    where: { id: previousExpertId },
    include: { user: true }
  }).catch(() => null);

  const prevExpertName = prevExpert ? `${prevExpert.user.firstName} ${prevExpert.user.lastName}` : "Previous Expert";

  // Find a new top expert excluding the previous one
  const candidateExperts = await prisma.expertProfile.findMany({
    where: {
      id: { not: previousExpertId },
      verificationStatus: "APPROVED"
    },
    include: { user: true },
    orderBy: { rating: "desc" }
  });

  const newExpert = candidateExperts[0] || {
    id: "exp-2",
    user: { firstName: "Dr. Camille", lastName: "Laurent" }
  };

  const newExpertName = `${newExpert.user.firstName} ${newExpert.user.lastName}`;

  let dissatisfactionSummary = `User reported dissatisfaction (Rating: ${rating}/5, Resolved: ${problemResolved}).`;
  let remediationBrief = `Prior session with ${prevExpertName} failed to resolve root issue. Feedback noted: "${comment}". New expert should focus on step-by-step verification.`;

  if (ai) {
    try {
      const prompt = `Generate a structured handover report for a new DevOps consultant taking over an unresolved session.
Previous Expert: ${prevExpertName}
Client Rating: ${rating}/5
Client Comment: "${comment}"

Return JSON:
{
  "dissatisfactionSummary": "Concise summary of client's frustration",
  "unresolvedTopics": ["Topic 1", "Topic 2"],
  "remediationBrief": "Handover instructions for new expert ${newExpertName}",
  "suggestedFocusArea": "Primary area to debug first"
}`;

      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

      const text = res.text || "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        dissatisfactionSummary = parsed.dissatisfactionSummary || dissatisfactionSummary;
        remediationBrief = parsed.remediationBrief || remediationBrief;
      }
    } catch (err) {
      console.warn("Failed to generate LLM dissatisfaction report, using structured fallback:", err);
    }
  }

  return {
    reportId: `dissat_rpt_${Date.now()}`,
    previousExpertId,
    newExpertId: newExpert.id,
    newExpertName,
    dissatisfactionSummary,
    unresolvedTopics: [
      "Root cause isolation in prior session",
      "Live environment verification"
    ],
    remediationBrief,
    suggestedFocusArea: "Direct live log inspection & component isolation",
    createdAt: new Date().toISOString()
  };
}

