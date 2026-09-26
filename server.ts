import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { apiRouter } from "./src/backend/routes/api";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: "10mb" }));
app.use("/api", apiRouter);

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// Server-side Gemini initialization with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Endpoint: AI "Ask" Natural Language Problem Decomposition & Matching
app.post("/api/gemini/ask", async (req, res) => {
  try {
    const { problem } = req.body;
    if (!problem || typeof problem !== "string") {
      res.status(400).json({ error: "Problem description is required." });
      return;
    }

    if (ai) {
      const prompt = `You are the core intelligence engine of HumanAPI, a marketplace for 5/10/15-minute 1-on-1 human expert consultations.
Analyze this user problem:
"${problem}"

Return a STRICT JSON response adhering to this format (without markdown formatting, pure JSON):
{
  "detectedCategories": ["Category 1", "Category 2"],
  "recommendedSkills": ["Skill A", "Skill B", "Skill C"],
  "recommendedDuration": 10,
  "consultationGoal": "Concise 1-sentence goal of what the 1-on-1 consultation should achieve",
  "matchExplanation": "2-sentence clear explanation of what type of verified expert the user needs and what questions to prepare"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        }
      });

      const text = response.text || "{}";
      try {
        const parsed = JSON.parse(text);
        res.json({ success: true, analysis: parsed });
        return;
      } catch (parseErr) {
        // Fall back below if parsing fails
      }
    }

    // Heuristic fallback if Gemini API key is missing or parse fails
    const lower = problem.toLowerCase();
    let detectedCategories = ["Software Development", "System Architecture"];
    let recommendedSkills = ["Debugging", "Architecture", "Best Practices"];
    let recommendedDuration: 5 | 10 | 15 = 10;
    let consultationGoal = "Isolate the root cause and get actionable code recommendations.";

    if (lower.includes("design") || lower.includes("ui") || lower.includes("ux") || lower.includes("figma")) {
      detectedCategories = ["UI/UX Design", "Product Strategy"];
      recommendedSkills = ["Design Systems", "Usability Audit", "User Flow Review"];
      consultationGoal = "Get high-signal feedback on layout, typography hierarchy, and friction points.";
    } else if (lower.includes("career") || lower.includes("interview") || lower.includes("resume") || lower.includes("job")) {
      detectedCategories = ["Career & Mentorship", "Interview Preparation"];
      recommendedSkills = ["Mock Interview", "Salary Negotiation", "Resume Tear-Down"];
      recommendedDuration = 15;
      consultationGoal = "Calibrate your positioning, portfolio narrative, and high-impact responses.";
    } else if (lower.includes("startup") || lower.includes("business") || lower.includes("pricing") || lower.includes("marketing")) {
      detectedCategories = ["Business & Startups", "Growth Marketing"];
      recommendedSkills = ["Go-To-Market", "Value Proposition", "Unit Economics"];
      consultationGoal = "Stress-test assumptions with a founder who has scaled similar models.";
    }

    res.json({
      success: true,
      analysis: {
        detectedCategories,
        recommendedSkills,
        recommendedDuration,
        consultationGoal,
        matchExplanation: `Based on your challenge, we matched specialists in ${detectedCategories.join(" & ")} who can diagnose the roadblock in a focused ${recommendedDuration}-minute session.`
      }
    });
  } catch (err: any) {
    console.error("Error in /api/gemini/ask:", err);
    res.status(500).json({ error: "Failed to analyze problem", details: err?.message });
  }
});

// Endpoint: AI Expert Verification Interview Question Generation
app.post("/api/gemini/interview/generate", async (req, res) => {
  try {
    const { field, headline, experienceYears, skills, sampleDescription } = req.body;

    if (ai) {
      const prompt = `You are the rigorous AI Accreditation Assessor for HumanAPI.
A candidate has applied to become a Verified Expert:
- Field: ${field}
- Headline: ${headline}
- Experience: ${experienceYears} years
- Skills: ${Array.isArray(skills) ? skills.join(", ") : skills}
- Project / Work sample summary: ${sampleDescription || "None provided"}

Generate exactly 4 high-signal, practical consultation assessment questions.
Criteria to evaluate:
Question 1: Deep domain knowledge and technical precision.
Question 2: Practical debugging / problem-solving scenario under time pressure.
Question 3: Live diagnostic ability (how they structure a 10-minute client consultation when requirements are ambiguous).
Question 4: Communication clarity & client empathy (explaining complex concepts simply).

Respond ONLY with valid JSON (no markdown backticks):
{
  "field": "${field}",
  "questions": [
    {
      "id": "q1",
      "category": "Domain Mastery",
      "question": "Question text here...",
      "guidance": "Brief tip on what the assessor looks for"
    },
    {
      "id": "q2",
      "category": "Practical Problem Solving",
      "question": "Question text here...",
      "guidance": "Brief tip on what the assessor looks for"
    },
    {
      "id": "q3",
      "category": "10-Minute Consultation Architecture",
      "question": "Question text here...",
      "guidance": "Brief tip on what the assessor looks for"
    },
    {
      "id": "q4",
      "category": "Communication & Client Empathy",
      "question": "Question text here...",
      "guidance": "Brief tip on what the assessor looks for"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.4,
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json({ success: true, ...parsed });
      return;
    }

    // Default fallback questions tailored to field
    const fallbackQuestions = [
      {
        id: "q1",
        category: "Domain Mastery",
        question: `In ${field || "your domain"}, what is an industry standard or architectural practice that most practitioners get wrong, and how do you rectify it?`,
        guidance: "Demonstrate nuanced technical grounding and modern best practices."
      },
      {
        id: "q2",
        category: "Practical Problem Solving",
        question: "Walk us through a critical production roadblock or project failure you personally diagnosed and fixed in the last 12 months.",
        guidance: "Focus on your diagnostic process, hypotheses tested, and verifiable outcome."
      },
      {
        id: "q3",
        category: "10-Minute Consultation Architecture",
        question: "A client books a 10-minute HumanAPI session with a chaotic, vague problem description. How do you lead the conversation to deliver tangible value before the timer ends?",
        guidance: "Showcase time discipline, active listening, and structured triage."
      },
      {
        id: "q4",
        category: "Communication & Empathy",
        question: "How do you communicate a difficult technical truth (e.g. their current approach needs complete refactoring) without demotivating the client?",
        guidance: "Emphasize respectful candor and actionable next steps."
      }
    ];

    res.json({ success: true, field: field || "Expert Practice", questions: fallbackQuestions });
  } catch (err: any) {
    console.error("Error generating interview questions:", err);
    res.status(500).json({ error: "Failed to generate interview", details: err?.message });
  }
});

// Endpoint: AI Evaluation of Expert Interview Answers
app.post("/api/gemini/interview/evaluate", async (req, res) => {
  try {
    const { field, questionsWithAnswers, candidateName } = req.body;

    if (ai && Array.isArray(questionsWithAnswers)) {
      const answersText = questionsWithAnswers
        .map((qa: any, idx: number) => `Q${idx + 1} (${qa.category}): ${qa.question}\nAnswer: ${qa.answer || "(No response)"}`)
        .join("\n\n");

      const prompt = `You are the Lead Accreditation Board for HumanAPI.
Evaluate this expert candidate's interview responses for verification in the field "${field}":

Candidate: ${candidateName || "Applicant"}
Responses:
${answersText}

Provide an objective evaluation. HumanAPI maintains uncompromising quality standards for verified experts.
Passing score is >= 75 / 100.

Return STRICT JSON format:
{
  "overallScore": 88,
  "passed": true,
  "status": "Approved",
  "scores": {
    "domainMastery": 90,
    "problemSolving": 85,
    "consultationSkill": 88,
    "communication": 89
  },
  "feedbackSummary": "Thorough assessment summary explaining strengths and advisory recommendations.",
  "strengths": ["Clear technical depth", "Practical triage instincts"],
  "areasForGrowth": ["Ensure immediate summary recap at minute 8 of 10-minute calls"],
  "badgeIssued": "Verified Expert"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json({ success: true, evaluation: parsed });
      return;
    }

    // Dynamic heuristic evaluation fallback
    const answersLength = (questionsWithAnswers || []).reduce((acc: number, curr: any) => acc + (curr.answer?.length || 0), 0);
    const passed = answersLength > 100;
    const baseScore = passed ? Math.min(94, 76 + Math.floor(answersLength / 40)) : 62;

    res.json({
      success: true,
      evaluation: {
        overallScore: baseScore,
        passed,
        status: passed ? "Approved" : "Revision Needed",
        scores: {
          domainMastery: Math.min(95, baseScore + 2),
          problemSolving: Math.min(95, baseScore - 1),
          consultationSkill: Math.min(95, baseScore + 1),
          communication: baseScore
        },
        feedbackSummary: passed
          ? "Candidate demonstrated excellent domain clarity, practical diagnostic instinct, and disciplined communication suited for high-impact 5/10/15-minute consultations."
          : "Responses lacked sufficient practical depth and concrete consultation methodologies. We invite you to refine your answers and resubmit.",
        strengths: ["Strong problem ownership", "Direct, jargon-free explanations", "Solid triage mindset"],
        areasForGrowth: ["Consider sharing concrete metrics in case studies", "Keep visual sketches handy for client sessions"],
        badgeIssued: passed ? "Verified Expert" : null
      }
    });
  } catch (err: any) {
    console.error("Error evaluating interview:", err);
  }
});

// Centralized API 404 Handler (ensures all unmatched /api requests return JSON, not HTML)
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `API endpoint ${req.originalUrl} not found.`
    }
  });
});

// Centralized Express API Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Centralized Express API Error:", err);
  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong while processing the request."
    }
  });
});

// Configure Vite / Static serving
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HumanAPI Server running on port ${PORT}`);
  });
}

start();

export default app;
