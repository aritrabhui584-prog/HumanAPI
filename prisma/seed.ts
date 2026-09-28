import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting HumanAPI Database Seeding...");

  // 1. SEED SKILLS
  const skillNames = [
    "DevOps", "Git", "GitHub", "Jenkins", "GitHub Actions", "GitLab CI", 
    "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Linux", 
    "Networking", "CI/CD", "Infrastructure", "SRE", "Build Systems", 
    "Database", "DNS", "SSL/TLS"
  ];

  const skillMap: Record<string, string> = {};
  for (const name of skillNames) {
    const s = await prisma.skill.upsert({
      where: { name },
      update: {},
      create: { name, category: "DEPLOYMENT" },
    });
    skillMap[name] = s.id;
  }
  console.log(`Seeded ${Object.keys(skillMap).length} normalized skills.`);

  // 2. SEED DEPLOYMENT CATEGORIES & 28 PROBLEM TYPES
  const taxonomyData = [
    {
      category: "GITHUB",
      description: "Repository access, SSH keys, webhook triggers, and permissions.",
      types: [
        { id: "PT_GITHUB_1", name: "Repository access denied", cause: "Wrong permissions or expired token", requiredExpertise: ["Git", "GitHub"] },
        { id: "PT_GITHUB_2", name: "Webhook failed", cause: "Jenkins or GitHub webhook misconfigured or HMAC secret mismatch", requiredExpertise: ["Jenkins", "GitHub"] }
      ]
    },
    {
      category: "BUILD",
      description: "Dependency locks, compilation errors, and engine runtime mismatches.",
      types: [
        { id: "PT_BUILD_3", name: "Dependency installation failed", cause: "Wrong package, lockfile drift, or missing native toolchain", requiredExpertise: ["Build Systems", "DevOps"] },
        { id: "PT_BUILD_4", name: "Compilation error", cause: "Code syntax or build tool configuration issue", requiredExpertise: ["Build Systems", "DevOps"] },
        { id: "PT_BUILD_5", name: "Runtime version mismatch", cause: "Incompatible Node/Python/Java engine version on host runner", requiredExpertise: ["DevOps", "Linux"] }
      ]
    },
    {
      category: "TEST",
      description: "Automated test suites, mocking, and CI environment divergence.",
      types: [
        { id: "PT_TEST_6", name: "Unit tests failed", cause: "Application code assertion failure", requiredExpertise: ["DevOps", "CI/CD"] },
        { id: "PT_TEST_7", name: "Tests pass locally but fail in CI", cause: "Environment variable isolation or missing test container database", requiredExpertise: ["CI/CD", "DevOps"] }
      ]
    },
    {
      category: "DOCKER",
      description: "Dockerfile syntax, layer caching, registry images, and container crashes.",
      types: [
        { id: "PT_DOCKER_8", name: "Docker build failed", cause: "Invalid Dockerfile syntax, layer cache invalidation, or build step error", requiredExpertise: ["Docker", "DevOps"] },
        { id: "PT_DOCKER_9", name: "Image not found", cause: "Missing image tag or registry authentication credentials failure", requiredExpertise: ["Docker", "Infrastructure"] },
        { id: "PT_DOCKER_10", name: "Container crashes", cause: "Environment/config issue or OOMKilled exit code 137", requiredExpertise: ["Docker", "DevOps"] }
      ]
    },
    {
      category: "JENKINS",
      description: "Jenkinsfile pipelines, node agent availability, and workspace permissions.",
      types: [
        { id: "PT_JENKINS_11", name: "Pipeline failed", cause: "Jenkinsfile syntax error or stage step failure", requiredExpertise: ["Jenkins", "CI/CD"] },
        { id: "PT_JENKINS_12", name: "Agent unavailable", cause: "Worker node offline, executor limit reached, or SSH timeout", requiredExpertise: ["Jenkins", "Linux"] },
        { id: "PT_JENKINS_13", name: "Permission denied", cause: "Jenkins daemon missing file or Docker socket permissions", requiredExpertise: ["Linux", "Jenkins"] }
      ]
    },
    {
      category: "CI/CD",
      description: "Pipeline secrets, environment variable injection, and runner authentication.",
      types: [
        { id: "PT_CICD_14", name: "Secret not found", cause: "Missing pipeline secret or vault environment variable", requiredExpertise: ["CI/CD", "DevOps"] },
        { id: "PT_CICD_15", name: "Authentication failed", cause: "Invalid deployment service token or expired credentials", requiredExpertise: ["DevOps", "Infrastructure"] }
      ]
    },
    {
      category: "AWS",
      description: "Cloud IAM policies, EC2 networking, and deployment timeouts.",
      types: [
        { id: "PT_AWS_16", name: "AccessDenied", cause: "IAM user/role missing required deployment policy permissions", requiredExpertise: ["AWS", "Infrastructure"] },
        { id: "PT_AWS_17", name: "EC2 unreachable", cause: "Security group ingress rule missing HTTP/SSH port configuration", requiredExpertise: ["AWS", "Networking"] },
        { id: "PT_AWS_18", name: "Deployment timeout", cause: "Health check grace period expired or server instance unresponsive", requiredExpertise: ["AWS", "DevOps"] }
      ]
    },
    {
      category: "KUBERNETES",
      description: "Pod lifecycle, container crash loops, and container registry image pulling.",
      types: [
        { id: "PT_K8S_19", name: "CrashLoopBackOff", cause: "Application exit error, missing env var, or failing liveness probe", requiredExpertise: ["Kubernetes", "DevOps"] },
        { id: "PT_K8S_20", name: "ImagePullBackOff", cause: "Missing imagePullSecrets or invalid registry secret", requiredExpertise: ["Kubernetes", "Docker"] }
      ]
    },
    {
      category: "DEPLOYMENT",
      description: "Network routing, DNS records, database connections, and environment secrets.",
      types: [
        { id: "PT_DEP_21", name: "Port not accessible", cause: "Firewall rule or host container port binding error", requiredExpertise: ["Networking", "DevOps"] },
        { id: "PT_DEP_22", name: "Environment variable missing", cause: "Deployment configuration missing required application key", requiredExpertise: ["DevOps", "Infrastructure"] },
        { id: "PT_DEP_23", name: "Database connection failed", cause: "VPC security group blocking database port or invalid DB credentials", requiredExpertise: ["Database", "DevOps"] },
        { id: "PT_DEP_24", name: "DNS error", cause: "Domain A/CNAME record misconfiguration or propagation delay", requiredExpertise: ["DNS", "Networking"] }
      ]
    },
    {
      category: "PRODUCTION",
      description: "Proxy servers, SSL certificates, 502/503 gateway errors.",
      types: [
        { id: "PT_PROD_25", name: "502 Bad Gateway", cause: "Nginx reverse proxy unable to connect to upstream service", requiredExpertise: ["DevOps", "Linux"] },
        { id: "PT_PROD_26", name: "503 Service Unavailable", cause: "Backend application down, crashing, or capacity overloaded", requiredExpertise: ["SRE", "DevOps"] },
        { id: "PT_PROD_27", name: "SSL/HTTPS error", cause: "SSL certificate expired, domain mismatch, or missing SAN", requiredExpertise: ["SSL/TLS", "Networking"] }
      ]
    },
    {
      category: "ROLLBACK",
      description: "Automated rollback failures and version restoration blockers.",
      types: [
        { id: "PT_ROLL_28", name: "Deployment rollback failed", cause: "Previous release artifact missing or schema migration lock", requiredExpertise: ["DevOps", "SRE"] }
      ]
    }
  ];

  const problemTypeMap: Record<string, string> = {};

  for (const cat of taxonomyData) {
    const categoryRecord = await prisma.deploymentProblemCategory.upsert({
      where: { name: cat.category },
      update: { description: cat.description },
      create: { name: cat.category, description: cat.description }
    });

    for (const pt of cat.types) {
      const createdPt = await prisma.deploymentProblemType.upsert({
        where: { id: pt.id },
        update: {
          name: pt.name,
          cause: pt.cause,
          requiredExpertise: JSON.stringify(pt.requiredExpertise),
          categoryId: categoryRecord.id
        },
        create: {
          id: pt.id,
          name: pt.name,
          cause: pt.cause,
          requiredExpertise: JSON.stringify(pt.requiredExpertise),
          categoryId: categoryRecord.id
        }
      });
      problemTypeMap[pt.name] = createdPt.id;
      problemTypeMap[pt.id] = createdPt.id;
    }
  }
  console.log("Seeded 9 Categories & 28 Canonical Problem Types.");

  // 3. SEED DIAGNOSIS RULES (1 rule per problem type)
  const diagnosisRulesSeed = [
    { ptId: "PT_GITHUB_1", keywords: ["github", "access denied", "ssh", "permission", "deploy key", "auth"], requiredSkills: ["Git", "GitHub"], priority: "HIGH" },
    { ptId: "PT_GITHUB_2", keywords: ["webhook", "jenkins", "payload", "hmac", "trigger", "event"], requiredSkills: ["Jenkins", "GitHub"], priority: "MEDIUM" },
    { ptId: "PT_BUILD_3", keywords: ["npm install", "dependency", "package", "yarn", "pip", "lockfile"], requiredSkills: ["Build Systems", "DevOps"], priority: "HIGH" },
    { ptId: "PT_BUILD_4", keywords: ["compilation", "tsc", "gcc", "build error", "syntax error", "transpile"], requiredSkills: ["Build Systems", "DevOps"], priority: "HIGH" },
    { ptId: "PT_BUILD_5", keywords: ["runtime version", "node version", "python version", "java version", "engine mismatch"], requiredSkills: ["DevOps", "Linux"], priority: "MEDIUM" },
    { ptId: "PT_TEST_6", keywords: ["unit test", "test failed", "jest", "pytest", "mocha", "assertion"], requiredSkills: ["CI/CD", "DevOps"], priority: "MEDIUM" },
    { ptId: "PT_TEST_7", keywords: ["pass locally", "fail in ci", "ci environment", "test database", "isolated test"], requiredSkills: ["CI/CD", "DevOps"], priority: "HIGH" },
    { ptId: "PT_DOCKER_8", keywords: ["docker build", "dockerfile", "exit code 137", "oomkilled", "step failed", "multistage"], requiredSkills: ["Docker", "DevOps"], priority: "HIGH" },
    { ptId: "PT_DOCKER_9", keywords: ["image not found", "docker pull", "tag missing", "registry auth", "ecr pull"], requiredSkills: ["Docker", "Infrastructure"], priority: "MEDIUM" },
    { ptId: "PT_DOCKER_10", keywords: ["container crash", "docker run", "entrypoint", "sigkill", "container died"], requiredSkills: ["Docker", "DevOps"], priority: "HIGH" },
    { ptId: "PT_JENKINS_11", keywords: ["jenkinsfile", "pipeline failed", "groovy", "jenkins pipeline", "stage failure"], requiredSkills: ["Jenkins", "CI/CD"], priority: "HIGH" },
    { ptId: "PT_JENKINS_12", keywords: ["agent unavailable", "slave node", "executor offline", "jenkins agent", "ssh executor"], requiredSkills: ["Jenkins", "Linux"], priority: "HIGH" },
    { ptId: "PT_JENKINS_13", keywords: ["permission denied", "jenkins sock", "docker.sock", "user permission", "chmod"], requiredSkills: ["Linux", "Jenkins"], priority: "HIGH" },
    { ptId: "PT_CICD_14", keywords: ["secret not found", "missing env", "vault", "github secrets", "variable undefined"], requiredSkills: ["CI/CD", "DevOps"], priority: "HIGH" },
    { ptId: "PT_CICD_15", keywords: ["authentication failed", "invalid credentials", "token expired", "auth header"], requiredSkills: ["DevOps", "Infrastructure"], priority: "HIGH" },
    { ptId: "PT_AWS_16", keywords: ["accessdenied", "iam policy", "aws permissions", "sts assume", "forbidden"], requiredSkills: ["AWS", "Infrastructure"], priority: "CRITICAL" },
    { ptId: "PT_AWS_17", keywords: ["ec2 unreachable", "security group", "port 80", "port 22", "ingress rule", "vpc"], requiredSkills: ["AWS", "Networking"], priority: "HIGH" },
    { ptId: "PT_AWS_18", keywords: ["deployment timeout", "ecs healthcheck", "cloudformation timeout", "alb target"], requiredSkills: ["AWS", "DevOps"], priority: "HIGH" },
    { ptId: "PT_K8S_19", keywords: ["crashloopbackoff", "pod crash", "kubectl logs", "liveness probe", "readiness probe"], requiredSkills: ["Kubernetes", "DevOps"], priority: "CRITICAL" },
    { ptId: "PT_K8S_20", keywords: ["imagepullbackoff", "errimagepull", "imagepullsecrets", "k8s secret"], requiredSkills: ["Kubernetes", "Docker"], priority: "HIGH" },
    { ptId: "PT_DEP_21", keywords: ["port not accessible", "port binding", "firewall", "ufw", "connection refused"], requiredSkills: ["Networking", "DevOps"], priority: "HIGH" },
    { ptId: "PT_DEP_22", keywords: ["environment variable missing", "dotenv", "undefined env", "process.env"], requiredSkills: ["DevOps", "Infrastructure"], priority: "MEDIUM" },
    { ptId: "PT_DEP_23", keywords: ["database connection failed", "postgres connection", "rds timeout", "port 5432", "econnrefused"], requiredSkills: ["Database", "DevOps"], priority: "CRITICAL" },
    { ptId: "PT_DEP_24", keywords: ["dns error", "nxdomain", "cname", "a record", "domain resolution"], requiredSkills: ["DNS", "Networking"], priority: "HIGH" },
    { ptId: "PT_PROD_25", keywords: ["502 bad gateway", "nginx error", "reverse proxy", "upstream timed out", "puma socket"], requiredSkills: ["DevOps", "Linux"], priority: "CRITICAL" },
    { ptId: "PT_PROD_26", keywords: ["503 service unavailable", "high cpu", "service overloaded", "capacity limit"], requiredSkills: ["SRE", "DevOps"], priority: "CRITICAL" },
    { ptId: "PT_PROD_27", keywords: ["ssl error", "https error", "cert expired", "letsencrypt", "tls handshake"], requiredSkills: ["SSL/TLS", "Networking"], priority: "HIGH" },
    { ptId: "PT_ROLL_28", keywords: ["rollback failed", "previous version", "migration lock", "release restore"], requiredSkills: ["DevOps", "SRE"], priority: "CRITICAL" }
  ];

  for (const rule of diagnosisRulesSeed) {
    await prisma.diagnosisRule.create({
      data: {
        problemTypeId: rule.ptId,
        keywords: JSON.stringify(rule.keywords),
        signals: JSON.stringify([rule.priority.toLowerCase(), "build_log_token"]),
        requiredSkills: JSON.stringify(rule.requiredSkills),
        priority: rule.priority as any,
        confidenceWeight: 0.92
      }
    });
  }
  console.log("Seeded 28 Diagnosis Rules.");

  // 4. SEED USERS & EXPERTS (25 Realistic DevOps Experts)
  const expertSeeds = [
    { name: "Vikram Malhotra", email: "vikram@humanapi.io", headline: "Principal DevOps & Kubernetes Architect", bio: "12+ years optimizing containerized pipelines, EKS clusters, and zero-downtime deployment strategies for enterprise microservices.", exp: 12, skills: ["Kubernetes", "Docker", "AWS", "CI/CD", "DevOps"], rating: 4.98, reviews: 142, price10: 499 },
    { name: "Sarah Jenkins", email: "sarah.j@humanapi.io", headline: "Jenkins & CI/CD Pipeline Specialist", bio: "Specializes in multi-branch Jenkinsfiles, distributed agent clusters, and secret management integrations.", exp: 9, skills: ["Jenkins", "CI/CD", "GitLab CI", "Linux", "Git"], rating: 4.95, reviews: 98, price10: 399 },
    { name: "Marcus Vance", email: "marcus.v@humanapi.io", headline: "AWS Infrastructure & Cloud Security SRE", bio: "Cloud Formation & Terraform wizard. Fast triage for IAM AccessDenied, VPC peering, and EC2 network routing bottlenecks.", exp: 11, skills: ["AWS", "Infrastructure", "Networking", "DevOps", "Linux"], rating: 4.99, reviews: 184, price10: 450 },
    { name: "Elena Rostova", email: "elena.r@humanapi.io", headline: "Docker Containerization & Build Optimization Engineer", bio: "Author of multi-stage Docker best practices. I debug OOMKilled code 137, layer cache invalidations, and alpine runtime glibc issues.", exp: 8, skills: ["Docker", "Build Systems", "DevOps", "Linux"], rating: 4.92, reviews: 76, price10: 349 },
    { name: "Devon Chen", email: "devon.c@humanapi.io", headline: "GitHub Actions & Automation Lead", bio: "Helped 200+ teams migrate to GitHub Actions. Expert in self-hosted runners, custom action triggers, and deployment environments.", exp: 7, skills: ["GitHub Actions", "GitHub", "Git", "CI/CD"], rating: 4.97, reviews: 112, price10: 349 },
    { name: "Aarav Sharma", email: "aarav.s@humanapi.io", headline: "Senior Linux & Production Networking Engineer", bio: "Nginx, SSL/TLS certificates, DNS records, 502/503 gateway triage, and Linux kernel socket troubleshooting.", exp: 10, skills: ["Linux", "Networking", "DNS", "SSL/TLS", "DevOps"], rating: 4.96, reviews: 129, price10: 399 },
    { name: "Priya Patel", email: "priya.p@humanapi.io", headline: "Cloud Database & RDS Connectivity Specialist", bio: "Specialized in VPC security group rules, PostgreSQL RDS connection pooling, SSL connection strings, and migration schema locks.", exp: 9, skills: ["Database", "AWS", "Infrastructure", "DevOps"], rating: 4.93, reviews: 88, price10: 399 },
    { name: "Lucas Rodriguez", email: "lucas.r@humanapi.io", headline: "Kubernetes Operator & Helm Chart SRE", bio: "Resolving CrashLoopBackOff, ImagePullBackOff, persistent volume claim bounds, and ingress controller misconfigurations.", exp: 10, skills: ["Kubernetes", "Docker", "SRE", "DevOps"], rating: 4.97, reviews: 156, price10: 449 },
    { name: "Chloe Dupont", email: "chloe.d@humanapi.io", headline: "GCP & Multi-Cloud Infrastructure Engineer", bio: "Google Cloud Build, GKE clusters, Cloud Run deployments, and GCP Service Account permission diagnostics.", exp: 8, skills: ["GCP", "Kubernetes", "CI/CD", "Infrastructure"], rating: 4.91, reviews: 64, price10: 349 },
    { name: "Tariq Al-Mansoor", email: "tariq.a@humanapi.io", headline: "Azure DevOps & Windows/Linux Hybrid Lead", bio: "Azure Pipelines, Service Principals, KeyVault secrets, and App Service deployment troubleshooting.", exp: 11, skills: ["Azure", "CI/CD", "DevOps", "Infrastructure"], rating: 4.94, reviews: 92, price10: 420 },
    { name: "Hannah Abbott", email: "hannah.a@humanapi.io", headline: "Build Systems & Dependency Chain Triage", bio: "Solving npm, yarn, pip, maven, and gradle build failures in headless CI/CD container environments.", exp: 7, skills: ["Build Systems", "DevOps", "Git", "CI/CD"], rating: 4.89, reviews: 54, price10: 299 },
    { name: "Rajesh Kulkarni", email: "rajesh.k@humanapi.io", headline: "Site Reliability Engineer & Emergency Rollback Specialist", bio: "24/7 incident responder specializing in production outage diagnosis, rollback recovery, and zero-downtime deployment pipelines.", exp: 13, skills: ["SRE", "DevOps", "Linux", "Networking", "Infrastructure"], rating: 5.00, reviews: 210, price10: 499 },
    { name: "Jessica Taylor", email: "jessica.t@humanapi.io", headline: "Git & Webhook Security Auditor", bio: "Resolving SSH key permission issues, deploy keys, webhook secret signature verification, and repository access rules.", exp: 8, skills: ["Git", "GitHub", "Jenkins", "DevOps"], rating: 4.92, reviews: 71, price10: 349 },
    { name: "David Kim", email: "david.k@humanapi.io", headline: "GitLab CI Runner & Microservice Pipeline Lead", bio: "GitLab CI runner concurrency, docker-in-docker setups, artifact caching, and environment variable masking.", exp: 9, skills: ["GitLab CI", "CI/CD", "Docker", "DevOps"], rating: 4.96, reviews: 104, price10: 379 },
    { name: "Fatima Hassan", email: "fatima.h@humanapi.io", headline: "SSL/TLS & Domain Security Specialist", bio: "HTTPS certificates, Let's Encrypt renewal hooks, Nginx TLS proxying, and CORS deployment header resolution.", exp: 7, skills: ["SSL/TLS", "DNS", "Networking", "Linux"], rating: 4.90, reviews: 49, price10: 299 },
    { name: "Rohan Verma", email: "rohan.v@humanapi.io", headline: "AWS EC2 & Security Group Specialist", bio: "EC2 networking, security group ingress/egress rules, VPC subnets, and elastic IP allocation for deployments.", exp: 10, skills: ["AWS", "Networking", "Infrastructure", "Linux"], rating: 4.94, reviews: 115, price10: 399 },
    { name: "Kaitlyn Miller", email: "kaitlyn.m@humanapi.io", headline: "DevOps & Infrastructure Automation Specialist", bio: "Terraform, Ansible, and automated infrastructure deployment failure diagnosis.", exp: 8, skills: ["Infrastructure", "DevOps", "AWS", "CI/CD"], rating: 4.93, reviews: 83, price10: 350 },
    { name: "Siddharth Nair", email: "siddharth.n@humanapi.io", headline: "Docker Registry & ECR Security Specialist", bio: "Debugging private container registry authentication, ImagePullBackOff, and Docker credential helpers.", exp: 9, skills: ["Docker", "AWS", "Kubernetes", "DevOps"], rating: 4.95, reviews: 97, price10: 380 },
    { name: "Amara Nwosu", email: "amara.n@humanapi.io", headline: "CI/CD Secret Management & Vault Specialist", bio: "Injected secrets, environment variable scope masking, and HashiCorp Vault integrations in build pipelines.", exp: 8, skills: ["CI/CD", "DevOps", "Infrastructure", "Linux"], rating: 4.91, reviews: 62, price10: 340 },
    { name: "Benjamin O'Connor", email: "ben.o@humanapi.io", headline: "Linux Systems & Port Binding Specialist", bio: "Netstat, lsof, ufw firewall, host-to-container port mapping, and socket binding diagnostics.", exp: 12, skills: ["Linux", "Networking", "DevOps", "SRE"], rating: 4.98, reviews: 167, price10: 420 },
    { name: "Zeynep Yilmaz", email: "zeynep.y@humanapi.io", headline: "Nginx & Load Balancer Reverse Proxy Specialist", bio: "Resolving 502 Bad Gateway, 504 Gateway Timeout, upstream keepalive, and proxy buffer overflow issues.", exp: 10, skills: ["Networking", "Linux", "DevOps", "SSL/TLS"], rating: 4.96, reviews: 124, price10: 399 },
    { name: "Gabriel Silva", email: "gabriel.s@humanapi.io", headline: "Deployment Rollback & Incident Recovery Lead", bio: "Automated rollback strategies, immutable release tags, and database migration rollback safety.", exp: 11, skills: ["DevOps", "SRE", "CI/CD", "Database"], rating: 4.97, reviews: 139, price10: 440 },
    { name: "Nisha Banerjee", email: "nisha.b@humanapi.io", headline: "Node.js & Python CI Build Pipeline Specialist", bio: "Headless engine version resolution, native C++ addon compilation failures, and lockfile synchronization.", exp: 7, skills: ["Build Systems", "DevOps", "Git", "Linux"], rating: 4.88, reviews: 46, price10: 299 },
    { name: "Oliver Wright", email: "oliver.w@humanapi.io", headline: "Kubernetes Liveness & Readiness Probe Specialist", bio: "Fixing CrashLoopBackOff caused by misconfigured health checks, memory limits, and container entrypoints.", exp: 9, skills: ["Kubernetes", "Docker", "DevOps", "SRE"], rating: 4.94, reviews: 89, price10: 380 },
    { name: "Mei Lin", email: "mei.l@humanapi.io", headline: "Enterprise CI/CD & Multi-Cloud Architect", bio: "End-to-end continuous integration and deployment pipelines spanning AWS, GCP, GitHub, and Jenkins.", exp: 14, skills: ["DevOps", "CI/CD", "AWS", "Kubernetes", "Infrastructure"], rating: 4.99, reviews: 230, price10: 499 }
  ];

  for (let i = 0; i < expertSeeds.length; i++) {
    const seed = expertSeeds[i];
    const nameParts = seed.name.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");

    const user = await prisma.user.upsert({
      where: { email: seed.email },
      update: {
        firstName,
        lastName,
        role: "EXPERT",
        status: "ACTIVE",
        emailVerified: true
      },
      create: {
        email: seed.email,
        passwordHash: "$2a$10$e8wJbH2vU.P8R/3o8tO5ve8K8wU2W3xX4y5z6a7b8c9d0e1f2g3h", // hashed placeholder
        firstName,
        lastName,
        avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + i * 100000}?w=200&auto=format&fit=crop&q=80`,
        role: "EXPERT",
        status: "ACTIVE",
        emailVerified: true
      }
    });

    const expertProfile = await prisma.expertProfile.upsert({
      where: { userId: user.id },
      update: {
        headline: seed.headline,
        bio: seed.bio,
        yearsExperience: seed.exp,
        verificationStatus: "APPROVED",
        accreditationStatus: "VERIFIED_EXPERT",
        rating: seed.rating,
        reviewCount: seed.reviews,
        pricing5: Math.round(seed.price10 * 0.6),
        pricing10: seed.price10,
        pricing15: Math.round(seed.price10 * 1.4)
      },
      create: {
        userId: user.id,
        headline: seed.headline,
        bio: seed.bio,
        yearsExperience: seed.exp,
        verificationStatus: "APPROVED",
        accreditationStatus: "VERIFIED_EXPERT",
        discoverabilityScore: 85 + (i % 15),
        rating: seed.rating,
        reviewCount: seed.reviews,
        availabilityStatus: "AVAILABLE",
        pricing5: Math.round(seed.price10 * 0.6),
        pricing10: seed.price10,
        pricing15: Math.round(seed.price10 * 1.4)
      }
    });

    // Seed expert skills
    for (const skillName of seed.skills) {
      if (skillMap[skillName]) {
        await prisma.expertSkill.upsert({
          where: {
            expertId_skillId: {
              expertId: expertProfile.id,
              skillId: skillMap[skillName]
            }
          },
          update: {},
          create: {
            expertId: expertProfile.id,
            skillId: skillMap[skillName],
            experienceLevel: seed.exp > 10 ? "LEAD" : "EXPERT"
          }
        });
      }
    }

    // Seed expert availability (Mon - Fri 9 AM - 6 PM)
    for (let day = 1; day <= 5; day++) {
      await prisma.expertAvailability.create({
        data: {
          expertId: expertProfile.id,
          dayOfWeek: day,
          startTime: "09:00",
          endTime: "18:00",
          timezone: "UTC",
          isAvailable: true
        }
      });
    }
  }

  console.log(`Seeded ${expertSeeds.length} Approved DevOps Experts with skills and availability.`);

  // 5. SEED CLIENT & ADMIN USERS
  const clientUser = await prisma.user.upsert({
    where: { email: "demo.user@humanapi.test" },
    update: {
      role: "CLIENT",
      emailVerified: true,
      phone: "+91 9876543210",
      dateOfBirth: "1994-06-15",
      city: "Bengaluru",
      origin: "Karnataka"
    },
    create: {
      email: "demo.user@humanapi.test",
      passwordHash: "$2a$10$e8wJbH2vU.P8R/3o8tO5ve8K8wU2W3xX4y5z6a7b8c9d0e1f2g3h",
      firstName: "Demo",
      lastName: "User",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      phone: "+91 9876543210",
      dateOfBirth: "1994-06-15",
      city: "Bengaluru",
      origin: "Karnataka",
      role: "CLIENT",
      status: "ACTIVE",
      emailVerified: true
    }
  });

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@humanapi.io" },
    update: { role: "ADMIN", emailVerified: true },
    create: {
      email: "admin@humanapi.io",
      passwordHash: "$2a$10$e8wJbH2vU.P8R/3o8tO5ve8K8wU2W3xX4y5z6a7b8c9d0e1f2g3h",
      firstName: "System",
      lastName: "Admin",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
      role: "ADMIN",
      status: "ACTIVE",
      emailVerified: true
    }
  });

  // 6. SEED 100+ SYNTHETIC DEPLOYMENT INCIDENT EXAMPLES (AI-READY DATASET)
  const techOptions = ["Node.js", "React", "Python", "Java", "Go"];
  const platformOptions = ["AWS", "GCP", "Azure", "Vercel", "Render"];
  const cicdOptions = ["GitHub Actions", "Jenkins", "GitLab CI", "CircleCI"];
  const stages = [
    { stage: "GITHUB", problemType: "PT_GITHUB_1", skills: ["Git", "GitHub"], template: "Repository access denied for deployment deploy key. Permission denied (publickey)." },
    { stage: "GITHUB", problemType: "PT_GITHUB_2", skills: ["Jenkins", "GitHub"], template: "GitHub webhook failed to deliver payload to Jenkins endpoint. HMAC signature mismatch." },
    { stage: "BUILD", problemType: "PT_BUILD_3", skills: ["Build Systems", "DevOps"], template: "npm install exited with code 1 during headless build. Missing native g++ toolchain." },
    { stage: "BUILD", problemType: "PT_BUILD_4", skills: ["Build Systems", "DevOps"], template: "TypeScript compilation failed with code 2: Cannot find module '@types/node'." },
    { stage: "BUILD", problemType: "PT_BUILD_5", skills: ["DevOps", "Linux"], template: "Runtime version mismatch: Required Node >= 20.0.0, runner active engine is v16.14.0." },
    { stage: "TEST", problemType: "PT_TEST_6", skills: ["CI/CD", "DevOps"], template: "Jest test suite failed in CI runner: 4 failed, 12 passed. Mock state isolation leak." },
    { stage: "TEST", problemType: "PT_TEST_7", skills: ["CI/CD", "DevOps"], template: "Tests pass locally but fail in CI runner due to missing test container PostgreSQL instance." },
    { stage: "DOCKER", problemType: "PT_DOCKER_8", skills: ["Docker", "DevOps"], template: "Docker build exits with code 137 during npm run build step. OOMKilled memory limit exceeded." },
    { stage: "DOCKER", problemType: "PT_DOCKER_9", skills: ["Docker", "Infrastructure"], template: "Docker pull error: repository node-app not found or registry authorization token expired." },
    { stage: "DOCKER", problemType: "PT_DOCKER_10", skills: ["Docker", "DevOps"], template: "Container crashes immediately after startup. Missing ENTRYPOINT environment variables." },
    { stage: "JENKINS", problemType: "PT_JENKINS_11", skills: ["Jenkins", "CI/CD"], template: "Jenkinsfile parsing error at line 42: unexpected token 'stage' in parallel execution." },
    { stage: "JENKINS", problemType: "PT_JENKINS_12", skills: ["Jenkins", "Linux"], template: "Jenkins build stayed in queue: Agent node 'build-worker-3' is offline." },
    { stage: "JENKINS", problemType: "PT_JENKINS_13", skills: ["Linux", "Jenkins"], template: "Permission denied while connecting to Docker daemon socket at unix:///var/run/docker.sock." },
    { stage: "CI/CD", problemType: "PT_CICD_14", skills: ["CI/CD", "DevOps"], template: "Pipeline execution failed: Required secret 'AWS_SECRET_ACCESS_KEY' is missing." },
    { stage: "CI/CD", problemType: "PT_CICD_15", skills: ["DevOps", "Infrastructure"], template: "Authentication failed during deployment stage: Service account token expired." },
    { stage: "AWS", problemType: "PT_AWS_16", skills: ["AWS", "Infrastructure"], template: "AWS AccessDenied: User arn:aws:iam::1234:user/ci is not authorized to perform ecs:UpdateService." },
    { stage: "AWS", problemType: "PT_AWS_17", skills: ["AWS", "Networking"], template: "EC2 instance unreachable over HTTP on port 80. Security group ingress rule missing." },
    { stage: "AWS", problemType: "PT_AWS_18", skills: ["AWS", "DevOps"], template: "Deployment timeout on AWS ECS: Health check grace period 60s expired before service signal." },
    { stage: "KUBERNETES", problemType: "PT_K8S_19", skills: ["Kubernetes", "DevOps"], template: "Pod api-server-5d6f is stuck in CrashLoopBackOff. Liveness probe HTTP 500 failure." },
    { stage: "KUBERNETES", problemType: "PT_K8S_20", skills: ["Kubernetes", "Docker"], template: "Pod production-worker stuck in ImagePullBackOff: imagePullSecrets 'regcred' not found." },
    { stage: "DEPLOYMENT", problemType: "PT_DEP_21", skills: ["Networking", "DevOps"], template: "Port 3000 is not accessible from load balancer. Container port binding missing." },
    { stage: "DEPLOYMENT", problemType: "PT_DEP_22", skills: ["DevOps", "Infrastructure"], template: "Application crashed on boot: Process.env.DATABASE_URL is undefined." },
    { stage: "DEPLOYMENT", problemType: "PT_DEP_23", skills: ["Database", "DevOps"], template: "Database connection failed: ECONNREFUSED 10.0.1.45:5432. RDS security group blocked port." },
    { stage: "DEPLOYMENT", problemType: "PT_DEP_24", skills: ["DNS", "Networking"], template: "DNS resolution error: getaddrinfo ENOTFOUND api.internal.domain.com." },
    { stage: "PRODUCTION", problemType: "PT_PROD_25", skills: ["DevOps", "Linux"], template: "Production domain returns 502 Bad Gateway: Nginx upstream connection refused on port 8080." },
    { stage: "PRODUCTION", problemType: "PT_PROD_26", skills: ["SRE", "DevOps"], template: "Production domain returns 503 Service Unavailable: High CPU utilization capacity limit reached." },
    { stage: "PRODUCTION", problemType: "PT_PROD_27", skills: ["SSL/TLS", "Networking"], template: "SSL/HTTPS error: ERR_CERT_DATE_INVALID. Certificate renewal failed on Let's Encrypt bot." },
    { stage: "ROLLBACK", problemType: "PT_ROLL_28", skills: ["DevOps", "SRE"], template: "Deployment rollback failed: Previous production release container image tag v1.4.1 not found." }
  ];

  let incidentCount = 0;
  for (let i = 0; i < 112; i++) {
    const s = stages[i % stages.length];
    const tech = techOptions[i % techOptions.length];
    const plat = platformOptions[i % platformOptions.length];
    const ci = cicdOptions[i % cicdOptions.length];
    const varText = `[Incident #${i + 101}] ${s.template} (Context: ${tech} application on ${plat} via ${ci})`;

    await prisma.deploymentIncidentExample.create({
      data: {
        stage: s.stage,
        errorText: varText,
        context: `Production deployment pipeline for ${tech} on ${plat}`,
        technology: tech,
        platform: plat,
        ciCd: ci,
        probableProblemType: s.problemType,
        requiredSkills: JSON.stringify(s.skills)
      }
    });
    incidentCount++;
  }
  console.log(`Seeded ${incidentCount} AI-ready Synthetic Deployment Incident Examples.`);

  // 7. SEED SAMPLE DEPLOYMENT CASE, BOOKING, SESSION, FEEDBACK & NOTIFICATION
  const firstExpertProfile = await prisma.expertProfile.findFirst({
    where: { verificationStatus: "APPROVED" }
  });

  if (firstExpertProfile) {
    const sampleCase = await prisma.deploymentCase.create({
      data: {
        userId: clientUser.id,
        title: "Docker build fails with exit code 137 in Jenkins CI",
        description: "Jenkins pipeline fails during multi-stage Docker build step when running npm run build. Memory allocation limit seems exceeded.",
        repositoryUrl: "https://github.com/humanapi/production-service",
        technology: "Node.js",
        deploymentPlatform: "AWS",
        ciCdTool: "Jenkins",
        problemTypeId: "PT_DOCKER_8",
        priority: "HIGH",
        status: "DIAGNOSED",
        diagnosis: JSON.stringify({
          caseId: "sample-case-1",
          status: "DIAGNOSED",
          problemType: "Docker build failed",
          cause: "Invalid Dockerfile syntax, layer cache invalidation, or build step error",
          stage: "DOCKER",
          diagnosis: "Build step failed during container image compilation. Exit code 137 indicates container memory throttling.",
          requiredSkills: ["Docker", "DevOps", "Jenkins"]
        })
      }
    });

    await prisma.expertMatch.create({
      data: {
        deploymentCaseId: sampleCase.id,
        expertId: firstExpertProfile.id,
        score: 0.96,
        matchReasons: JSON.stringify(["Docker", "Jenkins", "DevOps"])
      }
    });

    const booking = await prisma.booking.create({
      data: {
        clientId: clientUser.id,
        expertId: firstExpertProfile.id,
        deploymentCaseId: sampleCase.id,
        sessionDuration: 10,
        price: 349,
        currency: "INR",
        status: "CONFIRMED",
        scheduledAt: new Date(Date.now() + 3600000)
      }
    });

    const session = await prisma.session.create({
      data: {
        bookingId: booking.id,
        status: "SCHEDULED",
        roomId: `room-${booking.id}`
      }
    });

    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        clientId: clientUser.id,
        expertId: firstExpertProfile.id,
        amount: 349,
        currency: "INR",
        provider: "gateway_mock",
        providerPaymentId: `pay_mock_${Date.now()}`,
        status: "PAID",
        platformFee: 41.88,
        expertAmount: 307.12,
        paidAt: new Date()
      }
    });

    await prisma.notification.create({
      data: {
        userId: clientUser.id,
        type: "BOOKING_CONFIRMED",
        title: "10-Min Consultation Confirmed",
        message: `Your session with expert ${firstExpertProfile.headline} is confirmed for 10 minutes.`,
        read: false
      }
    });

    await prisma.auditLog.create({
      data: {
        actorUserId: adminUser.id,
        action: "EXPERT_APPROVED",
        entityType: "EXPERT",
        entityId: firstExpertProfile.id,
        metadata: JSON.stringify({ reason: "Accreditation assessment passed with 95% score" })
      }
    });
  }

  console.log("HumanAPI Database Seeding Complete!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
