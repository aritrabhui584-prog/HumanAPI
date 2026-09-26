<div align="center">
  <img src="./logo.png" alt="HumanAPI Logo" width="180" />
  <h1>HumanAPI</h1>
  <p><strong>AI-powered deployment diagnosis and human expert consultation platform</strong></p>
  <p>Analyzes DevOps issues and connects developers with verified specialists for fast, focused technical help.</p>

  <a href="https://share.google/vbBe0vbZkX3QDhYH1"><strong>Explore Demo / Google Share Link »</strong></a>

  <br /><br />

  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0+-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-4285F4?style=flat-square&logo=googlecloud&logoColor=white)](https://ai.google.dev/)
  [![Prisma](https://img.shields.io/badge/Prisma-6.0+-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
</div>

<hr />

## 📌 Overview

**HumanAPI** bridges the gap between automated artificial intelligence and human expertise in DevOps and Cloud Infrastructure engineering. When deployment pipelines break, Kubernetes clusters crash, or CI/CD jobs fail, **HumanAPI** instantly ingests logs and configuration files to deliver an AI-generated root-cause diagnosis. If complex edge cases persist, developers can seamlessly connect with top-tier verified DevOps experts for live 1-on-1 consultation.

🔗 **Live Platform Reference**: [https://share.google/vbBe0vbZkX3QDhYH1](https://share.google/vbBe0vbZkX3QDhYH1)

---

## ✨ Key Features

- 🤖 **Automated Deployment Diagnosis**: Powered by Google Gemini AI (`@google/genai`), analyzing build failures, runtime exceptions, Dockerfiles, and K8s manifests in real time.
- 🧑‍💻 **Verified Expert Network**: Connect with battle-tested SREs, DevOps engineers, and Cloud architects for paid consultations and live troubleshooting.
- 📋 **Interactive Problem Intake**: Multi-step intake flow enabling users to describe stack details, paste error logs, attach manifests, and specify urgency.
- 🔐 **Comprehensive Authentication & Security**: Complete user authentication system with email OTP verification, password recovery, JWT session handling, and role-based access control (Developers, Specialists, Admins).
- 📊 **User & Specialist Dashboards**: Manage active diagnoses, scheduled expert consultations, profile settings, and payment receipts.
- 💳 **Seamless Payments & Bookings**: Integrated payment gateway architecture supporting instant bookings and session management.
- 🎨 **Modern Futuristic UI**: Built with React 19, Tailwind CSS v4, Framer Motion animations, and Three.js visual elements.

---

## 🏗️ Architecture & Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript, Vite 6 |
| **Styling & Motion** | Tailwind CSS v4, Framer Motion, Lucide Icons, Three.js / R3F |
| **Backend & API** | Express.js, Node.js (`server.ts`), REST endpoints |
| **AI Diagnosis Engine** | `@google/genai` (Google Gemini API integration) |
| **Database & ORM** | Prisma ORM, SQLite (`prisma/schema.prisma`) |
| **Auth Microservice** | Python FastAPI Auth service (`src/Auth/Auth`) |

---

## 📁 Project Structure

```
HumanAPI/
├── logo.png                       # Primary application brand logo
├── public/                        # Static assets, icons, and logo variations
├── prisma/                        # Prisma database schema & seed scripts
├── src/
│   ├── Auth/                      # Authentication components, routes, and services
│   ├── backend/                   # API routes, diagnosis engine, and email service
│   ├── components/
│   │   ├── auth/                  # Login, Signup, OTP, and Auth Modals
│   │   ├── common/                # Navbar, Footer, Drawers, Layouts
│   │   ├── dashboard/             # Developer overview, settings, and session views
│   │   ├── expert/                # Expert consultation views & settings
│   │   └── intake/                # Deployment Intake wizard flow
│   ├── context/                   # AppState and Auth Context providers
│   ├── data/                      # Mock data and initial state fixtures
│   ├── lib/                       # API clients, payment gateway, user utils
│   ├── App.tsx                    # Main router & app layout entry
│   └── main.tsx                   # React entry point
├── server.ts                      # Express API server entry point
├── package.json                   # Project dependencies and script scripts
└── README.md                      # Documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **Gemini API Key**: Obtain a key from [Google AI Studio](https://aistudio.google.com/)

---

### Installation Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/aritrabhui584-prog/HumanAPI.git
   cd HumanAPI
   ```

2. **Install node dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` or `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   PORT=3000
   DATABASE_URL="file:./dev.db"
   ```

4. **Initialize Database**:
   ```bash
   # Push schema to SQLite database
   npm run db:push

   # Seed initial mock data (optional)
   npm run db:seed
   ```

---

### Running the Application

- **Development Mode** (Starts server with hot reload):
  ```bash
  npm run dev
  ```
  Open your browser and navigate to `http://localhost:3000` (or the port specified in terminal).

- **Production Build**:
  ```bash
  # Build bundle
  npm run build

  # Run production server
  npm start
  ```

---

## 📄 License

This project is open-source and available under the MIT License.

---

<div align="center">
  <sub>Built for developers by developers. Powered by AI + Human Intelligence.</sub><br />
  <a href="https://share.google/vbBe0vbZkX3QDhYH1"><strong>HumanAPI Showcase Link</strong></a>
</div>
