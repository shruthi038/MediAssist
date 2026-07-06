
# ══════════════════════════════════════════════════════════════════════════════
#
#                           MEDIASSIST
#       A MULTI-AGENT PERSONAL HEALTHCARE ASSISTANT
#
# ══════════════════════════════════════════════════════════════════════════════
#
#  DOCUMENT 0 — PRODUCT REQUIREMENTS DOCUMENT (PRD)
#
#  Project       : MediAssist
#  Document ID   : DOC-0-PRD
#  Version       : 1.1
#  Date          : July 2026
#  AI Model      : gemini-2.5-flash
#
# ══════════════════════════════════════════════════════════════════════════════

---

## TABLE OF CONTENTS

1. [Document Purpose & Scope](#1-document-purpose--scope)
2. [Product Vision](#2-product-vision)
3. [Problem Statement](#3-problem-statement)
4. [Existing Systems & Limitations](#4-existing-systems--limitations)
5. [Proposed System](#5-proposed-system)
6. [Product Goals & Objectives](#6-product-goals--objectives)
7. [Stakeholders](#7-stakeholders)
8. [User Personas](#8-user-personas)
9. [User Journeys](#9-user-journeys)
10. [Core Features (Version 1)](#10-core-features-version-1)
11. [Advanced Features (Version 1)](#11-advanced-features-version-1)
12. [Future Features (Post-Version 1)](#12-future-features-post-version-1)
13. [Success Metrics](#13-success-metrics)
14. [Scope](#14-scope)
15. [Assumptions](#15-assumptions)
16. [Constraints](#16-constraints)

---

---

## 1. DOCUMENT PURPOSE & SCOPE

### 1.1 Purpose

This Product Requirements Document (PRD) defines the product vision, goals, user needs, features, and high-level requirements for **MediAssist** — an AI-powered personal healthcare assistant. It serves as the authoritative reference for all downstream technical and design documentation and is intended to align all stakeholders — developers, designers, and project reviewers — before any implementation begins.

### 1.2 Scope of This Document

This document covers:

- The motivation behind building MediAssist
- The target users and their real-world problems
- The complete feature set for Version 1 of the product
- The boundaries of what MediAssist will and will not do
- The metrics by which the product's success will be measured

This document does **not** cover implementation details, API specifications, database schemas, or code architecture. Those concerns are addressed in subsequent documents (DOC-1 through DOC-10).

### 1.3 Cross-References

| Document | Title |
|----------|-------|
| DOC-1    | Software Requirements Specification |
| DOC-3    | System Design & Architecture |
| DOC-4    | Database & API Design |
| DOC-5    | UI/UX Design |
| DOC-6    | Implementation & Deployment Guide |

---

---

## 2. PRODUCT VISION

### 2.1 Vision Statement

> **MediAssist helps patients understand their prescriptions, medicines, and symptoms in simple, clear language — and gives doctors the concise patient summaries they need to provide better care.**

Every day, millions of patients leave clinics holding prescriptions they cannot read, taking medicines they do not fully understand, and searching unreliable sources when they feel unwell. MediAssist exists to change that. It is a personal healthcare companion that translates complex medical information into plain language, organizes a patient's health records in one place, and keeps them on track with their medications — all through an intelligent, multi-agent system powered by AI.

MediAssist is not a diagnostic tool. It is not a replacement for doctors. The AI is the technology that powers the system — the product itself is a patient-centered tool for understanding, organization, and follow-up care.

### 2.2 Mission

To build a lightweight, accessible, and trustworthy healthcare assistant that:

- Helps patients understand what their prescribed medicines are, what they do, and how to take them
- Explains symptoms in context and helps patients recognize when to seek urgent care
- Keeps patients organized and consistent with their medication schedules
- Provides doctors with structured, AI-generated patient summaries that reduce time spent on routine history review
- Always places patient safety first by directing users to professional medical care for any clinical decision

### 2.3 Core Philosophy

MediAssist is built around three principles:

1. **Assist, Never Diagnose** — Every AI output is advisory and accompanied by a mandatory medical disclaimer. The system explicitly directs users to consult qualified medical professionals for all diagnoses and treatments.

2. **Simplicity Over Complexity** — Medical information should be presented in the simplest possible language. A patient with no medical background should be able to understand what a medicine does, when to take it, and whether their symptoms warrant urgent attention.

3. **Privacy as a Foundation** — Patient medical data is treated with the highest degree of care. All data processing occurs with explicit user consent, and access is strictly role-controlled.

---

---

## 3. PROBLEM STATEMENT

### 3.1 The Core Problem

The average patient, when handed a prescription or discharged from a clinic, faces several immediate challenges:

- **Incomprehensible prescriptions**: Medical prescriptions are written using abbreviations, Latin terms, and shorthand (e.g., "Tab. Amox 500mg TDS x 5 days") that are meaningless to most patients.
- **Forgotten medications**: Medication non-adherence is one of the leading causes of preventable hospitalization. Patients frequently forget doses, skip courses, or take medicines at the wrong time.
- **Symptom uncertainty**: Patients routinely struggle to judge whether a symptom (headache, chest tightness, fatigue) is benign or warrants urgent medical attention.
- **Fragmented medical history**: Most patients have no organized, accessible personal medical record. Records are paper-based, stored in bags, or lost entirely.
- **Limited doctor access**: Doctors in high-volume clinics spend very little time per patient. Patients often leave consultations without fully understanding their condition or treatment.
- **Misinformation from unverified sources**: When patients do not understand a prescription or feel unwell, many turn to random websites, social media forums, or messaging groups for answers. This behavior exposes them to inaccurate, contradictory, or even dangerous health information. MediAssist addresses this directly by providing structured, AI-generated explanations grounded in the patient's own prescription and symptom data — reducing reliance on unverified sources and replacing panic-driven web searches with calm, clear guidance.

### 3.2 The Secondary Problem — Doctor Perspective

Doctors who wish to monitor patients outside clinical visits face:

- No structured view of what medicines a patient is currently taking
- No visibility into patient-reported symptom history
- No concise AI-generated summaries of patient medication adherence
- Manual, time-intensive review of handwritten notes

### 3.3 Who Is Affected

| Affected Party | Pain Point |
|---------------|-----------|
| Patients (general public) | Cannot understand prescriptions or medicines |
| Elderly patients | Particularly vulnerable to medication errors |
| Caregivers | Managing medications for dependents is disorganized |
| General practitioners | No structured view of patient history between visits |

---

---

## 4. EXISTING SYSTEMS & LIMITATIONS

### 4.1 Category: General Health Apps

**Examples**: MyFitnessPal, Apple Health, Google Fit

| Feature | Availability |
|---------|-------------|
| Prescription reading | Not available |
| AI medicine explanation | Not available |
| Symptom severity guidance | Limited |
| Doctor-patient connection | Not available |
| AI-generated summaries for doctors | Not available |

**Limitation**: These applications focus on fitness and wellness. They are not designed for clinical or medication management.

---

### 4.2 Category: Pharmacy Apps

**Examples**: PharmEasy, 1mg, Netmeds

| Feature | Availability |
|---------|-------------|
| Medicine information | Available (product-focused) |
| Prescription upload | For ordering only |
| AI-powered explanation | Not available |
| Medical history storage | Not available |
| Personalized reminders | Limited |
| Doctor summaries | Not available |

**Limitation**: These platforms are e-commerce tools. They display manufacturer-provided technical information and do not explain medicines in patient-friendly language. Prescription upload is for fulfillment, not comprehension.

---

### 4.3 Category: Hospital Management Systems

**Examples**: Practo, Medisoft, Apollo 247

| Feature | Availability |
|---------|-------------|
| Patient records | Available |
| Doctor-patient connection | Available |
| AI medicine explanation | Not available |
| Prescription image understanding | Not available |
| Accessible to individual patients | Requires institutional onboarding |

**Limitation**: These are full hospital-management ecosystems requiring institutional onboarding. They are not accessible to the average patient seeking independent health management.

---

### 4.4 Summary of Market Gap

No existing product combines:

1. Multimodal prescription reading (image to structured data)
2. AI-powered medicine explanation in plain language
3. Intelligent symptom severity guidance with emergency escalation
4. Personal medical history management
5. Medication reminder scheduling
6. AI-generated patient summaries for doctors

MediAssist addresses this precise combination of needs.

---

---

## 5. PROPOSED SYSTEM

### 5.1 What MediAssist Does

MediAssist is a full-stack web application composed of a React frontend and a Python/FastAPI backend, powered by Google's **gemini-2.5-flash** multimodal AI model and orchestrated by a LangGraph-based multi-agent system.

The system serves two distinct user roles:

**Patient Portal**

- Register and log in securely
- Upload prescription images (photos of physical prescriptions or digital files)
- Receive AI-extracted, user-confirmed medicine lists from prescriptions
- Understand what each medicine does in simple language
- Describe symptoms via text or voice and receive severity guidance
- Maintain a personal medical history
- Receive scheduled medication reminders
- View a medical disclaimer with every AI output

**Doctor Portal**

- Register and log in securely
- Search and view patient records
- Review AI-generated patient summaries before consultations, significantly reducing the time spent reviewing patient history and routine medication information
- View uploaded prescriptions and confirmed medicine lists
- Track patient symptom history

### 5.2 What MediAssist Does NOT Do

- Does not diagnose diseases
- Does not prescribe medicines
- Does not replace a licensed physician
- Does not provide real-time clinical monitoring
- The current prototype does not integrate with hospital or pharmacy information systems. Such integrations are considered future enhancements.
- Does not handle emergency dispatch — it advises users to contact emergency services directly

### 5.3 Audit Logging

MediAssist records important user actions — such as login events, prescription uploads, symptom analysis sessions, and reminder modifications — in a dedicated, append-only audit log. This log is not visible to end users but is available to the system for transparency, traceability, and developer review. Audit logging ensures that meaningful interactions with patient data are always accountable and traceable, supporting responsible use of the system.

### 5.4 Mandatory Medical Disclaimer

> "MediAssist is an AI-powered assistant designed to help you better understand your health information. It does not provide medical diagnoses, prescriptions, or clinical advice. Always consult a qualified healthcare professional for any medical decisions."

This disclaimer appears on every screen that displays AI-generated content.

---

---

## 6. PRODUCT GOALS & OBJECTIVES

### 6.1 Product Goals

| ID  | Goal | Description |
|-----|------|-------------|
| G-1 | Prescription Comprehension | Enable patients to understand their prescriptions without medical training |
| G-2 | Medication Adherence | Reduce medication non-adherence through timely, organized reminders |
| G-3 | Symptom Awareness | Help patients gauge the severity of their symptoms and act appropriately |
| G-4 | Personal Health Records | Provide a simple, organized record of a patient's medical history |
| G-5 | Doctor Efficiency | Give doctors a quick, AI-summarized view of patient records |
| G-6 | Safe AI Use | Ensure every AI output is validated, disclaimed, and never presented as clinical truth |

### 6.2 Objectives (SMART)

| ID  | Objective | Measurable Outcome |
|-----|-----------|--------------------|
| O-1 | Enable prescription image upload and AI extraction | Extraction accuracy >= 85% on clear prescription images |
| O-2 | Provide plain-language medicine explanations | Explanation generated within 10 seconds per medicine |
| O-3 | Deliver symptom severity guidance | Correct severity classification in defined test cases |
| O-4 | Schedule and deliver medication reminders | Reminder delivered within 60 seconds of scheduled time |
| O-5 | Maintain structured medical history | All user-confirmed records queryable and displayable |
| O-6 | Protect patient data | 100% authenticated access; zero unauthorized data exposure |
| O-7 | Provide doctors with patient summaries | Summary generated in under 15 seconds |

---

---

## 7. STAKEHOLDERS

### 7.1 Primary Stakeholders

| Stakeholder | Role | Interest |
|------------|------|---------|
| Patients | End users | Understand medicines, track health, receive reminders |
| Doctors / Physicians | Secondary users | View patient records, read AI summaries |
| Development Team | Builders | Implement and maintain the system |

### 7.2 Secondary Stakeholders

| Stakeholder | Role | Interest |
|------------|------|---------|
| Project Supervisor / Reviewer | Academic evaluator | Code quality, documentation, architecture |
| Caregivers | Indirect users | Managing medicines on behalf of elderly dependents |

### 7.3 External Dependencies

| External Party | Role | Risk Level |
|---------------|------|-----------|
| Google Gemini API | AI model provider | Medium — API availability and quotas |
| Supabase | Database and storage provider | Low — reliable managed service |
| Vercel | Frontend hosting | Low — highly available CDN |
| Hugging Face Spaces | Backend hosting | Medium — cold-start latency on free tier |

---

---

## 8. USER PERSONAS

### 8.1 Persona 1 — Priya Sharma (Patient)

```
NAME        : Priya Sharma
AGE         : 34
OCCUPATION  : School Teacher
LOCATION    : Pune, Maharashtra
TECH LEVEL  : Moderate (uses smartphone daily)

BACKGROUND
Priya was recently diagnosed with mild hypertension. Her doctor
prescribed three medicines with complex names. She does not
understand when to take them, what they do, or which side effects
to watch for. She photographs everything but loses paper records.

GOALS
- Understand what each medicine does in simple language
- Never forget a dose
- Keep a digital record of her prescriptions
- Know whether a symptom is serious or not

FRUSTRATIONS
- Medical terms are incomprehensible
- No organized place to store prescriptions
- Afraid to bother the doctor with small questions
- Googling symptoms leads to worst-case panic

HOW MEDIASSIST HELPS
- Scans her prescription and explains each medicine simply
- Sets daily reminders for her medicines
- Tells her whether her symptoms need urgent attention
- Stores all her prescriptions and medical history digitally
```

---

### 8.2 Persona 2 — Ramesh Iyer (Elderly Patient)

```
NAME        : Ramesh Iyer
AGE         : 67
OCCUPATION  : Retired Bank Manager
LOCATION    : Chennai, Tamil Nadu
TECH LEVEL  : Low (assisted by family)

BACKGROUND
Ramesh has diabetes and a cardiac condition. He takes 6 medicines
daily. His son Arjun manages his care. Ramesh forgets his afternoon
doses and sometimes confuses similar-looking tablets.

GOALS
- Never miss a medication
- Know exactly what each tablet is for
- Have his son able to view and manage his medications

FRUSTRATIONS
- Multiple medicines with no clear schedule
- Paper prescriptions get lost
- Cannot read small print on medicine packaging

HOW MEDIASSIST HELPS
- Caregiver (son) uploads medicines; Ramesh gets reminders
- Medicine packaging image leads to simple explanation
- Emergency alert tells Ramesh when to call a doctor immediately
```

---

### 8.3 Persona 3 — Dr. Ananya Mehta (Doctor)

```
NAME        : Dr. Ananya Mehta
AGE         : 41
SPECIALTY   : General Physician
LOCATION    : Bengaluru, Karnataka
TECH LEVEL  : High

BACKGROUND
Dr. Mehta runs a busy outpatient clinic and sees 40+ patients per
day. When a returning patient comes in, she has to rely on patient
memory for medication history. She wishes she had a quick, structured
summary of what medicines the patient is currently on.

GOALS
- Quickly review a patient's current medication list
- Read a concise AI-generated summary before a consultation
- View what symptoms the patient has reported recently

FRUSTRATIONS
- Patients cannot remember what they are taking or the dosage
- No structured patient history between visits
- Reviewing old prescriptions wastes consultation time

HOW MEDIASSIST HELPS
- AI-generated patient summary available before consultation
- Structured medicine list with dosage and frequency
- Recent symptom history at a glance
```

---

### 8.4 Persona 4 — Arjun Iyer (Caregiver)

```
NAME        : Arjun Iyer
AGE         : 38
OCCUPATION  : Software Engineer
RELATIONSHIP: Son of Ramesh Iyer (Elderly Patient)
TECH LEVEL  : High

BACKGROUND
Arjun manages his father's healthcare remotely from another city.
He photographs prescriptions during visits and tries to create
reminders manually. He worries about his father missing doses.

GOALS
- Ensure his father never misses a dose
- Understand what each medicine is prescribed for
- Have a consolidated record of all prescriptions

HOW MEDIASSIST HELPS
- Uploads prescriptions on behalf of patient
- Views full medication history
- Reminders are set and managed through the platform
```

---

---

## 9. USER JOURNEYS

### 9.1 Patient Journey — Prescription Understanding

```
TRIGGER: Patient receives a new prescription from their doctor

STEP 1  Patient opens MediAssist and logs in
        If not registered: Patient registers and provides consent

STEP 2  Patient navigates to Upload Prescription

STEP 3  Patient photographs or uploads the prescription image

STEP 4  MediAssist shows loading state
        "Reading Prescription... Please wait."

STEP 5  Gemini AI extracts medicine names, dosages, and frequency

STEP 6  Extracted information displayed to patient for confirmation
        "Is this information correct? Please review before saving."

STEP 7a Patient confirms → Data saved to medical history
STEP 7b Patient corrects → Edits fields manually → Saves

STEP 8  AI generates a plain-language explanation of each medicine
        "Generating Explanation..."
        Each explanation includes a mandatory medical disclaimer

STEP 9  Patient reads explanations and understands each medicine

STEP 10 MediAssist prompts: "Would you like to set reminders?"
        Patient sets reminder times → "Creating Reminders..."
        Reminders are scheduled in the system

OUTCOME: Patient understands their prescription and has reminders set.
```

---

### 9.2 Patient Journey — Symptom Analysis

```
TRIGGER: Patient is experiencing symptoms and wants guidance

STEP 1  Patient navigates to Symptom Checker

STEP 2  Patient describes symptoms via text input or voice
        Voice input transcribed to text in real time

STEP 3  MediAssist shows loading state
        "Analyzing Symptoms..."

STEP 4  Triage Agent evaluates severity level

STEP 5a Severity = MILD or MODERATE
        AI provides general guidance in plain language
        Mandatory disclaimer displayed
        "Consult a doctor if symptoms persist or worsen."

STEP 5b Severity = SEVERE or EMERGENCY
        System displays EMERGENCY ALERT (prominent red banner)
        "Your symptoms may require immediate medical attention.
         Please call your doctor or visit the nearest emergency room.
         In case of emergency, call 112."
        AI does NOT attempt to explain or minimize the symptoms

STEP 6  Result logged to patient's symptom history

OUTCOME: Patient has actionable guidance and a logged symptom record.
```

---

### 9.3 Doctor Journey — Patient Review

```
TRIGGER: Doctor is about to consult with a patient

STEP 1  Doctor logs into MediAssist (Doctor portal)

STEP 2  Doctor searches for the patient by name or patient ID

STEP 3  Doctor opens patient record

STEP 4  System generates AI summary of patient's medical history
        "Generating Patient Summary..."

STEP 5  Doctor views:
        - Current active medicines (name, dosage, frequency)
        - Uploaded prescriptions (image thumbnails)
        - Recent symptom reports
        - AI-generated summary paragraph

STEP 6  Doctor uses summary to prepare for consultation

OUTCOME: Doctor is well-prepared with structured patient information.
```

---

### 9.4 Patient Journey — Medication Reminder

```
TRIGGER: Scheduled time arrives for a medication dose

STEP 1  APScheduler fires at the scheduled time

STEP 2  In-app notification displayed to patient
        "Time to take your Amlodipine 5mg tablet."

STEP 3  Patient acknowledges the reminder (optional action)

STEP 4  Reminder acknowledgment status logged in audit log

OUTCOME: Patient is reminded and the action is recorded.
```

---

---

## 10. CORE FEATURES (VERSION 1)

### 10.1 Authentication & User Management

| Feature ID    | Feature | Description |
|--------------|---------|-------------|
| F-AUTH-01    | Patient Registration | Email, password, name, date of birth, gender, phone number |
| F-AUTH-02    | Doctor Registration | Email, password, name, specialization, license number |
| F-AUTH-03    | Patient Consent | Mandatory explicit consent checkbox during patient registration |
| F-AUTH-04    | Login | Email and password with JWT authentication |
| F-AUTH-05    | Role-based Access | Patient and Doctor portals are completely separate |
| F-AUTH-06    | Session Management | Token-based session with logout |
| F-AUTH-07    | Profile Management | Update personal details and profile picture |

---

### 10.2 Prescription Management

| Feature ID    | Feature | Description |
|--------------|---------|-------------|
| F-PRESC-01   | Prescription Upload | Upload prescription as image (JPG, PNG) or PDF |
| F-PRESC-02   | AI Extraction | Gemini extracts medicine name, dosage, frequency, duration |
| F-PRESC-03   | User Confirmation | Patient reviews and confirms extracted data before saving |
| F-PRESC-04   | Manual Correction | Patient can edit extracted fields before saving |
| F-PRESC-05   | Save to History | Confirmed prescription saved to patient's medical record |
| F-PRESC-06   | Prescription Gallery | View all uploaded prescription images |
| F-PRESC-07   | Image Storage | Prescription images stored in Supabase Storage |

---

### 10.3 Medicine Explanation

| Feature ID    | Feature | Description |
|--------------|---------|-------------|
| F-MED-01     | Medicine Explanation | AI explains what each medicine does in simple language |
| F-MED-02     | Side Effects Summary | AI lists common side effects in plain language |
| F-MED-03     | Usage Instructions | How and when to take the medicine |
| F-MED-04     | Package Image Upload | Patient can upload medicine packaging image for explanation |
| F-MED-05     | Medical Disclaimer | Every explanation includes a mandatory medical disclaimer |

---

### 10.4 Symptom Analysis

| Feature ID    | Feature | Description |
|--------------|---------|-------------|
| F-SYMP-01    | Text Symptom Input | Patient types symptoms into a text field |
| F-SYMP-02    | Voice Symptom Input | Patient speaks symptoms using Web Speech API |
| F-SYMP-03    | Severity Assessment | AI classifies severity: Mild / Moderate / Severe / Emergency |
| F-SYMP-04    | Emergency Alert | Prominent alert for severe and emergency classifications |
| F-SYMP-05    | General Guidance | AI provides general guidance for mild and moderate severity |
| F-SYMP-06    | Symptom History | All symptom analyses saved to patient record |
| F-SYMP-07    | Medical Disclaimer | Mandatory disclaimer on every symptom analysis result |

---

### 10.5 Medical History

| Feature ID    | Feature | Description |
|--------------|---------|-------------|
| F-HIST-01    | Timeline View | Chronological history of prescriptions, symptoms, and medicines |
| F-HIST-02    | Medicine List | Active and past medicines with dosage and frequency |
| F-HIST-03    | Prescription Archive | All uploaded prescriptions with dates |
| F-HIST-04    | Symptom Log | Dated log of all symptom analysis sessions |
| F-HIST-05    | Basic Filtering | Filter history by date range or type |

---

### 10.6 Medication Reminders

| Feature ID    | Feature | Description |
|--------------|---------|-------------|
| F-REM-01     | Set Reminder | Patient sets reminder for each medicine (time, frequency) |
| F-REM-02     | Edit Reminder | Update reminder time or frequency |
| F-REM-03     | Delete Reminder | Remove a reminder |
| F-REM-04     | In-App Notification | Notification displayed within the application at scheduled time |
| F-REM-05     | Reminder List | View all active reminders organized by time |

---

### 10.7 Doctor Portal

| Feature ID    | Feature | Description |
|--------------|---------|-------------|
| F-DOC-01     | Patient Search | Search patients by name or patient ID |
| F-DOC-02     | Patient Record View | View patient's full medical history |
| F-DOC-03     | AI Patient Summary | AI generates a concise paragraph summary of the patient |
| F-DOC-04     | Prescription View | View uploaded prescriptions and extracted medicine list |
| F-DOC-05     | Symptom History | View recent symptom reports submitted by the patient |

---

### 10.8 Audit & Transparency

| Feature ID    | Feature | Description |
|--------------|---------|-------------|
| F-AUDIT-01   | Action Logging | Log key actions: login, upload, analysis, reminder changes |
| F-AUDIT-02   | Timestamps | All records include creation and update timestamps |
| F-AUDIT-03   | Audit Log Table | Separate database table for immutable action logs |

---

---

## 11. ADVANCED FEATURES (VERSION 1)

These features are included in Version 1 but represent more complex implementations.

### 11.1 Multi-Agent AI Orchestration

The AI backend uses LangGraph to orchestrate a pipeline of specialized agents:

- **Triage Agent** — Entry point for symptom input; determines severity and routing
- **Symptom Analysis Agent** — Provides detailed guidance for mild and moderate cases
- **Prescription Extraction Agent** — Reads and extracts information from prescription images using gemini-2.5-flash multimodal input
- **Medicine Explanation Agent** — Explains medicines in plain language using gemini-2.5-flash
- **Reminder Agent** — Generates reminder schedules from confirmed medicine data using deterministic Python business logic (no AI call)
- **Doctor Summary Agent** — Compiles patient records into a concise AI summary

Each AI agent produces structured, validated output before it is displayed to the user. The Reminder Agent is intentionally implemented without an LLM call, using a predefined frequency mapping (OD, BD, TDS, QID, SOS, etc.) to generate deterministic, reliable reminder schedules via APScheduler.

### 11.2 Multimodal AI Input

MediAssist leverages gemini-2.5-flash's multimodal capabilities to:

- Read and understand prescription images (handwritten or printed)
- Read medicine packaging images and identify the medicine
- Process voice input converted to text by the Web Speech API

### 11.3 Emergency Alert System

When the Triage Agent classifies symptoms as SEVERE or EMERGENCY:

- A high-visibility alert banner is displayed (red background, warning icon)
- The alert explicitly advises the patient to seek immediate medical care
- Emergency contact number (112) is displayed
- No further AI analysis is attempted beyond the severity classification

### 11.4 Structured AI Output Validation

Every agent output is:

1. Generated in a structured JSON format by Gemini
2. Validated against a Pydantic schema on the backend
3. Rejected and replaced with a safe error message if validation fails

This ensures no malformed, incomplete, or hallucinated response ever reaches the user.

### 11.5 Loading States

The following loading states are implemented throughout the application:

| Context | Loading Message |
|---------|----------------|
| Prescription analysis | "Reading Prescription... Please wait." |
| Symptom analysis | "Analyzing Symptoms..." |
| Medicine explanation | "Generating Explanation..." |
| Reminder creation | "Creating Reminders..." |
| Doctor summary generation | "Generating Patient Summary..." |

### 11.6 Error Handling

If any service fails (Gemini API, database, file upload):

- A meaningful error message is displayed to the user
- The system does not expose technical error details to the frontend
- A graceful fallback screen guides the user on next steps
- All errors are logged for developer review

---

---

## 12. FUTURE FEATURES (POST-VERSION 1)

The following features are identified as valuable but are outside the scope of Version 1.

| ID  | Feature | Rationale for Deferral |
|-----|---------|------------------------|
| FF-1 | Doctor and Patient Messaging | Requires real-time communication infrastructure and security review |
| FF-2 | Multi-language Support | Translation management infrastructure needed; scope risk for V1 |
| FF-3 | Progressive Web App with Offline Mode | Service worker complexity deferred |
| FF-4 | User Feedback and AI Improvement | Requires feedback pipeline and AI evaluation loop |
| FF-5 | Export and Print Medical History (PDF) | PDF generation library integration deferred |
| FF-6 | Advanced Search and Filtering | Full-text search implementation deferred to post-V1 |
| FF-7 | Drug-Drug Interaction Checker | Requires validated pharmaceutical database or external API |
| FF-8 | Caregiver-Linked Accounts | Multi-account linking with delegated permissions — architectural extension |
| FF-9 | Appointment Booking | Requires integration with clinic scheduling systems |
| FF-10 | Insurance and Billing Records | Specialized financial compliance requirements |

---

---

## 13. SUCCESS METRICS

### 13.1 Functional Success Criteria

| Metric | Target |
|--------|--------|
| Prescription extraction accuracy (clear images) | >= 85% field-level accuracy |
| AI explanation generation time | <= 10 seconds per medicine |
| Symptom severity classification correctness | >= 90% on predefined test cases |
| Reminder delivery accuracy (within 60 seconds) | >= 95% of scheduled reminders |
| Doctor summary generation time | <= 15 seconds |
| API response time (non-AI endpoints) | <= 500ms average |
| AI endpoint response time | <= 15 seconds average |
| System uptime | >= 99% during demonstration period |

### 13.2 User Experience Success Criteria

| Metric | Target |
|--------|--------|
| Complete prescription workflow (upload to reminder) | <= 3 minutes end-to-end |
| First-time registration including consent | <= 2 minutes |
| Load time for patient dashboard | <= 2 seconds |
| Mobile responsiveness | Functional on screens >= 320px wide |
| Prescription comprehension without additional help | >= 90% of users should be able to understand their prescription explanations without requiring further clarification after a single MediAssist session |

### 13.3 Security and Compliance Success Criteria

| Metric | Target |
|--------|--------|
| Authenticated-only data access | 100% of protected endpoints |
| Patient consent captured before data processing | 100% of patient registrations |
| Medical disclaimer present on all AI outputs | 100% of AI-generated responses |
| Audit log coverage | All key actions logged |

---

---

## 14. SCOPE

### 14.1 In Scope (Version 1)

- Web application (desktop-first, mobile-responsive)
- Patient registration, login, consent management
- Doctor registration and login
- Prescription image upload and AI extraction
- User confirmation step before saving extracted data
- Medicine explanation via text and image
- Symptom analysis with triage and emergency alert
- Medical history (prescriptions, medicines, symptoms)
- Medication reminder scheduling and in-app notifications
- Doctor portal with patient records and AI summaries
- Audit logging of key actions
- Medical disclaimer on all AI-generated content
- Deployment on Vercel (frontend) and Hugging Face Spaces (backend)

### 14.2 Out of Scope (Version 1)

- Real-time doctor-patient messaging
- Multi-language UI
- Offline / Progressive Web App support
- Drug interaction checking
- PDF export of medical records
- Integration with hospital or pharmacy information systems (considered a future enhancement)
- Payment processing or insurance handling
- Native mobile application (iOS or Android)
- Real-time health device monitoring

---

---

## 15. ASSUMPTIONS

| ID  | Assumption |
|-----|-----------|
| A-1 | Users will access MediAssist through a modern web browser |
| A-2 | Prescription images uploaded will be reasonably legible |
| A-3 | The Gemini API will be available with sufficient quota for prototype-scale usage |
| A-4 | Users have a working internet connection for all features |
| A-5 | Doctors will use MediAssist only to view patient records, not to update or prescribe |
| A-6 | The application will be used in an English-language context for Version 1 |
| A-7 | Patient data input is honest — the system does not validate the clinical accuracy of user-entered symptoms |
| A-8 | Supabase free or pro tier is sufficient for the volume of data generated during the internship period |
| A-9 | Hugging Face Spaces (Docker) is sufficient for prototype-level backend hosting |
| A-10 | The Web Speech API is supported by the user's browser |

---

---

## 16. CONSTRAINTS

| ID  | Constraint | Type | Impact |
|-----|-----------|------|--------|
| C-1 | Development is time-constrained to a single semester internship; project is built by a solo developer | Timeline | Sequential development phases; ~7–8 weeks total |
| C-2 | gemini-2.5-flash API rate limits and quotas apply on the free tier | Technical | AI response time and availability may vary |
| C-3 | Hugging Face Spaces has cold-start latency on free tier | Infrastructure | First request after idle period may be slow |
| C-4 | Web Speech API requires HTTPS and browser support | Technical | Voice input unavailable on unsupported browsers |
| C-5 | No institutional hospital data integration is permitted | Legal | Medical data is self-reported by users only |
| C-6 | The system must not store raw audio recordings from voice input | Privacy | Only transcribed text is stored |
| C-7 | All AI outputs must include a mandatory medical disclaimer | Legal / Ethical | Cannot be disabled by any user role |
| C-8 | Patient data may only be processed after explicit consent is recorded | Legal | Consent is a hard gate at registration |
| C-9 | The developer operates on a limited budget using free tiers of all services | Cost | Infrastructure choices constrained to free or low-cost options |
| C-10 | Emergency alerting is advisory only — the system cannot call emergency services | Technical / Legal | Must rely on user to contact emergency services manually |

---

---

> END OF DOCUMENT 0 — PRODUCT REQUIREMENTS DOCUMENT
>
> Next Document: DOC-1 — Software Requirements Specification (SRS)
> Cross-Reference: This document is the authoritative source for all feature definitions.
> All subsequent documents must remain consistent with the scope defined here.
