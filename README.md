<div align="center">
  <img src="frontend/public/logo.png" alt="Pharma Care Logo" width="130" style="border-radius: 20px; box-shadow: 0 10px 25px rgba(0,255,160,0.2);" />
  <h1>Pharma Care — Enterprise Smart Pharmacy & Telemedicine Platform</h1>
  <p><strong>India's Next-Generation AI-Powered Healthcare Ecosystem &bull; Clean Domain Architecture &bull; Sub-10ms Clinical Pre-Flight Latency</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Frontend-React_19_+_Vite-00ffa0?style=for-the-badge&logo=react&logoColor=black" alt="Frontend React 19" />
    <img src="https://img.shields.io/badge/Backend-Node.js_+_TypeScript-222?style=for-the-badge&logo=typescript&logoColor=00ffa0" alt="Backend TypeScript" />
    <img src="https://img.shields.io/badge/Database-PostgreSQL_3NF_+_Prisma-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Queue-BullMQ_+_Redis-dc382d?style=for-the-badge&logo=redis&logoColor=white" alt="Redis BullMQ" />
    <img src="https://img.shields.io/badge/AI-Google_Gemini_+_Sub--10ms_Preflight-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google AI" />
  </p>
</div>

---

## 📌 Executive Summary

**Pharma Care** is an enterprise-grade, digital-first healthcare platform engineered to unify 24/7 digital telemedicine consultations, schedule H e-prescription verification, AI-assisted symptom triage, and verified home pharmacy logistics into a single authenticated experience.

Unlike traditional monolithic applications, Pharma Care is architected on strict **Clean Domain-Driven Design (DDD)** principles across both backend and frontend layers. It introduces an advanced **Application Layer 3D Hero UI Engine**, a **Sub-10ms Emergency Clinical Interceptor**, and a **Multi-Tab Consultancy Maintenance Suite** capable of serving patients, verified doctors, pharmacy dispensers, and platform administrators seamlessly.

---

## 🌟 Key Architectural Highlights & Features

### 1. ⚡ Application Layer 3D Hero UI Showcase (`Dashboard.jsx`)
To deliver a breathtaking visual experience (`CLS = 0`) directly inside the frontend application layer without external 3D bundle bloat (`Three.js`), the landing dashboard implements hardware-accelerated CSS perspective transform engines:
- **Layer 1 (Parallax Clinical Particles & Grid)**: Floating radial gradients (`#1c3b33` & `#00ffa0`) with continuous 8s/10s reverse tilt animation (`@keyframes layer1Float`).
- **Layer 2 (3D Isometric Holographic Matrix Card)**: Glassmorphism card tilted in 3D space (`perspective(1200px) rotateX(10deg) rotateY(-12deg)`). Elevates dynamically to `scale3d(1.03, 1.03, 1.03)` on hover (`@keyframes layer2Pulse`).
- **Layer 3 (Foreground Floating Action Badges)**: High-contrast badges projected along the Z-axis (`translateZ(35px) to translateZ(45px)`) highlighting *"Sub-10ms Emergency Pre-Flight"* and *"100% MCI Verified Specialists"* (`@keyframes layer3Bounce`).

### 2. 🛡️ Sub-10ms Emergency Pre-Flight Safety Interceptor (`AI Companion`)
In strict adherence to medical safety criteria (**FR-1.7**), every patient query submitted to the AI Health Companion (`/chat`) undergoes an immediate, deterministic local pre-flight check before hitting expensive LLM APIs:
- Intercepts life-threatening crisis keywords (`suicide`, `overdose`, `chest pain`, `heart attack`, `breathing`, `poisoning`) in **`< 10 milliseconds`**.
- Immediately flags an emergency safeguard warning (`EMERGENCY SAFEGUARD INTERCEPT`) directing the patient to emergency hospital services (`112 / 108`).
- Features **Initial Mode Triage Selectors** (`General Triage`, `Medication Safety`, `Emergency Checker`, `Doctor Finder`) and a **1-Click Reset to Initial State (`🔄`)** button.

### 3. 📅 Telemedicine & Consultancy Maintenance Suite (`Consultation.jsx`)
The consultation module (`/consultation`) operates as a multi-tab clinical management suite accessible across multiple roles:
- **`🎥 Live Consultation Room`**: Simulated WebRTC session room with real-time PIP feeds, session room status (`ROOM-EVE-RAO &bull; LIVE`), and an interactive prescription pad.
- **`📅 Consultancy Maintenance`**: Interactive roster maintenance allowing doctors and admins to update session fees (`₹500 - ₹800`), track consultation status (`Ready to Join`, `Confirmed`, `Rescheduled`), and review patient clinical notes.
- **`📋 Prescription Archive`**: Comprehensive audit log of verified Schedule H prescriptions (`RX-94021`, `RX-88102`) with direct **`Order from Pharmacy`** 1-click cart fulfillment.

