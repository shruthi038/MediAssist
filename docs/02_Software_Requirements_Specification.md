
# ══════════════════════════════════════════════════════════════════════════════
#
#                              MEDIASSIST
#            A MULTI-AGENT PERSONAL HEALTHCARE ASSISTANT
#
# ══════════════════════════════════════════════════════════════════════════════
#
#  DOCUMENT 1 — SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
#
#  Project        : MediAssist
#  Document ID    : DOC-1-SRS
#  Version        : 1.1
#  Date           : July 2026
#  AI Model       : gemini-2.5-flash
#
#  Cross-Reference: This document is derived from DOC-0 (PRD).
#                   All feature definitions and scope boundaries defined
#                   in DOC-0 apply to this document.
#
# ══════════════════════════════════════════════════════════════════════════════

---

## TABLE OF CONTENTS

1. [Introduction](#1-introduction)
   - 1.1 Purpose
   - 1.2 Scope
   - 1.3 Definitions, Acronyms, and Abbreviations
   - 1.4 References
   - 1.5 Document Overview

2. [Overall Description](#2-overall-description)
   - 2.1 Product Perspective
   - 2.2 Product Functions Summary
   - 2.3 User Classes and Characteristics
   - 2.4 Operating Environment
   - 2.5 Design and Implementation Constraints
   - 2.6 Assumptions and Dependencies

3. [Functional Requirements](#3-functional-requirements)
   - 3.1 Authentication & User Management (FR-001 to FR-008)
   - 3.2 Prescription Management (FR-009 to FR-016)
   - 3.3 Medicine Explanation (FR-017 to FR-022)
   - 3.4 Symptom Analysis (FR-023 to FR-029)
   - 3.5 Medical History (FR-030 to FR-034)
   - 3.6 Medication Reminders (FR-035 to FR-039)
   - 3.7 Doctor Portal (FR-040 to FR-044)
   - 3.8 Audit Logging (FR-045 to FR-047)

4. [Non-Functional Requirements](#4-non-functional-requirements)
   - 4.1 Performance (NFR-001 to NFR-003)
   - 4.2 Security (NFR-004 to NFR-007)
   - 4.3 Usability (NFR-008 to NFR-010)
   - 4.4 Reliability & Availability (NFR-011 to NFR-012)
   - 4.5 Maintainability (NFR-013)
   - 4.6 Compatibility (NFR-014 to NFR-015)

5. [External Interface Requirements](#5-external-interface-requirements)
   - 5.1 User Interface Requirements
   - 5.2 Hardware Interface Requirements
   - 5.3 Software Interface Requirements
   - 5.4 Communication Interface Requirements

6. [System Features](#6-system-features)

7. [Use Cases](#7-use-cases)

8. [User Stories](#8-user-stories)

9. [Acceptance Criteria](#9-acceptance-criteria)

10. [Business Rules](#10-business-rules)

11. [Requirement Traceability Matrix](#11-requirement-traceability-matrix)

---

---

## 1. INTRODUCTION

### 1.1 Purpose

This Software Requirements Specification (SRS) defines the complete functional and non-functional requirements for **MediAssist**, a multi-agent personal healthcare assistant. This document provides a precise, verifiable, and unambiguous description of system behavior to guide the design, development, and testing phases of the project.

This SRS is intended to be used by:

- **Developers** as the authoritative reference for implementation decisions
- **Testers** as the basis for writing test cases and acceptance criteria
- **Project supervisors and reviewers** for evaluating project completeness
- **System architects** for verifying that the architecture satisfies all requirements

This document supplements and extends DOC-0 (Product Requirements Document). Where DOC-0 defines *what* MediAssist is and *why* it exists, this SRS defines *exactly what* the system must do and *how well* it must do it.

### 1.2 Scope

**Product Name**: MediAssist — A Multi-Agent Personal Healthcare Assistant

**What the system does**:

MediAssist is a web-based application that enables patients to upload and understand prescriptions, analyze symptoms with severity guidance, maintain a personal medical history, and receive medication reminders. Doctors can view patient records and AI-generated patient summaries. All AI-driven features are powered by Google's **gemini-2.5-flash** multimodal API, orchestrated through a LangGraph multi-agent system.

**What the system does not do** (in Version 1):

- Diagnose diseases or prescribe treatments
- Integrate with hospital or pharmacy information systems
- Provide real-time clinical monitoring
- Support offline operation
- Support multiple languages

**Deployment Targets**:

- Frontend: Vercel (React + Vite)
- Backend: Hugging Face Spaces (FastAPI, Docker)
- Database: Supabase (PostgreSQL + Storage)

---

### 1.3 Definitions, Acronyms, and Abbreviations

| Term / Acronym | Definition |
|---------------|------------|
| **SRS** | Software Requirements Specification |
| **PRD** | Product Requirements Document |
| **FR** | Functional Requirement |
| **NFR** | Non-Functional Requirement |
| **UC** | Use Case |
| **US** | User Story |
| **BR** | Business Rule |
| **AC** | Acceptance Criteria |
| **API** | Application Programming Interface |
| **JWT** | JSON Web Token — used for stateless authentication |
| **LLM** | Large Language Model |
| **AI** | Artificial Intelligence |
| **UI** | User Interface |
| **UX** | User Experience |
| **RBAC** | Role-Based Access Control |
| **CRUD** | Create, Read, Update, Delete |
| **REST** | Representational State Transfer |
| **JSON** | JavaScript Object Notation |
| **HTTP** | Hypertext Transfer Protocol |
| **HTTPS** | HTTP Secure (TLS encrypted) |
| **ORM** | Object-Relational Mapping |
| **PHI** | Protected Health Information |
| **Gemini** | Google Gemini multimodal AI API |
| **LangGraph** | A Python library for building stateful multi-agent LLM workflows |
| **SQLModel** | Python ORM built on SQLAlchemy and Pydantic |
| **Supabase** | Open-source Firebase alternative providing PostgreSQL and file storage |
| **Vite** | Next-generation frontend build tool for React |
| **shadcn/ui** | Component library built on Radix UI primitives |
| **APScheduler** | Advanced Python Scheduler — used for reminder scheduling |
| **Pydantic** | Python data validation library used for AI output validation |
| **bcrypt** | Password hashing algorithm |
| **Web Speech API** | Browser-native API for converting spoken audio to text |
| **Triage Agent** | LangGraph agent responsible for assessing symptom severity |
| **WCAG** | Web Content Accessibility Guidelines |
| **RTM** | Requirement Traceability Matrix |

---

### 1.4 References

| Document ID | Title | Notes |
|-------------|-------|-------|
| DOC-0-PRD | Product Requirements Document | Parent document; defines vision and scope |
| DOC-2 | System Architecture Document | Architecture derived from this SRS |
| DOC-3 | Database Design Document | Schema derived from functional requirements herein |
| DOC-4 | API Design Document | API contracts derived from FR definitions herein |
| IEEE Std 830-1998 | IEEE Recommended Practice for SRS | Structural standard followed |

---

### 1.5 Document Overview

This SRS is organized as follows:

- **Section 2** provides an overall description of the system context, users, environment, and constraints
- **Section 3** lists all functional requirements with unique IDs, descriptions, priorities, and rationale
- **Section 4** lists all non-functional requirements with measurable targets
- **Section 5** covers all external interface requirements
- **Section 6** describes system features at a higher level of abstraction
- **Section 7** provides formal use cases with actors, flows, and exceptions
- **Section 8** provides user stories in standard agile format
- **Section 9** provides acceptance criteria for all major system behaviors
- **Section 10** defines the business rules that govern system behavior
- **Section 11** provides the Requirement Traceability Matrix linking all requirements to their sources and tests

---

---

## 2. OVERALL DESCRIPTION

### 2.1 Product Perspective

MediAssist is a new, standalone web application. It does not replace or integrate with existing hospital or pharmacy systems in Version 1. It operates as an independent patient-centered health management tool.

The system is composed of three independent tiers:

```
 ┌──────────────────────────────────────────────────┐
 │              PRESENTATION TIER                    │
 │   React (Vite) + Tailwind CSS + shadcn/ui         │
 │   Framer Motion + Lucide Icons                    │
 │   Web Speech API (voice input)                    │
 └────────────────────┬─────────────────────────────┘
                      │ HTTPS / REST / JSON
 ┌────────────────────▼─────────────────────────────┐
 │              APPLICATION TIER                     │
 │   Python + FastAPI                                │
 │   LangGraph (Multi-Agent Orchestration)           │
 │   SQLModel (ORM)                                  │
 │   APScheduler (Reminder Scheduling)               │
 │   Pydantic (AI Output Validation)                 │
 └────────────────────┬─────────────────────────────┘
                      │ SQL / Supabase SDK / REST
 ┌────────────────────▼─────────────────────────────┐
 │                  DATA TIER                        │
 │   Supabase PostgreSQL (relational data)           │
 │   Supabase Storage (prescription images)          │
 └──────────────────────────────────────────────────┘
                      │
 ┌────────────────────▼─────────────────────────────┐
 │              EXTERNAL SERVICES                    │
 │   Google Gemini API (multimodal AI)               │
 └──────────────────────────────────────────────────┘
```

MediAssist interacts with one external AI service (Google Gemini API) and one external platform (Supabase). All AI calls are proxied through the backend; the Gemini API key is never exposed to the frontend.

---

### 2.2 Product Functions Summary

The following summarizes the major functional areas of MediAssist:

| Function Area | Summary |
|--------------|---------|
| **Authentication** | Secure patient and doctor registration, login, and session management |
| **Prescription Management** | Upload, AI-extract, confirm, and store prescription data |
| **Medicine Explanation** | AI-generated plain-language explanations of medicines from text or image |
| **Symptom Analysis** | Triage-based symptom severity assessment with emergency alert capability |
| **Medical History** | Chronological personal health record of prescriptions, medicines, and symptoms |
| **Medication Reminders** | Scheduled in-app reminder notifications for medicines |
| **Doctor Portal** | Patient record viewing and AI-generated patient summary for doctors |
| **Audit Logging** | Immutable record of key system actions for transparency and traceability |

---

### 2.3 User Classes and Characteristics

#### 2.3.1 Patient

| Attribute | Description |
|-----------|-------------|
| **Definition** | An individual registered to manage their personal healthcare |
| **Technical Proficiency** | Low to moderate — must be able to use a web browser |
| **Access Level** | Full access to their own data only |
| **Primary Interactions** | Prescription upload, symptom check, reminder management, medical history |
| **Frequency of Use** | Daily (reminders) to occasional (prescription upload) |
| **Special Needs** | Simple, unambiguous language; clear loading and error states |

#### 2.3.2 Doctor

| Attribute | Description |
|-----------|-------------|
| **Definition** | A registered licensed medical professional |
| **Technical Proficiency** | Moderate to high |
| **Access Level** | Read-only access to patient records |
| **Primary Interactions** | Patient search, record review, AI summary review |
| **Frequency of Use** | Per-consultation basis |
| **Special Needs** | Fast retrieval, concise AI summaries |

#### 2.3.3 System Administrator (Implicit)

| Attribute | Description |
|-----------|-------------|
| **Definition** | The development team managing infrastructure |
| **Technical Proficiency** | High |
| **Access Level** | Database and server access |
| **Primary Interactions** | Audit log review, error monitoring, deployment |
| **Note** | No dedicated admin UI in Version 1 |

---

### 2.4 Operating Environment

| Component | Environment |
|-----------|------------|
| **Frontend Hosting** | Vercel (global CDN) |
| **Backend Hosting** | Hugging Face Spaces (Docker container) |
| **Database** | Supabase (PostgreSQL 14+, hosted) |
| **File Storage** | Supabase Storage (S3-compatible) |
| **Runtime — Backend** | Python 3.11+, FastAPI |
| **Runtime — Frontend** | Node.js 20+ (build time); static HTML/JS/CSS (runtime) |
| **Browser Support** | Chrome 110+, Firefox 110+, Safari 16+, Edge 110+ |
| **Minimum Screen Width** | 320px (mobile-responsive) |
| **Network Requirement** | Active internet connection required for all features |
| **Protocol** | HTTPS (TLS 1.2+) required for all communications and Web Speech API |
| **Voice Input Requirement** | Browser with Web Speech API support (Chrome recommended) |

---

### 2.5 Design and Implementation Constraints

| ID | Constraint | Source |
|----|-----------|--------|
| DC-01 | The frontend must be a React (Vite) single-page application | Architecture decision |
| DC-02 | The backend must be built with Python and FastAPI | Architecture decision |
| DC-03 | AI inference must use Google Gemini API exclusively | Architecture decision |
| DC-04 | All AI calls must originate from the backend; the API key must never be in the frontend | Security requirement |
| DC-05 | The database must be hosted on Supabase PostgreSQL | Architecture decision |
| DC-06 | Prescription images and files must be stored in Supabase Storage | Architecture decision |
| DC-07 | Authentication must use JWT tokens signed with bcrypt-hashed passwords | Security requirement |
| DC-08 | Patient data must not be processed by AI before explicit consent is captured | Legal / ethical |
| DC-09 | All AI-generated outputs must include a mandatory medical disclaimer | Legal / ethical |
| DC-10 | The Web Speech API must be used for voice input; raw audio must not be stored | Privacy requirement |
| DC-11 | LangGraph must be used as the multi-agent orchestration framework | Architecture decision |
| DC-12 | SQLModel must be used as the ORM | Architecture decision |
| DC-13 | APScheduler must be used for reminder scheduling | Architecture decision |
| DC-14 | All Gemini AI outputs must be validated via Pydantic schemas before use | Quality requirement |
| DC-15 | The system must be deployable via Docker on Hugging Face Spaces | Deployment requirement |

---

### 2.6 Assumptions and Dependencies

| ID | Type | Description |
|----|------|-------------|
| AD-01 | Assumption | Users access MediAssist through a modern, HTTPS-capable web browser |
| AD-02 | Assumption | Uploaded prescription images are reasonably legible (not severely blurred, torn, or rotated) |
| AD-03 | Assumption | Google Gemini API is available with sufficient free-tier or paid quota for prototype use |
| AD-04 | Assumption | Supabase is available and accessible from the backend deployment environment |
| AD-05 | Assumption | Users self-report their symptoms honestly; clinical validation is not performed |
| AD-06 | Assumption | The system operates in an English-language context for Version 1 |
| AD-07 | Dependency | Google Gemini API — all AI features depend on this external service |
| AD-08 | Dependency | Supabase — all data storage and retrieval depends on this service |
| AD-09 | Dependency | Vercel — frontend delivery depends on this hosting platform |
| AD-10 | Dependency | Hugging Face Spaces — backend hosting depends on this platform |
| AD-11 | Dependency | Web Speech API — voice input is not available if the browser does not support it |

---

---

## 3. FUNCTIONAL REQUIREMENTS

> **Priority Scale**:
> - **P1 — Critical**: System cannot function without this requirement
> - **P2 — High**: Core functionality; must be implemented in V1
> - **P3 — Medium**: Important but system can operate without it in limited form

---

### 3.1 Authentication & User Management

---

#### FR-001 — Patient Registration

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-001 |
| **Title** | Patient Registration |
| **Priority** | P1 — Critical |
| **Actor** | Patient |
| **Description** | The system shall allow a new patient to create an account by providing their full name, email address, password, date of birth, gender, and phone number. |
| **Input** | Full name, email, password (min 8 characters), date of birth, gender, phone number |
| **Output** | New patient account created; user redirected to consent screen |
| **Precondition** | Email address is not already registered in the system |
| **Postcondition** | Patient record created in the database; session not started until consent is given |
| **Business Rule** | BR-001, BR-002 |
| **Validation** | Email must be in valid format; password must meet minimum strength requirements; all fields required |

---

#### FR-002 — Patient Consent Capture

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-002 |
| **Title** | Patient Consent Capture |
| **Priority** | P1 — Critical |
| **Actor** | Patient |
| **Description** | Immediately after registration, the system shall present the patient with a consent screen explaining that their medical data will be processed by an AI-assisted system. The patient must explicitly check a consent checkbox before proceeding. Consent must be recorded with a timestamp in the database. |
| **Input** | Consent checkbox (boolean) |
| **Output** | Consent record stored with patient ID and timestamp; patient redirected to patient dashboard |
| **Precondition** | Patient has successfully completed FR-001 |
| **Postcondition** | Patient's `consent_given` field is `true`; `consent_timestamp` is recorded |
| **Business Rule** | BR-003 |
| **Validation** | Consent checkbox must be checked; the system must reject any attempt to proceed without consent |

---

#### FR-003 — Doctor Registration

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-003 |
| **Title** | Doctor Registration |
| **Priority** | P1 — Critical |
| **Actor** | Doctor |
| **Description** | The system shall allow a licensed medical professional to register by providing their full name, email, password, medical specialization, and license number. |
| **Input** | Full name, email, password, specialization, license number |
| **Output** | Doctor account created; user redirected to doctor dashboard |
| **Precondition** | Email address is not already registered |
| **Postcondition** | Doctor record created with `role = doctor` |
| **Business Rule** | BR-001, BR-002 |
| **Validation** | All fields required; email must be valid; license number is stored as provided (no external verification in V1) |

---

#### FR-004 — User Login

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-004 |
| **Title** | User Login |
| **Priority** | P1 — Critical |
| **Actor** | Patient, Doctor |
| **Description** | The system shall authenticate a registered user using their email address and password. On successful authentication, a JWT token shall be issued and stored on the client. The user shall be redirected to the appropriate dashboard based on their role. |
| **Input** | Email, password |
| **Output** | JWT token issued; user redirected to Patient Dashboard or Doctor Dashboard |
| **Precondition** | User account exists; password matches stored bcrypt hash |
| **Postcondition** | Active session established; login event recorded in audit log |
| **Business Rule** | BR-004 |
| **Validation** | Invalid credentials return a generic error message; specific reason (wrong email vs wrong password) not disclosed |

---

#### FR-005 — Role-Based Access Control

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-005 |
| **Title** | Role-Based Access Control (RBAC) |
| **Priority** | P1 — Critical |
| **Actor** | System |
| **Description** | The system shall enforce strict role-based access control. Patients may only access patient-facing routes and their own data. Doctors may only access doctor-facing routes and read-only patient records. All protected API endpoints shall validate the JWT token and user role on every request. |
| **Input** | JWT token on every API request |
| **Output** | Request allowed or rejected with HTTP 401 or HTTP 403 |
| **Precondition** | User is logged in with a valid JWT token |
| **Postcondition** | Unauthorized access attempts are rejected and logged |
| **Business Rule** | BR-005 |

---

#### FR-006 — User Logout

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-006 |
| **Title** | User Logout |
| **Priority** | P1 — Critical |
| **Actor** | Patient, Doctor |
| **Description** | The system shall allow a logged-in user to log out. On logout, the JWT token shall be cleared from the client. The user shall be redirected to the login screen. |
| **Input** | Logout action (button click) |
| **Output** | Token cleared; session ended; user on login screen |
| **Postcondition** | Subsequent requests with the old token are not honored |
| **Business Rule** | BR-004 |

---

#### FR-007 — Profile View and Update

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-007 |
| **Title** | Profile View and Update |
| **Priority** | P2 — High |
| **Actor** | Patient, Doctor |
| **Description** | The system shall allow logged-in users to view and update their profile information (name, phone number, profile picture). Email and role cannot be changed after registration. |
| **Input** | Updated name, phone number, profile picture (optional image upload) |
| **Output** | Updated profile saved; confirmation message displayed |
| **Precondition** | User is logged in |
| **Validation** | Phone number format validated; image file type restricted to JPG, PNG |

---

#### FR-008 — Password Security (Storage)

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-008 |
| **Title** | Password Security — Secure Storage |
| **Priority** | P1 — Critical |
| **Actor** | System |
| **Description** | The system shall never store plaintext passwords. All passwords shall be hashed using bcrypt before storage. Password comparison shall be performed using bcrypt verification. |
| **Input** | Plaintext password during registration or login |
| **Output** | bcrypt hash stored; plaintext password discarded |
| **Business Rule** | BR-006 |

---

### 3.2 Prescription Management

---

#### FR-009 — Prescription Image Upload

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-009 |
| **Title** | Prescription Image Upload |
| **Priority** | P1 — Critical |
| **Actor** | Patient |
| **Description** | The system shall allow a patient to upload a prescription as a JPG, PNG, or PDF file. The file shall be uploaded to Supabase Storage and associated with the patient's account. |
| **Input** | Image or PDF file (max 10MB) |
| **Output** | File stored in Supabase Storage; file URL associated with patient record; prescription extraction triggered |
| **Precondition** | Patient is logged in; patient has given consent (FR-002) |
| **Validation** | Accepted formats: JPG, JPEG, PNG, PDF; max file size: 10MB; file must not be empty |
| **Business Rule** | BR-007 |

---

#### FR-010 — AI-Based Medicine Data Extraction

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-010 |
| **Title** | AI-Based Medicine Data Extraction |
| **Priority** | P1 — Critical |
| **Actor** | System (Prescription Extraction Agent) |
| **Description** | Upon successful upload, the system shall pass the prescription image to the Gemini API via the Prescription Extraction Agent. The agent shall extract: medicine name, dosage, frequency (e.g., twice daily), duration (e.g., 5 days), and any special instructions. The response shall be validated against a Pydantic schema. |
| **Input** | Prescription image URL |
| **Output** | Structured JSON object containing extracted medicine entries |
| **Loading State** | "Reading Prescription... Please wait." |
| **Precondition** | Prescription image successfully uploaded (FR-009) |
| **Error Handling** | If extraction fails or produces invalid output, display a meaningful error; do not save any data |
| **Business Rule** | BR-008, BR-013 |

---

#### FR-011 — Display Extracted Data for User Confirmation

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-011 |
| **Title** | Display Extracted Data for Patient Confirmation |
| **Priority** | P1 — Critical |
| **Actor** | Patient |
| **Description** | The system shall display the AI-extracted medicine data to the patient in an editable review screen before any data is saved. The patient must explicitly confirm or edit the data. The system shall display the message: "Please review the extracted information. Make any corrections before saving." |
| **Input** | Confirmation (button) or corrections (inline edits) |
| **Output** | Patient proceeds to save (FR-012) or returns to upload |
| **Precondition** | FR-010 completed successfully |
| **Business Rule** | BR-009 |

---

#### FR-012 — Manual Correction of Extracted Fields

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-012 |
| **Title** | Manual Correction of Extracted Fields |
| **Priority** | P2 — High |
| **Actor** | Patient |
| **Description** | On the confirmation screen (FR-011), the patient shall be able to edit any extracted field (medicine name, dosage, frequency, duration, special instructions) before saving. |
| **Input** | Edited field values |
| **Output** | Corrected values held in local state pending save |
| **Precondition** | FR-011 screen is displayed |

---

#### FR-013 — Save Confirmed Prescription

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-013 |
| **Title** | Save Confirmed Prescription to Medical History |
| **Priority** | P1 — Critical |
| **Actor** | Patient |
| **Description** | After patient confirmation (FR-011), the system shall save the confirmed medicine list and associated prescription image reference to the patient's medical history. Data shall only be saved after explicit patient confirmation. |
| **Input** | Confirmed (and optionally corrected) extracted data |
| **Output** | Prescription and medicine records saved to database; success confirmation displayed |
| **Precondition** | Patient has clicked Confirm on the review screen |
| **Business Rule** | BR-009 |

---

#### FR-014 — Medicine Explanation After Prescription Save

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-014 |
| **Title** | Medicine Explanation Generation |
| **Priority** | P1 — Critical |
| **Actor** | System (Medicine Explanation Agent) |
| **Description** | Immediately after prescription data is saved (FR-013), the system shall invoke the Medicine Explanation Agent for each medicine in the prescription. The agent shall generate a plain-language explanation of what the medicine does, how to take it, and its common side effects. Each explanation shall include a mandatory medical disclaimer. |
| **Input** | Medicine name, dosage, frequency |
| **Output** | Explanation text per medicine stored and displayed; medical disclaimer appended |
| **Loading State** | "Generating Explanation..." |
| **Business Rule** | BR-010, BR-011 |

---

#### FR-015 — View Prescription Gallery

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-015 |
| **Title** | View Prescription Gallery |
| **Priority** | P2 — High |
| **Actor** | Patient |
| **Description** | The system shall provide a gallery view of all prescription images uploaded by the patient, sorted by upload date (newest first). Each entry shall display a thumbnail, upload date, and the list of extracted medicines. |
| **Input** | Patient's authenticated session |
| **Output** | Paginated list of prescription cards |
| **Precondition** | Patient is logged in; at least one prescription has been saved |

---

#### FR-016 — Medicine Packaging Image Explanation

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-016 |
| **Title** | Medicine Packaging Image Explanation |
| **Priority** | P2 — High |
| **Actor** | Patient |
| **Description** | The system shall allow a patient to upload an image of medicine packaging (box, blister pack, or label). The Medicine Explanation Agent shall identify the medicine from the image and return a plain-language explanation. A medical disclaimer shall be included. |
| **Input** | Medicine packaging image (JPG, PNG, max 10MB) |
| **Output** | Medicine name identified; plain-language explanation displayed; disclaimer shown |
| **Loading State** | "Reading Medicine Packaging..." |
| **Business Rule** | BR-010, BR-011 |

---

### 3.3 Medicine Explanation

---

#### FR-017 — Plain-Language Medicine Explanation

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-017 |
| **Title** | Plain-Language Medicine Explanation |
| **Priority** | P1 — Critical |
| **Actor** | System (Medicine Explanation Agent) |
| **Description** | For every medicine explanation request (from prescription or packaging image), the system shall produce output in simple, jargon-free language. The explanation shall include: (a) what the medicine is for, (b) how to take it, (c) common side effects in plain terms, and (d) any important warnings. |
| **Output** | Structured explanation with four sections; each response validated by Pydantic schema |
| **Business Rule** | BR-010, BR-011, BR-013 |

---

#### FR-018 — Medical Disclaimer on All AI Outputs

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-018 |
| **Title** | Mandatory Medical Disclaimer |
| **Priority** | P1 — Critical |
| **Actor** | System |
| **Description** | Every screen that displays AI-generated medical content (medicine explanations, symptom analysis results, patient summaries) shall include the following disclaimer, rendered in a clearly visible but non-intrusive style: "MediAssist is an AI-powered assistant designed to help you better understand your health information. It does not provide medical diagnoses, prescriptions, or clinical advice. Always consult a qualified healthcare professional for any medical decisions." |
| **Input** | N/A — always displayed with AI content |
| **Output** | Disclaimer rendered on screen |
| **Business Rule** | BR-010 |

---

#### FR-019 — AI Output Validation

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-019 |
| **Title** | Structured AI Output Validation |
| **Priority** | P1 — Critical |
| **Actor** | System |
| **Description** | Every response from the Gemini API shall be validated against a predefined Pydantic schema before being passed to the frontend. If validation fails, the system shall display a user-friendly error message and log the failure. Raw or unvalidated AI output shall never reach the user interface. |
| **Input** | Raw JSON response from Gemini API |
| **Output** | Validated and structured data object, or error message on failure |
| **Business Rule** | BR-013 |

---

### 3.4 Symptom Analysis

---

#### FR-020 — Text-Based Symptom Input

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-020 |
| **Title** | Text-Based Symptom Input |
| **Priority** | P1 — Critical |
| **Actor** | Patient |
| **Description** | The system shall provide a multi-line text input field where a patient can describe their current symptoms in their own words. The field shall support a minimum of 500 characters. |
| **Input** | Free-text symptom description (min 10 characters, max 2000 characters) |
| **Output** | Text submitted to Triage Agent for analysis |
| **Validation** | Input must not be blank; minimum 10 characters required |

---

#### FR-021 — Voice-Based Symptom Input

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-021 |
| **Title** | Voice-Based Symptom Input |
| **Priority** | P2 — High |
| **Actor** | Patient |
| **Description** | The system shall provide a microphone button on the Symptom Checker screen. When activated, the Web Speech API shall record and transcribe the patient's spoken symptoms into the text input field in real time. The patient shall be able to review and edit the transcribed text before submitting. Raw audio must not be stored. |
| **Input** | Spoken audio captured by Web Speech API |
| **Output** | Transcribed text populated in the symptom input field |
| **Precondition** | Browser supports Web Speech API; user grants microphone permission; HTTPS connection active |
| **Error Handling** | If Web Speech API is unavailable, display a fallback message: "Voice input is not supported in your browser. Please type your symptoms." |
| **Business Rule** | BR-014 |

---

#### FR-022 — Triage Agent Severity Classification

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-022 |
| **Title** | Triage Agent Symptom Severity Classification |
| **Priority** | P1 — Critical |
| **Actor** | System (Triage Agent) |
| **Description** | The system shall pass submitted symptom text to the Triage Agent. The Triage Agent shall classify the severity as one of four levels: MILD, MODERATE, SEVERE, or EMERGENCY. The classification shall be returned as a validated structured JSON object. Routing of the next step is determined by this classification. |
| **Input** | Symptom description text |
| **Output** | Severity level (MILD / MODERATE / SEVERE / EMERGENCY); confidence indicator |
| **Loading State** | "Analyzing Symptoms..." |
| **Business Rule** | BR-012, BR-013 |

---

#### FR-023 — Symptom Guidance for Mild and Moderate Severity

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-023 |
| **Title** | Symptom Guidance — Mild and Moderate |
| **Priority** | P1 — Critical |
| **Actor** | System (Symptom Analysis Agent) |
| **Description** | When the Triage Agent classifies symptoms as MILD or MODERATE, the system shall invoke the Symptom Analysis Agent to generate general, informational guidance in plain language. The guidance shall explain what the symptoms may generally relate to, suggest common self-care measures, and advise the patient to consult a doctor if symptoms persist. A medical disclaimer shall be appended. |
| **Input** | Symptom text; severity = MILD or MODERATE |
| **Output** | Plain-language guidance paragraph; medical disclaimer |
| **Business Rule** | BR-010, BR-011, BR-012 |

---

#### FR-024 — Emergency Alert for Severe Symptoms

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-024 |
| **Title** | Emergency Alert — Severe and Emergency Severity |
| **Priority** | P1 — Critical |
| **Actor** | System |
| **Description** | When the Triage Agent classifies symptoms as SEVERE or EMERGENCY, the system shall immediately display a high-visibility emergency alert. The alert shall: (a) use a prominent red banner with a warning icon, (b) display the message: "Your symptoms may require immediate medical attention. Please call your doctor or go to the nearest emergency room immediately. In case of emergency, call 112.", (c) not attempt to further explain or minimize the symptoms. No additional AI analysis shall be invoked for SEVERE or EMERGENCY classifications. |
| **Input** | Severity = SEVERE or EMERGENCY |
| **Output** | Emergency alert banner displayed prominently |
| **Business Rule** | BR-012 |

---

#### FR-025 — Save Symptom Analysis to History

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-025 |
| **Title** | Save Symptom Analysis to Patient History |
| **Priority** | P2 — High |
| **Actor** | System |
| **Description** | After every symptom analysis (regardless of severity), the system shall save the symptom description, the severity classification, the generated guidance (if any), and the analysis timestamp to the patient's symptom history. |
| **Input** | Symptom text, severity level, guidance text, timestamp |
| **Output** | Symptom log entry stored in database |
| **Precondition** | Patient is logged in; analysis completed |

---

### 3.5 Medical History

---

#### FR-026 — Medical History Timeline View

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-026 |
| **Title** | Medical History — Chronological Timeline |
| **Priority** | P2 — High |
| **Actor** | Patient |
| **Description** | The system shall provide a timeline view of the patient's medical history showing all entries (prescriptions, symptom analyses, and saved medicines) in reverse chronological order (newest first). Each entry shall display the date, entry type, and a brief summary. |
| **Input** | Patient's authenticated session |
| **Output** | Chronological list of medical history entries |

---

#### FR-027 — Medicine List View

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-027 |
| **Title** | Active and Past Medicine List |
| **Priority** | P2 — High |
| **Actor** | Patient |
| **Description** | The system shall provide a dedicated medicines list screen showing all medicines saved by the patient, separated into Active (currently within the prescription duration) and Past (expired or completed) sections. Each entry shall display medicine name, dosage, frequency, and duration. |
| **Input** | Patient's authenticated session |
| **Output** | Medicine list with active and past sections |

---

#### FR-028 — Symptom History Log

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-028 |
| **Title** | Symptom History Log |
| **Priority** | P2 — High |
| **Actor** | Patient |
| **Description** | The system shall provide a log of all past symptom analyses, displaying the date, a summary of the symptoms described, and the severity classification for each entry. |
| **Input** | Patient's authenticated session |
| **Output** | Symptom log entries in reverse chronological order |

---

#### FR-029 — Basic History Filtering

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-029 |
| **Title** | Basic History Filtering |
| **Priority** | P3 — Medium |
| **Actor** | Patient |
| **Description** | The system shall allow the patient to filter their medical history by entry type (Prescriptions / Medicines / Symptoms) and by date range. |
| **Input** | Filter selections |
| **Output** | Filtered history list |

---

### 3.6 Medication Reminders

---

#### FR-030 — Set Medication Reminder

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-030 |
| **Title** | Set Medication Reminder |
| **Priority** | P1 — Critical |
| **Actor** | Patient |
| **Description** | The system shall allow a patient to set one or more medication reminders for each medicine. Each reminder shall include: medicine name, dose description, reminder time (hours and minutes), and frequency (daily, specific days of the week). The reminder shall be scheduled using APScheduler. |
| **Input** | Medicine name, dose description, reminder time, frequency |
| **Output** | Reminder created and scheduled; success confirmation |
| **Precondition** | Patient is logged in |

---

#### FR-031 — Suggest Reminders from Prescription

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-031 |
| **Title** | Suggest Reminders from Prescription Data |
| **Priority** | P2 — High |
| **Actor** | System (Reminder Agent) |
| **Description** | After a prescription is saved (FR-013), the system shall prompt the patient: "Would you like to set reminders for these medicines?" If the patient confirms, the Reminder Agent shall suggest reminder times based on a predefined frequency mapping (OD → once daily, BD → twice daily, TDS → three times daily, QID → four times daily, SOS → as needed, etc.). This mapping is implemented as Python business logic — no AI call is made. The patient may accept or modify the suggestions before saving. |
| **Input** | Confirmed prescription medicine list with frequency |
| **Output** | Suggested reminder schedule displayed for patient review |
| **Loading State** | "Creating Reminders..." |

---

#### FR-032 — Edit Reminder

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-032 |
| **Title** | Edit Medication Reminder |
| **Priority** | P2 — High |
| **Actor** | Patient |
| **Description** | The system shall allow a patient to edit an existing reminder's time or frequency. Changes shall be reflected in APScheduler immediately. |
| **Input** | Updated reminder time and/or frequency |
| **Output** | Reminder updated; schedule updated; success confirmation |

---

#### FR-033 — Delete Reminder

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-033 |
| **Title** | Delete Medication Reminder |
| **Priority** | P2 — High |
| **Actor** | Patient |
| **Description** | The system shall allow a patient to delete a reminder. The reminder shall be removed from the APScheduler job store and the database. |
| **Input** | Reminder deletion confirmation |
| **Output** | Reminder removed; schedule cancelled; success confirmation |

---

#### FR-034 — In-App Reminder Notification

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-034 |
| **Title** | In-App Reminder Notification |
| **Priority** | P1 — Critical |
| **Actor** | System (APScheduler) |
| **Description** | When a scheduled reminder time arrives, the system shall display an in-app notification to the patient if they are logged in and the application is open. The notification shall display: "Time to take your [Medicine Name] [Dose]." |
| **Input** | APScheduler trigger at scheduled time |
| **Output** | In-app notification displayed |
| **Note** | Notifications are delivered in-app only in V1. Push notifications or email are future enhancements. |

---

#### FR-035 — Reminder List View

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-035 |
| **Title** | View All Reminders |
| **Priority** | P2 — High |
| **Actor** | Patient |
| **Description** | The system shall display a list of all active reminders for the patient, organized by time of day. Each entry shall show the medicine name, dose, time, and frequency. |
| **Input** | Patient's authenticated session |
| **Output** | Sorted and grouped reminder list |

---

### 3.7 Doctor Portal

---

#### FR-036 — Patient Search

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-036 |
| **Title** | Patient Search |
| **Priority** | P1 — Critical |
| **Actor** | Doctor |
| **Description** | The system shall allow a doctor to search for patients by name or patient ID. The search shall return a list of matching patient records. Partial name matches shall be supported. |
| **Input** | Search string (name or patient ID) |
| **Output** | List of matching patient result cards |
| **Precondition** | Doctor is logged in |
| **Business Rule** | BR-005 |

---

#### FR-037 — Patient Record View

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-037 |
| **Title** | Full Patient Record View |
| **Priority** | P1 — Critical |
| **Actor** | Doctor |
| **Description** | The system shall allow a doctor to open a patient's full medical record, displaying: current active medicines (name, dosage, frequency), all uploaded prescriptions (with image thumbnails), and recent symptom history entries. Doctor access is read-only. |
| **Input** | Selected patient ID |
| **Output** | Full patient record screen with medicines, prescriptions, and symptoms |
| **Business Rule** | BR-005 |

---

#### FR-038 — AI-Generated Patient Summary

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-038 |
| **Title** | AI-Generated Patient Summary for Doctors |
| **Priority** | P2 — High |
| **Actor** | System (Doctor Summary Agent), Doctor |
| **Description** | When a doctor opens a patient record (FR-037), the system shall invoke the Doctor Summary Agent to generate a concise summary paragraph of the patient's current medical situation. The summary shall include: current medicines, recent symptoms, and any notable patterns. The summary shall include a medical disclaimer. |
| **Input** | Patient's medical history data |
| **Output** | AI-generated summary paragraph displayed at the top of the patient record |
| **Loading State** | "Generating Patient Summary..." |
| **Business Rule** | BR-010, BR-011, BR-013 |

---

#### FR-039 — Doctor Read-Only Access Enforcement

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-039 |
| **Title** | Doctor Read-Only Access Enforcement |
| **Priority** | P1 — Critical |
| **Actor** | System |
| **Description** | The system shall ensure that doctors can only read patient data. Doctors shall have no ability to create, modify, or delete any patient records, prescriptions, symptoms, or reminders. All doctor-facing API endpoints shall be GET-only. |
| **Input** | Doctor's JWT token on any write-type request |
| **Output** | HTTP 403 Forbidden response |
| **Business Rule** | BR-005 |

---

### 3.8 Audit Logging

---

#### FR-040 — Audit Log for Key Actions

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-040 |
| **Title** | Audit Logging — Key User Actions |
| **Priority** | P2 — High |
| **Actor** | System |
| **Description** | The system shall automatically record the following actions to an audit log: user login (success and failure), user logout, prescription upload, prescription save (after confirmation), symptom analysis submission, reminder creation, reminder edit, reminder deletion, and doctor access to a patient record. |
| **Input** | System event trigger |
| **Output** | Audit log entry created with: action type, user ID, timestamp, IP address, and relevant record ID |
| **Business Rule** | BR-015 |

---

#### FR-041 — Audit Log Immutability

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-041 |
| **Title** | Audit Log Immutability |
| **Priority** | P2 — High |
| **Actor** | System |
| **Description** | The audit log table shall be append-only. No API endpoint shall allow updating or deleting audit log records. Application code shall not expose any delete functionality for audit entries. |
| **Business Rule** | BR-015 |

---

#### FR-042 — Timestamps on All Records

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-042 |
| **Title** | Timestamps on All Records |
| **Priority** | P1 — Critical |
| **Actor** | System |
| **Description** | Every record in the database (user, prescription, medicine, symptom log, reminder, audit log) shall include `created_at` and `updated_at` timestamp fields, automatically populated by the system. Timestamps shall be stored in UTC. |
| **Input** | Record creation or update event |
| **Output** | Timestamps set in UTC |

---

---

## 4. NON-FUNCTIONAL REQUIREMENTS

---

### 4.1 Performance

#### NFR-001 — API Response Time (Non-AI Endpoints)

| Attribute | Detail |
|-----------|--------|
| **ID** | NFR-001 |
| **Category** | Performance |
| **Description** | All non-AI API endpoints (authentication, data retrieval, CRUD operations) shall return a response within 500 milliseconds under normal load conditions (up to 50 concurrent users). |
| **Measurement** | Average response time measured via API test suite |
| **Target** | <= 500ms average |

---

#### NFR-002 — AI Endpoint Response Time

| Attribute | Detail |
|-----------|--------|
| **ID** | NFR-002 |
| **Category** | Performance |
| **Description** | All AI-powered endpoints (prescription extraction, medicine explanation, symptom analysis, patient summary) shall return a response within 15 seconds under normal conditions. |
| **Measurement** | Average response time for Gemini API calls measured during testing |
| **Target** | <= 15 seconds average |

---

#### NFR-003 — Frontend Load Time

| Attribute | Detail |
|-----------|--------|
| **ID** | NFR-003 |
| **Category** | Performance |
| **Description** | The patient dashboard and doctor dashboard shall fully load and be interactive within 2 seconds on a standard broadband connection (25 Mbps+). |
| **Measurement** | Lighthouse performance score; Time to Interactive metric |
| **Target** | Time to Interactive <= 2 seconds |

---

### 4.2 Security

#### NFR-004 — Authentication Security

| Attribute | Detail |
|-----------|--------|
| **ID** | NFR-004 |
| **Category** | Security |
| **Description** | All user passwords shall be hashed with bcrypt (minimum cost factor 10) before storage. JWT tokens shall be signed with a secure secret key (min 256-bit). Tokens shall have an expiry of 24 hours. API keys (Gemini, Supabase) shall be stored as environment variables and never committed to version control. |
| **Target** | Zero plaintext passwords in database; zero API keys in source code |

---

#### NFR-005 — Endpoint Authorization

| Attribute | Detail |
|-----------|--------|
| **ID** | NFR-005 |
| **Category** | Security |
| **Description** | Every protected API endpoint shall validate the JWT token and the user's role on every request. Requests with missing, expired, or invalid tokens shall receive HTTP 401. Requests with valid tokens but insufficient role permissions shall receive HTTP 403. |
| **Target** | 100% of protected endpoints covered by JWT middleware |

---

#### NFR-006 — Input Validation and Sanitization

| Attribute | Detail |
|-----------|--------|
| **ID** | NFR-006 |
| **Category** | Security |
| **Description** | All user inputs shall be validated on the backend using Pydantic models before processing. SQL injection prevention is provided by SQLModel's parameterized queries. Text inputs passed to the Gemini API shall be sanitized to remove potential prompt injection patterns. |
| **Target** | Zero SQL injection vulnerabilities; all inputs validated server-side |

---

#### NFR-007 — Data Privacy

| Attribute | Detail |
|-----------|--------|
| **ID** | NFR-007 |
| **Category** | Security / Privacy |
| **Description** | Patient medical data shall only be accessible by the patient themselves and doctors (read-only). No patient data shall be exposed to other patients. Voice input shall be transcribed by the browser's Web Speech API; no raw audio shall be transmitted to or stored by the backend. |
| **Target** | Zero cross-patient data exposure; zero audio stored server-side |

---

### 4.3 Usability

#### NFR-008 — Navigation Simplicity

| Attribute | Detail |
|-----------|--------|
| **ID** | NFR-008 |
| **Category** | Usability |
| **Description** | Any primary feature of MediAssist (prescription upload, symptom check, reminder setting, history view) shall be reachable within 3 clicks or interactions from the respective dashboard. |
| **Target** | All primary features reachable in <= 3 clicks |

---

#### NFR-009 — Clear Loading and Error States

| Attribute | Detail |
|-----------|--------|
| **ID** | NFR-009 |
| **Category** | Usability |
| **Description** | The system shall display a meaningful loading indicator and message for every operation that takes more than 500ms. When an operation fails, the system shall display a user-friendly error message describing what went wrong and what the user can do next. Technical error details (stack traces, error codes) shall not be shown to end users. |
| **Target** | 100% of async operations have loading states; 100% of errors have user-friendly messages |

---

#### NFR-010 — Responsive Design

| Attribute | Detail |
|-----------|--------|
| **ID** | NFR-010 |
| **Category** | Usability |
| **Description** | The application shall be fully functional and visually coherent on screen widths from 320px (mobile) to 1920px (desktop). The layout shall adapt gracefully to different screen sizes without horizontal scrolling on mobile. |
| **Target** | Functional on screens >= 320px wide |

---

### 4.4 Reliability and Availability

#### NFR-011 — System Availability

| Attribute | Detail |
|-----------|--------|
| **ID** | NFR-011 |
| **Category** | Reliability |
| **Description** | The system shall maintain >= 99% uptime during the demonstration and evaluation period. Planned maintenance windows shall be conducted during off-peak hours. |
| **Target** | >= 99% uptime during evaluation period |

---

#### NFR-012 — Graceful Degradation

| Attribute | Detail |
|-----------|--------|
| **ID** | NFR-012 |
| **Category** | Reliability |
| **Description** | If the Gemini API is unavailable or returns an error, the system shall display a user-friendly fallback message ("Our AI service is temporarily unavailable. Please try again in a few minutes.") without crashing or exposing error details. Non-AI features (history view, reminder management) shall continue to function independently of AI service availability. |
| **Target** | Non-AI features remain functional during AI service outages |

---

### 4.5 Maintainability

#### NFR-013 — Code Modularity

| Attribute | Detail |
|-----------|--------|
| **ID** | NFR-013 |
| **Category** | Maintainability |
| **Description** | The backend shall be organized into clearly separated modules: authentication, prescriptions, medicines, symptoms, reminders, doctor portal, agents, and utilities. Each LangGraph agent shall be defined in its own file. Frontend components shall follow a component-per-feature structure. |
| **Target** | No module exceeds 500 lines of code; agents are independently testable |

---

### 4.6 Compatibility

#### NFR-014 — Browser Compatibility

| Attribute | Detail |
|-----------|--------|
| **ID** | NFR-014 |
| **Category** | Compatibility |
| **Description** | The application shall function correctly on the latest two major versions of Google Chrome, Mozilla Firefox, Microsoft Edge, and Apple Safari. |
| **Target** | No critical functionality broken on supported browsers |

---

#### NFR-015 — HTTPS Requirement

| Attribute | Detail |
|-----------|--------|
| **ID** | NFR-015 |
| **Category** | Compatibility / Security |
| **Description** | All communication between the frontend and backend shall be over HTTPS (TLS 1.2 or higher). HTTP connections shall not be accepted. The Web Speech API requires HTTPS and shall not function on HTTP. |
| **Target** | 100% of traffic over HTTPS; no HTTP endpoints exposed |

---

---

## 5. EXTERNAL INTERFACE REQUIREMENTS

### 5.1 User Interface Requirements

| Requirement | Description |
|------------|-------------|
| UI-01 | The application shall use a consistent design system (Tailwind CSS + shadcn/ui components) across all screens |
| UI-02 | All interactive elements (buttons, inputs, links) shall have visible hover and focus states |
| UI-03 | The color system shall provide sufficient contrast (minimum WCAG 2.1 AA: 4.5:1 for normal text) |
| UI-04 | The application shall support a dark mode theme toggle |
| UI-05 | Typography shall use a professional web font (e.g., Inter or similar from Google Fonts) |
| UI-06 | All transitions and animations shall be implemented with Framer Motion for smooth, polished interactions |
| UI-07 | Icons shall use Lucide Icons exclusively for visual consistency |
| UI-08 | Emergency alert banners shall use a red background with a warning icon, making them unmistakably distinct from all other UI elements |
| UI-09 | Medical disclaimers shall appear in every AI result screen in a clearly visible but non-intrusive style (e.g., muted border card at the bottom of the result) |
| UI-10 | Loading states shall use animated spinners or skeleton screens with descriptive text messages |

---

### 5.2 Hardware Interface Requirements

| Requirement | Description |
|------------|-------------|
| HW-01 | The application requires no specialized hardware beyond a standard device with a web browser |
| HW-02 | For voice input (FR-021), the device must have a functional microphone accessible to the browser |
| HW-03 | For prescription image upload (FR-009), the device must have a camera or file system access |
| HW-04 | Minimum recommended screen size: 5-inch mobile display (320px width) |

---

### 5.3 Software Interface Requirements

| External System | Interface Type | Purpose |
|----------------|---------------|---------|
| **Google Gemini API** | REST API over HTTPS | Multimodal AI inference for prescription extraction, medicine explanation, symptom analysis, and patient summaries |
| **Supabase PostgreSQL** | Supabase Python client / asyncpg | Relational data storage (users, prescriptions, medicines, symptoms, reminders, audit log) |
| **Supabase Storage** | Supabase Storage API | Secure storage and retrieval of prescription image files |
| **Web Speech API** | Browser-native API | Voice-to-text transcription for symptom input |
| **APScheduler** | Python library (in-process) | Scheduling and firing medication reminder notifications |

#### 5.3.1 Google Gemini API Interface

| Attribute | Detail |
|-----------|--------|
| **Provider** | Google AI Studio / Google Cloud |
| **Model** | gemini-2.5-flash (multimodal) |
| **Input Modalities** | Text, images (prescription scans, packaging photos) |
| **Output Format** | Structured JSON as specified in agent prompts |
| **Authentication** | API key, stored as environment variable on backend |
| **Error Handling** | HTTP errors (429 rate limit, 500 server error) handled with user-friendly fallback message |
| **Validation** | All outputs validated via Pydantic schemas before use |

---

### 5.4 Communication Interface Requirements

| Requirement | Description |
|------------|-------------|
| COM-01 | All client-server communication shall use HTTPS (TLS 1.2+) |
| COM-02 | The frontend shall communicate with the backend via RESTful HTTP requests with JSON payloads |
| COM-03 | Authentication tokens (JWT) shall be transmitted in the Authorization header as Bearer tokens |
| COM-04 | File uploads (prescriptions, images) shall use multipart/form-data encoding |
| COM-05 | CORS policy on the backend shall restrict allowed origins to the deployed frontend domain only |
| COM-06 | All API responses shall use standard HTTP status codes (200, 201, 400, 401, 403, 404, 422, 500) |

---

---

## 6. SYSTEM FEATURES

> This section summarizes MediAssist's system features at a higher level of abstraction, mapping to the functional requirements defined in Section 3.

---

### Feature F1 — User Authentication and Role Management

**Description**: Provides secure registration, login, logout, and profile management for patients and doctors. Enforces role-based access control across all features.

**Linked Requirements**: FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008

**Priority**: P1 — Critical

---

### Feature F2 — Prescription Upload and AI Extraction

**Description**: Enables patients to upload prescription images, have them processed by the AI Prescription Extraction Agent, review the extracted data, make corrections, and confirm before saving. Ensures data is never saved without patient approval.

**Linked Requirements**: FR-009, FR-010, FR-011, FR-012, FR-013

**Priority**: P1 — Critical

---

### Feature F3 — Medicine Explanation

**Description**: Generates plain-language explanations of medicines from prescription data or medicine packaging images. Includes usage instructions, side effects, and a mandatory medical disclaimer.

**Linked Requirements**: FR-014, FR-016, FR-017, FR-018, FR-019

**Priority**: P1 — Critical

---

### Feature F4 — Symptom Analysis with Triage

**Description**: Accepts symptom input via text or voice, routes to the Triage Agent for severity classification, and delivers either plain-language guidance (mild/moderate) or an emergency alert (severe/emergency). All results are logged to history.

**Linked Requirements**: FR-020, FR-021, FR-022, FR-023, FR-024, FR-025

**Priority**: P1 — Critical

---

### Feature F5 — Personal Medical History

**Description**: Maintains a chronological record of a patient's prescriptions, saved medicines, and symptom analyses. Provides filtering by type and date range.

**Linked Requirements**: FR-026, FR-027, FR-028, FR-029, FR-015

**Priority**: P2 — High

---

### Feature F6 — Medication Reminder Management

**Description**: Allows patients to create, view, edit, and delete medication reminders. Reminders are scheduled via APScheduler and delivered as in-app notifications. The Reminder Agent can suggest reminders from prescription data.

**Linked Requirements**: FR-030, FR-031, FR-032, FR-033, FR-034, FR-035

**Priority**: P1 — Critical

---

### Feature F7 — Doctor Portal

**Description**: Provides doctors with a read-only view of patient records including active medicines, prescriptions, and symptom history. Generates an AI patient summary to reduce pre-consultation review time.

**Linked Requirements**: FR-036, FR-037, FR-038, FR-039

**Priority**: P2 — High

---

### Feature F8 — Audit Logging and Transparency

**Description**: Records key user and system actions to an immutable audit log. Timestamps all records in UTC. Supports transparency and developer review.

**Linked Requirements**: FR-040, FR-041, FR-042

**Priority**: P2 — High

---

---

## 7. USE CASES

> **Notation**: Each use case follows the standard IEEE/UML use case template.

---

### 7.1 Use Case Diagram — System Overview

```
  ┌─────────────────────────────────────────────────────────────────────────┐
  │                          MEDIASSIST SYSTEM                              │
  │                                                                         │
  │   ┌─────────────────────────────┐   ┌───────────────────────────────┐  │
  │   │       PATIENT PORTAL        │   │        DOCTOR PORTAL          │  │
  │   │                             │   │                               │  │
  │   │  ○ Register & Consent       │   │  ○ Register / Login           │  │
  │   │  ○ Login / Logout           │   │  ○ Search Patient             │  │
  │   │  ○ Upload Prescription      │   │  ○ View Patient Record        │  │
  │   │  ○ Review & Confirm Data    │   │  ○ View AI Patient Summary    │  │
  │   │  ○ View Medicine Explanation│   │                               │  │
  │   │  ○ Check Symptoms           │   └─────────────┬─────────────────┘  │
  │   │  ○ View Medical History     │                 │                    │
  │   │  ○ Manage Reminders         │                 │                    │
  │   │  ○ Update Profile           │                 │                    │
  │   └──────────────┬──────────────┘                 │                    │
  │                  │                                 │                    │
  └──────────────────┼─────────────────────────────────┼────────────────────┘
                     │                                 │
           ┌─────────▼─────────┐             ┌────────▼──────────┐
           │   <<actor>>       │             │    <<actor>>      │
           │     Patient       │             │      Doctor       │
           └───────────────────┘             └───────────────────┘

  ┌──────────────────────────────────────────────────────────────────────────┐
  │                        SUPPORTING SYSTEMS                                │
  │                                                                          │
  │  <<external>>              <<external>>         <<internal>>             │
  │  Google Gemini API         Supabase              APScheduler             │
  │  (AI Inference)            (Data + Storage)      (Reminders)             │
  └──────────────────────────────────────────────────────────────────────────┘
```

---

### UC-001 — Patient Registration with Consent

| Field | Detail |
|-------|--------|
| **Use Case ID** | UC-001 |
| **Use Case Name** | Patient Registration with Consent |
| **Actor** | Patient |
| **Goal** | Patient creates an account and gives explicit consent for AI data processing |
| **Preconditions** | Patient does not have an existing account; internet connection available |
| **Trigger** | Patient clicks "Register" on the landing page |

**Main Success Flow**:

```
1. Patient opens MediAssist and clicks "Register as Patient"
2. System displays the patient registration form
3. Patient enters: full name, email, password, date of birth, gender, phone number
4. Patient clicks "Create Account"
5. System validates all fields (format, uniqueness, strength)
6. System creates the patient record with role = patient
7. System redirects to the Consent Screen
8. System displays the consent statement and checkbox
9. Patient reads the consent text and checks the checkbox
10. Patient clicks "I Agree and Continue"
11. System records consent with timestamp
12. System issues JWT token and redirects to Patient Dashboard
```

**Alternative Flows**:

- **A1 (Email already registered)**: At step 5, system displays: "An account with this email already exists. Please log in."
- **A2 (Password too weak)**: At step 5, system displays inline validation: "Password must be at least 8 characters."
- **A3 (Consent not given)**: At step 10, if checkbox is unchecked, system displays: "You must agree to the terms to continue."

**Postconditions**: Patient account exists in the database with `consent_given = true` and `consent_timestamp` recorded.

---

### UC-002 — Upload and Understand a Prescription

| Field | Detail |
|-------|--------|
| **Use Case ID** | UC-002 |
| **Use Case Name** | Upload and Understand a Prescription |
| **Actor** | Patient |
| **Goal** | Patient uploads a prescription, confirms extracted data, and receives medicine explanations |
| **Preconditions** | Patient is logged in; patient has given consent |
| **Trigger** | Patient clicks "Upload Prescription" from the dashboard |

**Main Success Flow**:

```
1. Patient navigates to the Upload Prescription screen
2. Patient selects or photographs a prescription image (JPG, PNG, or PDF)
3. System displays: "Reading Prescription... Please wait."
4. System uploads image to Supabase Storage
5. System invokes the Prescription Extraction Agent via Gemini API
6. Agent returns a validated structured list of medicines
7. System displays the extracted data in an editable review form
8. System displays: "Please review the extracted information. Make any corrections before saving."
9. Patient reviews; optionally edits fields; clicks "Confirm and Save"
10. System saves prescription record and medicine entries to database
11. System invokes the Medicine Explanation Agent for each medicine
12. System displays: "Generating Explanation..."
13. System displays plain-language explanations with medical disclaimer
14. System prompts: "Would you like to set reminders for these medicines?"
15. Patient clicks "Yes" and is guided to set reminder times
16. System schedules reminders via APScheduler
```

**Alternative Flows**:

- **A1 (AI extraction fails)**: At step 6, if extraction fails validation, system displays: "We could not read this prescription. Please try uploading a clearer image or enter the medicines manually."
- **A2 (Patient corrects data)**: At step 9, patient edits fields before saving; corrected data is saved.
- **A3 (Patient declines reminders)**: At step 14, patient clicks "No thanks" — reminder setup skipped.
- **A4 (File too large)**: At step 2, file > 10MB: "File size exceeds the 10MB limit. Please upload a smaller file."

**Postconditions**: Prescription and medicines saved in database; explanations generated; reminders optionally scheduled; prescription upload logged in audit log.

---

### UC-003 — Analyze Symptoms

| Field | Detail |
|-------|--------|
| **Use Case ID** | UC-003 |
| **Use Case Name** | Symptom Analysis |
| **Actor** | Patient |
| **Goal** | Patient receives severity-based guidance on their symptoms |
| **Preconditions** | Patient is logged in |
| **Trigger** | Patient navigates to "Symptom Checker" |

**Main Success Flow (Mild/Moderate)**:

```
1. Patient navigates to the Symptom Checker screen
2. Patient types or speaks their symptoms
   (If voice: Patient clicks microphone → speaks → text transcribed by Web Speech API)
3. Patient clicks "Analyze Symptoms"
4. System displays: "Analyzing Symptoms..."
5. System passes symptom text to the Triage Agent
6. Triage Agent returns severity = MILD or MODERATE
7. System invokes the Symptom Analysis Agent
8. Agent returns plain-language guidance
9. System displays guidance with medical disclaimer
10. Symptom entry (text + severity + guidance) saved to patient history
```

**Alternative Flow (Severe/Emergency)**:

```
At step 6, if Triage Agent returns SEVERE or EMERGENCY:
7. System immediately displays the Emergency Alert banner (red, full-width)
   "Your symptoms may require immediate medical attention.
    Please call your doctor or go to the nearest emergency room.
    In case of emergency, call 112."
8. No further AI analysis is performed
9. Symptom entry (text + EMERGENCY severity) saved to history
```

**Alternative Flows**:

- **A1 (Input too short)**: System displays: "Please describe your symptoms in more detail (at least 10 characters)."
- **A2 (Voice not supported)**: Microphone button shows: "Voice input is not supported in your browser. Please type your symptoms."
- **A3 (AI fails)**: System displays: "Symptom analysis is temporarily unavailable. Please try again shortly."

**Postconditions**: Symptom analysis result displayed; entry saved to patient history.

---

### UC-004 — View Medical History

| Field | Detail |
|-------|--------|
| **Use Case ID** | UC-004 |
| **Use Case Name** | View Medical History |
| **Actor** | Patient |
| **Goal** | Patient views a complete record of their healthcare interactions |
| **Preconditions** | Patient is logged in; at least one record exists |
| **Trigger** | Patient clicks "Medical History" in navigation |

**Main Success Flow**:

```
1. Patient navigates to Medical History
2. System retrieves all records for the patient from the database
3. System displays a chronological timeline (newest first) showing:
   - Prescriptions (date uploaded, medicines extracted)
   - Symptom analyses (date, severity, summary)
   - Saved medicines (name, dosage, status)
4. Patient can click any entry to view full details
5. Patient can apply filters: by type (prescriptions/medicines/symptoms) or date range
6. Filtered results update the timeline view
```

**Postconditions**: Patient has reviewed their medical history.

---

### UC-005 — Manage Medication Reminders

| Field | Detail |
|-------|--------|
| **Use Case ID** | UC-005 |
| **Use Case Name** | Manage Medication Reminders |
| **Actor** | Patient |
| **Goal** | Patient creates, edits, and removes medication reminders |
| **Preconditions** | Patient is logged in |
| **Trigger** | Patient navigates to "Reminders" |

**Main Success Flow (Create)**:

```
1. Patient navigates to the Reminders screen
2. Patient views existing reminders (if any)
3. Patient clicks "Add Reminder"
4. Patient enters: medicine name, dose, time, frequency
5. Patient clicks "Save Reminder"
6. System schedules the reminder via APScheduler
7. Reminder appears in the reminder list
```

**Edit Flow**:

```
1. Patient clicks "Edit" on an existing reminder
2. Patient modifies time or frequency
3. Patient clicks "Update"
4. System updates the schedule in APScheduler
```

**Delete Flow**:

```
1. Patient clicks "Delete" on a reminder
2. System asks for confirmation: "Are you sure you want to delete this reminder?"
3. Patient confirms
4. System removes the reminder from APScheduler and the database
```

**Postconditions**: Reminder state reflects patient's actions; APScheduler updated accordingly.

---

### UC-006 — Doctor Views Patient Record

| Field | Detail |
|-------|--------|
| **Use Case ID** | UC-006 |
| **Use Case Name** | Doctor Views Patient Record |
| **Actor** | Doctor |
| **Goal** | Doctor reviews a patient's full medical record before a consultation |
| **Preconditions** | Doctor is logged in; patient exists in the system |
| **Trigger** | Doctor searches for and selects a patient |

**Main Success Flow**:

```
1. Doctor navigates to the Patient Search screen
2. Doctor types patient name or patient ID in the search box
3. System returns a list of matching patients
4. Doctor clicks on the target patient
5. System opens the Patient Record view
6. System invokes the Doctor Summary Agent
7. System displays: "Generating Patient Summary..."
8. AI-generated summary paragraph displayed at the top of the screen
   (with medical disclaimer)
9. Doctor reviews:
   - AI summary paragraph
   - Active medicines (name, dosage, frequency)
   - Uploaded prescriptions (thumbnails, dates)
   - Recent symptom reports (date, severity, summary)
10. Doctor access event logged in audit log
```

**Alternative Flows**:

- **A1 (No matching patients)**: "No patients found matching your search."
- **A2 (AI summary fails)**: "Summary generation is temporarily unavailable." Patient data still displayed.
- **A3 (Patient has no records)**: "This patient has not yet uploaded any prescriptions or symptom analyses."

**Postconditions**: Doctor has reviewed patient record; access logged.

---

### UC-007 — Receive Medication Reminder

| Field | Detail |
|-------|--------|
| **Use Case ID** | UC-007 |
| **Use Case Name** | Receive In-App Medication Reminder |
| **Actor** | Patient, System (APScheduler) |
| **Goal** | Patient receives a timely in-app reminder for a scheduled medication |
| **Preconditions** | Patient has an active reminder scheduled; patient is logged in and the app is open |
| **Trigger** | APScheduler fires at the scheduled reminder time |

**Main Success Flow**:

```
1. APScheduler triggers at the scheduled time
2. System displays an in-app notification:
   "Time to take your [Medicine Name] [Dose]."
3. Patient sees the notification
4. Patient acknowledges the notification (optional)
5. Reminder delivery event logged in audit log
```

**Alternative Flow**:

- **A1 (Patient not logged in)**: Reminder fires but patient is not in the app — notification not displayed. (Push notifications are a future enhancement.)

---

### UC-008 — Doctor Generates AI Patient Summary

| Field | Detail |
|-------|--------|
| **Use Case ID** | UC-008 |
| **Use Case Name** | AI Patient Summary Generation |
| **Actor** | Doctor, System (Doctor Summary Agent) |
| **Goal** | Doctor receives an AI-generated summary to reduce manual review time |
| **Preconditions** | Doctor is logged in; patient record exists and contains at least one medicine or symptom entry |
| **Trigger** | Doctor opens a patient's record (UC-006) |

**Main Success Flow**:

```
1. Doctor opens patient record
2. System collects: active medicines, recent symptoms, all prescriptions
3. System invokes Doctor Summary Agent with collected data
4. Agent generates structured summary JSON
5. System validates summary via Pydantic schema
6. System displays summary paragraph at top of patient record
7. Medical disclaimer rendered below summary
```

**Postconditions**: Doctor has an AI-generated summary to inform their consultation.

---

---

## 8. USER STORIES

> **Format**: As a [role], I want to [action], so that [benefit].
> **Priority**: P1 Critical / P2 High / P3 Medium

---

| ID | Role | Story | Priority | FR Reference |
|----|------|-------|----------|-------------|
| US-001 | Patient | As a patient, I want to register with my name, email, and password so that I can create a personal health account. | P1 | FR-001 |
| US-002 | Patient | As a patient, I want to explicitly consent to AI data processing during registration so that I understand how my health data is used. | P1 | FR-002 |
| US-003 | Doctor | As a doctor, I want to register with my specialization and license number so that I can access patient records securely. | P1 | FR-003 |
| US-004 | Patient / Doctor | As a user, I want to log in with my email and password so that I can securely access my account. | P1 | FR-004 |
| US-005 | Patient / Doctor | As a user, I want to log out of my account so that my session is securely terminated. | P1 | FR-006 |
| US-006 | Patient / Doctor | As a user, I want to update my profile details and picture so that my account information stays current. | P2 | FR-007 |
| US-007 | Patient | As a patient, I want to upload a photo of my prescription so that the system can extract and organize my medicines automatically. | P1 | FR-009, FR-010 |
| US-008 | Patient | As a patient, I want to review and confirm AI-extracted medicine data before it is saved so that no incorrect information is stored in my record. | P1 | FR-011, FR-012, FR-013 |
| US-009 | Patient | As a patient, I want to read a plain-language explanation of each medicine in my prescription so that I understand what I am taking and why. | P1 | FR-014, FR-017 |
| US-010 | Patient | As a patient, I want to upload a photo of a medicine box and get a simple explanation so that I can understand any medicine I encounter. | P2 | FR-016, FR-017 |
| US-011 | Patient | As a patient, I want to describe my symptoms in text and receive guidance on their severity so that I know whether to seek medical attention. | P1 | FR-020, FR-022, FR-023 |
| US-012 | Patient | As a patient, I want to describe my symptoms using my voice so that I can use the symptom checker hands-free. | P2 | FR-021 |
| US-013 | Patient | As a patient, I want to see a clear emergency alert if my symptoms are severe so that I immediately know to seek medical help. | P1 | FR-024 |
| US-014 | Patient | As a patient, I want my symptom analyses to be automatically saved so that I have a complete record of my health concerns over time. | P2 | FR-025 |
| US-015 | Patient | As a patient, I want to view a chronological history of all my prescriptions and symptom analyses so that I have a complete picture of my health journey. | P2 | FR-026, FR-027, FR-028 |
| US-016 | Patient | As a patient, I want to filter my medical history by type and date so that I can quickly find specific records. | P3 | FR-029 |
| US-017 | Patient | As a patient, I want to set medication reminders for each of my medicines so that I never miss a dose. | P1 | FR-030 |
| US-018 | Patient | As a patient, I want the system to suggest reminder times based on my prescription's dosage frequency so that I do not have to figure them out myself. | P2 | FR-031 |
| US-019 | Patient | As a patient, I want to receive an in-app notification when it is time to take my medicine so that I am reminded at the right time. | P1 | FR-034 |
| US-020 | Patient | As a patient, I want to edit or delete my reminders so that I can keep my schedule up to date. | P2 | FR-032, FR-033 |
| US-021 | Doctor | As a doctor, I want to search for a patient by name or ID so that I can quickly access their record before a consultation. | P1 | FR-036 |
| US-022 | Doctor | As a doctor, I want to view an AI-generated summary of a patient's current medicines and recent symptoms so that I can prepare for a consultation efficiently without manually reviewing all records. | P2 | FR-037, FR-038 |

---

---

## 9. ACCEPTANCE CRITERIA

> **Notation**: Acceptance criteria are written in Given / When / Then format.

---

### AC-001 — Patient Registration (US-001, FR-001)

```
GIVEN the registration form is displayed
WHEN the patient fills in all required fields with valid data and clicks "Create Account"
THEN a new patient account is created in the database
AND the patient is redirected to the Consent Screen
AND no session is started until consent is given
```

```
GIVEN the registration form is displayed
WHEN the patient submits an email address already registered in the system
THEN the system displays: "An account with this email already exists. Please log in."
AND no account is created
```

```
GIVEN the registration form is displayed
WHEN the patient submits a password with fewer than 8 characters
THEN the system displays an inline validation error on the password field
AND the form is not submitted
```

---

### AC-002 — Patient Consent (US-002, FR-002)

```
GIVEN the Consent Screen is displayed after registration
WHEN the patient checks the consent checkbox and clicks "I Agree and Continue"
THEN the system records consent_given = true and consent_timestamp in the database
AND the patient is redirected to the Patient Dashboard
```

```
GIVEN the Consent Screen is displayed
WHEN the patient clicks "I Agree and Continue" WITHOUT checking the checkbox
THEN the system displays: "You must agree to the terms to continue."
AND consent is not recorded
AND navigation is blocked
```

---

### AC-003 — Login (US-004, FR-004)

```
GIVEN the login form is displayed
WHEN a registered patient enters correct email and password
THEN the system issues a JWT token
AND redirects to the Patient Dashboard
AND logs the login event in the audit log
```

```
GIVEN the login form is displayed
WHEN a user enters an incorrect password
THEN the system displays a generic error: "Invalid email or password."
AND no token is issued
AND the failed login attempt is logged in the audit log
```

---

### AC-004 — Prescription Upload and AI Extraction (US-007, US-008, FR-009, FR-010, FR-011)

```
GIVEN the patient is on the Upload Prescription screen
WHEN the patient uploads a valid prescription image (JPG, PNG, or PDF under 10MB)
THEN the system displays: "Reading Prescription... Please wait."
AND the image is uploaded to Supabase Storage
AND the Gemini API extracts medicine data
AND the extracted data is validated against the Pydantic schema
AND the confirmation screen is displayed with the extracted fields editable
```

```
GIVEN the confirmation screen is displayed
WHEN the patient clicks "Confirm and Save" without editing
THEN all extracted medicines are saved to the patient's medical history
AND medicine explanations are generated
AND the patient is prompted to set reminders
```

```
GIVEN the confirmation screen is displayed
WHEN the patient edits a field and clicks "Confirm and Save"
THEN the corrected data (not the original AI output) is saved to the database
```

```
GIVEN a prescription image is uploaded
WHEN the Gemini API returns invalid or malformed output
THEN the system displays: "We could not read this prescription. Please try uploading a clearer image."
AND no data is saved to the database
```

---

### AC-005 — Symptom Analysis — Mild/Moderate (US-011, FR-020, FR-022, FR-023)

```
GIVEN the patient has entered a symptom description of at least 10 characters
WHEN the patient clicks "Analyze Symptoms"
THEN the system displays: "Analyzing Symptoms..."
AND the Triage Agent returns a severity classification
AND if severity is MILD or MODERATE, guidance is displayed in plain language
AND a medical disclaimer is displayed below the guidance
AND the symptom entry is saved to the patient's history
```

---

### AC-006 — Symptom Analysis — Emergency (US-013, FR-024)

```
GIVEN the patient has described symptoms
WHEN the Triage Agent returns severity = SEVERE or EMERGENCY
THEN the system immediately displays a full-width red emergency alert banner
AND the alert contains: "Your symptoms may require immediate medical attention. Please call your doctor or go to the nearest emergency room. In case of emergency, call 112."
AND no additional AI analysis or explanation is generated
AND the entry is saved to symptom history with severity = EMERGENCY
```

---

### AC-007 — Medication Reminder (US-017, US-019, FR-030, FR-034)

```
GIVEN the patient is on the Reminders screen
WHEN the patient fills in medicine name, dose, time, and frequency and clicks "Save Reminder"
THEN the reminder is saved to the database
AND scheduled in APScheduler
AND appears in the patient's reminder list
```

```
GIVEN a reminder is scheduled
WHEN the scheduled time arrives and the patient is logged in with the app open
THEN an in-app notification is displayed: "Time to take your [Medicine Name] [Dose]."
AND the reminder delivery is logged in the audit log
```

---

### AC-008 — Doctor Patient Summary (US-022, FR-038)

```
GIVEN the doctor is viewing a patient's record
WHEN the page loads
THEN the system displays: "Generating Patient Summary..."
AND the Doctor Summary Agent generates a validated summary paragraph
AND the summary is displayed at the top of the patient record
AND a medical disclaimer is displayed below the summary
```

```
GIVEN the Doctor Summary Agent fails to generate a summary
WHEN the AI service returns an error
THEN the system displays: "Summary generation is temporarily unavailable."
AND the patient's data (medicines, prescriptions, symptoms) is still displayed
```

---

### AC-009 — Role-Based Access Control (FR-005, FR-039)

```
GIVEN a patient is logged in
WHEN the patient attempts to access a doctor-only endpoint
THEN the system returns HTTP 403 Forbidden
AND the access attempt is logged
```

```
GIVEN a doctor is logged in
WHEN the doctor attempts a write operation on any patient record
THEN the system returns HTTP 403 Forbidden
AND no data is modified
```

---

### AC-010 — Medical Disclaimer (FR-018)

```
GIVEN any AI-generated content is displayed (medicine explanation, symptom guidance, patient summary)
THEN the medical disclaimer must be visible on the same screen
AND the disclaimer cannot be hidden, collapsed, or dismissed by any user action
```

---

---

## 10. BUSINESS RULES

> Business rules define the policies and constraints that govern system behavior independent of specific use cases.

---

| ID | Business Rule | Description |
|----|--------------|-------------|
| **BR-001** | Unique Email Registration | Each email address may be associated with only one account in the system. The system shall reject duplicate email registrations. |
| **BR-002** | Password Minimum Strength | All passwords must be at least 8 characters in length. Strength requirements may be enhanced in future versions. |
| **BR-003** | Consent is Mandatory for Patients | A patient account is not fully active until explicit consent is recorded. AI-powered features are inaccessible without consent. Doctors are not subject to this rule. |
| **BR-004** | Session Token Expiry | JWT tokens expire after 24 hours. Expired tokens shall not grant access. Users must re-authenticate after token expiry. |
| **BR-005** | Strict Role Isolation | Patients and doctors access entirely separate portal views. No API endpoint is shared between roles. Doctors cannot write patient data. Patients cannot access other patients' data. |
| **BR-006** | No Plaintext Password Storage | The system must never store or log a user's plaintext password at any stage, including during transmission, processing, or storage. |
| **BR-007** | Prescription Upload Limit | Supported file formats: JPG, JPEG, PNG, PDF. Maximum file size: 10MB per upload. Files exceeding this limit must be rejected with a clear error message. |
| **BR-008** | AI Extraction Does Not Auto-Save | Extracted prescription data must never be automatically saved to the database. The patient must explicitly confirm the extracted data before any record is created. |
| **BR-009** | Patient Confirmation is Required | Any data derived from AI extraction (medicine names, dosages, frequency) must pass through a patient-facing review and confirmation step before being persisted. |
| **BR-010** | Medical Disclaimer is Mandatory and Non-Dismissible | Every screen presenting AI-generated medical content must display the standard medical disclaimer. No user role or setting may disable or remove this disclaimer. |
| **BR-011** | AI Cannot Diagnose | The system must never present AI output as a diagnosis or a prescription recommendation. Language such as "You have..." or "You should take..." is prohibited. All guidance must be hedged: "This may be related to...", "Some people with similar symptoms..." |
| **BR-012** | Emergency Symptoms Are Never Minimized | When the Triage Agent classifies symptoms as SEVERE or EMERGENCY, the system must display the emergency alert immediately and must not attempt to explain, contextualize, or provide guidance on the symptoms. The system directs the patient to emergency services. |
| **BR-013** | All AI Outputs Must Pass Schema Validation | No response from the Gemini API may be displayed to a user without first passing validation against the corresponding Pydantic schema. Invalid AI responses are discarded and replaced by a user-friendly error message. |
| **BR-014** | No Audio Storage | The Web Speech API processes voice input entirely in the browser. The backend must not receive, process, or store audio data in any form. Only the transcribed text is transmitted to the backend. |
| **BR-015** | Audit Log is Append-Only | The audit log table must only support INSERT operations. UPDATE and DELETE operations on audit log records are prohibited at the application layer. Audit log records must include: user ID, action type, timestamp (UTC), and relevant resource ID. |
| **BR-016** | Doctors Have Read-Only Access | The doctor portal is strictly a read-only view of patient data. No feature in the doctor portal may create, modify, or delete any patient record, prescription, medicine, symptom entry, or reminder. |
| **BR-017** | Timestamps in UTC | All timestamps stored in the database (created_at, updated_at, consent_timestamp, audit timestamps) must be stored in Coordinated Universal Time (UTC). Display conversion to local time is handled on the frontend. |

---

---

## 11. REQUIREMENT TRACEABILITY MATRIX (RTM)

> The RTM maps every functional requirement to its: Feature group, Use Case, User Story, Acceptance Criteria, and related NFRs. This ensures complete coverage and traceability from requirements to implementation and testing.

---

### 11.1 Functional Requirements to Features and Use Cases

| FR ID | Requirement Title | Feature | Use Case | User Story |
|-------|-----------------|---------|----------|-----------|
| FR-001 | Patient Registration | F1 | UC-001 | US-001 |
| FR-002 | Patient Consent Capture | F1 | UC-001 | US-002 |
| FR-003 | Doctor Registration | F1 | — | US-003 |
| FR-004 | User Login | F1 | UC-001 | US-004 |
| FR-005 | Role-Based Access Control | F1 | All UCs | — |
| FR-006 | User Logout | F1 | — | US-005 |
| FR-007 | Profile View and Update | F1 | — | US-006 |
| FR-008 | Password Security | F1 | UC-001 | — |
| FR-009 | Prescription Image Upload | F2 | UC-002 | US-007 |
| FR-010 | AI Medicine Data Extraction | F2 | UC-002 | US-007 |
| FR-011 | Display Extracted Data for Confirmation | F2 | UC-002 | US-008 |
| FR-012 | Manual Correction of Extracted Fields | F2 | UC-002 | US-008 |
| FR-013 | Save Confirmed Prescription | F2 | UC-002 | US-008 |
| FR-014 | Medicine Explanation After Prescription Save | F3 | UC-002 | US-009 |
| FR-015 | View Prescription Gallery | F5 | UC-004 | US-015 |
| FR-016 | Medicine Packaging Image Explanation | F3 | — | US-010 |
| FR-017 | Plain-Language Medicine Explanation | F3 | UC-002 | US-009, US-010 |
| FR-018 | Mandatory Medical Disclaimer | F3, F4, F7 | All AI UCs | — |
| FR-019 | Structured AI Output Validation | All AI features | All AI UCs | — |
| FR-020 | Text-Based Symptom Input | F4 | UC-003 | US-011 |
| FR-021 | Voice-Based Symptom Input | F4 | UC-003 | US-012 |
| FR-022 | Triage Agent Severity Classification | F4 | UC-003 | US-011, US-013 |
| FR-023 | Symptom Guidance — Mild/Moderate | F4 | UC-003 | US-011 |
| FR-024 | Emergency Alert | F4 | UC-003 | US-013 |
| FR-025 | Save Symptom Analysis to History | F4, F5 | UC-003 | US-014 |
| FR-026 | Medical History Timeline View | F5 | UC-004 | US-015 |
| FR-027 | Active and Past Medicine List | F5 | UC-004 | US-015 |
| FR-028 | Symptom History Log | F5 | UC-004 | US-015 |
| FR-029 | Basic History Filtering | F5 | UC-004 | US-016 |
| FR-030 | Set Medication Reminder | F6 | UC-005 | US-017 |
| FR-031 | Suggest Reminders from Prescription | F6 | UC-002, UC-005 | US-018 |
| FR-032 | Edit Reminder | F6 | UC-005 | US-020 |
| FR-033 | Delete Reminder | F6 | UC-005 | US-020 |
| FR-034 | In-App Reminder Notification | F6 | UC-007 | US-019 |
| FR-035 | View All Reminders | F6 | UC-005 | US-017 |
| FR-036 | Patient Search (Doctor) | F7 | UC-006 | US-021 |
| FR-037 | Patient Record View (Doctor) | F7 | UC-006, UC-008 | US-022 |
| FR-038 | AI-Generated Patient Summary | F7 | UC-008 | US-022 |
| FR-039 | Doctor Read-Only Access | F7 | UC-006 | — |
| FR-040 | Audit Log — Key Actions | F8 | All UCs | — |
| FR-041 | Audit Log Immutability | F8 | — | — |
| FR-042 | Timestamps on All Records | F8 | — | — |

---

### 11.2 Functional Requirements to NFRs and Business Rules

| FR ID | Related NFRs | Related Business Rules | Acceptance Criteria |
|-------|-------------|----------------------|---------------------|
| FR-001 | NFR-004, NFR-006 | BR-001, BR-002 | AC-001 |
| FR-002 | NFR-007 | BR-003 | AC-002 |
| FR-003 | NFR-004, NFR-006 | BR-001, BR-002 | AC-001 |
| FR-004 | NFR-004, NFR-005 | BR-004 | AC-003 |
| FR-005 | NFR-005 | BR-005, BR-016 | AC-009 |
| FR-006 | NFR-004 | BR-004 | — |
| FR-007 | NFR-006 | — | — |
| FR-008 | NFR-004 | BR-006 | — |
| FR-009 | NFR-001, NFR-006 | BR-007 | AC-004 |
| FR-010 | NFR-002, NFR-012 | BR-008, BR-013 | AC-004 |
| FR-011 | NFR-008, NFR-009 | BR-008, BR-009 | AC-004 |
| FR-012 | NFR-008 | BR-009 | AC-004 |
| FR-013 | NFR-001 | BR-009 | AC-004 |
| FR-014 | NFR-002, NFR-009 | BR-010, BR-011, BR-013 | AC-004 |
| FR-016 | NFR-002 | BR-010, BR-013 | — |
| FR-017 | NFR-002 | BR-011, BR-013 | AC-004 |
| FR-018 | NFR-009 | BR-010 | AC-010 |
| FR-019 | NFR-012 | BR-013 | AC-004, AC-008 |
| FR-020 | NFR-006, NFR-008 | — | AC-005 |
| FR-021 | NFR-010 | BR-014 | AC-005 |
| FR-022 | NFR-002 | BR-012, BR-013 | AC-005, AC-006 |
| FR-023 | NFR-002, NFR-009 | BR-010, BR-011, BR-012 | AC-005 |
| FR-024 | NFR-009 | BR-012 | AC-006 |
| FR-025 | NFR-001 | — | AC-005 |
| FR-030 | NFR-001, NFR-008 | — | AC-007 |
| FR-031 | NFR-002 | — | — |
| FR-034 | NFR-011 | — | AC-007 |
| FR-036 | NFR-001, NFR-005 | BR-005, BR-016 | — |
| FR-037 | NFR-001, NFR-005 | BR-005, BR-016 | AC-008 |
| FR-038 | NFR-002, NFR-012 | BR-010, BR-011, BR-013 | AC-008 |
| FR-039 | NFR-005 | BR-005, BR-016 | AC-009 |
| FR-040 | NFR-005 | BR-015 | — |
| FR-041 | NFR-005 | BR-015 | — |
| FR-042 | — | BR-017 | — |

---

### 11.3 Non-Functional Requirements Coverage Summary

| NFR ID | Category | FRs Supported | Acceptance Criteria |
|--------|---------|--------------|---------------------|
| NFR-001 | Performance | FR-001 to FR-042 (non-AI) | NFR measured via load testing |
| NFR-002 | Performance | FR-010, FR-014, FR-017, FR-022, FR-038 | AI response time testing |
| NFR-003 | Performance | FR-004, FR-026 | Lighthouse / browser testing |
| NFR-004 | Security | FR-001, FR-004, FR-008 | Penetration check; no plaintext passwords |
| NFR-005 | Security | FR-005, FR-039, FR-040 | All protected endpoints tested |
| NFR-006 | Security | FR-001 to FR-042 | Input validation test suite |
| NFR-007 | Privacy | FR-002, FR-021, FR-025 | Cross-patient data tests; audio not stored |
| NFR-008 | Usability | FR-011, FR-020, FR-030 | UX walkthrough testing |
| NFR-009 | Usability | FR-010, FR-014, FR-022, FR-038 | Loading/error state review |
| NFR-010 | Usability | All frontend FRs | Responsive design testing (320px – 1920px) |
| NFR-011 | Reliability | FR-034 | Uptime monitoring |
| NFR-012 | Reliability | FR-010, FR-022, FR-038 | AI outage simulation tests |
| NFR-013 | Maintainability | All FRs | Code review; module line count |
| NFR-014 | Compatibility | All frontend FRs | Cross-browser testing matrix |
| NFR-015 | Compatibility | All FRs | TLS certificate verification; HTTP blocked |

---

---

> END OF DOCUMENT 1 — SOFTWARE REQUIREMENTS SPECIFICATION
>
> Parent Document  : DOC-0 — Product Requirements Document
> Next Document    : DOC-3 — System Design & Architecture
> All architectural decisions in DOC-3 must satisfy the requirements defined in this SRS.
> All API endpoints in DOC-4 must implement the functional requirements listed in Section 3.
> All test cases must verify the acceptance criteria in Section 9 and the NFR targets in Section 4.
