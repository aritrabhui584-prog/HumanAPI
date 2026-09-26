import { prisma } from "../db/prisma";

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
