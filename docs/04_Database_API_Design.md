
# ══════════════════════════════════════════════════════════════════════════════
#
#                              MEDIASSIST
#            A MULTI-AGENT PERSONAL HEALTHCARE ASSISTANT
#
# ══════════════════════════════════════════════════════════════════════════════
#
#  DOCUMENT 4 — DATABASE & API DESIGN
#
#  Project        : MediAssist
#  Document ID    : DOC-4-DAD
#  Version        : 1.1
#  Date           : July 2026
#  AI Model       : gemini-2.5-flash
#
#  Cross-References:
#    DOC-0 (PRD)  — Feature scope and user roles
#    DOC-1 (SRS)  — Functional requirements (FR-001 to FR-042)
#    DOC-3 (SDA)  — System architecture; component model definitions
#
# ══════════════════════════════════════════════════════════════════════════════

---

## TABLE OF CONTENTS

1. [Introduction](#1-introduction)
2. [Database Overview](#2-database-overview)
3. [Database Design](#3-database-design)
4. [Entity Relationship (ER) Diagram](#4-entity-relationship-er-diagram)
5. [Table Structures](#5-table-structures)
   - 5.1 Patients
   - 5.2 Doctors
   - 5.3 Prescriptions
   - 5.4 Medical Records
   - 5.5 Medication Reminders
   - 5.6 AI Interaction History
   - 5.7 Audit Logs
6. [Table Relationships](#6-table-relationships)
7. [API Design](#7-api-design)
   - 7.1 Authentication APIs
   - 7.2 Patient APIs
   - 7.3 Symptom Analysis APIs
   - 7.4 Prescription APIs
   - 7.5 Reminder APIs
   - 7.6 Doctor Dashboard APIs
8. [Authentication Flow (JWT)](#8-authentication-flow-jwt)
9. [Input Validation Rules](#9-input-validation-rules)
10. [Conclusion](#10-conclusion)

---

---

## 1. INTRODUCTION

### 1.1 Purpose

This document defines the complete database schema and API design for MediAssist. It serves as the reference blueprint for all data storage decisions and API contracts between the frontend and backend. Every table and every endpoint in this document maps directly to a functional requirement defined in DOC-1 (SRS).

### 1.2 Scope

This document covers:

- The database platform, structure, and design rationale
- The design of every table, including fields, data types, and relationships
- An entity-relationship diagram of the full schema
- Every API endpoint the backend exposes to the frontend
- The JWT authentication flow
- Input validation rules enforced at the backend

This document does not include source code, SQL scripts, or JSON payload examples.

### 1.3 Design Principles

| Principle | Description |
|-----------|-------------|
| **Simplicity** | Tables are designed to be straightforward and directly mapped to MediAssist features — no unnecessary normalization that adds complexity without benefit |
| **Consistency** | Naming conventions are uniform across all tables (snake_case for column names, plural nouns for table names) |
| **Traceability** | Every table and endpoint is traceable to a functional requirement from DOC-1 |
| **Data Safety** | Patient data is never modified by AI extraction without user confirmation. No sensitive field (passwords, API keys) is stored as plaintext |
| **Timestamps** | All tables include `created_at` and `updated_at` columns, stored in UTC |

---

---

## 2. DATABASE OVERVIEW

### 2.1 Platform

MediAssist uses **Supabase** as its managed database service. Supabase provides:

- A hosted **PostgreSQL 14+** database
- An integrated **Storage** bucket for prescription images and packaging photos
- A built-in client library (Supabase Python SDK) for use in the FastAPI backend
- Row-level security capabilities for future hardening

All structured application data (users, prescriptions, medicines, symptoms, reminders, audit entries) is stored in the PostgreSQL database. All uploaded files (prescription images, medicine packaging photos) are stored in Supabase Storage.

### 2.2 Database Summary

| Attribute | Detail |
|-----------|--------|
| **Database Engine** | PostgreSQL 14+ |
| **Hosting** | Supabase (managed cloud) |
| **ORM** | SQLModel (Python) |
| **Connection** | Supabase PostgreSQL connection string via environment variable |
| **Encoding** | UTF-8 |
| **Timezone** | All timestamps stored in UTC |
| **File Storage** | Supabase Storage (S3-compatible) |

### 2.3 Tables at a Glance

| Table | Purpose | Primary Feature |
|-------|---------|----------------|
| `patients` | Patient accounts, profiles, and consent | Auth, FR-001, FR-002 |
| `doctors` | Doctor accounts and profiles | Auth, FR-003 |
| `prescriptions` | Uploaded prescription image records | FR-009 to FR-013 |
| `medical_records` | Confirmed medicines from prescriptions | FR-013, FR-027 |
| `medication_reminders` | Scheduled medication reminders | FR-030 to FR-035 |
| `ai_interaction_history` | Symptom analyses and medicine explanations | FR-022 to FR-025, FR-017 |
| `audit_logs` | Immutable log of key system actions | FR-040 to FR-042 |

### 2.4 File Storage Structure

Prescription images and medicine packaging photos are stored in Supabase Storage using the following path convention:

```
Bucket: mediassist-uploads
│
├── prescriptions/
│   └── {patient_id}/
│       └── {timestamp}_{original_filename}
│
└── packaging/
    └── {patient_id}/
        └── {timestamp}_{original_filename}
```

Files are stored with private access. The backend generates authenticated URLs when serving files to the frontend.

---

---

## 3. DATABASE DESIGN

### 3.1 Design Decisions

**Separate Patient and Doctor Tables**

Patients and doctors are stored in separate tables rather than a single shared users table. This design was chosen because:
- Patients and doctors have entirely different profile fields (e.g., patients have consent fields and date of birth; doctors have license numbers and specializations)
- Role separation is explicit in the schema, not just a field value — making RBAC enforcement more straightforward
- There is no feature in MediAssist that requires treating patients and doctors as the same entity

**Medical Records as a Separate Table**

Medicines confirmed from prescriptions are stored in a dedicated `medical_records` table rather than embedded in the `prescriptions` table. This is because:
- A single prescription can contain multiple medicines
- Medicines need to be queried independently (e.g., to show the active medicine list in DOC-1, FR-027)
- The separation allows status tracking (active vs. past) per medicine without duplicating prescription data

**AI Interaction History as a Unified Table**

Symptom analyses and medicine explanation requests are stored in a single `ai_interaction_history` table distinguished by an `interaction_type` column. This simplifies the schema for a prototype, as both record a user's AI request and its output.

**Audit Log as Append-Only**

The `audit_logs` table is designed to be INSERT-only. No UPDATE or DELETE operation is ever performed on this table, satisfying FR-041 (audit log immutability) and BR-015.

### 3.2 Naming Conventions

| Convention | Example |
|-----------|---------|
| Table names | `plural_snake_case` → `medical_records` |
| Column names | `snake_case` → `patient_id`, `created_at` |
| Primary keys | `id` (UUID) on all tables |
| Foreign keys | `{referenced_table_singular}_id` → `patient_id` |
| Boolean fields | `is_` prefix → `is_active`, `is_confirmed` |
| Timestamp fields | `_at` suffix → `created_at`, `confirmed_at` |

---

---

## 4. ENTITY RELATIONSHIP (ER) DIAGRAM

```
┌───────────────────────────────────────────────────────────────────────────┐
│                    MEDIASSIST — ENTITY RELATIONSHIP DIAGRAM                │
└───────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐          ┌──────────────────────────┐
│         PATIENTS          │          │         DOCTORS           │
│──────────────────────────│          │──────────────────────────│
│ PK  id (UUID)            │          │ PK  id (UUID)            │
│     full_name            │          │     full_name            │
│     email (UNIQUE)       │          │     email (UNIQUE)       │
│     password_hash        │          │     password_hash        │
│     date_of_birth        │          │     specialization       │
│     gender               │          │     license_number       │
│     phone_number         │          │     phone_number         │
│     profile_picture_url  │          │     profile_picture_url  │
│     consent_given        │          │     created_at           │
│     consent_timestamp    │          │     updated_at           │
│     created_at           │          └──────────────────────────┘
│     updated_at           │
└──────────┬───────────────┘
           │ 1
           │
           │ has many
           │
     ┌─────┴──────────────────────────────────────────────┐
     │                    │                │               │
     │ M                  │ M              │ M             │ M
     ▼                    ▼                ▼               ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
│ PRESCRIPTIONS│  │   MEDICAL    │  │  MEDICATION  │  │  AI INTERACTION  │
│              │  │   RECORDS    │  │  REMINDERS   │  │     HISTORY      │
│──────────────│  │──────────────│  │──────────────│  │──────────────────│
│PK id (UUID)  │  │PK id (UUID)  │  │PK id (UUID)  │  │PK id (UUID)      │
│FK patient_id │  │FK patient_id │  │FK patient_id │  │FK patient_id     │
│   image_url  │  │FK prescrip.. │  │   medicine.. │  │   interaction_.. │
│   status     │  │   medicine.. │  │   dose_desc  │  │   input_text     │
│   is_confirm.│  │   dosage     │  │   reminder.. │  │   image_url      │
│   uploaded_at│  │   frequency  │  │   frequency  │  │   severity       │
│   confirmed_.│  │   duration   │  │   is_active  │  │   ai_output      │
│   created_at │  │   instruct.. │  │   created_at │  │   disclaimer_..  │
│   updated_at │  │   explanat.. │  │   updated_at │  │   analyzed_at    │
└──────────────┘  │   status     │  └──────────────┘  │   created_at     │
      │           │   created_at │                     └──────────────────┘
      │ 1         │   updated_at │
      │           └──────────────┘
      │ has many
      │
      │ M
      ▼
 (MEDICAL RECORDS
  reference back
  via prescription_id)

┌──────────────────────────────────────────┐
│                AUDIT_LOGS                 │
│──────────────────────────────────────────│
│ PK  id (UUID)                            │
│     user_id       (patient or doctor ID) │
│     user_role     (patient / doctor)     │
│     action        (LOGIN, UPLOAD, etc.)  │
│     resource_type (prescription, etc.)   │
│     resource_id   (optional)             │
│     ip_address                           │
│     timestamp     (UTC)                  │
└──────────────────────────────────────────┘
  (No foreign key — append-only, standalone)
```

---

---

## 5. TABLE STRUCTURES

---

### 5.1 Patients

**Purpose**: Stores all patient accounts, including authentication credentials, personal profile information, and consent status. This is the central table for the patient role in MediAssist.

**Referenced by**: `prescriptions.patient_id`, `medical_records.patient_id`, `medication_reminders.patient_id`, `ai_interaction_history.patient_id`

| Field | Data Type | Constraint | Description |
|-------|-----------|-----------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier for the patient |
| `full_name` | VARCHAR(100) | NOT NULL | Patient's full name as entered during registration |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Login email address; must be unique across all patients |
| `password_hash` | VARCHAR(255) | NOT NULL | bcrypt-hashed password; plaintext is never stored |
| `date_of_birth` | DATE | NOT NULL | Patient's date of birth; used for age context |
| `gender` | VARCHAR(20) | NOT NULL | Patient's gender (Male / Female / Other / Prefer not to say) |
| `phone_number` | VARCHAR(20) | NULLABLE | Optional contact phone number |
| `profile_picture_url` | TEXT | NULLABLE | URL to profile image stored in Supabase Storage |
| `consent_given` | BOOLEAN | NOT NULL, DEFAULT FALSE | Whether the patient has given explicit AI data processing consent |
| `consent_timestamp` | TIMESTAMPTZ | NULLABLE | UTC timestamp of when consent was given |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Account creation timestamp (UTC) |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Timestamp of last profile update (UTC) |

---

### 5.2 Doctors

**Purpose**: Stores all doctor accounts, including authentication credentials, professional details, and contact information. Doctors have read-only access to patient records.

| Field | Data Type | Constraint | Description |
|-------|-----------|-----------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier for the doctor |
| `full_name` | VARCHAR(100) | NOT NULL | Doctor's full name as entered during registration |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Login email address; must be unique across all doctors |
| `password_hash` | VARCHAR(255) | NOT NULL | bcrypt-hashed password |
| `specialization` | VARCHAR(100) | NOT NULL | Medical specialization (e.g., General Physician, Cardiologist) |
| `license_number` | VARCHAR(100) | NOT NULL | Medical license number; stored as provided, no external verification in V1 |
| `phone_number` | VARCHAR(20) | NULLABLE | Optional contact phone number |
| `profile_picture_url` | TEXT | NULLABLE | URL to profile image in Supabase Storage |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Account creation timestamp (UTC) |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Timestamp of last profile update (UTC) |

---

### 5.3 Prescriptions

**Purpose**: Records each prescription image uploaded by a patient. Tracks the upload status and whether the extracted data has been confirmed by the patient. The image itself is stored in Supabase Storage; this table holds the metadata and reference URL.

**References**: `patient_id` → `patients.id`
**Referenced by**: `medical_records.prescription_id`

| Field | Data Type | Constraint | Description |
|-------|-----------|-----------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier for the prescription upload |
| `patient_id` | UUID | NOT NULL, FOREIGN KEY → patients.id | The patient who uploaded this prescription |
| `image_url` | TEXT | NOT NULL | Full URL to the prescription image in Supabase Storage |
| `original_filename` | VARCHAR(255) | NULLABLE | Original name of the uploaded file |
| `file_type` | VARCHAR(10) | NOT NULL | File format of the upload (jpg, png, pdf) |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT 'pending' | Lifecycle status: pending / extracted / confirmed / failed |
| `is_confirmed` | BOOLEAN | NOT NULL, DEFAULT FALSE | TRUE only after the patient explicitly confirms extracted data |
| `uploaded_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Timestamp when the image was uploaded (UTC) |
| `confirmed_at` | TIMESTAMPTZ | NULLABLE | Timestamp when the patient confirmed the extracted data (UTC) |
| `notes` | TEXT | NULLABLE | Optional freetext notes the patient may add |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation timestamp (UTC) |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record last updated timestamp (UTC) |

**Status Field Values**:

| Status | Meaning |
|--------|---------|
| `pending` | Image uploaded; AI extraction not yet started |
| `extracted` | AI extraction completed; patient has not confirmed yet |
| `confirmed` | Patient has reviewed and confirmed the extracted data |
| `failed` | AI extraction failed or returned invalid output |

---

### 5.4 Medical Records

**Purpose**: Stores individual medicine entries that have been confirmed by the patient from a prescription. Each row represents one medicine. Multiple medicines from the same prescription each get their own row. This table powers the patient's active medicine list, medicine explanations, and doctor record view.

**References**: `patient_id` → `patients.id`, `prescription_id` → `prescriptions.id`

| Field | Data Type | Constraint | Description |
|-------|-----------|-----------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier for the medicine record |
| `patient_id` | UUID | NOT NULL, FOREIGN KEY → patients.id | The patient this medicine belongs to |
| `prescription_id` | UUID | NULLABLE, FOREIGN KEY → prescriptions.id | The prescription this medicine was extracted from (NULL if added manually) |
| `medicine_name` | VARCHAR(255) | NOT NULL | Name of the medicine as confirmed by the patient |
| `dosage` | VARCHAR(100) | NULLABLE | Dosage amount and unit (e.g., 500mg, 10ml) |
| `frequency` | VARCHAR(100) | NULLABLE | How often the medicine is taken (e.g., twice daily, TDS) |
| `duration` | VARCHAR(100) | NULLABLE | Duration of the course (e.g., 5 days, 1 month) |
| `special_instructions` | TEXT | NULLABLE | Any additional instructions from the prescription |
| `ai_explanation` | TEXT | NULLABLE | AI-generated plain-language explanation of this medicine |
| `status` | VARCHAR(10) | NOT NULL, DEFAULT 'active' | Whether the medicine course is active or past |
| `start_date` | DATE | NULLABLE | Date when the medicine course was started |
| `end_date` | DATE | NULLABLE | Calculated end date based on start date and duration |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation timestamp (UTC) |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record last updated timestamp (UTC) |

**Status Field Values**:

| Status | Meaning |
|--------|---------|
| `active` | Patient is currently taking this medicine |
| `past` | Medicine course has been completed or discontinued |

---

### 5.5 Medication Reminders

**Purpose**: Stores all medication reminders set by patients. Each row represents one scheduled reminder for one medicine. The `reminder_time` and `frequency` fields are used by APScheduler to schedule and fire in-app notifications.

**References**: `patient_id` → `patients.id`

| Field | Data Type | Constraint | Description |
|-------|-----------|-----------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier for the reminder |
| `patient_id` | UUID | NOT NULL, FOREIGN KEY → patients.id | The patient this reminder belongs to |
| `medicine_name` | VARCHAR(255) | NOT NULL | Name of the medicine to be reminded about |
| `dose_description` | VARCHAR(255) | NULLABLE | Human-readable dose description (e.g., "1 tablet", "5ml") |
| `reminder_time` | TIME | NOT NULL | Time of day the reminder fires (HH:MM format, local time) |
| `frequency` | VARCHAR(50) | NOT NULL | How often the reminder repeats (daily, weekdays, specific days) |
| `days_of_week` | VARCHAR(50) | NULLABLE | Comma-separated days if frequency is not daily (e.g., "Mon,Wed,Fri") |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT TRUE | Whether this reminder is currently active |
| `scheduler_job_id` | VARCHAR(255) | NULLABLE | APScheduler job ID used to modify or cancel the scheduled job |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Reminder creation timestamp (UTC) |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last modification timestamp (UTC) |

---

### 5.6 AI Interaction History

**Purpose**: Records every AI-powered interaction a patient has with MediAssist. This covers symptom analysis sessions and medicine explanation requests (from prescription or packaging image). Each row logs the input, the AI output, and the severity level (for symptom analyses). This table drives the patient's symptom log and history views.

**References**: `patient_id` → `patients.id`

| Field | Data Type | Constraint | Description |
|-------|-----------|-----------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier for the AI interaction |
| `patient_id` | UUID | NOT NULL, FOREIGN KEY → patients.id | The patient who initiated this interaction |
| `interaction_type` | VARCHAR(30) | NOT NULL | Type of interaction: symptom_analysis or medicine_explanation |
| `input_text` | TEXT | NULLABLE | The symptom description or medicine name text entered by the patient |
| `image_url` | TEXT | NULLABLE | Supabase Storage URL if the interaction involved an image input |
| `severity` | VARCHAR(20) | NULLABLE | Severity classification (MILD / MODERATE / SEVERE / EMERGENCY) — applies to symptom_analysis only |
| `ai_output` | TEXT | NOT NULL | The full AI-generated response text (guidance, explanation, or error message) |
| `disclaimer_shown` | BOOLEAN | NOT NULL, DEFAULT TRUE | Confirms that the medical disclaimer was displayed with this output |
| `is_emergency` | BOOLEAN | NOT NULL, DEFAULT FALSE | TRUE if the severity was SEVERE or EMERGENCY |
| `analyzed_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Timestamp when the AI analysis was completed (UTC) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation timestamp (UTC) |

**Interaction Type Values**:

| Type | Triggered By |
|------|-------------|
| `symptom_analysis` | Patient submits symptoms on the Symptom Checker screen |
| `medicine_explanation` | Medicine explanation generated after prescription confirmation or packaging image upload |

---

### 5.7 Audit Logs

**Purpose**: Records important system events for transparency and traceability. This table is append-only — no rows are ever updated or deleted. It captures who performed an action, what the action was, on which resource, and when it occurred.

**Note**: This table has no foreign key constraints intentionally, so that audit records are preserved even if the referenced user is ever removed. Audit integrity must not depend on other tables.

| Field | Data Type | Constraint | Description |
|-------|-----------|-----------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier for the audit log entry |
| `user_id` | UUID | NOT NULL | The ID of the patient or doctor who performed the action (no FK — intentional) |
| `user_role` | VARCHAR(10) | NOT NULL | Role of the user at the time of the action (patient / doctor) |
| `action` | VARCHAR(50) | NOT NULL | The action that was performed (see action values below) |
| `resource_type` | VARCHAR(50) | NULLABLE | The type of resource the action was performed on (prescription, reminder, etc.) |
| `resource_id` | UUID | NULLABLE | The ID of the specific resource involved, if applicable |
| `ip_address` | VARCHAR(45) | NULLABLE | IP address of the client at the time of the action |
| `additional_info` | TEXT | NULLABLE | Optional context (e.g., failure reason, severity level) |
| `timestamp` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Exact UTC timestamp of the action |

**Action Values**:

| Action | Triggered When |
|--------|---------------|
| `USER_LOGIN` | Patient or doctor successfully logs in |
| `USER_LOGIN_FAILED` | Login attempt fails (wrong credentials) |
| `USER_LOGOUT` | Patient or doctor logs out |
| `USER_REGISTERED` | New patient or doctor account created |
| `CONSENT_GIVEN` | Patient records consent during registration |
| `PRESCRIPTION_UPLOADED` | Patient uploads a prescription image |
| `PRESCRIPTION_CONFIRMED` | Patient confirms extracted prescription data |
| `SYMPTOM_ANALYZED` | Patient submits a symptom analysis request |
| `EMERGENCY_ALERT_SHOWN` | Triage Agent classifies symptoms as SEVERE or EMERGENCY |
| `REMINDER_CREATED` | Patient creates a new medication reminder |
| `REMINDER_UPDATED` | Patient edits an existing reminder |
| `REMINDER_DELETED` | Patient deletes a reminder |
| `REMINDER_DELIVERED` | APScheduler fires a reminder notification |
| `DOCTOR_ACCESSED_PATIENT` | Doctor opens a patient's record |

---

---

## 6. TABLE RELATIONSHIPS

| Relationship | Type | Description |
|-------------|------|-------------|
| `patients` → `prescriptions` | One-to-Many | A patient can have zero or more prescription uploads. Each prescription belongs to exactly one patient. |
| `patients` → `medical_records` | One-to-Many | A patient can have zero or more confirmed medicine records. Each medical record belongs to one patient. |
| `patients` → `medication_reminders` | One-to-Many | A patient can have zero or more reminders. Each reminder belongs to one patient. |
| `patients` → `ai_interaction_history` | One-to-Many | A patient can have zero or more AI interaction history entries. Each entry belongs to one patient. |
| `prescriptions` → `medical_records` | One-to-Many | A single prescription can result in multiple medicine records (one per medicine extracted). Each medical record optionally references the prescription it came from. |
| `audit_logs` → (all tables) | Standalone | The audit log records user and resource IDs as plain values with no enforced foreign key. This ensures audit records persist independently of other data. |
| `doctors` → (none directly) | None | Doctors have no direct foreign key relationships to patient data. They access patient records through the doctor API, not through a database join. This enforces the read-only, role-controlled access pattern. |

---

---

## 7. API DESIGN

### 7.1 API Overview

The MediAssist backend exposes a RESTful API built with FastAPI. All endpoints are prefixed with `/api/v1`. All protected endpoints require a valid JWT token passed in the `Authorization` header as a Bearer token.

**Base URL (Production)**: `https://{huggingface-space-name}.hf.space/api/v1`
**Base URL (Development)**: `http://localhost:8000/api/v1`

**Common HTTP Status Codes Used**:

| Code | Meaning |
|------|---------|
| 200 | OK — Request succeeded |
| 201 | Created — Resource successfully created |
| 400 | Bad Request — Invalid input data |
| 401 | Unauthorized — Missing or invalid JWT token |
| 403 | Forbidden — Valid token but insufficient role permissions |
| 404 | Not Found — Requested resource does not exist |
| 422 | Unprocessable Entity — Validation error on request body |
| 500 | Internal Server Error — Unexpected backend error |

---

### 7.2 Authentication APIs

These endpoints handle registration, login, logout, and patient consent. They are the only endpoints accessible without authentication.

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|--------------|
| POST | `/auth/register/patient` | Register a new patient account | No |
| POST | `/auth/register/doctor` | Register a new doctor account | No |
| POST | `/auth/login` | Authenticate a user and receive a JWT token | No |
| POST | `/auth/logout` | Log out the current user and invalidate the client token | Yes |
| POST | `/auth/consent` | Record patient consent after registration | Yes (Patient) |

---

### 7.3 Patient APIs

These endpoints manage the authenticated patient's profile and provide access to their medical history.

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|--------------|
| GET | `/patient/profile` | Retrieve the logged-in patient's profile information | Yes (Patient) |
| PUT | `/patient/profile` | Update the patient's name, phone number, or profile picture | Yes (Patient) |
| GET | `/patient/history` | Retrieve the patient's full medical history (prescriptions, symptoms, medicines) in chronological order | Yes (Patient) |
| GET | `/patient/medicines` | Retrieve the patient's medicine list, separated into active and past entries | Yes (Patient) |
| GET | `/patient/medicines/{id}` | Retrieve full details for a specific medicine record, including the AI explanation | Yes (Patient) |

---

### 7.4 Symptom Analysis APIs

These endpoints handle the symptom checker workflow, including text and voice-transcribed input and retrieval of past symptom analyses.

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|--------------|
| POST | `/symptoms/analyze` | Submit symptom text to the Triage Agent and Symptom Analysis Agent; receive severity classification and guidance | Yes (Patient) |
| GET | `/symptoms/history` | Retrieve the patient's full symptom analysis history in reverse chronological order | Yes (Patient) |
| GET | `/symptoms/history/{id}` | Retrieve the full details of a specific symptom analysis entry | Yes (Patient) |

---

### 7.5 Prescription APIs

These endpoints manage the full prescription workflow: upload, AI extraction, patient confirmation, and medicine explanation generation.

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|--------------|
| POST | `/prescriptions/upload` | Upload a prescription image to Supabase Storage and trigger AI extraction via the Prescription Extraction Agent | Yes (Patient) |
| GET | `/prescriptions/` | Retrieve a list of all prescriptions uploaded by the patient | Yes (Patient) |
| GET | `/prescriptions/{id}` | Retrieve the details and extracted medicines for a specific prescription | Yes (Patient) |
| POST | `/prescriptions/{id}/confirm` | Submit the patient's confirmed (and optionally corrected) medicine data; triggers medicine explanation generation | Yes (Patient) |
| POST | `/medicines/explain` | Request a plain-language AI explanation for a named medicine (text-based) | Yes (Patient) |
| POST | `/medicines/explain-image` | Upload a medicine packaging image and request an AI explanation of the identified medicine | Yes (Patient) |

---

### 7.6 Reminder APIs

These endpoints allow patients to create, manage, and retrieve their medication reminders. They also provide the in-app notification polling endpoint.

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|--------------|
| GET | `/reminders/` | Retrieve all active reminders for the logged-in patient, sorted by reminder time | Yes (Patient) |
| POST | `/reminders/` | Create a new medication reminder and schedule it in APScheduler | Yes (Patient) |
| PUT | `/reminders/{id}` | Update the time or frequency of an existing reminder; reschedules the APScheduler job | Yes (Patient) |
| DELETE | `/reminders/{id}` | Delete a reminder and cancel the corresponding APScheduler job | Yes (Patient) |
| POST | `/reminders/suggest` | Apply Python frequency mapping (OD, BD, TDS, etc.) to a confirmed medicine list and return suggested reminder times — no AI call made | Yes (Patient) |
| GET | `/reminders/notifications/pending` | Poll for any undelivered reminder notifications for the current patient session | Yes (Patient) |
| POST | `/reminders/notifications/{id}/acknowledge` | Mark a reminder notification as acknowledged by the patient | Yes (Patient) |

---

### 7.7 Doctor Dashboard APIs

These endpoints provide doctors with read-only access to patient records and AI-generated patient summaries. All doctor endpoints are strictly GET-only.

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|--------------|
| GET | `/doctor/profile` | Retrieve the logged-in doctor's profile information | Yes (Doctor) |
| PUT | `/doctor/profile` | Update the doctor's name, phone number, or profile picture | Yes (Doctor) |
| GET | `/doctor/patients/search` | Search for patients by name or patient ID; returns a list of matching patient cards | Yes (Doctor) |
| GET | `/doctor/patients/{id}` | Retrieve a patient's full record: active medicines, prescription list, and recent symptom history | Yes (Doctor) |
| GET | `/doctor/patients/{id}/summary` | Generate and retrieve an AI patient summary for the specified patient via the Doctor Summary Agent | Yes (Doctor) |
| GET | `/doctor/patients/{id}/prescriptions` | Retrieve the list of all prescriptions uploaded by the specified patient | Yes (Doctor) |
| GET | `/doctor/patients/{id}/medicines` | Retrieve the confirmed medicine list for the specified patient | Yes (Doctor) |
| GET | `/doctor/patients/{id}/symptoms` | Retrieve the symptom history for the specified patient | Yes (Doctor) |

---

---

## 8. AUTHENTICATION FLOW (JWT)

### 8.1 Overview

MediAssist uses **JSON Web Tokens (JWT)** for stateless authentication. The server does not store session data. Instead, a token is issued at login and must be included with every subsequent protected request. Token validity is verified on the backend on every request.

### 8.2 Token Structure

A MediAssist JWT contains the following claims in its payload:

| Claim | Value | Description |
|-------|-------|-------------|
| `sub` | user UUID | The unique ID of the logged-in patient or doctor |
| `role` | `patient` or `doctor` | The user's role, used for RBAC enforcement |
| `email` | string | The user's email address |
| `iat` | Unix timestamp | Issued-at time |
| `exp` | Unix timestamp | Expiry time (24 hours after issuance) |

The token is signed using HMAC-SHA256 with a secret key stored as an environment variable (`JWT_SECRET`).

### 8.3 Authentication Flow

```
STEP 1 — LOGIN
Patient or Doctor submits email and password to POST /api/v1/auth/login

STEP 2 — CREDENTIAL VERIFICATION
Backend retrieves the user record from the patients or doctors table by email.
If no record is found → return HTTP 401 (generic error message).
Backend uses bcrypt to verify the submitted password against the stored password_hash.
If verification fails → return HTTP 401 (generic error message).

STEP 3 — TOKEN GENERATION
If credentials are valid:
 - Backend constructs a JWT payload with: sub, role, email, iat, exp
 - Backend signs the token with JWT_SECRET using HS256
 - Token is returned to the client in the response body
 - Login event is recorded in audit_logs

STEP 4 — CLIENT TOKEN STORAGE
The frontend (React) stores the JWT in memory (application state).
The token is included in the Authorization header of every subsequent request:
 Authorization: Bearer <token>

STEP 5 — REQUEST AUTHORIZATION
For every protected endpoint, the FastAPI auth middleware:
 - Extracts the token from the Authorization header
 - Verifies the token signature using JWT_SECRET
 - Checks token expiry (exp claim)
 - Reads the role claim and verifies it matches the required role for the endpoint
 - If any check fails → HTTP 401 (invalid/expired token) or HTTP 403 (wrong role)
 - If all checks pass → the request is forwarded to the route handler

STEP 6 — LOGOUT
Patient or Doctor sends POST /api/v1/auth/logout (authenticated request).
Backend records the logout event in audit_logs.
The response instructs the client to clear the token from memory.
Without a valid token, future requests are rejected.

STEP 7 — TOKEN EXPIRY
Tokens expire after 24 hours (exp claim).
On expiry, the next authenticated request returns HTTP 401.
The frontend detects HTTP 401, clears the token from state, and redirects to the login page.
The user must log in again to receive a new token.
```

### 8.4 Security Notes

| Concern | Handling |
|---------|---------|
| Token storage | JWT stored in React application memory (not localStorage or cookies in V1) — cleared on page refresh or logout |
| Secret key | `JWT_SECRET` stored as a Hugging Face Spaces environment secret; never committed to version control |
| Generic error messages | Login errors never reveal whether the email or password was incorrect |
| Token revocation | In V1, tokens cannot be server-side revoked before expiry. Logout clears the client-side token only. This is an accepted limitation for a prototype |

---

---

## 9. INPUT VALIDATION RULES

All input validation is enforced on the backend using FastAPI's built-in Pydantic request validation. The frontend also performs basic client-side validation for a better user experience, but the backend is the authoritative validation layer.

---

### 9.1 Patient Registration

| Field | Validation Rules |
|-------|----------------|
| `full_name` | Required; 2–100 characters; letters, spaces, hyphens only |
| `email` | Required; valid email format (RFC 5322); must not already exist in the patients table |
| `password` | Required; minimum 8 characters; at least one letter and one number |
| `date_of_birth` | Required; valid date; patient must be at least 1 year old; not a future date |
| `gender` | Required; must be one of: Male, Female, Other, Prefer not to say |
| `phone_number` | Optional; if provided, must be 7–15 digits; may include + prefix for country code |

---

### 9.2 Doctor Registration

| Field | Validation Rules |
|-------|----------------|
| `full_name` | Required; 2–100 characters |
| `email` | Required; valid email format; must not already exist in the doctors table |
| `password` | Required; minimum 8 characters; at least one letter and one number |
| `specialization` | Required; 2–100 characters |
| `license_number` | Required; 3–50 characters; alphanumeric |
| `phone_number` | Optional; same rules as patient phone number |

---

### 9.3 Login

| Field | Validation Rules |
|-------|----------------|
| `email` | Required; valid email format |
| `password` | Required; must not be blank |

---

### 9.4 Prescription Upload

| Field | Validation Rules |
|-------|----------------|
| `file` | Required; accepted MIME types: image/jpeg, image/png, application/pdf; maximum size: 10MB; file must not be empty |

---

### 9.5 Prescription Confirmation

| Field | Validation Rules |
|-------|----------------|
| `medicines` | Required; must be a non-empty list |
| `medicine_name` | Required per entry; 1–255 characters |
| `dosage` | Optional per entry; 1–100 characters if provided |
| `frequency` | Optional per entry; 1–100 characters if provided |
| `duration` | Optional per entry; 1–100 characters if provided |
| `special_instructions` | Optional; max 1000 characters |

---

### 9.6 Symptom Analysis

| Field | Validation Rules |
|-------|----------------|
| `symptom_text` | Required; minimum 10 characters; maximum 2000 characters; must not consist of only whitespace |

---

### 9.7 Medication Reminder

| Field | Validation Rules |
|-------|----------------|
| `medicine_name` | Required; 1–255 characters |
| `dose_description` | Optional; max 255 characters |
| `reminder_time` | Required; valid time format (HH:MM in 24-hour format) |
| `frequency` | Required; must be one of: daily, weekdays, custom |
| `days_of_week` | Required if frequency is custom; comma-separated valid day abbreviations (Mon, Tue, Wed, Thu, Fri, Sat, Sun) |

---

### 9.8 Profile Update

| Field | Validation Rules |
|-------|----------------|
| `full_name` | Optional; if provided, 2–100 characters |
| `phone_number` | Optional; if provided, valid phone format |
| `profile_picture` | Optional; if provided, accepted MIME types: image/jpeg, image/png; maximum size: 5MB |

---

### 9.9 Patient Search (Doctor)

| Field | Validation Rules |
|-------|----------------|
| `query` | Required; minimum 2 characters; maximum 100 characters |

---

### 9.10 AI Output Validation

In addition to user input validation, all responses from the Google Gemini API are validated against Pydantic schemas before they are used or stored. If any AI response fails schema validation, the system returns a safe fallback error message. The invalid AI output is discarded and is never stored in the database or shown to the user.

| AI Operation | Schema Validated |
|-------------|-----------------|
| Prescription extraction | List of MedicineEntry objects (name, dosage, frequency, duration) |
| Medicine explanation | MedicineExplanation object (purpose, how_to_take, side_effects, warnings) |
| Symptom triage | SymptomSeverity object (severity: one of MILD, MODERATE, SEVERE, EMERGENCY) |
| Symptom guidance | SymptomGuidance object (guidance text, advisory flag) |
| Reminder suggestion | **No AI call** — output is generated by Python frequency mapping; validated against ReminderScheduleSchema before returning to frontend |
| Doctor summary | DoctorSummary object (summary text, medicine count, symptom count) |

---

---

## 10. CONCLUSION

### 10.1 Design Summary

This document has defined the complete database schema and API surface for MediAssist. The design is intentionally pragmatic — 7 tables and 30 endpoints covering every feature defined in the SRS (DOC-1) without unnecessary complexity.

| Layer | Count | Notes |
|-------|-------|-------|
| Database Tables | 7 | patients, doctors, prescriptions, medical_records, medication_reminders, ai_interaction_history, audit_logs |
| API Endpoint Groups | 6 | Auth, Patient, Symptom, Prescription, Reminder, Doctor |
| Total API Endpoints | 30 | Covering all patient and doctor-facing features |
| Validation Rule Sets | 10 | One per major input domain |
| AI Output Schemas | 6 | One per agent interaction type |

### 10.2 Key Design Decisions Summarized

| Decision | Rationale |
|----------|-----------|
| Separate patients and doctors tables | Different schema needs; explicit role separation in the database |
| Medical records as a child of prescriptions | Supports one-to-many extraction; independent medicine querying |
| AI interactions unified in one table | Simplifies the schema; interaction_type field differentiates behaviour |
| Audit logs without foreign keys | Ensures audit record permanence regardless of other data changes |
| JWT with 24-hour expiry | Simple, stateless authentication; appropriate for a prototype |
| All AI outputs validated before storage | Prevents malformed or hallucinated data from entering the database |

### 10.3 Cross-Reference to Next Document

The screen designs and navigation flows in **DOC-5 (UI/UX Design)** must reflect:

- The data structures defined in this document (e.g., what fields are displayed for each medicine, prescription, or symptom entry)
- The API endpoints defined in Section 7 (e.g., the symptom checker screen calls `POST /symptoms/analyze`)
- The validation rules in Section 9 (e.g., the registration form enforces password minimum length)

---

> END OF DOCUMENT 4 — DATABASE & API DESIGN
>
> Parent Documents : DOC-0 (PRD), DOC-1 (SRS), DOC-3 (System Design & Architecture)
> Next Document   : DOC-5 — UI/UX Design
>
> The screen designs in DOC-5 must align with the data fields and API endpoints defined here.
> The implementation in DOC-6 must use the table structures and validation rules in this document.
