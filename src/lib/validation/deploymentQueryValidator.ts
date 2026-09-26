/**
 * Centralized Deployment Query Validator
 * Authoritative relevance validation for HumanAPI Deployment & DevOps domain.
 */

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  matchedType?: string;
}

// HumanAPI Authoritative Deployment Problem Taxonomy (28 Problem Types)
export const DEPLOYMENT_TAXONOMY_TYPES = [
  "Repository access denied",
  "Webhook failed",
  "Dependency installation failed",
  "Compilation error",
  "Runtime version mismatch",
  "Unit tests failed",
  "Tests pass locally but fail in CI",
  "Docker build failed",
  "Image not found",
  "Container crashes",
  "Jenkins pipeline failed",
  "Jenkins agent unavailable",
  "Permission denied",
  "Secret not found",
  "Authentication failed",
  "AWS AccessDenied",
  "EC2 unreachable",
  "Deployment timeout",
  "Kubernetes CrashLoopBackOff",
  "Kubernetes ImagePullBackOff",
  "Port not accessible",
  "Environment variable missing",
  "Database connection failed",
  "DNS error",
  "502 Bad Gateway",
  "503 Service Unavailable",
  "SSL/HTTPS error",
  "Deployment rollback failed"
];

// DevOps & Deployment Domain Keywords
const DEVOPS_KEYWORDS = [
  "github", "git", "repo", "repository", "webhook", "commit", "push", "pull request",
  "build", "compilation", "dependency", "package", "npm", "yarn", "pip", "maven", "gradle", "go mod",
  "ci", "cd", "pipeline", "actions", "circleci", "gitlab", "travis", "test", "unit test", "integration test",
  "docker", "container", "dockerfile", "image", "registry", "ecr", "dockerhub", "tag", "crash",
  "jenkins", "agent", "executor", "groovy", "pipeline syntax",
  "secret", "auth", "token", "credentials", "permission", "access", "ssh", "key",
  "aws", "amazon", "ec2", "s3", "iam", "accessdenied", "cloud", "azure", "gcp", "lambda", "ecs", "eks",
  "kubernetes", "k8s", "pod", "crashloopbackoff", "imagepullbackoff", "ingress", "kubectl", "helm",
  "deployment", "deploy", "deploying", "production", "staging", "environment", "env", "env var",
  "database", "db", "postgres", "mysql", "mongodb", "redis", "connection", "connect", "timeout",
  "dns", "port", "firewall", "security group", "ip", "subdomain", "domain", "route",
  "502", "503", "504", "403", "bad gateway", "service unavailable", "nginx", "apache",
  "ssl", "tls", "https", "certificate", "certbot",
  "rollback", "incident", "outage", "log", "stack trace", "error", "failed", "crash", "bug", "debugging", "infra", "devops"
];

// Unrelated / Out-of-Scope Patterns
const UNRELATED_PATTERNS = [
  /\bbirthday\b/i,
  /\bcapital of\b/i,
  /\blose weight\b/i,
  /\bdsa\b/i,
  /\binstagram\b/i,
  /\bcaption\b/i,
  /\belon musk\b/i,
  /\bmovie\b/i,
  /\bquantum physics\b/i,
  /\brecipe\b/i,
  /\bjoke\b/i,
  /\bpoem\b/i,
  /\bsong\b/i,
  /\bessay\b/i,
  /\btranslate\b/i,
  /\bwho is\b/i,
  /\bwhat is the capital\b/i,
  /\bhow do i lose\b/i,
  /\brecommend a\b/i,
  /\bweather\b/i,
  /\bsport\b/i,
  /\bgame\b/i
];

export const DEPLOYMENT_VALIDATION_ERROR_MESSAGE =
  "Invalid question. Please recheck your question and ask about a deployment, DevOps, CI/CD, cloud, Docker, Kubernetes, Jenkins, GitHub, or production issue.";

/**
 * Validates whether a user query falls within HumanAPI's deployment/DevOps scope.
 */
export function validateDeploymentQuery(query: string): ValidationResult {
  const trimmed = query ? query.trim() : "";

  if (!trimmed || trimmed.length < 5) {
    return {
      isValid: false,
      errorMessage: DEPLOYMENT_VALIDATION_ERROR_MESSAGE
    };
  }

  const lower = trimmed.toLowerCase();

  // 1. Check for explicit unrelated patterns
  for (const pattern of UNRELATED_PATTERNS) {
    if (pattern.test(lower)) {
      return {
        isValid: false,
        errorMessage: DEPLOYMENT_VALIDATION_ERROR_MESSAGE
      };
    }
  }

  // 2. Check for matching taxonomy or DevOps keywords
  const hasTaxonomyMatch = DEPLOYMENT_TAXONOMY_TYPES.some(t => lower.includes(t.toLowerCase()));
  const hasKeywordMatch = DEVOPS_KEYWORDS.some(kw => lower.includes(kw.toLowerCase()));

  if (hasTaxonomyMatch || hasKeywordMatch) {
    return {
      isValid: true
    };
  }

  // 3. Reject queries lacking deployment/DevOps context
  return {
    isValid: false,
    errorMessage: DEPLOYMENT_VALIDATION_ERROR_MESSAGE
  };
}
