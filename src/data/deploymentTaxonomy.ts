export interface DeploymentTaxonomyItem {
  id: string;
  stage: string;
  category: string;
  title: string;
  roadblock: string;
  example: string;
  specialists: string;
  expertiseTags: string[];
  subErrors: {
    error: string;
    cause: string;
    expertise: string[];
  }[];
}

export const DEPLOYMENT_PROBLEM_TAXONOMY: DeploymentTaxonomyItem[] = [
  {
    id: "archetype-github",
    stage: "GITHUB",
    category: "GITHUB",
    title: "Repository Access & Webhooks",
    roadblock: "Your deployment pipeline cannot access the repository or GitHub events are not reaching your CI system.",
    example: "“Jenkins cannot access the repository or the GitHub webhook isn't triggering the pipeline.”",
    specialists: "GitHub · Git · Jenkins",
    expertiseTags: ["GitHub", "Git", "Jenkins"],
    subErrors: [
      { error: "Repository access denied", cause: "SSH key mismatch or deploy key permissions", expertise: ["GitHub", "Git"] },
      { error: "Webhook failed to trigger CI", cause: "Payload delivery failure or HMAC secret misconfiguration", expertise: ["GitHub", "Jenkins"] }
    ]
  },
  {
    id: "archetype-build",
    stage: "BUILD",
    category: "BUILD",
    title: "Build & Dependency Failures",
    roadblock: "Dependencies fail to install, compilation breaks, or your runtime version doesn't match the project requirements.",
    example: "“npm install fails in CI even though the project works locally.”",
    specialists: "Build Systems · Node.js · Python · Java · DevOps",
    expertiseTags: ["Build Systems", "Node.js", "Python", "Java", "DevOps"],
    subErrors: [
      { error: "Dependency installation failed", cause: "Package registry lockfile drift or missing native build toolchain", expertise: ["Node.js", "Build Systems"] },
      { error: "Compilation error", cause: "TypeScript / compiler target syntax error", expertise: ["Build Systems", "DevOps"] },
      { error: "Runtime version mismatch", cause: "Node/Python engine version mismatch between host and CI runner", expertise: ["DevOps", "Python"] }
    ]
  },
  {
    id: "archetype-test",
    stage: "TEST",
    category: "TEST",
    title: "CI Tests Failing",
    roadblock: "Tests pass locally but fail inside the CI environment because the environment or configuration is different.",
    example: "“All tests pass locally, but the Jenkins pipeline fails during the test stage.”",
    specialists: "CI/CD · Testing · DevOps",
    expertiseTags: ["CI/CD", "Testing", "DevOps"],
    subErrors: [
      { error: "Unit tests failed", cause: "Mock state isolation leak", expertise: ["Testing", "CI/CD"] },
      { error: "Tests pass locally but fail in CI", cause: "CI environment variable isolation or missing test container database", expertise: ["CI/CD", "DevOps"] }
    ]
  },
  {
    id: "archetype-docker",
    stage: "DOCKER",
    category: "DOCKER",
    title: "Docker Build & Container Issues",
    roadblock: "Your image fails to build, the wrong image is deployed, or the container crashes after startup.",
    example: "“Docker build fails in Jenkins with an unexpected exit code.”",
    specialists: "Docker · DevOps · Containerization",
    expertiseTags: ["Docker", "DevOps", "Containerization"],
    subErrors: [
      { error: "Docker build failed", cause: "Invalid Dockerfile multi-stage syntax or layer caching failure", expertise: ["Docker", "DevOps"] },
      { error: "Image not found", cause: "Registry credential failure or missing tag push step", expertise: ["Docker", "Containerization"] },
      { error: "Container crashes after startup", cause: "OOMKilled memory exit code 137 or missing ENTRYPOINT command", expertise: ["Docker", "DevOps"] }
    ]
  },
  {
    id: "archetype-jenkins",
    stage: "JENKINS",
    category: "JENKINS / CI-CD",
    title: "Pipeline & Agent Failures",
    roadblock: "Your Jenkins pipeline fails because of Jenkinsfile configuration, unavailable agents, permissions, credentials, or pipeline setup.",
    example: "“Jenkins cannot start the build because the configured agent is unavailable.”",
    specialists: "Jenkins · CI/CD · Linux · DevOps",
    expertiseTags: ["Jenkins", "CI/CD", "Linux", "DevOps"],
    subErrors: [
      { error: "Pipeline failed", cause: "Syntax error in Jenkinsfile Groovy step", expertise: ["Jenkins", "CI/CD"] },
      { error: "Agent unavailable", cause: "Slave node offline or SSH executor connection timeout", expertise: ["Jenkins", "Linux"] },
      { error: "Permission denied", cause: "Jenkins daemon user lacking Docker socket permissions", expertise: ["Jenkins", "DevOps"] }
    ]
  },
  {
    id: "archetype-cloud",
    stage: "CLOUD",
    category: "CLOUD",
    title: "Cloud Deployment Problems",
    roadblock: "Your application deploys incorrectly or cannot reach cloud infrastructure because of permissions, networking, or configuration.",
    example: "“AWS deployment fails with AccessDenied or the EC2 instance cannot be reached.”",
    specialists: "AWS · Cloud Infrastructure · Networking · DevOps",
    expertiseTags: ["AWS", "Cloud Infrastructure", "Networking", "DevOps"],
    subErrors: [
      { error: "AWS AccessDenied", cause: "IAM role missing deployment policy permissions", expertise: ["AWS", "Cloud Infrastructure"] },
      { error: "EC2 unreachable", cause: "Security group ingress rule missing HTTP/SSH port configuration", expertise: ["AWS", "Networking"] },
      { error: "Deployment timeout", cause: "Healthcheck grace period expired on Cloudformation / ECS", expertise: ["AWS", "DevOps"] }
    ]
  },
  {
    id: "archetype-kubernetes",
    stage: "KUBERNETES",
    category: "KUBERNETES",
    title: "Kubernetes & Container Orchestration",
    roadblock: "Pods fail to start, images cannot be pulled, or workloads repeatedly crash after deployment.",
    example: "“Production pods are stuck in ImagePullBackOff.”",
    specialists: "Kubernetes · Docker · Cloud · DevOps",
    expertiseTags: ["Kubernetes", "Docker", "Cloud", "DevOps"],
    subErrors: [
      { error: "CrashLoopBackOff", cause: "Liveness probe failing or missing application env var", expertise: ["Kubernetes", "DevOps"] },
      { error: "ImagePullBackOff", cause: "Secret imagePullSecrets missing or private registry authentication error", expertise: ["Kubernetes", "Docker"] }
    ]
  },
  {
    id: "archetype-production",
    stage: "PRODUCTION",
    category: "PRODUCTION",
    title: "Production & Networking Errors",
    roadblock: "Your application is deployed but users cannot reach it because of ports, DNS, SSL, proxy, or service availability problems.",
    example: "“Deployment succeeds, but the production URL returns 502 Bad Gateway.”",
    specialists: "DevOps · Networking · Cloud · Infrastructure",
    expertiseTags: ["DevOps", "Networking", "Cloud", "Infrastructure"],
    subErrors: [
      { error: "Port inaccessible", cause: "Host container port binding misconfiguration", expertise: ["Networking", "DevOps"] },
      { error: "Environment variable missing", cause: "Production .env secrets not injected by deployment runner", expertise: ["DevOps", "Cloud"] },
      { error: "Database connection failed", cause: "VPC security group blocking RDS/Postgres port 5432", expertise: ["Infrastructure", "Cloud"] },
      { error: "DNS error", cause: "CNAME / A record propagation failure", expertise: ["Networking"] },
      { error: "502 Bad Gateway", cause: "Nginx upstream socket connection refused", expertise: ["DevOps", "Networking"] },
      { error: "503 Service Unavailable", cause: "Capacity limit reached or health check failing", expertise: ["Infrastructure"] },
      { error: "SSL/HTTPS error", cause: "Let's Encrypt certificate renewal timeout or missing SAN", expertise: ["Networking", "DevOps"] }
    ]
  },
  {
    id: "archetype-rollback",
    stage: "ROLLBACK",
    category: "ROLLBACK",
    title: "Failed Rollbacks & Recovery",
    roadblock: "A deployment has failed and the previous stable version cannot be restored cleanly.",
    example: "“The latest deployment failed and the previous production version cannot be restored.”",
    specialists: "DevOps · CI/CD · Cloud Infrastructure · SRE",
    expertiseTags: ["DevOps", "CI/CD", "Cloud Infrastructure", "SRE"],
    subErrors: [
      { error: "Deployment rollback failed", cause: "Database migration schema lock or immutable artifact tag overwriting", expertise: ["DevOps", "SRE"] }
    ]
  }
];