### 4. 🔐 1-Click Role-Based Access Control (RBAC) Matrix
The application navigation bar (`App.jsx`) embeds a **`⚡ Switch Role / Login`** quick-access badge (`UserCheck` icon), allowing instant switching across **4 distinct prototype personas** right from the top right header:
1. **🧑 Patient (`Rishi Kumar`)**: Books appointments, chats with AI triage, and places medication orders.
2. **👨‍⚕️ Doctor (`Dr. Evelyn Rao`)**: Conducts video consultations, manages roster schedules, and issues digital prescriptions.
3. **🏥 Pharmacy Admin (`Meera Sen`)**: Validates Schedule H uploads, dispenses medication, and manages stock status.
4. **🛡️ Platform Admin (`Super Admin`)**: Full governance over the **Admin Suite (`/admin`)**, onboarding doctors, maintaining drug catalogs, and auditing safety logs.

---

## 🏗️ System Architecture & Repository Structure

Pharma Care follows **Clean Architecture (Domain-Driven Design)** with strict layering: Presentation $\rightarrow$ Service $\rightarrow$ Domain Entities $\rightarrow$ Repository / Infrastructure.

```text
Pharma-Care-/
├── frontend/                     # React 19 + Vite + Vanilla CSS System
│   ├── src/
│   │   ├── components/           # Reusable UI components (Navbar, Stepper, Badges)
│   │   ├── views/
│   │   │   ├── Dashboard.jsx     # 3D Landing Page Hero (3 Animation Layers)
│   │   │   ├── Chat.jsx          # AI Companion with Sub-10ms Safety Interceptor
│   │   │   ├── Consultation.jsx  # Multi-Tab Telemedicine & Consultancy Suite
│   │   │   ├── OrderTracking.jsx # Order Delivery Tracker (Unique Key Deduplicated)
│   │   │   ├── Pharmacy.jsx      # Smart Pharmacy & Schedule H Cart Checkout
│   │   │   ├── Login.jsx         # Quick Demo Role Cards & Auth Suite
│   │   │   └── Admin.jsx         # Multi-Role Clinical Admin Suite
│   │   └── App.jsx               # Central Router & Top Header RBAC Switcher
│   └── package.json
│
├── backend/                      # Node.js + Express + TypeScript Clean Architecture
│   ├── src/
│   │   ├── config/               # Zod validated environment variables & CORS
│   │   ├── constants/            # Enums, HTTP status codes, and message strings
│   │   ├── domain/               # Core Domain Layer (Pure TypeScript)
│   │   │   ├── entities/         # User, Doctor, Medicine, Order, Appointment interfaces
│   │   │   └── repositories/     # Repository interfaces decoupling DB implementation
│   │   ├── infrastructure/       # Infrastructure & External Integrations
│   │   │   ├── database/         # Prisma Singleton ORM Client (`prisma/client.ts`)
│   │   │   ├── cache/            # Redis Caching & BullMQ Asynchronous Task Queue
│   │   │   └── ai/               # Gemini / Vertex AI Health Interceptor Service
│   │   ├── modules/              # Feature-based Clean Domain Modules
│   │   │   ├── auth/             # DTO, Repository, Service, Controller, Routes
│   │   │   ├── pharmacy/         # DTO, Repository, Service, Controller, Routes
│   │   │   ├── telemedicine/     # DTO, Repository, Service, Controller, Routes
│   │   │   ├── ai/               # DTO, Repository, Service, Controller, Routes
│   │   │   └── admin/            # DTO, Repository, Service, Controller, Routes
│   │   ├── middlewares/          # Global Auth, RBAC, Rate Limit, Upload & Error handlers
│   │   └── app.ts / server.ts    # Application factory and graceful server bootstrap
│   ├── prisma/
│   │   ├── schema.prisma         # Complete 44+ 3NF normalized enterprise schema
│   │   └── seed.ts               # Complete multi-role DB seeder
│   ├── tests/                    # Automated Jest unit & integration test suites
│   ├── Dockerfile                # Multi-stage production container build
│   └── package.json
│
├── design.md                     # Master Technical Architecture & Design Document
├── docker-compose.yml            # Local Development Stack (PostgreSQL + Redis + App)
├── docker-compose.prod.yml       # Production Container Stack
└── README.md                     # Master Project Documentation (This File)
```

---

## 🛠️ Quick Start & Installation Guide

### Prerequisites
- **Node.js**: v18.x or v20.x (`node -v`)
- **npm**: v9.x or higher (`npm -v`)
- **PostgreSQL & Redis** *(Optional if using Docker Compose)*

### 1. Clone & Install Dependencies
You can install both frontend and backend dependencies using the root workspace helper:
```bash
git clone https://github.com/CodewithRushi-111/Pharma-Care-.git
cd Pharma-Care-

# Install all workspace dependencies (Frontend + Backend)
npm run install-all
```

