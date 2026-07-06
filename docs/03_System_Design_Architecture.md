
# ══════════════════════════════════════════════════════════════════════════════
#
#                              MEDIASSIST
#            A MULTI-AGENT PERSONAL HEALTHCARE ASSISTANT
#
# ══════════════════════════════════════════════════════════════════════════════
#
#  DOCUMENT 3 — SYSTEM DESIGN & ARCHITECTURE
#
#  Project        : MediAssist
#  Document ID    : DOC-3-SDA
#  Version        : 1.1
#  Date           : July 2026
#  AI Model       : gemini-2.5-flash
#
#  Cross-References:
#    DOC-0 (PRD)  — Product vision, scope, and constraints
#    DOC-1 (SRS)  — Functional requirements driving this design
#
# ══════════════════════════════════════════════════════════════════════════════

---

## TABLE OF CONTENTS

1. [Introduction](#1-introduction)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Component Architecture](#3-component-architecture)
4. [Layered Architecture](#4-layered-architecture)
5. [Multi-Agent Architecture](#5-multi-agent-architecture)
6. [Communication Flow](#6-communication-flow)
7. [Deployment Architecture](#7-deployment-architecture)
8. [Technology Stack Justification](#8-technology-stack-justification)

---

---

## 1. INTRODUCTION

### 1.1 Purpose

This document describes the complete system design and architecture of MediAssist. It translates the requirements defined in DOC-1 (SRS) into concrete architectural decisions, component structures, and design patterns that guide the development team during implementation.

Every design decision in this document is justified against a functional requirement (FR) or a constraint (DC) from DOC-1. No architectural component exists without a clear purpose.

### 1.2 Scope

This document covers:

- The high-level system architecture and tier relationships
- The component breakdown of each tier
- The layered architecture and separation of concerns
- The LangGraph multi-agent design, including all agents and their orchestration
- The communication flows between system components
- The deployment architecture across all hosting platforms
- The rationale for every technology choice in the stack

### 1.3 Architectural Goals

The architecture of MediAssist is designed to satisfy the following goals, derived from the project's constraints (DOC-1, Section 2.5):

| Goal | Description |
|------|-------------|
| **Simplicity** | The architecture must be understandable and implementable by a single developer within one semester |
| **Modularity** | Each feature area (auth, prescriptions, symptoms, reminders, doctors) must be independently developed and tested |
| **AI Safety** | All AI calls must be proxied through the backend; no API key touches the frontend |
| **Separation of Concerns** | Frontend, backend, and database are independently deployable and replaceable |
| **Lightweight Deployment** | The entire system deploys using free-tier or low-cost managed services |

---

---

## 2. HIGH-LEVEL ARCHITECTURE

### 2.1 Overview

MediAssist is a three-tier web application:

- **Presentation Tier**: A React single-page application served via Vercel
- **Application Tier**: A FastAPI backend hosted on Hugging Face Spaces (Docker)
- **Data Tier**: A Supabase-hosted PostgreSQL database with integrated file storage

All communication between tiers uses HTTPS. The AI inference layer (Google Gemini API) is accessed exclusively from the Application Tier, ensuring the API key never reaches the browser.

### 2.2 High-Level Architecture Diagram

```
╔══════════════════════════════════════════════════════════════════════════╗
║                         MEDIASSIST SYSTEM                               ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║  ┌───────────────────────────────────────────────────────────────────┐  ║
║  │                   PRESENTATION TIER                               │  ║
║  │                                                                   │  ║
║  │   Browser (Patient)            Browser (Doctor)                  │  ║
║  │   ┌─────────────────┐          ┌─────────────────┐               │  ║
║  │   │  Patient Portal  │          │  Doctor Portal   │               │  ║
║  │   │  React + Vite    │          │  React + Vite    │               │  ║
║  │   │  Tailwind CSS    │          │  Tailwind CSS    │               │  ║
║  │   │  shadcn/ui       │          │  shadcn/ui       │               │  ║
║  │   │  Framer Motion   │          │  Framer Motion   │               │  ║
║  │   │  Web Speech API  │          │                  │               │  ║
║  │   └────────┬─────────┘          └────────┬─────────┘               │  ║
║  │            └──────────────┬──────────────┘                        │  ║
║  │                           │ HTTPS  (JWT Bearer Token)             │  ║
║  └───────────────────────────┼───────────────────────────────────────┘  ║
║                              │                                           ║
║  ┌───────────────────────────▼───────────────────────────────────────┐  ║
║  │                   APPLICATION TIER                                │  ║
║  │                                                                   │  ║
║  │   ┌───────────────────────────────────────────────────────────┐  │  ║
║  │   │                  FastAPI Application                      │  │  ║
║  │   │                                                           │  │  ║
║  │   │  ┌──────────┐ ┌────────────┐ ┌───────────┐ ┌──────────┐  │  │  ║
║  │   │  │   Auth   │ │Prescription│ │ Symptoms  │ │Reminders │  │  │  ║
║  │   │  │  Router  │ │  Router    │ │  Router   │ │  Router  │  │  │  ║
║  │   │  └──────────┘ └────────────┘ └───────────┘ └──────────┘  │  │  ║
║  │   │  ┌──────────┐ ┌────────────┐ ┌───────────────────────┐   │  │  ║
║  │   │  │ Medicine │ │  Doctor    │ │     Audit Logger      │   │  │  ║
║  │   │  │  Router  │ │  Router    │ │    (Middleware)        │   │  │  ║
║  │   │  └──────────┘ └────────────┘ └───────────────────────┘   │  │  ║
║  │   └───────────────────────┬───────────────────────────────────┘  │  ║
║  │                           │                                       │  ║
║  │   ┌───────────────────────▼───────────────────────────────────┐  │  ║
║  │   │              LangGraph Agent Orchestrator                 │  │  ║
║  │   │                                                           │  │  ║
║  │   │  ┌───────────┐ ┌──────────────┐ ┌─────────────────────┐  │  │  ║
║  │   │  │  Triage   │ │  Symptom     │ │   Prescription      │  │  │  ║
║  │   │  │  Agent    │ │  Analysis    │ │   Extraction Agent  │  │  │  ║
║  │   │  │           │ │  Agent       │ │                     │  │  │  ║
║  │   │  └───────────┘ └──────────────┘ └─────────────────────┘  │  │  ║
║  │   │  ┌───────────┐ ┌──────────────┐ ┌─────────────────────┐  │  │  ║
║  │   │  │ Medicine  │ │  Reminder    │ │   Doctor Summary    │  │  │  ║
║  │   │  │Explanation│ │  Agent       │ │   Agent             │  │  │  ║
║  │   │  │  Agent    │ │              │ │                     │  │  │  ║
║  │   │  └───────────┘ └──────────────┘ └─────────────────────┘  │  │  ║
║  │   └───────────────────────┬───────────────────────────────────┘  │  ║
║  │                           │ HTTPS                                 │  ║
║  │   ┌───────────────────────▼───────────────────────────────────┐  │  ║
║  │   │            Google Gemini API (External)                   │  │  ║
║  │   │            Multimodal AI Inference                        │  │  ║
║  │   └───────────────────────────────────────────────────────────┘  │  ║
║  │                                                                   │  ║
║  │   ┌───────────────────────────────────────────────────────────┐  │  ║
║  │   │         APScheduler (In-Process Reminder Engine)          │  │  ║
║  │   └───────────────────────────────────────────────────────────┘  │  ║
║  └───────────────────────────┬───────────────────────────────────────┘  ║
║                              │ Supabase SDK / SQL                        ║
║  ┌───────────────────────────▼───────────────────────────────────────┐  ║
║  │                      DATA TIER                                    │  ║
║  │                                                                   │  ║
║  │   ┌─────────────────────────────┐  ┌──────────────────────────┐  │  ║
║  │   │  Supabase PostgreSQL        │  │  Supabase Storage        │  │  ║
║  │   │  (Relational Data)          │  │  (Prescription Images)   │  │  ║
║  │   │                             │  │                          │  │  ║
║  │   │  users / patients / doctors │  │  /prescriptions/{uid}/   │  │  ║
║  │   │  prescriptions / medicines  │  │  {filename}              │  │  ║
║  │   │  symptom_logs / reminders   │  │                          │  │  ║
║  │   │  audit_logs                 │  │                          │  │  ║
║  │   └─────────────────────────────┘  └──────────────────────────┘  │  ║
║  └───────────────────────────────────────────────────────────────────┘  ║
╚══════════════════════════════════════════════════════════════════════════╝
```

### 2.3 Tier Responsibilities

| Tier | Technology | Responsibility |
|------|-----------|---------------|
| **Presentation** | React + Vite | Render UI, collect user input, display AI results, manage local state |
| **Application** | FastAPI + LangGraph | Process business logic, authenticate requests, orchestrate AI agents, schedule reminders |
| **Data** | Supabase PostgreSQL + Storage | Persist all structured data and uploaded files |
| **AI (External)** | Google Gemini API | Perform multimodal AI inference on demand |

---

---

## 3. COMPONENT ARCHITECTURE

### 3.1 Frontend Component Structure

The React frontend is organized by feature area. Each feature maps directly to a section of the SRS (DOC-1, Section 3).

```
src/
│
├── components/                  # Reusable UI components
│   ├── layout/
│   │   ├── Navbar.jsx           # Top navigation bar
│   │   ├── Sidebar.jsx          # Feature navigation sidebar
│   │   └── PageWrapper.jsx      # Shared page container with padding
│   │
│   ├── ui/                      # shadcn/ui base components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Badge.jsx
│   │   └── Dialog.jsx
│   │
│   ├── common/
│   │   ├── LoadingState.jsx     # Reusable loading spinner + message
│   │   ├── ErrorState.jsx       # Reusable error display
│   │   ├── EmptyState.jsx       # Reusable empty data display
│   │   ├── MedicalDisclaimer.jsx # Mandatory AI disclaimer card
│   │   └── EmergencyAlert.jsx   # Emergency severity alert banner
│   │
│   └── features/
│       ├── auth/                # Login, Register, ConsentForm
│       ├── prescription/        # UploadForm, ConfirmationForm, Gallery
│       ├── medicine/            # ExplanationCard, PackagingUpload
│       ├── symptom/             # SymptomForm, VoiceInput, ResultCard
│       ├── history/             # Timeline, MedicineList, SymptomLog
│       ├── reminders/           # ReminderCard, ReminderForm, ReminderList
│       └── doctor/              # PatientSearch, PatientRecord, SummaryCard
│
├── pages/                       # Route-level page components
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── ConsentPage.jsx
│   ├── PatientDashboard.jsx
│   ├── DoctorDashboard.jsx
│   ├── UploadPrescriptionPage.jsx
│   ├── SymptomCheckerPage.jsx
│   ├── MedicalHistoryPage.jsx
│   ├── RemindersPage.jsx
│   ├── MedicineExplainerPage.jsx
│   └── ProfilePage.jsx
│
├── services/                    # API communication layer
│   ├── api.js                   # Axios instance with base URL + JWT header
│   ├── authService.js
│   ├── prescriptionService.js
│   ├── medicineService.js
│   ├── symptomService.js
│   ├── reminderService.js
│   └── doctorService.js
│
├── store/                       # Global state (React Context or Zustand)
│   ├── authStore.js             # Current user, token, role
│   └── notificationStore.js    # In-app reminder notifications
│
├── hooks/                       # Custom React hooks
│   ├── useAuth.js
│   ├── useVoiceInput.js         # Web Speech API wrapper
│   └── useReminders.js
│
└── utils/
    ├── formatDate.js
    ├── constants.js             # Severity levels, file size limits
    └── validators.js
```

---

### 3.2 Backend Component Structure

The FastAPI backend is organized into independent routers (one per domain), a shared services layer, and an agents layer for AI operations.

```
backend/
│
├── main.py                      # FastAPI app entry point; mounts routers
├── config.py                    # Environment variables (Gemini key, DB URL, JWT secret)
├── database.py                  # SQLModel engine + session factory
│
├── models/                      # SQLModel table definitions (see DOC-4)
│   ├── user.py
│   ├── prescription.py
│   ├── medicine.py
│   ├── symptom_log.py
│   ├── reminder.py
│   └── audit_log.py
│
├── routers/                     # FastAPI route handlers (one per domain)
│   ├── auth.py                  # POST /register, POST /login, POST /logout
│   ├── prescriptions.py         # POST /upload, GET /list, POST /confirm
│   ├── medicines.py             # POST /explain, POST /explain-image
│   ├── symptoms.py              # POST /analyze
│   ├── reminders.py             # POST /create, GET /list, PUT /update, DELETE
│   ├── history.py               # GET /timeline, GET /medicines, GET /symptoms
│   ├── doctor.py                # GET /search, GET /patient/{id}, GET /summary
│   └── profile.py               # GET /me, PUT /update
│
├── services/                    # Business logic, separate from route handlers
│   ├── auth_service.py          # JWT creation, bcrypt verify
│   ├── prescription_service.py  # Save to DB, trigger agents
│   ├── reminder_service.py      # APScheduler job management
│   └── storage_service.py       # Supabase Storage upload/retrieve
│
├── agents/                      # LangGraph agents (one per agent)
│   ├── graph.py                 # LangGraph graph definition and compilation
│   ├── state.py                 # Shared state TypedDict
│   ├── triage_agent.py
│   ├── symptom_agent.py
│   ├── prescription_agent.py
│   ├── medicine_agent.py
│   ├── reminder_agent.py
│   └── doctor_summary_agent.py
│
├── middleware/
│   ├── auth_middleware.py       # JWT validation on protected routes
│   └── audit_middleware.py      # Auto-log key actions to audit_log table
│
├── schemas/                     # Pydantic schemas for AI output validation
│   ├── prescription_schema.py
│   ├── medicine_schema.py
│   ├── symptom_schema.py
│   └── summary_schema.py
│
└── scheduler.py                 # APScheduler initialization and job definitions
```

### 3.3 Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                                │
│                                                                         │
│  ┌───────────┐   ┌──────────────┐   ┌──────────────┐   ┌────────────┐ │
│  │   Pages   │──▶│  Feature     │──▶│   Services   │──▶│  API Layer │ │
│  │ (Routes)  │   │  Components  │   │  (Axios)     │   │  (api.js)  │ │
│  └───────────┘   └──────────────┘   └──────────────┘   └─────┬──────┘ │
│                                                               │        │
│  ┌──────────────────────────────┐                            │        │
│  │  Global State (authStore,    │◀───────────────────────────┘        │
│  │  notificationStore)          │                                      │
│  └──────────────────────────────┘                                      │
└───────────────────────────────────────────────────┬─────────────────────┘
                                                    │ HTTPS + JWT
┌───────────────────────────────────────────────────▼─────────────────────┐
│                         BACKEND (FastAPI)                               │
│                                                                         │
│  ┌─────────────┐   ┌──────────────┐   ┌──────────────────────────────┐ │
│  │  Middleware  │──▶│   Routers    │──▶│        Services              │ │
│  │  (JWT +     │   │  (Domain     │   │  (Business Logic)            │ │
│  │   Audit)    │   │   Separated) │   │                              │ │
│  └─────────────┘   └──────┬───────┘   └──────────────┬───────────────┘ │
│                           │                          │                  │
│                           ▼                          ▼                  │
│  ┌────────────────────────────────┐  ┌──────────────────────────────┐  │
│  │   LangGraph Agent Orchestrator │  │   APScheduler                │  │
│  │   (graph.py + state.py)        │  │   (Reminder Jobs)            │  │
│  │   6 Specialized Agents         │  │                              │  │
│  └────────────────────┬───────────┘  └──────────────────────────────┘  │
│                       │ HTTPS                                           │
│  ┌────────────────────▼───────────┐                                    │
│  │   Google Gemini API            │                                    │
│  │   (Pydantic-validated output)  │                                    │
│  └────────────────────────────────┘                                    │
└───────────────────────────────────────────────────┬─────────────────────┘
                                                    │ Supabase SDK
┌───────────────────────────────────────────────────▼─────────────────────┐
│                      DATA TIER (Supabase)                               │
│   PostgreSQL (structured data)       Storage (prescription images)      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

---

## 4. LAYERED ARCHITECTURE

MediAssist follows a **layered architecture** with five distinct layers. Each layer has a defined responsibility and communicates only with the layer directly adjacent to it.

```
┌─────────────────────────────────────────────────────────────┐
│   LAYER 1 — PRESENTATION                                    │
│   React Components, Pages, shadcn/ui, Framer Motion         │
│   Responsibility: Render UI; collect and display data       │
├─────────────────────────────────────────────────────────────┤
│   LAYER 2 — APPLICATION (API Gateway)                       │
│   FastAPI Routers + Middleware (JWT, Audit)                 │
│   Responsibility: Route requests; enforce security          │
├─────────────────────────────────────────────────────────────┤
│   LAYER 3 — DOMAIN (Business Logic)                         │
│   Services + LangGraph Agents + APScheduler                 │
│   Responsibility: Process logic; orchestrate AI; schedule   │
├─────────────────────────────────────────────────────────────┤
│   LAYER 4 — DATA ACCESS                                     │
│   SQLModel ORM + Supabase Storage Service                   │
│   Responsibility: Read/write to database and file storage   │
├─────────────────────────────────────────────────────────────┤
│   LAYER 5 — EXTERNAL SERVICES                               │
│   Google Gemini API + Supabase (PostgreSQL + Storage)       │
│   Responsibility: AI inference + persistent data hosting    │
└─────────────────────────────────────────────────────────────┘
```

### Layer Rules

| Rule | Description |
|------|-------------|
| **No layer skipping** | The Presentation layer never talks directly to the database; it always goes through the API |
| **Downward dependency only** | Each layer depends only on the layer below it, never above |
| **Single responsibility** | Routers handle HTTP; services handle logic; agents handle AI; ORM handles database |
| **AI isolation** | The Gemini API is only called from inside the agents layer — never from routers or services directly |

---

---

## 5. MULTI-AGENT ARCHITECTURE

### 5.1 Why LangGraph

LangGraph is a Python library for building stateful, multi-step AI workflows using a directed graph model. It was chosen for MediAssist because:

- It allows different AI tasks (triage, extraction, explanation, summary) to be defined as separate, independently testable nodes
- It supports **conditional routing** — the graph can decide which agent to invoke based on intermediate results (e.g., severity level)
- It makes AI workflows explicit, readable, and maintainable — each agent's role is visible in the graph definition
- It is natively compatible with the Gemini API via LangChain's Gemini integration

Each agent in MediAssist is a **node** in a LangGraph graph. Agents communicate through a **shared state object** that is passed between nodes.

---

### 5.2 Shared State Schema

The shared state is the data structure passed between all agents in a graph execution. It is defined as a Python `TypedDict`.

```
MediAssistState:
  ┌─────────────────────────────────────────────────────────────┐
  │ input_text          : str   (symptom text or medicine name) │
  │ image_url           : str   (prescription or package image) │
  │ patient_id          : str   (authenticated patient ID)      │
  │                                                             │
  │ severity            : str   (MILD/MODERATE/SEVERE/EMERGENCY)│
  │ extracted_medicines : list  (from prescription agent)       │
  │ explanations        : list  (from medicine agent)           │
  │ symptom_guidance    : str   (from symptom agent)            │
  │ reminder_schedule   : list  (from reminder agent)           │
  │ patient_summary     : str   (from doctor summary agent)     │
  │                                                             │
  │ error               : str   (error message if agent fails)  │
  │ current_node        : str   (tracks execution position)     │
  └─────────────────────────────────────────────────────────────┘
```

**Design Decision**: The shared state uses a flat structure to keep state management simple and transparent. Each agent reads only the fields it needs and writes only to its designated output field. This prevents agents from accidentally overwriting each other's outputs.

---

### 5.3 Agent Descriptions

#### Agent 1 — Triage Agent

| Attribute | Detail |
|-----------|--------|
| **Node Name** | `triage` |
| **Trigger** | Patient submits symptom text |
| **Input** | `state.input_text` (symptom description) |
| **Output** | `state.severity` (MILD / MODERATE / SEVERE / EMERGENCY) |
| **Model Call** | Gemini text-only prompt with structured JSON output |
| **Validation** | Output validated against `SymptomSeveritySchema` (Pydantic) |
| **Routing** | If MILD or MODERATE → route to Symptom Analysis Agent. If SEVERE or EMERGENCY → route to Emergency Output node (no further AI analysis) |
| **Responsibility** | Acts as the safety gateway for all symptom inputs. It never provides explanations — only a severity classification |
| **Prompt Strategy** | Prompt instructs Gemini to classify severity only. Explicitly instructed NOT to provide diagnoses. Output is a single JSON field: `{"severity": "MODERATE"}` |

---

#### Agent 2 — Symptom Analysis Agent

| Attribute | Detail |
|-----------|--------|
| **Node Name** | `symptom_analysis` |
| **Trigger** | Triage Agent classifies severity as MILD or MODERATE |
| **Input** | `state.input_text`, `state.severity` |
| **Output** | `state.symptom_guidance` (plain-language guidance paragraph) |
| **Model Call** | Gemini text prompt requesting advisory guidance |
| **Validation** | Output validated against `SymptomGuidanceSchema` |
| **Routing** | Terminal node — no further agent is invoked |
| **Responsibility** | Generates safe, general guidance. Explicitly cannot state a diagnosis. Language is hedged: "symptoms like these may be associated with...", "it is advisable to consult a doctor if..." |
| **Prompt Strategy** | Prompt includes: the symptom text, the severity level, and strict instructions to avoid diagnostic language. Medical disclaimer is appended on the backend after output is received |

---

#### Agent 3 — Prescription Extraction Agent

| Attribute | Detail |
|-----------|--------|
| **Node Name** | `prescription_extraction` |
| **Trigger** | Patient uploads a prescription image |
| **Input** | `state.image_url` (Supabase Storage URL of uploaded prescription) |
| **Output** | `state.extracted_medicines` (list of medicine objects) |
| **Model Call** | Gemini multimodal prompt — image + text instruction |
| **Output Structure** | `[{"name": "...", "dosage": "...", "frequency": "...", "duration": "...", "instructions": "..."}]` |
| **Validation** | Output validated against `PrescriptionExtractionSchema` (Pydantic list of MedicineEntry objects) |
| **Routing** | On success → data passed to confirmation step (not another agent). On validation failure → error message returned |
| **Responsibility** | Reads prescription images and extracts structured medicine data. Does NOT explain medicines — that is the Medicine Explanation Agent's responsibility |
| **Prompt Strategy** | Prompt asks Gemini to extract only what is written on the prescription. Explicitly instructed not to add or infer medicine information not present in the image |

---

#### Agent 4 — Medicine Explanation Agent

| Attribute | Detail |
|-----------|--------|
| **Node Name** | `medicine_explanation` |
| **Trigger** | (a) Patient confirms prescription data (post extraction), OR (b) Patient uploads a medicine packaging image |
| **Input** | Medicine name + dosage + frequency (from confirmed data), OR `state.image_url` (packaging image) |
| **Output** | `state.explanations` (list of explanation objects per medicine) |
| **Model Call** | Gemini text or multimodal prompt (depending on input type) |
| **Output Structure** | `[{"medicine": "...", "purpose": "...", "how_to_take": "...", "side_effects": "...", "warnings": "..."}]` |
| **Validation** | Output validated against `MedicineExplanationSchema` |
| **Routing** | Terminal node for medicine explanation workflows |
| **Responsibility** | Translates medical information into plain, accessible language. Must avoid clinical or diagnostic framing. All explanations use simple sentences |
| **Prompt Strategy** | Prompt specifies: "Explain [medicine name] to a patient with no medical background. Use simple language. Include: what it is used for, how to take it, common side effects in plain terms, and any important warnings." |

---

#### Agent 5 — Reminder Agent

| Attribute | Detail |
|-----------|--------|
| **Node Name** | `reminder_suggestion` |
| **Trigger** | Patient confirms prescription data (post extraction); patient opts in to reminder setup |
| **Input** | Confirmed medicine list with frequency fields (e.g., OD, BD, TDS, QID, SOS) |
| **Output** | `state.reminder_schedule` (list of suggested reminder objects) |
| **Model Call** | **None** — reminder scheduling is handled entirely by Python business logic |
| **Output Structure** | `[{"medicine": "...", "dose": "...", "times": ["08:00", "20:00"], "frequency": "daily"}]` |
| **Validation** | Output validated against `ReminderScheduleSchema` (Pydantic) |
| **Routing** | Terminal node — output is shown to patient for review and confirmation before any reminder is saved |
| **Responsibility** | Interprets frequency abbreviations using a predefined mapping (OD → 1× daily at 08:00; BD → 2× at 08:00 & 20:00; TDS → 3× at 08:00, 14:00 & 20:00; QID → 4× at 08:00, 12:00, 16:00 & 20:00; SOS → as needed, no scheduled time) and suggests sensible reminder times. This deterministic approach eliminates hallucination risk, reduces API costs, and guarantees consistent scheduling behavior. Patient must review and confirm before anything is scheduled |
| **Implementation** | Pure Python — a `FREQUENCY_MAP` dict in `reminder_agent.py` maps common medical abbreviations and plain-language descriptions to time arrays. APScheduler CronTrigger is used to schedule jobs |

---

#### Agent 6 — Doctor Summary Agent

| Attribute | Detail |
|-----------|--------|
| **Node Name** | `doctor_summary` |
| **Trigger** | Doctor opens a patient record |
| **Input** | Patient's active medicines, recent symptom logs, prescription count |
| **Output** | `state.patient_summary` (concise 2–3 paragraph summary) |
| **Model Call** | Gemini text prompt |
| **Validation** | Output validated against `DoctorSummarySchema` |
| **Routing** | Terminal node |
| **Responsibility** | Compiles available patient data into a readable, clinically-neutral summary. Does not make recommendations or diagnoses. Uses factual, observational language |
| **Prompt Strategy** | Prompt includes: medicine list, symptom history, and instruction: "Summarize this patient's current medication status and recent symptom history in concise, professional language suitable for a doctor's reference. Do not diagnose or recommend treatment." |

---

### 5.4 Multi-Agent Workflow Diagram

```
                     ┌────────────────────────────────────┐
                     │         MEDIASSIST REQUEST          │
                     └──────────────────┬─────────────────┘
                                        │
               ┌────────────────────────┼──────────────────────────┐
               │                        │                          │
               ▼                        ▼                          ▼
   ┌─────────────────────┐  ┌────────────────────────┐  ┌──────────────────────┐
   │  SYMPTOM WORKFLOW   │  │  PRESCRIPTION WORKFLOW  │  │  DOCTOR WORKFLOW     │
   │                     │  │                         │  │                      │
   │  Patient describes  │  │  Patient uploads image  │  │  Doctor opens        │
   │  symptoms           │  │                         │  │  patient record      │
   └──────────┬──────────┘  └────────────┬────────────┘  └──────────┬───────────┘
              │                          │                           │
              ▼                          ▼                           ▼
   ┌──────────────────┐      ┌───────────────────────┐   ┌─────────────────────┐
   │  TRIAGE AGENT    │      │  PRESCRIPTION         │   │  DOCTOR SUMMARY     │
   │                  │      │  EXTRACTION AGENT     │   │  AGENT              │
   │  Classify:       │      │                       │   │                     │
   │  MILD/MODERATE   │      │  Image → Structured   │   │  Patient data →     │
   │  SEVERE/EMERGENCY│      │  medicine list        │   │  Summary paragraph  │
   └────────┬─────────┘      └──────────┬────────────┘   └─────────────────────┘
            │                           │
     ┌──────┴──────┐                    │
     │             │                    ▼
     ▼             ▼         ┌──────────────────────┐
  MILD /        SEVERE /     │  USER CONFIRMATION   │
  MODERATE      EMERGENCY    │  SCREEN              │
     │             │         │  (Patient reviews    │
     │             │         │   and confirms data) │
     ▼             ▼         └──────────┬───────────┘
┌──────────┐  ┌──────────┐             │
│ SYMPTOM  │  │EMERGENCY │             ├──────────────────────┐
│ ANALYSIS │  │  ALERT   │             ▼                      ▼
│  AGENT   │  │ (no more │  ┌───────────────────┐  ┌──────────────────────┐
│          │  │  agents) │  │    MEDICINE       │  │   REMINDER AGENT     │
│ Guidance │  │          │  │ EXPLANATION AGENT │  │                      │
│ paragraph│  │  112 →   │  │                   │  │  Frequency →         │
└──────────┘  └──────────┘  │  Medicine →       │  │  Suggested times     │
                             │  Plain-language   │  └──────────────────────┘
                             │  explanation      │             │
                             └───────────────────┘             ▼
                                                   ┌─────────────────────────┐
                                                   │  PATIENT REVIEW &       │
                                                   │  SAVE REMINDERS         │
                                                   └─────────────────────────┘
```

### 5.5 Routing Logic Summary

| From | Condition | To |
|------|----------|----|
| Entry | Symptom text submitted | Triage Agent |
| Triage Agent | severity == MILD or MODERATE | Symptom Analysis Agent |
| Triage Agent | severity == SEVERE or EMERGENCY | Emergency Alert (no agent) |
| Entry | Prescription image uploaded | Prescription Extraction Agent |
| Prescription Extraction Agent | Validation success | User Confirmation Screen |
| User Confirmation | Patient confirms | Medicine Explanation Agent + Reminder Agent (parallel, independent) |
| Entry | Doctor opens patient record | Doctor Summary Agent |
| Any Agent | Validation failure | Error output node |

> **Parallel Execution Note**: After prescription confirmation, the Medicine Explanation Agent and Reminder Agent can be invoked in parallel using LangGraph's parallel node support, since their inputs are independent (both read from the confirmed medicine list). This reduces total response time compared to sequential invocation.

### 5.6 Hallucination Reduction Strategies

Since MediAssist operates in a healthcare context, reducing AI hallucination is a design priority. The following strategies are implemented across all agents:

| Strategy | Implementation |
|----------|---------------|
| **Structured output mode** | Every Gemini call requests a specific JSON format. Gemini is instructed to return only the fields defined in the output schema |
| **Pydantic schema validation** | Every AI response is parsed and validated before use. Structurally invalid responses are discarded |
| **Source-grounded prompts** | Agents are prompted to work only from the data provided (prescription image, medicine name, patient records) — not from general knowledge alone |
| **Conservative language prompts** | All prompts include explicit instructions against diagnostic language. Hedged language ("may be related to", "consult a doctor") is required in outputs |
| **Emergency routing without explanation** | Severe symptoms are flagged immediately and routed away from explanation agents — preventing the AI from contextualizing emergency situations |
| **User confirmation step** | Prescription extraction results are never auto-saved. Human review acts as a final validation layer on top of Pydantic validation |

---

---

## 6. COMMUNICATION FLOW

### 6.1 Standard API Request Flow

Every non-AI request follows this path:

```
Browser (React)
    │
    │  1. User action triggers API call (e.g., GET /history/timeline)
    │
    ▼
services/api.js (Axios)
    │
    │  2. Axios adds Authorization: Bearer <JWT> header
    │
    ▼
FastAPI Router (e.g., routers/history.py)
    │
    │  3. auth_middleware validates JWT token
    │     — Invalid token → HTTP 401
    │     — Wrong role   → HTTP 403
    │
    ▼
Service Layer (e.g., services/history_service.py)
    │
    │  4. Business logic applied
    │
    ▼
SQLModel ORM
    │
    │  5. Parameterized SQL query executed against Supabase PostgreSQL
    │
    ▼
Response returned to router → serialized to JSON → returned to browser
    │
    │  6. React component receives data and updates UI
    ▼
User sees rendered result
```

---

### 6.2 AI Agent Request Flow

AI-powered requests (prescription extraction, symptom analysis, etc.) follow an extended path:

```
Browser (React)
    │
    │  1. User submits prescription image / symptom text
    │
    ▼
FastAPI Router
    │
    │  2. JWT validated; request forwarded to service layer
    │
    ▼
Service Layer
    │
    │  3. Input prepared (image URL retrieved from Supabase, or text cleaned)
    │  4. LangGraph graph invoked with initial state
    │
    ▼
LangGraph Agent Orchestrator
    │
    │  5. Graph routes to the appropriate first agent (e.g., Triage Agent)
    │  6. Agent constructs Gemini API prompt
    │
    ▼
Google Gemini API (HTTPS)
    │
    │  7. Gemini returns structured JSON response
    │
    ▼
LangGraph Agent (continued)
    │
    │  8. Pydantic schema validates response
    │     — Validation fails → error state set → graph exits to error node
    │     — Validation passes → state updated → graph routes to next node
    │
    ▼
Final Agent Output
    │
    │  9. Medical disclaimer appended (if content is AI medical output)
    │  10. Audit log entry created
    │  11. Response returned to router → JSON → browser
    │
    ▼
React displays result with LoadingState → ResultCard → MedicalDisclaimer
```

---

### 6.3 Reminder Notification Flow

```
APScheduler (runs inside FastAPI process)
    │
    │  1. Job fires at scheduled time (e.g., 08:00 daily)
    │
    ▼
Reminder Job Function (scheduler.py)
    │
    │  2. Reads reminder details from database
    │  3. Creates a notification payload
    │
    ▼
In-App Notification Store (frontend polling or SSE)
    │
    │  4. Frontend displays notification:
    │     "Time to take your Metformin 500mg tablet."
    │
    ▼
Patient sees reminder notification
    │
    │  5. Audit log entry created for reminder delivery
```

> **Note**: Version 1 uses in-app notifications only. The frontend polls a `/notifications/pending` endpoint at regular intervals to check for new reminders. Push notifications are a future enhancement.

---

---

## 7. DEPLOYMENT ARCHITECTURE

### 7.1 Deployment Diagram

```
╔══════════════════════════════════════════════════════════════════════════╗
║                        DEPLOYMENT ARCHITECTURE                          ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║   ┌──────────────────────────────────────────────────────────────────┐  ║
║   │                        INTERNET                                  │  ║
║   └────────────┬──────────────────────────────────┬─────────────────┘  ║
║                │                                  │                     ║
║                ▼                                  ▼                     ║
║   ┌────────────────────────┐        ┌──────────────────────────────┐   ║
║   │        VERCEL          │        │    HUGGING FACE SPACES       │   ║
║   │  (Frontend Hosting)    │        │    (Backend Hosting)         │   ║
║   │                        │        │                              │   ║
║   │  React SPA (built)     │        │  Docker Container            │   ║
║   │  Served as static CDN  │        │  ┌──────────────────────┐   │   ║
║   │                        │        │  │  Python 3.11         │   │   ║
║   │  Auto-deploy on        │        │  │  FastAPI (Uvicorn)   │   │   ║
║   │  git push to main      │        │  │  LangGraph           │   │   ║
║   │                        │        │  │  APScheduler         │   │   ║
║   │  Custom domain         │        │  │  SQLModel            │   │   ║
║   │  (HTTPS auto)          │        │  └──────────────────────┘   │   ║
║   │                        │        │                              │   ║
║   │  CORS: Allows only     │        │  Environment Variables:      │   ║
║   │  HF Spaces backend URL │        │  GEMINI_API_KEY             │   ║
║   └──────────┬─────────────┘        │  SUPABASE_URL               │   ║
║              │ HTTPS / REST         │  SUPABASE_KEY               │   ║
║              │ JWT Bearer           │  JWT_SECRET                  │   ║
║              └──────────────────────┘  DATABASE_URL               │   ║
║                           │            └──────────────────────────────┘   ║
║                           │ HTTPS                                     ║
║                           ▼                                           ║
║   ┌───────────────────────────────────────────────────────────────┐  ║
║   │                       SUPABASE                                │  ║
║   │                  (Managed Cloud Service)                      │  ║
║   │                                                               │  ║
║   │   ┌──────────────────────────┐  ┌───────────────────────┐    │  ║
║   │   │  PostgreSQL Database     │  │  Supabase Storage     │    │  ║
║   │   │                          │  │                       │    │  ║
║   │   │  Tables:                 │  │  Bucket:              │    │  ║
║   │   │  users                   │  │  prescriptions/       │    │  ║
║   │   │  prescriptions           │  │  {patient_id}/        │    │  ║
║   │   │  medicines               │  │  {filename}           │    │  ║
║   │   │  symptom_logs            │  │                       │    │  ║
║   │   │  reminders               │  │  Access: Private      │    │  ║
║   │   │  audit_logs              │  │  (authenticated only) │    │  ║
║   │   └──────────────────────────┘  └───────────────────────┘    │  ║
║   └───────────────────────────────────────────────────────────────┘  ║
║                           │ HTTPS                                     ║
║                           ▼                                           ║
║   ┌───────────────────────────────────────────────────────────────┐  ║
║   │              GOOGLE GEMINI API (External Service)             │  ║
║   │              Accessed only from Hugging Face Spaces backend   │  ║
║   └───────────────────────────────────────────────────────────────┘  ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

### 7.2 Deployment Process

#### Frontend (Vercel)

| Step | Action |
|------|--------|
| 1 | Developer pushes changes to `main` branch on GitHub |
| 2 | Vercel detects push via webhook and triggers build |
| 3 | Vite builds the React application into static files |
| 4 | Vercel deploys static files to global CDN edge nodes |
| 5 | Live URL updated; HTTPS certificate managed automatically by Vercel |

#### Backend (Hugging Face Spaces — Docker)

| Step | Action |
|------|--------|
| 1 | Developer pushes changes to the Hugging Face Spaces repository |
| 2 | Hugging Face detects push and rebuilds the Docker container |
| 3 | Docker container starts: installs Python dependencies, starts Uvicorn server |
| 4 | FastAPI application initializes: connects to Supabase, starts APScheduler |
| 5 | Backend API is available at the Hugging Face Spaces URL |

#### Environment Variables

All sensitive configuration is stored as environment variables — never in source code or version control:

| Variable | Location | Description |
|----------|---------|-------------|
| `GEMINI_API_KEY` | HF Spaces Secrets | Google Gemini API access key |
| `SUPABASE_URL` | HF Spaces Secrets | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | HF Spaces Secrets | Supabase service role key (backend only) |
| `JWT_SECRET` | HF Spaces Secrets | Secret key for JWT signing (min 256-bit) |
| `DATABASE_URL` | HF Spaces Secrets | PostgreSQL connection string |
| `VITE_API_BASE_URL` | Vercel Environment | Backend API base URL (set at build time) |

---

### 7.3 Known Infrastructure Limitations

| Limitation | Impact | Mitigation |
|-----------|--------|-----------|
| Hugging Face Spaces cold-start | First request after idle may take 15–30 seconds | Display a loading message; user retries |
| APScheduler is in-process | Reminders do not fire if the backend container restarts | Acceptable for a prototype; reminders reload from DB on startup |
| Hugging Face Spaces free tier memory | Limited RAM for concurrent requests | Acceptable for a prototype; upgrade if load increases |
| Vercel cold-start (serverless edge) | Negligible — React is statically served | No mitigation needed |

---

---

## 8. TECHNOLOGY STACK JUSTIFICATION

Each technology in the MediAssist stack was chosen for a specific reason grounded in the project's constraints (DC-01 to DC-15 from DOC-1, Section 2.5).

---

### 8.1 Frontend Technologies

| Technology | Role | Justification |
|-----------|------|--------------|
| **React (Vite)** | UI Framework | React is the most widely-used frontend framework; Vite provides fast development builds and optimized production output. Suitable for a single-page application with dynamic state |
| **Tailwind CSS** | Styling | Utility-first CSS eliminates the need for custom stylesheets. Enables consistent, responsive design without a heavy CSS framework. Works natively with shadcn/ui |
| **shadcn/ui** | Component Library | Provides pre-built, accessible UI components (inputs, cards, dialogs, badges) built on Radix UI primitives. Eliminates the need to build basic components from scratch |
| **Framer Motion** | Animations | Purpose-built React animation library. Enables smooth transitions, loading animations, and micro-interactions without performance overhead |
| **Lucide Icons** | Icons | Consistent, MIT-licensed SVG icon set. Ships tree-shaken; only icons used are bundled |
| **Web Speech API** | Voice Input | Browser-native API requiring no external service. Voice is transcribed locally in the browser — no audio is transmitted to or stored by any server |

---

### 8.2 Backend Technologies

| Technology | Role | Justification |
|-----------|------|--------------|
| **Python** | Backend Language | Python is the dominant language for AI/ML development. First-class support for LangGraph, LangChain, Pydantic, and SQLModel. Team familiarity |
| **FastAPI** | Web Framework | FastAPI provides automatic request validation via Pydantic, auto-generated OpenAPI documentation, and async support. It is lightweight, performant, and easy to structure |
| **LangGraph** | Agent Orchestration | Provides a graph-based workflow that makes multi-agent logic explicit, conditional, and testable. State is shared across nodes cleanly. Compatible with Gemini via LangChain |
| **SQLModel** | ORM | Combines SQLAlchemy (database) and Pydantic (validation) in one library. Allows database models and API schemas to share class definitions — reducing duplication |
| **Pydantic** | Validation | Used throughout FastAPI and as the schema layer for all AI outputs. Ensures all data (incoming and AI-generated) is structurally valid before use |
| **APScheduler** | Reminder Scheduling | Lightweight, in-process scheduler requiring no external broker. Suitable for a prototype with moderate reminder volume. Jobs persist in the database across restarts |
| **bcrypt** | Password Hashing | Industry-standard adaptive hashing algorithm. Resists brute-force attacks via configurable work factor. Python `passlib` provides the interface |
| **JWT (PyJWT)** | Authentication | Stateless token-based authentication. Eliminates the need for server-side session storage. Well-understood standard with broad library support |

---

### 8.3 AI & External Services

| Technology | Role | Justification |
|-----------|------|--------------|
| **Google Gemini API** | AI Inference | **gemini-2.5-flash** supports multimodal inputs (text + images), which is essential for prescription image extraction. Available on the free tier for prototype usage. Faster inference than larger models. Structured JSON output mode reduces hallucination risk |
| **Supabase PostgreSQL** | Primary Database | Managed PostgreSQL with a generous free tier. Provides a built-in REST API, authentication utilities, and direct SQL access. Row-level security is available for future hardening |
| **Supabase Storage** | File Storage | S3-compatible object storage integrated directly with the Supabase project. Provides access control tied to the same authentication layer as the database |

---

### 8.4 Deployment Technologies

| Technology | Role | Justification |
|-----------|------|--------------|
| **Vercel** | Frontend Hosting | Zero-configuration deployment for React/Vite applications. Automatic HTTPS, global CDN, and GitHub integration. Free tier is fully adequate for a prototype |
| **Hugging Face Spaces (Docker)** | Backend Hosting | Provides free Docker container hosting suitable for Python/FastAPI applications. Simple to deploy from a Dockerfile. The AI community familiarity makes it appropriate for this context |
| **Docker** | Backend Containerization | Ensures consistent runtime environment between local development and Hugging Face Spaces. Eliminates "works on my machine" issues and simplifies dependency management |
| **GitHub** | Version Control | Industry-standard source control. Enables CI/CD integration with Vercel (automatic deploy on push) and Hugging Face Spaces |

---

### 8.5 Why This Stack Works for a College Internship Project

The stack was specifically chosen to be:

1. **Free to run** — Vercel, Supabase, and Hugging Face Spaces free tiers cover all hosting needs at prototype scale
2. **Fast to develop** — FastAPI's auto-docs, Vite's hot module reload, and shadcn/ui's ready-made components reduce boilerplate
3. **Industry-relevant** — Every technology in the stack (React, FastAPI, LangGraph, PostgreSQL, Docker) is used in professional software engineering. The documentation produced here reflects real-world engineering practice
4. **Self-contained** — The full stack can run locally with a single `.env` file and a Docker Compose setup, enabling offline development and testing

---

---

> END OF DOCUMENT 3 — SYSTEM DESIGN & ARCHITECTURE
>
> Parent Documents : DOC-0 (PRD), DOC-1 (SRS)
> Next Document   : DOC-4 — Database & API Design
>
> The database schema in DOC-4 must match the models described in Section 3.2 of this document.
> The API endpoints in DOC-4 must implement the routers described in Section 3.2 of this document.
