
# ══════════════════════════════════════════════════════════════════════════════
#
#                              MEDIASSIST
#            A MULTI-AGENT PERSONAL HEALTHCARE ASSISTANT
#
# ══════════════════════════════════════════════════════════════════════════════
#
#  DOCUMENT 6 — IMPLEMENTATION & DEPLOYMENT GUIDE
#
#  Project        : MediAssist
#  Document ID    : DOC-6-IDG
#  Version        : 1.1
#  Date           : July 2026
#  AI Model       : gemini-2.5-flash
#
#  Cross-References:
#    DOC-0 (PRD)  — Product vision and feature scope
#    DOC-1 (SRS)  — Functional and non-functional requirements
#    DOC-3 (SDA)  — System architecture and component design
#    DOC-4 (DAD)  — Database schema and API endpoints
#    DOC-5 (UXD)  — Screen designs and user flows
#
# ══════════════════════════════════════════════════════════════════════════════

---

## TABLE OF CONTENTS

1. [Introduction](#1-introduction)
2. [Project Folder Structure](#2-project-folder-structure)
3. [Development Roadmap](#3-development-roadmap)
4. [Core Algorithms](#4-core-algorithms)
5. [Libraries and Their Purpose](#5-libraries-and-their-purpose)
6. [Security Implementation](#6-security-implementation)
7. [Testing Strategy](#7-testing-strategy)
8. [Deployment Guide](#8-deployment-guide)
9. [Future Enhancements](#9-future-enhancements)
10. [Conclusion](#10-conclusion)

---

---

## 1. INTRODUCTION

### 1.1 Purpose

This document is the final implementation guide for MediAssist. It bridges the gap between the design and architecture documents (DOC-3 to DOC-5) and the actual development work. Where previous documents defined *what* to build and *why*, this document explains *how* to build it — covering implementation approach, algorithms, libraries, security, testing, and deployment in practical, actionable terms.

This guide is written for a solo developer working on a college internship project. Every recommendation in this document is aligned with the lightweight, modular architecture approved in DOC-3.

### 1.2 What This Document Covers

| Section | Focus |
|---------|-------|
| Project Folder Structure | Where files live and why |
| Development Roadmap | What to build first, second, and last |
| Core Algorithms | Step-by-step logic for each AI-powered workflow |
| Libraries | Every dependency and its specific role |
| Security | How authentication, hashing, and AI safety are implemented |
| Testing | How to verify every feature works correctly |
| Deployment | How to go from local development to a live, hosted product |
| Future Enhancements | What comes after Version 1 |

### 1.3 Development Environment Prerequisites

Before development begins, the following tools must be installed on each developer's machine:

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20 LTS | Frontend build toolchain |
| Python | 3.11+ | Backend runtime |
| Git | Latest | Version control |
| Docker Desktop | Latest | Backend containerization |
| VS Code | Latest | Recommended code editor |
| Postman | Latest | API testing |

---

---

## 2. PROJECT FOLDER STRUCTURE

### 2.1 Repository Layout

MediAssist is organized as a monorepo — both frontend and backend live in the same Git repository, in separate top-level directories.

```
mediassist/
│
├── frontend/           # React + Vite application
├── backend/            # FastAPI application
├── docs/               # All six documentation files
├── .github/            # GitHub Actions workflows (optional CI)
├── .gitignore          # Excludes node_modules, venv, .env, __pycache__
└── README.md           # Project overview and setup instructions
```

---

### 2.2 Frontend Folder Structure

```
frontend/
│
├── index.html                   # Vite entry point (root HTML)
├── vite.config.js               # Vite configuration (path aliases, plugins)
├── tailwind.config.js           # Tailwind CSS configuration (theme, content)
├── postcss.config.js            # PostCSS config (required by Tailwind)
├── package.json                 # Frontend dependencies
│
├── public/
│   └── favicon.ico              # MediAssist app icon
│
└── src/
    │
    ├── main.jsx                 # React app entry point; renders <App />
    ├── App.jsx                  # Root component; router configuration
    │
    ├── components/
    │   │
    │   ├── layout/
    │   │   ├── Navbar.jsx       # Top navigation bar (Welcome page only)
    │   │   ├── Sidebar.jsx      # Left sidebar (authenticated patient screens)
    │   │   ├── DoctorSidebar.jsx  # Left sidebar (doctor portal)
    │   │   ├── BottomNav.jsx    # Mobile bottom navigation bar
    │   │   └── PageWrapper.jsx  # Layout wrapper with consistent padding
    │   │
    │   ├── common/
    │   │   ├── LoadingState.jsx      # Spinner + descriptive message
    │   │   ├── ErrorState.jsx        # Friendly error card
    │   │   ├── EmptyState.jsx        # Empty data illustration + message
    │   │   ├── MedicalDisclaimer.jsx # Mandatory AI disclaimer card
    │   │   ├── EmergencyAlert.jsx    # Red emergency banner component
    │   │   ├── SeverityBadge.jsx     # Color-coded severity tag
    │   │   └── NotificationToast.jsx # In-app reminder notification
    │   │
    │   └── features/
    │       ├── auth/
    │       │   ├── LoginForm.jsx
    │       │   ├── RegisterForm.jsx
    │       │   └── ConsentForm.jsx
    │       │
    │       ├── prescription/
    │       │   ├── UploadZone.jsx        # Drag-and-drop file upload
    │       │   ├── ConfirmationForm.jsx  # Editable extracted medicine review
    │       │   ├── MedicineCard.jsx      # Individual medicine in the list
    │       │   └── PrescriptionGallery.jsx
    │       │
    │       ├── symptom/
    │       │   ├── SymptomForm.jsx       # Text input + voice button
    │       │   ├── VoiceInput.jsx        # Web Speech API microphone
    │       │   └── SymptomResultCard.jsx # Guidance output card
    │       │
    │       ├── medicine/
    │       │   ├── MedicineSearchInput.jsx
    │       │   └── ExplanationCard.jsx   # Structured 4-section explanation
    │       │
    │       ├── reminders/
    │       │   ├── ReminderCard.jsx
    │       │   ├── ReminderForm.jsx
    │       │   └── ReminderList.jsx
    │       │
    │       ├── history/
    │       │   ├── HistoryTimeline.jsx
    │       │   ├── HistoryEntryCard.jsx
    │       │   └── HistoryFilters.jsx
    │       │
    │       └── doctor/
    │           ├── PatientSearchBar.jsx
    │           ├── PatientCard.jsx
    │           ├── PatientRecord.jsx
    │           └── AISummaryCard.jsx
    │
    ├── pages/
    │   ├── WelcomePage.jsx
    │   ├── LoginPage.jsx
    │   ├── RegisterPage.jsx
    │   ├── ConsentPage.jsx
    │   ├── PatientDashboard.jsx
    │   ├── DoctorDashboard.jsx
    │   ├── UploadPrescriptionPage.jsx
    │   ├── SymptomCheckerPage.jsx
    │   ├── MedicineExplainerPage.jsx
    │   ├── RemindersPage.jsx
    │   ├── MedicalHistoryPage.jsx
    │   ├── ProfilePage.jsx
    │   └── NotFoundPage.jsx
    │
    ├── services/
    │   ├── api.js                # Axios instance with base URL + interceptors
    │   ├── authService.js        # register, login, logout, consent
    │   ├── prescriptionService.js # upload, confirm, list
    │   ├── medicineService.js    # explain (text), explain (image)
    │   ├── symptomService.js     # analyze, history
    │   ├── reminderService.js    # create, list, update, delete
    │   └── doctorService.js      # search, getPatient, getSummary
    │
    ├── store/
    │   ├── authStore.js          # Current user, JWT token, role
    │   └── notificationStore.js  # Pending in-app reminder notifications
    │
    ├── hooks/
    │   ├── useAuth.js            # Auth state access and redirect logic
    │   ├── useVoiceInput.js      # Web Speech API wrapper with state
    │   └── useReminders.js       # Reminder CRUD with local state sync
    │
    └── utils/
        ├── formatDate.js         # Date formatting helpers
        ├── constants.js          # Severity levels, accepted file types
        └── validators.js         # Client-side validation helpers
```

---

### 2.3 Backend Folder Structure

```
backend/
│
├── Dockerfile                   # Docker build instructions for HF Spaces
├── requirements.txt             # Python dependencies list
├── .env.example                 # Template for required environment variables
│
├── main.py                      # FastAPI app initialization; mounts routers
├── config.py                    # Reads environment variables via pydantic-settings
├── database.py                  # SQLModel engine creation and session factory
├── scheduler.py                 # APScheduler instance and job utilities
│
├── models/                      # SQLModel table definitions (maps to DOC-4 tables)
│   ├── __init__.py
│   ├── patient.py               # Patients table
│   ├── doctor.py                # Doctors table
│   ├── prescription.py          # Prescriptions table
│   ├── medical_record.py        # Medical Records table
│   ├── reminder.py              # Medication Reminders table
│   ├── ai_interaction.py        # AI Interaction History table
│   └── audit_log.py             # Audit Logs table
│
├── routers/                     # FastAPI route handlers (one file per feature)
│   ├── __init__.py
│   ├── auth.py                  # /auth/register, /auth/login, /auth/logout
│   ├── patient.py               # /patient/profile, /patient/history
│   ├── prescriptions.py         # /prescriptions/upload, /confirm, /list
│   ├── medicines.py             # /medicines/explain, /explain-image
│   ├── symptoms.py              # /symptoms/analyze, /history
│   ├── reminders.py             # /reminders/ CRUD + /notifications
│   ├── doctor.py                # /doctor/patients/search, /record, /summary
│   └── profile.py               # /patient/profile PUT, /doctor/profile PUT
│
├── services/                    # Business logic layer
│   ├── __init__.py
│   ├── auth_service.py          # JWT creation, bcrypt verification
│   ├── prescription_service.py  # Upload, trigger extraction, confirm save
│   ├── reminder_service.py      # APScheduler job creation and management
│   └── storage_service.py       # Supabase Storage upload and URL generation
│
├── agents/                      # LangGraph agents
│   ├── __init__.py
│   ├── state.py                 # MediAssistState TypedDict definition
│   ├── graph.py                 # LangGraph graph assembly and compilation
│   ├── triage_agent.py          # Severity classification agent
│   ├── symptom_agent.py         # Plain-language symptom guidance agent
│   ├── prescription_agent.py    # Prescription image extraction agent
│   ├── medicine_agent.py        # Medicine explanation agent
│   ├── reminder_agent.py        # Reminder time suggestion agent
│   └── doctor_summary_agent.py  # Patient summary generation agent
│
├── middleware/
│   ├── __init__.py
│   ├── auth_middleware.py       # JWT validation on every protected request
│   └── audit_middleware.py      # Auto-create audit log entries
│
└── schemas/                     # Pydantic schemas for AI output validation
    ├── __init__.py
    ├── prescription_schema.py   # PrescriptionExtractionSchema
    ├── medicine_schema.py       # MedicineExplanationSchema
    ├── symptom_schema.py        # SymptomSeveritySchema, SymptomGuidanceSchema
    ├── reminder_schema.py       # ReminderScheduleSchema
    └── summary_schema.py        # DoctorSummarySchema
```

---

### 2.4 Documentation Folder Structure

```
docs/
│
├── DOC_0_Product_Requirements_Document.md
├── DOC_1_Software_Requirements_Specification.md
├── DOC_3_System_Design_Architecture.md
├── DOC_4_Database_API_Design.md
├── DOC_5_UIUX_Design.md
└── DOC_6_Implementation_Deployment_Guide.md
```

---

---

## 3. DEVELOPMENT ROADMAP

### 3.1 Overview

The recommended implementation order follows a bottom-up, feature-by-feature approach. Infrastructure and authentication are built first to establish a working foundation. AI features are added incrementally after the core data layer is proven stable.

**Estimated total duration**: 7–8 weeks (for a solo developer)

---

### 3.2 Phase-by-Phase Plan

---

#### Phase 1 — Project Setup and Infrastructure (Days 1–3)

**Goal**: The developer can run the project locally with all services connected.

| Task | Description |
|------|-------------|
| Initialize frontend | `npm create vite@latest frontend -- --template react`; install Tailwind CSS, shadcn/ui, Lucide, Framer Motion, Axios, React Router |
| Initialize backend | Create `backend/` directory; install FastAPI, SQLModel, passlib, python-jose, supabase, google-generativeai, langgraph, pydantic, APScheduler |
| Create Supabase project | Set up Supabase project; create all 7 tables from DOC-4; create Storage bucket |
| Configure environment variables | Create `.env.example`; fill `.env` with Supabase URL, keys, Gemini key, JWT secret |
| Set up `database.py` | Initialize SQLModel engine with Supabase PostgreSQL connection string |
| Verify connectivity | Write a test endpoint that reads from the database and confirms connectivity |
| Set up Git | Initialize repository; create `.gitignore`; push to GitHub |

**Milestone**: `GET /api/v1/health` returns 200 OK and confirms DB connectivity.

---

#### Phase 2 — Authentication System (Days 4–7)

**Goal**: Patients and doctors can register, consent, login, and logout. JWT is issued and validated.

| Task | Description |
|------|-------------|
| Build `auth_service.py` | Implement password hashing (bcrypt), JWT generation, JWT verification |
| Build `auth.py` router | Implement POST /register/patient, /register/doctor, /login, /logout, /consent |
| Build `auth_middleware.py` | Implement JWT extraction from headers; role checking decorator |
| Frontend: Login page | Build split-panel login form with role toggle |
| Frontend: Register page | Build 2-step registration (profile + consent) |
| Frontend: Auth store | Set up Zustand/Context store for token and user state |
| Frontend: Protected routes | Build route guard that redirects unauthenticated users to login |
| Audit logging | Create `audit_log.py` model; wire login and registration events |

**Milestone**: Patient and doctor can register, consent, login, and be redirected to their respective dashboards. JWT is correctly validated on protected routes.

---

#### Phase 3 — Prescription Upload and Extraction (Days 8–13)

**Goal**: Patient can upload a prescription image, see extracted medicines, confirm, and view the explanation.

| Task | Description |
|------|-------------|
| Supabase Storage setup | Configure Storage bucket; implement `storage_service.py` upload function |
| Build `prescription_agent.py` | Write Gemini prompt for medicine extraction; implement Pydantic schema validation |
| Build `prescriptions.py` router | Implement upload endpoint, extraction trigger, and confirm endpoint |
| Build `medicine_agent.py` | Write Gemini prompt for medicine explanation; implement schema validation |
| Frontend: Upload Zone | Build drag-and-drop file upload component |
| Frontend: 4-step prescription flow | Upload → Loading → Confirmation form → Explanation cards |
| Frontend: Confirmation form | Editable fields per medicine; Confirm and Save button |
| Frontend: Medicine explanation cards | Structured 4-section card with medical disclaimer |
| Audit logging | Log prescription upload and confirmation events |

**Milestone**: Patient uploads a real prescription image, sees the extracted medicines (editable), confirms, and reads plain-language explanations with the medical disclaimer visible.

---

#### Phase 4 — Symptom Analysis and Triage (Days 14–18)

**Goal**: Patient can describe symptoms, receive severity classification, see guidance or emergency alert.

| Task | Description |
|------|-------------|
| Build `triage_agent.py` | Write Gemini prompt for severity classification; validate with SymptomSeveritySchema |
| Build `symptom_agent.py` | Write Gemini prompt for guidance generation; validate with SymptomGuidanceSchema |
| Wire LangGraph graph | Assemble symptom workflow graph in `graph.py`; implement conditional routing based on severity |
| Build `symptoms.py` router | Implement POST /symptoms/analyze and GET /symptoms/history |
| Build AI Interaction History | Save every analysis to `ai_interaction_history` table |
| Frontend: Symptom Checker page | Text area, voice input button, Analyze button, loading state |
| Frontend: VoiceInput component | Web Speech API wrapper with recording state and transcription display |
| Frontend: Result display | Guidance card (mild/moderate) and emergency alert banner (severe/emergency) |
| Audit logging | Log SYMPTOM_ANALYZED and EMERGENCY_ALERT_SHOWN events |

**Milestone**: Patient types or speaks symptoms, sees a loading state, and receives either plain-language guidance with a medical disclaimer or a red emergency alert.

---

#### Phase 5 — Medication Reminders (Days 19–23)

**Goal**: Patient can create, view, edit, and delete reminders. Reminders fire as in-app notifications.

| Task | Description |
|------|-------------|
| Build `scheduler.py` | Initialize APScheduler with SQLAlchemy job store; implement add, update, remove job functions |
| Build `reminder_agent.py` | Implement Python `FREQUENCY_MAP` (OD → 1× daily, BD → 2×, TDS → 3×, QID → 4×) — no Gemini call; deterministic output |
| Build `reminders.py` router | Implement CRUD endpoints and `/suggest` endpoint |
| Build `reminder_service.py` | Coordinate between database and APScheduler; handle job lifecycle |
| Frontend: Reminders page | Time-grouped reminder list; Add Reminder form panel |
| Frontend: NotificationToast | Toast component for in-app reminder notifications |
| Frontend: Notification polling | Poll `/reminders/notifications/pending` every 60 seconds when logged in |
| Reminder suggestion flow | After prescription confirmation, prompt patient to set reminders with AI-suggested times |
| Audit logging | Log REMINDER_CREATED, UPDATED, DELETED, DELIVERED events |

**Milestone**: Patient creates a reminder for 8:00 AM daily. At 8:00 AM, an in-app toast notification appears: "Time to take your [Medicine] [Dose]."

---

#### Phase 6 — Medical History and Doctor Portal (Days 24–29)

**Goal**: Patient can view their full history. Doctor can search patients, view records, and see AI summaries.

| Task | Description |
|------|-------------|
| Build `patient.py` router | Implement GET /patient/history, /patient/medicines with filtering |
| Build `doctor_summary_agent.py` | Write Gemini prompt for patient summary; validate with DoctorSummarySchema |
| Build `doctor.py` router | Implement patient search, patient record view, and AI summary endpoints |
| Frontend: Medical History page | Chronological timeline with filter tabs (All / Prescriptions / Medicines / Symptoms) |
| Frontend: Patient Dashboard (final) | Wire up quick actions, today's reminders widget, and recent activity feed |
| Frontend: Doctor Dashboard | Patient search bar with live results; recent patients list |
| Frontend: Patient Record view | AI summary card, active medicines tab, prescriptions tab, symptoms tab |
| Medicine explainer page | Standalone page for text or image-based medicine explanation |
| Profile page | Editable profile fields; read-only consent status |
| Audit logging | Log DOCTOR_ACCESSED_PATIENT events |

**Milestone**: Doctor searches for a patient, opens their record, and sees an AI-generated summary above the patient's medicines and symptom history. Medical disclaimer is always visible.

---

#### Phase 7 — Polish, Error Handling, and Testing (Days 30–37)

**Goal**: All error states are handled gracefully. Loading states are consistent. All features tested.

| Task | Description |
|------|-------------|
| Error boundary components | Catch unexpected frontend errors; show friendly fallback |
| Loading state review | Ensure every async operation has a loading state with a descriptive message |
| API error handling | Ensure all 401, 403, 404, 422, and 500 responses have user-friendly messages |
| AI outage simulation | Simulate Gemini API failure; verify graceful fallback messages |
| Mobile responsiveness | Test all screens at 320px, 768px, and 1280px widths |
| Cross-browser testing | Test on Chrome, Firefox, Edge, and Safari |
| Medical disclaimer audit | Confirm disclaimer appears on every AI-generated content screen |
| Functional testing checklist | Complete the full test checklist from Section 7 |
| API testing | Run all API tests from Section 7 using Postman |

**Milestone**: All features work without crashes. Error states are friendly and informative. All screens look correct on mobile.

---

#### Phase 8 — Deployment (Days 38–42)

**Goal**: MediAssist is fully deployed and accessible at a live URL.

| Task | Description |
|------|-------------|
| Write Dockerfile | Create backend Dockerfile for Hugging Face Spaces (see Section 8) |
| Deploy backend | Push to Hugging Face Spaces repository; configure secrets |
| Deploy frontend | Connect GitHub to Vercel; configure VITE_API_BASE_URL environment variable |
| Final environment check | Verify all environment variables are set in both deployments |
| End-to-end live test | Perform a complete user journey on the live URLs |
| Document live URLs | Record the Vercel URL and HF Spaces URL in the README |

**Milestone**: MediAssist is live at a Vercel URL. A patient can register, upload a prescription, analyze symptoms, set a reminder, and view their history — all on the deployed application.

---

---

## 4. CORE ALGORITHMS

> This section describes the logic behind each major AI-powered workflow in MediAssist. These are described as step-by-step processes — not as code.

---

### 4.1 LangGraph Orchestration Pattern

LangGraph represents an AI workflow as a directed graph where:
- Each **node** is a Python function that receives the shared state and returns an updated state
- Each **edge** is either unconditional (always route to next node) or conditional (route based on a value in the state)
- The **state** is a TypedDict object that all nodes read from and write to

**General pattern for every LangGraph workflow in MediAssist**:

```
STEP 1 — Initialize State
  Create a MediAssistState object with the initial inputs:
  — patient_id (from authenticated session)
  — input_text or image_url (from the request body)
  — All output fields set to None or empty

STEP 2 — Invoke the Graph
  Call graph.invoke(initial_state)
  LangGraph begins execution at the designated entry node

STEP 3 — Node Execution
  Each node:
    a. Reads the fields it needs from state
    b. Constructs a prompt for the Gemini API
    c. Calls the Gemini API via the LangChain Google Gemini integration
    d. Receives a text response
    e. Attempts to parse the response as structured JSON
    f. Validates the parsed JSON against the Pydantic schema
    g. If validation succeeds: writes output to state, returns updated state
    h. If validation fails: writes an error message to state.error, returns

STEP 4 — Routing
  After each node, LangGraph evaluates the routing function:
  — Reads a key field from state (e.g., state.severity, state.error)
  — Returns the name of the next node to execute, OR
  — Returns a special terminal marker to end the graph

STEP 5 — Return Final State
  graph.invoke() returns the final state after all nodes complete
  The service layer reads the output fields from the final state
  Output is sent to the router → serialized to JSON → returned to frontend

STEP 6 — Error Handling
  If state.error is set at any point, the error output node returns the
  error message. The service layer detects this and returns a 500 response
  with a user-friendly message. The raw error is never shown to the user.
```

---

### 4.2 Symptom Analysis Flow

**Trigger**: Patient submits symptom text via `POST /api/v1/symptoms/analyze`

```
INPUT: symptom_text (min 10 characters), patient_id

STEP 1 — Input Preparation
  Validate symptom text length and content (Pydantic at router level)
  Create initial state: { input_text: symptom_text, patient_id: patient_id }

STEP 2 — Triage Agent (Node: triage)
  Construct prompt:
    "Classify the severity of the following symptoms as one of:
     MILD, MODERATE, SEVERE, or EMERGENCY.
     Respond only with a JSON object: { 'severity': '<level>' }
     Do not explain or diagnose. Classify only.
     Symptoms: [symptom_text]"

  Call Gemini API with text prompt
  Parse response as JSON
  Validate against SymptomSeveritySchema:
    — severity must be exactly one of: MILD, MODERATE, SEVERE, EMERGENCY
  Write validated severity to state.severity

STEP 3 — Routing Decision
  Read state.severity:
    — MILD or MODERATE → route to Symptom Analysis Agent
    — SEVERE or EMERGENCY → route to Emergency Output Node (skip analysis)
    — Any error → route to Error Output Node

STEP 4A — Symptom Analysis Agent (Node: symptom_analysis) [MILD/MODERATE only]
  Construct prompt:
    "A patient describes the following symptoms: [symptom_text]
     Severity has been assessed as [severity].
     Provide brief, plain-language guidance about what these symptoms
     may generally indicate and what the patient should do.
     Use hedged language (may, might, could be related to).
     Do not diagnose. Do not name a specific disease.
     Respond as JSON: { 'guidance': '<text>' }"

  Call Gemini API
  Parse and validate against SymptomGuidanceSchema
  Write guidance text to state.symptom_guidance

STEP 4B — Emergency Output Node [SEVERE/EMERGENCY]
  No Gemini call is made
  Set state.symptom_guidance = None
  Set state.is_emergency = True
  Return state immediately

STEP 5 — Save to Database
  Service layer reads final state
  Creates an ai_interaction_history record:
    — interaction_type: symptom_analysis
    — input_text: original symptom text
    — severity: state.severity
    — ai_output: state.symptom_guidance (or NULL if emergency)
    — is_emergency: True/False
    — disclaimer_shown: True
    — analyzed_at: current UTC timestamp
  Creates audit_log entry: SYMPTOM_ANALYZED or EMERGENCY_ALERT_SHOWN

STEP 6 — Return Response
  Router returns: { severity, guidance, is_emergency, disclaimer }
  Frontend displays result based on is_emergency flag:
    — False → guidance card with medical disclaimer
    — True  → emergency alert banner (no guidance shown)
```

---

### 4.3 Prescription Understanding Flow

**Trigger**: Patient uploads a prescription image via `POST /api/v1/prescriptions/upload`

```
INPUT: prescription_image_file, patient_id

PHASE A — UPLOAD AND EXTRACTION

STEP 1 — File Validation
  Validate file: type must be image/jpeg, image/png, or application/pdf
  Validate file size: must not exceed 10MB
  Reject with 400 if invalid

STEP 2 — Upload to Supabase Storage
  Generate filename: {patient_id}/{timestamp}_{original_filename}
  Upload file bytes to Supabase Storage bucket
  Receive the public (authenticated) URL of the uploaded file
  Save prescription record to database:
    — status: 'pending', is_confirmed: False, uploaded_at: now

STEP 3 — Prescription Extraction Agent (Node: prescription_extraction)
  Construct multimodal prompt (text + image):
    "Extract all medicines from this prescription image.
     For each medicine, return: name, dosage, frequency, duration,
     and special instructions.
     If a field is not visible, return null for that field.
     Return only a JSON array of medicine objects.
     Do not add information not present in the image."

  Call Gemini API with image URL + text prompt (multimodal)
  Parse response as JSON array
  Validate against PrescriptionExtractionSchema:
    — Must be a list
    — Each item must have at least a 'name' field
    — dosage, frequency, duration are optional strings
  Update prescription record status to 'extracted'

STEP 4 — Return to Frontend
  Return the validated list of extracted medicines to the frontend
  Frontend displays the confirmation screen with editable fields
  Backend does NOT save medicine records at this point

PHASE B — CONFIRMATION AND EXPLANATION

STEP 5 — Patient Reviews and Confirms
  Patient edits any incorrect fields in the frontend
  Patient clicks "Confirm and Save"
  Frontend sends POST /api/v1/prescriptions/{id}/confirm
  Request body contains the (possibly corrected) medicine list

STEP 6 — Save Confirmed Data
  Service layer saves each medicine as a medical_record entry:
    — medicine_name, dosage, frequency, duration, special_instructions
    — status: 'active'
    — prescription_id: linked prescription
  Update prescription record: is_confirmed = True, status = 'confirmed'
  Create audit log entry: PRESCRIPTION_CONFIRMED

STEP 7 — Medicine Explanation Agent (Node: medicine_explanation)
  For each confirmed medicine:
    Construct prompt:
      "Explain [medicine_name] [dosage] to a patient with no medical background.
       Use simple, everyday language.
       Return JSON with fields:
         purpose (what it treats),
         how_to_take (usage instructions),
         side_effects (common side effects in plain terms),
         warnings (important cautions)"

    Call Gemini API
    Validate against MedicineExplanationSchema
    Save explanation to the medical_record.ai_explanation field

STEP 8 — Return Explanations
  Return all explanations to frontend
  Frontend renders explanation cards per medicine
  Medical disclaimer appended on the backend; displayed on every card
  Frontend prompts: "Would you like to set reminders for these medicines?"
```

---

### 4.4 Medication Reminder Flow

**Trigger A — Manual creation**: Patient fills the reminder form and clicks "Save"
**Trigger B — AI suggestion**: After prescription confirmation, patient opts in to reminder suggestions

```
FLOW A — MANUAL REMINDER CREATION

STEP 1 — Receive Request
  POST /api/v1/reminders/ receives: medicine_name, dose_description,
  reminder_time (HH:MM), frequency, days_of_week (optional)

STEP 2 — Validate Input
  Pydantic schema validates all fields
  reminder_time must be a valid 24-hour time string
  frequency must be: daily, weekdays, or custom

STEP 3 — Save to Database
  Insert reminder record into medication_reminders table
  Set is_active = True

STEP 4 — Schedule with APScheduler
  reminder_service creates an APScheduler job:
    — Job trigger: CronTrigger based on frequency and reminder_time
    — Job function: a function that creates a notification record
      for the patient when the time arrives
  Store the APScheduler job_id in the reminder.scheduler_job_id field
  This allows the job to be retrieved and cancelled on edit or delete

STEP 5 — Confirm to Frontend
  Return the saved reminder data
  Frontend adds reminder to the list immediately (optimistic update)
  Create audit log entry: REMINDER_CREATED


FLOW B — PYTHON FREQUENCY MAPPING (POST /api/v1/reminders/suggest)

STEP 1 — Receive Medicine List
  Frontend sends the confirmed medicine list with frequency strings
  (e.g., "twice daily", "TDS", "once daily at night")

STEP 2 — Reminder Agent (Python Logic, no LLM call)
  The `reminder_agent.py` module applies a `FREQUENCY_MAP` dict to each
  medicine's frequency field:
    OD / once daily         → ["08:00"]
    BD / twice daily        → ["08:00", "20:00"]
    TDS / three times daily → ["08:00", "14:00", "20:00"]
    QID / four times daily  → ["08:00", "12:00", "16:00", "20:00"]
    SOS / as needed         → [] (no scheduled reminder)
    Unrecognized strings    → ["08:00"] (safe default)
  Output is assembled as a list and validated against ReminderScheduleSchema
  No Gemini API call is made. This eliminates hallucination risk and API cost
  for this step.

STEP 3 — Return Suggestions
  Return suggested reminder schedule to frontend
  Frontend displays suggested times in the reminder setup screen
  Patient can adjust any time before saving

STEP 4 — Patient Confirms
  Patient edits times if needed, clicks "Save Reminders"
  Frontend calls POST /api/v1/reminders/ for each reminder
  Each reminder is saved and scheduled as in Flow A

IN-APP NOTIFICATION DELIVERY

APScheduler fires a job at the scheduled time:
  STEP 1 — Job function runs: creates a pending notification record
           in a lightweight notifications store (database or in-memory dict)
  STEP 2 — Frontend polls GET /api/v1/reminders/notifications/pending
           every 60 seconds while patient is logged in
  STEP 3 — If pending notifications exist, frontend displays a toast:
           "Time to take your [medicine_name] [dose_description]"
  STEP 4 — Patient dismisses the toast
  STEP 5 — Frontend calls POST /api/v1/reminders/notifications/{id}/acknowledge
  STEP 6 — Notification marked as delivered; audit log entry created
```

---

### 4.5 Doctor Summary Generation Flow

**Trigger**: Doctor opens a patient record. Called automatically by `GET /api/v1/doctor/patients/{id}/summary`

```
INPUT: patient_id (from URL), doctor's authenticated session

STEP 1 — Authorization Check
  Verify the requesting user has role = doctor
  If not → return HTTP 403

STEP 2 — Collect Patient Data
  Service layer queries:
    — All active medicines from medical_records (limit: most recent 10)
    — All symptom analyses from ai_interaction_history
      type = symptom_analysis (limit: most recent 5, ordered by date)
    — Count of total prescriptions uploaded
  This data is passed as structured text to the Doctor Summary Agent

STEP 3 — Doctor Summary Agent (Node: doctor_summary)
  Construct prompt:
    "Prepare a concise medical reference summary for a doctor.
     The patient has the following:

     Active Medicines: [list with dosages and frequencies]
     Recent Symptoms (last 5 entries, newest first):
       [date — severity — symptom text excerpt]
     Total Prescriptions Uploaded: [count]

     Write a brief 2–3 paragraph summary covering:
     1. Current medication status
     2. Recent symptom pattern (if any)
     3. Any notable observations

     Use factual, neutral, professional language.
     Do not recommend treatments. Do not diagnose.
     Return JSON: { 'summary': '<text>', 'medicine_count': n,
                    'symptom_count': n }"

  Call Gemini API (gemini-2.5-flash)
  Validate against DoctorSummarySchema

STEP 4 — Return Summary
  Return the summary text to the frontend
  Frontend displays summary card at the top of the patient record
  Medical disclaimer appended and displayed below the summary card

STEP 5 — Audit Log
  Create audit log entry: DOCTOR_ACCESSED_PATIENT
  Records: doctor_id, patient_id, timestamp, IP address
```

---

---

## 5. LIBRARIES AND THEIR PURPOSE

### 5.1 Frontend Dependencies

| Library | Version | Purpose |
|---------|---------|---------|
| `react` | 18.x | Core UI library; component model |
| `react-dom` | 18.x | DOM rendering for React |
| `react-router-dom` | 6.x | Client-side routing between pages |
| `vite` | 5.x | Build tool and development server |
| `@vitejs/plugin-react` | Latest | Vite plugin for React Fast Refresh |
| `tailwindcss` | 3.x | Utility-first CSS framework |
| `postcss` | Latest | CSS transformation pipeline (required by Tailwind) |
| `autoprefixer` | Latest | Automatically adds CSS vendor prefixes |
| `@shadcn/ui` | Latest | Accessible, composable component library (via CLI) |
| `@radix-ui/*` | Latest | Radix primitives underlying shadcn/ui |
| `class-variance-authority` | Latest | Manages Tailwind class variants for shadcn components |
| `clsx` | Latest | Utility for conditionally joining class names |
| `tailwind-merge` | Latest | Resolves conflicting Tailwind classes |
| `framer-motion` | 11.x | Declarative animations and transitions |
| `lucide-react` | Latest | Consistent SVG icon set |
| `axios` | 1.x | HTTP client for API calls; supports interceptors |
| `zustand` | 4.x | Lightweight state management for auth and notifications |
| `date-fns` | 3.x | Date formatting and manipulation |
| `react-dropzone` | Latest | File drag-and-drop upload zone |
| `sonner` | Latest | Toast notification component (used for reminders) |

### 5.2 Backend Dependencies

| Library | Version | Purpose |
|---------|---------|---------|
| `fastapi` | 0.111.x | Web framework; automatic OpenAPI docs |
| `uvicorn[standard]` | Latest | ASGI server for running FastAPI |
| `sqlmodel` | 0.0.18+ | ORM combining SQLAlchemy + Pydantic |
| `pydantic` | 2.x | Data validation for API inputs and AI outputs |
| `pydantic-settings` | Latest | Reads environment variables into a settings object |
| `supabase` | 2.x | Supabase Python client for DB and Storage |
| `python-jose[cryptography]` | Latest | JWT encoding and decoding |
| `passlib[bcrypt]` | Latest | Password hashing with bcrypt |
| `python-multipart` | Latest | Required for file upload handling in FastAPI |
| `google-generativeai` | Latest | Google Gemini API Python SDK |
| `langchain-google-genai` | Latest | LangChain integration for Gemini API |
| `langgraph` | Latest | Multi-agent graph orchestration |
| `langchain-core` | Latest | Core LangChain types (messages, prompts) |
| `apscheduler` | 3.x | In-process job scheduling for reminders |
| `httpx` | Latest | Async HTTP client (used internally by FastAPI) |
| `python-dotenv` | Latest | Loads `.env` file into environment variables |
| `pillow` | Latest | Image format validation and basic processing |

---

---

## 6. SECURITY IMPLEMENTATION

### 6.1 JWT Authentication

**How JWT works in MediAssist**:

The `auth_service.py` module handles all JWT operations. When a user logs in successfully, a JWT payload is constructed containing the user's ID (`sub`), role, email, issued-at time (`iat`), and expiry time (`exp`). This payload is signed using the `JWT_SECRET` environment variable with the HMAC-SHA256 (`HS256`) algorithm via the `python-jose` library.

On every protected request, the `auth_middleware.py` FastAPI dependency:
1. Extracts the token from the `Authorization: Bearer <token>` header
2. Calls `python-jose`'s `decode()` to verify the signature and check expiry
3. Extracts the `role` claim and compares it to the required role for the endpoint
4. If valid, injects the user data into the route handler's function signature
5. If invalid or expired, returns HTTP 401 or HTTP 403 immediately

**Implementation notes**:
- JWT secret must be at least 256 bits of randomness. It is generated once and stored as a Hugging Face Spaces environment secret
- Token expiry is set to 24 hours (`exp = iat + 86400`)
- Tokens are never stored in the database — they are stateless
- On logout, the frontend clears the token from memory. Token blocklisting is not implemented in V1 (an accepted limitation)

---

### 6.2 Password Hashing (bcrypt)

Passwords are never stored or logged in plaintext at any stage. The `passlib` library with the `bcrypt` scheme handles all password operations.

**Registration flow**:
1. User submits plaintext password in the registration request
2. `auth_service.py` calls `passlib`'s `hash()` function with `bcrypt` and a work factor of 12
3. The resulting hash string is stored in the `patients.password_hash` or `doctors.password_hash` column
4. The plaintext password is discarded immediately

**Login flow**:
1. User submits plaintext password in the login request
2. `auth_service.py` retrieves the stored hash from the database
3. `passlib`'s `verify()` function compares the submitted password against the stored hash
4. If verification passes → JWT issued. If it fails → generic error returned
5. The plaintext password is never stored, logged, or compared as a string

**Why bcrypt**: bcrypt is adaptive — its work factor can be increased as hardware improves, keeping it resistant to brute-force attacks.

---

### 6.3 Environment Variables

All sensitive configuration is stored as environment variables. They must never appear in source code or be committed to version control.

**Backend environment variables** (stored as Hugging Face Spaces secrets):

| Variable | Description | Example Format |
|----------|-------------|---------------|
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |
| `SUPABASE_URL` | Supabase project URL | `https://{ref}.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (backend only) | `eyJ...` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) | Random 64-char string |
| `JWT_ALGORITHM` | Signing algorithm | `HS256` |
| `JWT_EXPIRE_HOURS` | Token lifetime in hours | `24` |
| `STORAGE_BUCKET` | Supabase Storage bucket name | `mediassist-uploads` |
| `ALLOWED_ORIGINS` | Comma-separated CORS allowed origins | `https://mediassist.vercel.app` |

**Frontend environment variable** (set in Vercel project settings):

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Full URL of the deployed FastAPI backend |

**Local development**:
- Create a `.env` file in the `backend/` directory from `.env.example`
- Create a `.env.local` file in the `frontend/` directory
- Both files must be listed in `.gitignore` and never committed

---

### 6.4 Input Validation

All API inputs are validated by FastAPI using Pydantic v2 request models. Validation happens before any business logic runs.

**Approach**:
- Every POST and PUT request body is defined as a Pydantic `BaseModel`
- FastAPI automatically validates the incoming JSON against the model
- If validation fails, FastAPI returns HTTP 422 with a structured error response before the route handler is called
- Field-level constraints (min length, max length, regex, allowed values) are defined directly in the model using Pydantic's `Field()`

**Key validation points**:
- Email fields: validated with Pydantic's `EmailStr` type
- Password fields: minimum 8 characters enforced in the model
- Enum fields (severity, status, role): validated against a Python `Enum`
- Text fields: minimum and maximum character counts enforced
- Optional fields: explicitly marked as `Optional` with `None` defaults

**SQL injection prevention**: SQLModel uses SQLAlchemy under the hood, which always uses parameterized queries. Raw SQL string interpolation is never used.

**Text passed to Gemini**: Before symptom text or medicine names are included in Gemini prompts, the backend applies basic sanitization:
- Strips leading/trailing whitespace
- Removes any characters that could be interpreted as prompt delimiters
- Limits to the validated maximum character count

---

### 6.5 File Upload Validation

Prescription and packaging images are validated before being processed or stored.

**Validation steps**:
1. **MIME type check**: The `python-multipart` library provides the file's MIME type. Accepted types: `image/jpeg`, `image/png`, `application/pdf`. Other types are rejected with HTTP 400
2. **File size check**: The file size is checked against a 10MB limit (10 × 1024 × 1024 bytes). Files exceeding the limit are rejected with HTTP 400 and a clear error message
3. **Empty file check**: Files with zero bytes are rejected
4. **Image format validation**: For image uploads, `Pillow`'s `Image.open()` is called to verify the file is a genuine image, not a renamed file with a spoofed MIME type

**File naming**: Uploaded files are stored with a safe filename format — `{patient_id}/{UTC_timestamp}_{sanitized_original_name}`. Special characters and path traversal sequences are removed from the original filename before constructing the storage path.

---

### 6.6 AI Safety and Medical Disclaimer

MediAssist treats AI safety as a first-class implementation concern, not an afterthought.

**Prompt-level safeguards**:
- Every Gemini prompt that involves medical information includes an explicit instruction prohibiting diagnostic language (e.g., "Do not diagnose. Do not name a specific disease. Do not recommend a prescription.")
- Triage prompts are restricted to returning only a severity level — no explanatory text
- Symptom guidance prompts require hedged language ("may be related to", "it is advisable to consult a doctor")
- Doctor summary prompts explicitly prohibit treatment recommendations

**Schema-level safeguards**:
- Every Gemini response is validated against a Pydantic schema before use
- The `severity` field in the symptom schema is validated as a strict `Literal` type — only exactly one of `MILD`, `MODERATE`, `SEVERE`, `EMERGENCY` is accepted
- Any AI response that fails schema validation is completely discarded; the backend returns a user-friendly error without exposing raw AI output

**Emergency routing**:
- When the Triage Agent classifies `SEVERE` or `EMERGENCY`, no further AI agent is invoked
- The emergency alert content is hardcoded in the backend response and frontend component — it is not AI-generated
- This ensures emergency messaging is always consistent, always visible, and never modified by the AI

**Medical disclaimer**:
- The disclaimer text is a constant defined in the backend
- It is appended to every API response that contains AI-generated medical content
- The frontend component `MedicalDisclaimer.jsx` always renders when an AI result is displayed
- It uses `aria-live` to be announced by screen readers
- There is no user action that can hide or dismiss it

---

---

## 7. TESTING STRATEGY

### 7.1 Functional Testing

Functional testing is performed manually by the development team following a structured checklist. Each item must pass before the feature is considered complete.

#### Authentication

| Test Case | Expected Outcome |
|-----------|-----------------|
| Register a new patient with valid data | Account created; redirected to consent screen |
| Register with an already-used email | Error: "An account with this email already exists" |
| Register with a password shorter than 8 characters | Inline validation error shown |
| Patient attempts to proceed without checking consent | Button stays disabled; error message shown |
| Login with correct credentials | JWT token issued; redirected to Patient Dashboard |
| Login with incorrect password | Generic error shown; no token issued |
| Access a protected route without a token | Redirected to login page |
| Doctor attempts to access a patient-only endpoint | HTTP 403 returned |

#### Prescription Upload

| Test Case | Expected Outcome |
|-----------|-----------------|
| Upload a clear prescription image | Extraction succeeds; confirmation screen shows extracted medicines |
| Upload a file larger than 10MB | Error: file size limit message |
| Upload a non-image file (e.g., .exe) | Error: invalid file type |
| Edit a field on the confirmation screen and confirm | Corrected data is saved (not the original AI output) |
| Confirm without editing | All extracted data saved as-is |
| Gemini API returns malformed JSON | User-friendly extraction failure message; nothing saved |
| View explanation after confirmation | Explanation card shown per medicine; disclaimer visible |

#### Symptom Analysis

| Test Case | Expected Outcome |
|-----------|-----------------|
| Submit a symptom description under 10 characters | Validation error |
| Submit mild symptoms | Guidance card shown; severity badge = Mild; disclaimer visible |
| Submit emergency symptoms | Emergency alert banner shown; no guidance text |
| Use voice input (Chrome) | Microphone activates; transcription appears in text box |
| Use voice input (unsupported browser) | Fallback message shown; text input still works |
| View symptom history | All past entries listed chronologically |

#### Medication Reminders

| Test Case | Expected Outcome |
|-----------|-----------------|
| Create a daily reminder for 08:00 | Reminder saved; appears in the list under "Morning" |
| Create a reminder with missing time | Validation error |
| Edit reminder time to 10:00 | Reminder updated; APScheduler job rescheduled |
| Delete a reminder | Reminder removed from list; confirmation dialog shown first |
| Wait for reminder time to arrive (in test) | In-app toast notification appears |

#### Doctor Portal

| Test Case | Expected Outcome |
|-----------|-----------------|
| Search for a patient by name | Matching patient cards returned |
| Open a patient record | AI summary shown at top; medicines, prescriptions, symptoms visible |
| AI summary fails | Fallback message shown; patient data still visible |
| Doctor attempts any write operation | HTTP 403 returned |

---

### 7.2 API Testing

API tests are performed using **Postman** (or the auto-generated FastAPI OpenAPI docs at `/docs`).

**Setup**:
- Create a Postman environment with variables: `base_url`, `patient_token`, `doctor_token`
- Login as a patient and doctor once; store their tokens as environment variables
- Use the environment variables as `{{patient_token}}` in the Authorization header

**Key API Tests**:

| Endpoint | Method | Test | Expected |
|----------|--------|------|----------|
| `/auth/register/patient` | POST | Valid patient data | 201 Created |
| `/auth/login` | POST | Valid credentials | 200 OK with token |
| `/auth/login` | POST | Wrong password | 401 Unauthorized |
| `/prescriptions/upload` | POST | Valid image with patient token | 200 with extracted data |
| `/prescriptions/upload` | POST | No token | 401 Unauthorized |
| `/symptoms/analyze` | POST | Valid symptom text | 200 with severity and guidance |
| `/symptoms/analyze` | POST | Text under 10 chars | 422 Unprocessable Entity |
| `/reminders/` | POST | Valid reminder data | 201 Created |
| `/reminders/{id}` | DELETE | Patient's own reminder | 200 Deleted |
| `/doctor/patients/search` | GET | Doctor token + query | 200 with patient list |
| `/doctor/patients/search` | GET | Patient token | 403 Forbidden |
| `/doctor/patients/{id}` | PUT | Doctor token (write) | 405 or 403 (not allowed) |

---

### 7.3 AI Response Validation Testing

The AI pipeline is tested independently of the full application flow.

**Approach**:
- Write standalone Python test scripts (not unittest or pytest — simple scripts) that invoke each agent directly
- These scripts call the Gemini API with prepared inputs and print the validated output

**For each agent, test**:

| Agent | Test Input | What to Verify |
|-------|-----------|---------------|
| Triage Agent | Known mild symptoms ("slight headache") | Returns `MILD` or `MODERATE` — gemini-2.5-flash |
| Triage Agent | Known emergency symptoms ("chest pain, left arm pain") | Returns `EMERGENCY` — gemini-2.5-flash |
| Prescription Agent | A clear, real prescription image URL | Returns a list with at least one medicine with a name — gemini-2.5-flash multimodal |
| Medicine Agent | "Metformin 500mg, twice daily" | Returns all 4 fields: purpose, how_to_take, side_effects, warnings — gemini-2.5-flash |
| Reminder Agent | `[{medicine: "Metformin", frequency: "twice daily"}]` | Returns 2 times approximately 12 hours apart — **Python logic only, no API call** |
| Doctor Summary Agent | Sample patient data dict | Returns a non-empty summary string — gemini-2.5-flash |

**Schema mismatch testing**:
- Temporarily use a prompt that produces invalid output (e.g., ask for a different JSON structure)
- Verify that the Pydantic validation catches it and the system returns a graceful error — not a crash

---

### 7.4 UI Testing

UI testing is performed manually across devices and browsers.

**Browser Test Matrix**:

| Browser | Version | Desktop | Mobile |
|---------|---------|---------|--------|
| Google Chrome | Latest | ✓ Test | ✓ Test |
| Mozilla Firefox | Latest | ✓ Test | ✓ Test |
| Microsoft Edge | Latest | ✓ Test | — |
| Safari | Latest | ✓ Test | ✓ Test (iOS) |

**Responsive Testing Sizes**:

| Width | Device Simulated | Key Things to Check |
|-------|-----------------|---------------------|
| 320px | iPhone SE | No horizontal scroll; bottom nav visible; touch targets ≥ 44px |
| 375px | iPhone 14 | Readable font sizes; full-width buttons |
| 768px | iPad portrait | Sidebar visible; 2-column layout where expected |
| 1024px | iPad landscape / small laptop | Full layout; quick action cards in 3 columns |
| 1280px | Standard laptop | Max-width container centered; sidebar comfortably wide |

**UI Checklist**:

| Item | Check |
|------|-------|
| Medical disclaimer visible on all AI result screens | |
| Emergency alert is red, full-width, and unmissable | |
| Loading states display on all async operations | |
| Error states display friendly messages (no stack traces) | |
| Consent checkbox required before registration completes | |
| Voice input gracefully degrades on Firefox/Safari | |
| All form labels are visible above inputs | |
| Focus rings visible on all interactive elements when tabbing | |
| Animations smooth (60fps) on mid-range mobile | |
| Dark text on light backgrounds meets 4.5:1 contrast ratio | |

---

---

## 8. DEPLOYMENT GUIDE

### 8.1 Supabase Setup

Supabase is the first service to configure, as both the backend deployment and local development depend on it.

**Steps**:

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"; give it the name `mediassist`; set a strong database password; choose a region close to your users
3. Once the project is created, navigate to **Project Settings → API** to find:
   - `Project URL` → this is `SUPABASE_URL`
   - `service_role` key → this is `SUPABASE_SERVICE_KEY` (for backend use only)
4. Navigate to the **SQL Editor** and run the table creation statements from DOC-4 to create all 7 tables
5. Navigate to **Storage → Buckets** and create a new bucket named `mediassist-uploads`
   - Set bucket access to **Private** (files only accessible via authenticated backend requests)
6. Note the database connection string from **Project Settings → Database → Connection string (URI mode)** → this is `DATABASE_URL`

**Table Creation Order** (respects foreign key dependencies):
1. `patients`
2. `doctors`
3. `prescriptions` (references `patients`)
4. `medical_records` (references `patients`, `prescriptions`)
5. `medication_reminders` (references `patients`)
6. `ai_interaction_history` (references `patients`)
7. `audit_logs` (no foreign keys — safe to create last)

---

### 8.2 Backend Deployment (Hugging Face Spaces — Docker)

Hugging Face Spaces provides free Docker container hosting for the FastAPI backend.

**Dockerfile structure** (description — not code):

```
The Dockerfile for the MediAssist backend follows this structure:

1. Base image: python:3.11-slim
   (Small Python image to keep container size minimal)

2. Set working directory to /app

3. Copy requirements.txt and run pip install
   (This layer is cached separately so that dependency installs
   are only re-run when requirements.txt changes)

4. Copy all application files into the container

5. Expose port 7860
   (Hugging Face Spaces routes external traffic to port 7860 by default)

6. Set the CMD to:
   uvicorn main:app --host 0.0.0.0 --port 7860
   (Runs the FastAPI application on all interfaces at port 7860)
```

**Deployment steps**:

1. Create a free account at [huggingface.co](https://huggingface.co)
2. Click "New Space" → choose "Docker" as the Space type → name it `mediassist-backend`
3. In the Space settings, add all backend environment variables as **Secrets** (Settings → Repository Secrets):
   - `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `DATABASE_URL`, `JWT_SECRET`, `JWT_ALGORITHM`, `JWT_EXPIRE_HOURS`, `STORAGE_BUCKET`, `ALLOWED_ORIGINS`
4. Clone the HF Spaces repository to your local machine
5. Copy the `backend/` directory contents into the cloned repository
6. Add a `Dockerfile` to the root of the repository
7. Commit and push to the Hugging Face Space:
   ```
   git add .
   git commit -m "Initial backend deployment"
   git push
   ```
8. Hugging Face automatically detects the Dockerfile, builds the container, and starts the application
9. Note the Space URL (format: `https://username-mediassist-backend.hf.space`) — this is the backend base URL
10. Verify deployment by visiting `{space_url}/docs` — the FastAPI OpenAPI docs page should load

**Important note on cold starts**: HF Spaces free tier pauses after inactivity. The first request after a pause may take 15–30 seconds. This is normal behavior and can be communicated to users via the loading state.

---

### 8.3 Frontend Deployment (Vercel)

**Steps**:

1. Create a free account at [vercel.com](https://vercel.com)
2. Click "Add New Project" → import your GitHub repository
3. Vercel auto-detects the Vite framework; set the **Root Directory** to `frontend/`
4. Add the environment variable in the Vercel project settings:
   - Name: `VITE_API_BASE_URL`
   - Value: the Hugging Face Spaces backend URL from Step 9 above
5. Click "Deploy"
6. Vercel builds the Vite project and deploys it to a global CDN
7. A live URL is generated (format: `https://mediassist.vercel.app` or similar)
8. Every subsequent `git push` to the `main` branch triggers an automatic redeployment

**CORS configuration**: In `main.py`, configure FastAPI's `CORSMiddleware` to only allow the Vercel deployment URL as an allowed origin. This prevents other websites from making API calls to the backend using a stolen token.

**Custom domain (optional)**: In Vercel's project settings, you can add a custom domain (e.g., `mediassist.yourname.dev`). Vercel handles SSL certificate provisioning automatically.

---

### 8.4 Environment Variables Summary

Complete list of all environment variables needed for a working deployment:

**Backend (Hugging Face Spaces Secrets)**:

| Variable | Where to Get It | Required |
|----------|----------------|---------|
| `GEMINI_API_KEY` | Google AI Studio → API Keys | Yes |
| `SUPABASE_URL` | Supabase → Project Settings → API | Yes |
| `SUPABASE_SERVICE_KEY` | Supabase → Project Settings → API → service_role | Yes |
| `DATABASE_URL` | Supabase → Project Settings → Database → Connection String | Yes |
| `JWT_SECRET` | Generate: `openssl rand -hex 32` | Yes |
| `JWT_ALGORITHM` | Set to: `HS256` | Yes |
| `JWT_EXPIRE_HOURS` | Set to: `24` | Yes |
| `STORAGE_BUCKET` | Set to: `mediassist-uploads` | Yes |
| `ALLOWED_ORIGINS` | Your Vercel frontend URL | Yes |

**Frontend (Vercel Project Settings)**:

| Variable | Value |
|----------|-------|
| `VITE_API_BASE_URL` | Your Hugging Face Spaces backend URL |

**Local Development (.env files)**:
- Copy `.env.example` to `.env` in `backend/`; fill in all values from the table above
- Create `frontend/.env.local` with `VITE_API_BASE_URL=http://localhost:8000`

---

### 8.5 Docker Overview

Docker ensures the FastAPI application runs identically in local development and on Hugging Face Spaces. The containerized approach eliminates dependency conflicts and environment differences.

**Key concepts used in the MediAssist Dockerfile**:

| Concept | Application |
|---------|-------------|
| **Base image** | `python:3.11-slim` — minimal Python image; reduces container size compared to the full `python:3.11` image |
| **Layer caching** | `requirements.txt` is copied and installed before the application code. This means Docker only reinstalls dependencies when `requirements.txt` changes — not on every code change |
| **Port exposure** | Port 7860 is exposed because Hugging Face Spaces routes external HTTP traffic to port 7860 on Docker spaces |
| **Non-root user** | The application runs as a non-root user inside the container for basic security hygiene |
| **Environment variables** | Not baked into the Dockerfile — they are injected at runtime by Hugging Face Spaces from the project's Secrets store |

**Local Docker testing**:
Before deploying to Hugging Face Spaces, test the Docker build locally:
1. Build the image from the `backend/` directory using `docker build`
2. Run the container with the local `.env` file passed as environment variables
3. Verify the FastAPI docs are accessible at `localhost:7860/docs`

---

---

## 9. FUTURE ENHANCEMENTS

These features are explicitly out of scope for Version 1 but are natural next steps for MediAssist post-internship or in Version 2.

| Priority | Enhancement | Description |
|----------|-------------|-------------|
| **High** | Push Notifications | Use web push notifications (FCM or Web Push API) to deliver medication reminders even when the browser is not open or the patient is not logged in |
| **High** | Email Reminders | Send reminder emails for critical medicines using a transactional email service (e.g., Resend or SendGrid) |
| **High** | Prescription PDF Export | Allow patients to download their medicine list and explanations as a PDF for offline reference or to share with a family member |
| **High** | Caretaker / Family Access | Allow a family member or caretaker to view (read-only) a patient's reminders and history with the patient's consent |
| **Medium** | Multi-language Support | Support Hindi and other Indian regional languages using Gemini's multilingual capabilities and i18n in the frontend |
| **Medium** | Hospital / Pharmacy Integration | Connect with hospital systems (HL7 FHIR) or pharmacy APIs to auto-import prescription data |
| **Medium** | Admin Dashboard | A simple admin panel for monitoring system health, viewing audit logs, and managing user accounts |
| **Medium** | Drug Interaction Checker | Before saving a new medicine, check for known interactions with the patient's existing active medicines using the AI or a drug database API |
| **Medium** | Appointment Reminders | Allow patients to log upcoming doctor appointments and receive reminders with a pre-populated symptom summary |
| **Low** | Progressive Web App (PWA) | Make the frontend installable on mobile home screens with offline support for viewing saved history |
| **Low** | Voice-Driven Navigation | Allow patients to navigate MediAssist using voice commands (e.g., "Show my reminders") |
| **Low** | Telemedicine Integration | Embed a video consultation link within the Doctor Portal for direct patient-doctor communication |
| **Low** | AI-powered Medicine Image Recognition Database | Cache frequently explained medicines in the database to reduce Gemini API calls and improve response time for common queries |

---

---

## 10. CONCLUSION

### 10.1 Implementation Summary

This document completes the MediAssist documentation suite. Together, the six documents form a complete blueprint from product vision to deployment:

| Document | Role |
|----------|------|
| DOC-0 (PRD) | Defines *why* MediAssist exists and *what* it achieves |
| DOC-1 (SRS) | Defines *exactly what* the system must do and *how well* |
| DOC-3 (SDA) | Defines *how* the system is structured and architected |
| DOC-4 (DAD) | Defines *how* data is stored and *how* the API works |
| DOC-5 (UXD) | Defines *how* the interface looks and *how* users interact |
| DOC-6 (IDG) | Defines *how* to build, test, and deploy the system |

### 10.2 Technical Summary

| Category | Details |
|----------|---------|
| **Total Screens** | 11 (patient-facing: 9, doctor-facing: 2) |
| **Total API Endpoints** | 30 (Authentication: 5, Patient: 5, Symptoms: 3, Prescriptions: 6, Reminders: 7, Doctor: 8, Profile: 1) |
| **Total Database Tables** | 7 |
| **AI Agents** | 6 (Triage, Symptom Analysis, Prescription Extraction, Medicine Explanation, Reminder Suggestion, Doctor Summary) |
| **Libraries (Frontend)** | 18 |
| **Libraries (Backend)** | 17 |
| **Deployment Platforms** | 3 (Vercel, Hugging Face Spaces, Supabase) |
| **Cost to Run** | $0 (all free-tier services for prototype scale) |

### 10.3 Key Engineering Decisions Recap

| Decision | Reason |
|----------|--------|
| LangGraph for agent orchestration | Explicit, readable, testable AI workflows with conditional routing |
| Supabase over self-hosted PostgreSQL | Free managed hosting; integrated storage; no DevOps overhead |
| APScheduler (in-process) over Redis/Celery | Simpler; zero additional infrastructure; appropriate for prototype scale |
| Separate patients and doctors tables | Cleaner RBAC; no shared schema ambiguity |
| Pydantic validation on all AI outputs | Prevents hallucinated or malformed AI data from entering the database or UI |
| Patient confirmation before saving prescription data | Non-negotiable safety requirement from DOC-1 (BR-009) |
| Hardcoded emergency alert content | Emergency messaging must be consistent and never AI-generated |

### 10.4 Final Note

MediAssist is designed to be a complete, working product at the end of a college internship. Every architectural decision prioritizes clarity over complexity, correctness over cleverness, and user safety over feature breadth. The documentation produced across all six documents follows professional software engineering practices — suitable for both academic evaluation and as a portfolio-quality project.

---

> END OF DOCUMENT 6 — IMPLEMENTATION & DEPLOYMENT GUIDE
>
> This is the final document in the MediAssist documentation suite.
>
> Documentation Suite:
>   DOC-0  Product Requirements Document          ✓ Complete
>   DOC-1  Software Requirements Specification    ✓ Complete
>   DOC-3  System Design & Architecture           ✓ Complete
>   DOC-4  Database & API Design                  ✓ Complete
>   DOC-5  UI/UX Design                           ✓ Complete
>   DOC-6  Implementation & Deployment Guide      ✓ Complete
>
> MediAssist documentation is complete and ready for development.