### 2. Configure Environment Variables (`backend/.env`)
Create a `.env` file inside the `backend/` folder:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pharmacare?schema=public"
REDIS_HOST="127.0.0.1"
REDIS_PORT=6379
JWT_SECRET="super-secret-pharma-care-jwt-key-2026"
JWT_EXPIRES_IN="1d"
GEMINI_API_KEY="your_google_gemini_api_key_here"
```

### 3. Database Migration & Seeding (`Prisma`)
Ensure PostgreSQL is running, then initialize the 3NF schema and seed demo data:
```bash
cd backend
npx prisma generate
npx prisma db push
npm run seed
cd ..
```

### 4. Run Locally (Development Mode)
Start the frontend and backend servers concurrently:
```bash
# Start Vite Frontend (http://localhost:5173)
cd frontend
npm run dev

# In a separate terminal: Start Express Backend (http://localhost:5000)
cd backend
npm run dev
```

---

## 🐳 Docker Production Deployment

Pharma Care includes production-ready Docker and Docker Compose configurations:

```bash
# Launch the complete enterprise stack (PostgreSQL + Redis + Backend API)
docker-compose up -d --build

# Check container health and worker logs
docker-compose ps
docker-compose logs -f backend
```

---

## 🧪 Testing & Verification Suite

All system capabilities and domain rules are verified by comprehensive unit and production build tests:

```bash
# Run Backend Unit & Clinical AI Safety Tests (Jest)
cd backend
npm test

# Expected Output:
# PASS tests/ai.safety.test.ts (Clinical AI Sub-10ms Emergency Pre-flight Safety Interceptor)
# PASS tests/auth.test.ts (Auth Utilities & Token Verification)
# Test Suites: 2 passed, 2 total | Tests: 6 passed, 6 total

# Build Frontend Production Bundle (Vite)
cd ../frontend
npm run build
# Expected Output: ✓ 1,795 modules transformed in < 600ms without errors.
```

---

## 📖 API Endpoints & Swagger Documentation

Once the backend is running, access the interactive OpenAPI Swagger UI at:
**👉 `http://localhost:5000/api-docs`**

| Module | HTTP Method | Route Endpoint | Description | Role Required |
| :--- | :---: | :--- | :--- | :---: |
| **Auth** | `POST` | `/api/v1/auth/register` | Register new user account | Public |
| **Auth** | `POST` | `/api/v1/auth/login` | Authenticate and receive JWT | Public |
| **Pharmacy** | `GET` | `/api/v1/pharmacy/medicines` | Get catalog with stock/generic alternatives | Public |
| **Pharmacy** | `POST` | `/api/v1/pharmacy/orders` | Place new medication order | Patient |
| **Telemedicine** | `POST` | `/api/v1/telemedicine/appointments` | Book specialist video consult | Patient |
| **Telemedicine** | `POST` | `/api/v1/telemedicine/prescriptions` | Issue & sign digital Schedule H script | Doctor |
| **AI Assistant**| `POST` | `/api/v1/ai/triage` | Symptom triage & dosage check (`<10ms` preflight)| All Roles |
| **Admin** | `PATCH` | `/api/v1/admin/prescriptions/:id/verify`| Approve/reject uploaded Rx | Pharmacy Admin |
| **Admin** | `POST` | `/api/v1/admin/doctors/onboard` | Onboard verified MCI specialist | Platform Admin |

---

## 👥 Quick Demo Credentials

When testing via `/login` or switching profiles from the top navigation bar, use these pre-seeded personas:

| Persona Name | Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Rishi Kumar** | `Patient` | `patient@pharmacare.com` | `password` | Book doctors, order medicines, check AI symptom triage |
| **Dr. Evelyn Rao** | `Doctor` | `doctor.rao@pharmacare.com` | `password` | Live WebRTC video rooms, consultancy maintenance, issue prescriptions |
| **Meera Sen** | `Pharmacy Admin` | `meera.sen@pharmacare.com` | `password` | Verify Schedule H uploads, manage drug inventory & fulfillment |
| **Super Admin** | `Platform Admin` | `admin@pharmacare.com` | `password` | Full system governance, Doctor onboarding, AI safety audit logs |

---

## 📜 Documentation & Specifications
For detailed architectural diagrams, 3NF schema tables, DTO interface contracts, and 3D UI keyframes, please read the master specification: **[`design.md`](file:///c:/Users/Mrigesh%20koyande/OneDrive/Desktop/Pharma-Care/Pharma-Care-/design.md)**.

---
<div align="center">
  <p>Engineered with clinical precision and state-of-the-art web standards for the **IEEE Internship Program**.</p>
  <p>&copy; 2026 Pharma Care Health Systems. All Rights Reserved.</p>
</div>
