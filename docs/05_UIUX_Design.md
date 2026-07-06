
# ══════════════════════════════════════════════════════════════════════════════
#
#                              MEDIASSIST
#            A MULTI-AGENT PERSONAL HEALTHCARE ASSISTANT
#
# ══════════════════════════════════════════════════════════════════════════════
#
#  DOCUMENT 5 — UI/UX DESIGN
#
#  Project        : MediAssist
#  Document ID    : DOC-5-UXD
#  Version        : 1.1
#  Date           : July 2026
#  AI Model       : gemini-2.5-flash
#
#  Cross-References:
#    DOC-0 (PRD)  — User personas and journeys
#    DOC-1 (SRS)  — Functional requirements (UI-01 to UI-10, NFR-008 to NFR-010)
#    DOC-3 (SDA)  — Frontend component structure
#    DOC-4 (DAD)  — API endpoints driving each screen
#
#  Design Inspiration:
#    Notion, Linear, Stripe Dashboard, Apple Human Interface Guidelines
#
# ══════════════════════════════════════════════════════════════════════════════

---

## TABLE OF CONTENTS

1. [Introduction](#1-introduction)
2. [Design Goals](#2-design-goals)
3. [User Roles](#3-user-roles)
4. [Navigation Flow](#4-navigation-flow)
5. [Screen Designs](#5-screen-designs)
   - 5.1  Welcome Page
   - 5.2  Login
   - 5.3  Register & Consent
   - 5.4  Patient Dashboard
   - 5.5  Doctor Dashboard
   - 5.6  Symptom Analysis
   - 5.7  Prescription Upload
   - 5.8  Medicine Explanation
   - 5.9  Medication Reminders
   - 5.10 Medical History
   - 5.11 Profile & Settings
6. [User Flow Diagrams](#6-user-flow-diagrams)
7. [Design System](#7-design-system)
8. [Responsive Design](#8-responsive-design)
9. [Accessibility Considerations](#9-accessibility-considerations)
10. [Conclusion](#10-conclusion)

---

---

## 1. INTRODUCTION

### 1.1 Purpose

This document defines the complete UI/UX design specification for MediAssist. It describes every screen a patient or doctor will interact with, the design language that governs all visual decisions, and the principles that ensure the interface is approachable for users of all technical backgrounds — including elderly patients.

### 1.2 Design Philosophy

MediAssist is a healthcare assistant. The visual design must inspire trust, communicate clarity, and reduce cognitive load. This is not a social media app competing for attention — it is a tool that must get out of the user's way and let the information speak.

The design language draws from:

- **Notion** — Generous whitespace, clean typography, distraction-free layouts
- **Linear** — Purposeful use of color, precision, consistent component language
- **Stripe Dashboard** — Data-dense yet readable; numbers and status always instantly legible
- **Apple HIG** — Hierarchy, clarity, and deference to content

### 1.3 Technology Stack

| Technology | UI Role |
|-----------|---------|
| **React + Vite** | Component-based SPA rendering |
| **Tailwind CSS** | Utility-first styling; consistent spacing and color |
| **shadcn/ui** | Pre-built accessible components (buttons, cards, dialogs, inputs) |
| **Framer Motion** | Smooth page transitions and micro-animations |
| **Lucide Icons** | Consistent, lightweight icon set throughout |
| **Inter (Google Fonts)** | Primary typeface for all UI text |

---

---

## 2. DESIGN GOALS

| # | Goal | Rationale |
|---|------|-----------|
| **DG-1** | **Clarity over cleverness** | Every UI element has one clear purpose. Nothing decorative competes with function. Labels are always visible; icons never replace text alone |
| **DG-2** | **Trust through consistency** | Every screen shares the same spacing grid, color system, and component library. Users should never wonder if they are on the same product |
| **DG-3** | **Accessible to non-technical users** | Font sizes are generous. Actions are labeled. Errors explain what happened and what to do next. The design serves a 67-year-old diabetic patient equally as well as a 34-year-old teacher |
| **DG-4** | **Safe, responsible AI presentation** | AI output is visually distinct from user-entered data. Medical disclaimers are always visible. Emergency alerts are unmistakable |
| **DG-5** | **Progressive disclosure** | Complex workflows (prescription confirmation, reminder setup) are broken into clear steps. The user is never presented with too much at once |
| **DG-6** | **Responsive and mobile-aware** | The design works beautifully at 320px and at 1920px. The information hierarchy adapts; nothing is hidden on mobile that is critical to the user |

---

---

## 3. USER ROLES

### 3.1 Patient Interface Context

| Attribute | Description |
|-----------|-------------|
| **Primary access device** | Mobile (smartphone) — majority of use |
| **Key tasks** | Upload prescriptions, check symptoms, set and receive reminders |
| **Emotional context** | Sometimes anxious (health concerns); must feel safe and supported |
| **Design priority** | Large touch targets, simple language, always-visible help text |
| **Navigation model** | Bottom navigation bar on mobile; sidebar on desktop |

### 3.2 Doctor Interface Context

| Attribute | Description |
|-----------|-------------|
| **Primary access device** | Desktop (laptop or workstation) |
| **Key tasks** | Search patients, review records, read AI summary |
| **Emotional context** | Time-pressured; needs information density without clutter |
| **Design priority** | Information density, fast search, clean tabular data, quick navigation |
| **Navigation model** | Left sidebar on desktop; top tabs on mobile |

---

---

## 4. NAVIGATION FLOW

### 4.1 Overall Application Navigation

```
                    ┌─────────────────┐
                    │   WELCOME PAGE  │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │                             │
              ▼                             ▼
     ┌─────────────────┐          ┌─────────────────┐
     │  LOGIN (Patient)│          │  LOGIN (Doctor)  │
     └────────┬────────┘          └────────┬─────────┘
              │                            │
    ┌─────────┘                            └──────────────┐
    │  NEW USER?                                          │
    │  ┌────────────────┐                                 │
    └─▶│    REGISTER    │                                 │
       │  + CONSENT     │                                 │
       └────────┬───────┘                                 │
                │                                         │
                ▼                                         ▼
  ┌─────────────────────────────┐          ┌─────────────────────────────┐
  │     PATIENT DASHBOARD       │          │      DOCTOR DASHBOARD       │
  │                             │          │                             │
  │  ┌──────────────────────┐   │          │  ┌──────────────────────┐   │
  │  │  Quick Actions       │   │          │  │  Patient Search      │   │
  │  │  • Upload Rx         │   │          │  │  • Search bar        │   │
  │  │  • Check Symptoms    │   │          │  │  • Recent patients   │   │
  │  │  • View Reminders    │   │          │  └──────────────────────┘   │
  │  └──────────────────────┘   │          │                             │
  └─────────────┬───────────────┘          │  ┌──────────────────────┐   │
                │                          │  │  Patient Record View │   │
     ┌──────────┼──────────┐               │  │  • AI Summary        │   │
     │          │          │               │  │  • Medicines         │   │
     ▼          ▼          ▼               │  │  • Prescriptions     │   │
 ┌───────┐ ┌───────┐ ┌──────────┐         │  │  • Symptoms          │   │
 │Symptom│ │Presc. │ │Reminders │         │  └──────────────────────┘   │
 │Checker│ │Upload │ │          │         └─────────────────────────────┘
 └───────┘ └───────┘ └──────────┘
     │          │
     │          ▼
     │   ┌──────────────┐
     │   │Medicine Expl.│
     │   └──────────────┘
     ▼
 ┌────────────────┐
 │Medical History │
 └────────────────┘

 Profile & Settings accessible from any authenticated screen via sidebar/navbar
```

### 4.2 Patient Sidebar Navigation Items

| Icon | Label | Route |
|------|-------|-------|
| LayoutDashboard | Dashboard | `/dashboard` |
| Upload | Upload Prescription | `/prescriptions/upload` |
| Stethoscope | Symptom Checker | `/symptoms` |
| Pill | My Medicines | `/medicines` |
| Bell | Reminders | `/reminders` |
| ClockRewind | Medical History | `/history` |
| User | Profile | `/profile` |
| LogOut | Logout | (action) |

### 4.3 Doctor Sidebar Navigation Items

| Icon | Label | Route |
|------|-------|-------|
| LayoutDashboard | Dashboard | `/doctor/dashboard` |
| Search | Patient Search | `/doctor/patients` |
| User | Profile | `/doctor/profile` |
| LogOut | Logout | (action) |

---

---

## 5. SCREEN DESIGNS

> **Wireframe Key**:
> `[ ]` = Button or interactive element
> `(  )` = Input field
> `|   |` = Card or container boundary
> `---` = Divider
> `▣` = Icon placeholder
> `░░░` = Image or image placeholder

---

### 5.1 Welcome Page

**Purpose**: The public landing page. Creates the first impression of MediAssist. Communicates the product value clearly and routes users to login or register.

**API**: None — public page

**Layout**:

```
┌──────────────────────────────────────────────────────────────────────┐
│  ▣ MediAssist                              [ Login ]  [ Get Started ]│
│  (Navbar — sticky, white background, subtle bottom border)           │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                         HERO SECTION                                 │
│                                                                      │
│            Your Health, Simplified.                                  │
│   (48px, bold, dark text, center-aligned)                            │
│                                                                      │
│   Understand your prescriptions, track symptoms,                     │
│   and stay on top of your medications — all in one place.            │
│   (18px, muted gray, center-aligned, max-width 600px)                │
│                                                                      │
│          [ Get Started — Free ]     [ Learn More ↓ ]                │
│          (teal filled button)       (ghost button)                   │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                      FEATURE CARDS ROW                               │
│                                                                      │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────────┐ │
│  │ ▣ Prescription   │ │ ▣ Symptom        │ │ ▣ Smart Reminders   │ │
│  │   Upload         │ │   Guidance       │ │                     │ │
│  │                  │ │                  │ │ Never miss a dose.  │ │
│  │ Scan and         │ │ Describe how     │ │ Personalised        │ │
│  │ understand your  │ │ you feel and     │ │ medication          │ │
│  │ prescription in  │ │ get clear        │ │ schedules with      │ │
│  │ simple language. │ │ guidance.        │ │ timely reminders.   │ │
│  └──────────────────┘ └──────────────────┘ └──────────────────────┘ │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                      FOOTER                                          │
│   ▣ MediAssist    For Patients · For Doctors · Privacy · Terms      │
│   © 2026 MediAssist. For informational purposes only.               │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Main UI Components**:
- Sticky navbar with logo and CTA buttons
- Hero section with headline, subheadline, and two CTA buttons
- 3-column feature card grid with icons and descriptions
- Footer with medical disclaimer reference

**User Actions**:
- Click "Get Started" → Navigate to Register page
- Click "Login" → Navigate to Login page
- Click "Learn More" → Smooth scroll to feature cards

**Navigation from here**:
- → Login Page
- → Register Page

---

### 5.2 Login

**Purpose**: Authenticate a returning patient or doctor. Simple, fast, and trustworthy.

**API**: `POST /api/v1/auth/login`

**Layout**:

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│     ┌────────────────────────────────────────┐                       │
│     │                                        │                       │
│     │   ▣  MediAssist                        │   LEFT PANEL         │
│     │                                        │   (40% width)        │
│     │   Welcome back.                        │   Teal gradient bg   │
│     │   (32px, white, bold)                  │   with subtle        │
│     │                                        │   geometric pattern  │
│     │   Sign in to continue managing         │                      │
│     │   your health journey.                 │                      │
│     │   (16px, white/80%)                    │                      │
│     │                                        │                      │
│     └────────────────────────────────────────┘                       │
│                                                                      │
│     ┌────────────────────────────────────────┐                       │
│     │                                        │   RIGHT PANEL        │
│     │   Sign In                              │   (60% width)        │
│     │   (24px, dark, semibold)               │   White background   │
│     │                                        │   Center aligned     │
│     │   I am a:   [ Patient ]  [ Doctor ]   │                      │
│     │             (segmented control)        │                      │
│     │                                        │                      │
│     │   Email address                        │                      │
│     │   (──────────────────────────────)     │                      │
│     │                                        │                      │
│     │   Password                             │                      │
│     │   (──────────────────────────── ▣ )   │                      │
│     │   (eye icon to show/hide)              │                      │
│     │                                        │                      │
│     │   [ Sign In          → ]               │                      │
│     │   (full-width teal button)             │                      │
│     │                                        │                      │
│     │   ─────────── or ───────────           │                      │
│     │                                        │                      │
│     │   Don't have an account?               │                      │
│     │   [ Create Account ]                   │                      │
│     │                                        │                      │
│     └────────────────────────────────────────┘                       │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Main UI Components**:
- Split-panel layout (teal brand panel left, form panel right)
- Role selector (Patient / Doctor) — segmented control (shadcn/ui Tabs)
- Email input field
- Password input with show/hide toggle (Lucide Eye icon)
- Primary "Sign In" button (full-width, teal)
- "Create Account" text link
- Inline error message area below form (hidden until error occurs)

**User Actions**:
- Toggle between Patient and Doctor roles
- Enter credentials and submit
- Click "Create Account" → Register Page

**Error States**:
- Invalid credentials → inline error below password: "Incorrect email or password."
- Empty fields → inline field validation on blur

**Navigation from here**:
- Successful login (Patient) → Patient Dashboard
- Successful login (Doctor) → Doctor Dashboard
- "Create Account" → Register Page
- Logo click → Welcome Page

---

### 5.3 Register & Consent

**Purpose**: Two-step process. Step 1 collects profile information. Step 2 (patients only) captures explicit consent before AI features are accessible. Uses a step progress indicator.

**API**: `POST /api/v1/auth/register/patient` or `/doctor` → `POST /api/v1/auth/consent`

**Layout — Step 1 (Registration)**:

```
┌──────────────────────────────────────────────────────────────────────┐
│   ▣ MediAssist                                          Step 1 of 2  │
│                                                                      │
│   ●────────────○           Step progress indicator                   │
│   Profile    Consent       (teal filled = current, empty = upcoming) │
│                                                                      │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │                                                             │   │
│   │   Create your account                                       │   │
│   │   (24px, dark, semibold)                                    │   │
│   │                                                             │   │
│   │   I am registering as:  [ Patient ]  [ Doctor ]            │   │
│   │                                                             │   │
│   │   Full Name                                                 │   │
│   │   (────────────────────────────────────)                    │   │
│   │                                                             │   │
│   │   Email Address                                             │   │
│   │   (────────────────────────────────────)                    │   │
│   │                                                             │   │
│   │   Password                                                  │   │
│   │   (────────────────────────────────── ▣)                   │   │
│   │   ░░░░░░░░░░░░  Password strength indicator                │   │
│   │                                                             │   │
│   │   (Patient fields)          (Doctor fields)                 │   │
│   │   Date of Birth             Specialization                  │   │
│   │   (────────────────)        (──────────────────────)        │   │
│   │                                                             │   │
│   │   Gender                    License Number                  │   │
│   │   (── Select ──▾)           (──────────────────────)        │   │
│   │                                                             │   │
│   │   Phone (optional)                                          │   │
│   │   (────────────────────────────────────)                    │   │
│   │                                                             │   │
│   │            [ Continue →  ]                                  │   │
│   │            (full-width teal button)                         │   │
│   │                                                             │   │
│   │   Already have an account? Sign in                          │   │
│   └─────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

**Layout — Step 2 (Consent — Patients Only)**:

```
┌──────────────────────────────────────────────────────────────────────┐
│   ▣ MediAssist                                          Step 2 of 2  │
│                                                                      │
│   ●────────────●           Both steps filled                         │
│   Profile    Consent                                                 │
│                                                                      │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │                                                             │   │
│   │   ▣  Before you continue                                    │   │
│   │      (ShieldCheck icon, teal, 32px)                         │   │
│   │                                                             │   │
│   │   Your Privacy & Data Use                                   │   │
│   │   (20px, dark, semibold)                                    │   │
│   │                                                             │   │
│   │   ┌───────────────────────────────────────────────────┐    │   │
│   │   │  MediAssist uses AI to help you understand your   │    │   │
│   │   │  prescriptions, medicines, and symptoms.          │    │   │
│   │   │                                                   │    │   │
│   │   │  By continuing, you agree that:                   │    │   │
│   │   │                                                   │    │   │
│   │   │  • Your uploaded prescriptions and symptom        │    │   │
│   │   │    descriptions will be processed by an AI        │    │   │
│   │   │    system to generate explanations and guidance.  │    │   │
│   │   │                                                   │    │   │
│   │   │  • MediAssist does not diagnose diseases or       │    │   │
│   │   │    replace a qualified doctor.                    │    │   │
│   │   │                                                   │    │   │
│   │   │  • Your data is stored securely and used only     │    │   │
│   │   │    to provide MediAssist services.                │    │   │
│   │   └───────────────────────────────────────────────────┘    │   │
│   │                                                             │   │
│   │   ☐  I have read and agree to the above terms.             │   │
│   │      I give my consent for my health data to be            │   │
│   │      processed by MediAssist's AI system.                  │   │
│   │      (checkbox — must be checked to proceed)               │   │
│   │                                                             │   │
│   │            [ I Agree and Continue → ]                       │   │
│   │            (disabled until checkbox checked)                │   │
│   └─────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

**Main UI Components**:
- Step progress indicator (two steps, teal = active)
- Role toggle (Patient / Doctor) — switches which fields are shown
- Labeled form fields with inline validation
- Password strength meter (4-segment bar)
- Consent text box (scrollable, bordered)
- Consent checkbox (required)
- Continue / Agree button (disabled until checkbox is checked)

**User Actions**:
- Fill in profile information → click Continue
- Read consent text, check checkbox → click "I Agree and Continue"
- "Sign in" link → Login Page

**Navigation from here**:
- Consent given → Patient Dashboard
- Doctor registration → Doctor Dashboard (no consent step)

---

### 5.4 Patient Dashboard

**Purpose**: The patient's home base. Provides a quick overview of health status, upcoming reminders, recent activity, and fast access to all key features.

**API**: `GET /api/v1/patient/profile`, `GET /api/v1/reminders/`, `GET /api/v1/patient/history`

**Layout**:

```
┌───────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│ ┌─────────────────┐  ┌────────────────────────────────────────────────┐  │
│ │                 │  │                                                 │  │
│ │  ▣ MediAssist   │  │  Good morning, Priya ☀️                        │  │
│ │                 │  │  (22px, dark, semibold)                        │  │
│ │  ─────────────  │  │  Tuesday, July 1, 2026                         │  │
│ │                 │  │  (14px, muted gray)                            │  │
│ │  ▣ Dashboard    │  │                                                │  │
│ │  ▣ Prescription │  │ ─────────────────────────────────────────────  │  │
│ │  ▣ Symptoms     │  │                                                │  │
│ │  ▣ Medicines    │  │  QUICK ACTIONS                                 │  │
│ │  ▣ Reminders    │  │  ┌──────────────┐ ┌──────────────┐ ┌────────┐ │  │
│ │  ▣ History      │  │  │  ▣ Upload    │ │  ▣ Check     │ │▣ View  │ │  │
│ │                 │  │  │  Prescription│ │  Symptoms    │ │Reminder│ │  │
│ │  ─────────────  │  │  │              │ │              │ │        │ │  │
│ │  ▣ Profile      │  │  │  [ Upload ]  │ │  [ Start ]   │ │[View ] │ │  │
│ │  ▣ Logout       │  │  └──────────────┘ └──────────────┘ └────────┘ │  │
│ │                 │  │                                                │  │
│ │  LEFT SIDEBAR   │  │  ─────────────────────────────────────────────  │  │
│ │  Width: 240px   │  │                                                │  │
│ │  White bg       │  │  TODAY'S REMINDERS                             │  │
│ │  Subtle border  │  │  ┌───────────────────────────────────────────┐ │  │
│ │  right          │  │  │  ▣ 08:00 AM   Amlodipine 5mg   1 tablet  │ │  │
│ │                 │  │  │              [ Mark as Taken ]            │ │  │
│ │                 │  │  │  ▣ 02:00 PM   Metformin 500mg  1 tablet  │ │  │
│ │                 │  │  │              [ Mark as Taken ]            │ │  │
│ │                 │  │  │  ▣ 08:00 PM   Amlodipine 5mg   1 tablet  │ │  │
│ │                 │  │  │              Upcoming                     │ │  │
│ │                 │  │  └───────────────────────────────────────────┘ │  │
│ │                 │  │                                                │  │
│ │                 │  │  ─────────────────────────────────────────────  │  │
│ │                 │  │                                                │  │
│ │                 │  │  RECENT ACTIVITY                               │  │
│ │                 │  │  ┌───────────────────────────────────────────┐ │  │
│ │                 │  │  │  ▣ Prescription uploaded   Yesterday      │ │  │
│ │                 │  │  │    3 medicines extracted and confirmed     │ │  │
│ │                 │  │  │  ▣ Symptom analysis        2 days ago     │ │  │
│ │                 │  │  │    Severity: Mild · Guidance provided      │ │  │
│ │                 │  │  └───────────────────────────────────────────┘ │  │
│ └─────────────────┘  └────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────┘
```

**Main UI Components**:
- Fixed left sidebar with navigation links and icons (Lucide)
- Greeting header with patient name and current date
- 3-column quick action card row (Upload Prescription, Check Symptoms, View Reminders)
- Today's Reminders card (chronological, with "Mark as Taken" actions)
- Recent Activity feed (last 3–5 events)

**User Actions**:
- Click quick action card → navigate to corresponding feature
- Click "Mark as Taken" on a reminder → acknowledges notification
- Click a recent activity item → navigate to full details

**Navigation from here**:
- → Upload Prescription Page
- → Symptom Analysis Page
- → Reminders Page
- → Medical History Page
- → Profile Page

---

### 5.5 Doctor Dashboard

**Purpose**: Entry point for doctors. Provides a search interface to find patients and a recent patients list for quick access.

**API**: `GET /api/v1/doctor/profile`, `GET /api/v1/doctor/patients/search`

**Layout**:

```
┌───────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│ ┌─────────────────┐  ┌────────────────────────────────────────────────┐  │
│ │                 │  │                                                 │  │
│ │  ▣ MediAssist   │  │  Dr. Ananya Mehta                              │  │
│ │  Doctor Portal  │  │  General Physician                             │  │
│ │                 │  │                                                │  │
│ │  ─────────────  │  │  ─────────────────────────────────────────────  │  │
│ │  ▣ Dashboard    │  │                                                │  │
│ │  ▣ Patients     │  │  SEARCH PATIENTS                               │  │
│ │                 │  │  ┌─────────────────────────────────── ▣ ─────┐ │  │
│ │  ─────────────  │  │  │  Search by patient name or ID...          │ │  │
│ │  ▣ Profile      │  │  └────────────────────────────────────────────┘ │  │
│ │  ▣ Logout       │  │  (Lucide Search icon inside input)             │  │
│ │                 │  │                                                │  │
│ │                 │  │  ─────────────────────────────────────────────  │  │
│ │                 │  │                                                │  │
│ │                 │  │  RECENT PATIENTS                               │  │
│ │                 │  │  ┌─────────────────────────────────────────┐   │  │
│ │                 │  │  │  ░  Priya Sharma        Viewed Yesterday │   │  │
│ │                 │  │  │     3 active medicines · Last seen: Mon  │   │  │
│ │                 │  │  │  ─────────────────────────────────────   │   │  │
│ │                 │  │  │  ░  Ramesh Iyer          Viewed 3d ago  │   │  │
│ │                 │  │  │     6 active medicines · Last seen: Fri  │   │  │
│ │                 │  │  └─────────────────────────────────────────┘   │  │
│ │                 │  │                                                │  │
│ └─────────────────┘  └────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────┘
```

**Main UI Components**:
- Minimal doctor sidebar (Dashboard, Patients, Profile, Logout)
- Doctor identity header (name and specialization)
- Full-width patient search input (live search on type)
- Recent patients list with name, medicine count, and last viewed date

**User Actions**:
- Type in search box → live filter results
- Click a patient card → open Patient Record View
- Click "Patients" sidebar link → full patient search page

**Navigation from here**:
- → Patient Record View (FR-037, FR-038)
- → Doctor Profile Page

---

### 5.6 Symptom Analysis

**Purpose**: The symptom checker. Accepts text or voice input, shows a loading state during analysis, and displays severity-specific output — either guidance (mild/moderate) or an emergency alert (severe/emergency).

**API**: `POST /api/v1/symptoms/analyze`, `GET /api/v1/symptoms/history`

**Layout — Input State**:

```
┌───────────────────────────────────────────────────────────────────────────┐
│  Sidebar  │                                                               │
│           │   Symptom Checker                                             │
│           │   (24px, dark, semibold)                                      │
│           │   Describe how you are feeling and we will help you           │
│           │   understand your symptoms.                                   │
│           │   (14px, muted)                                               │
│           │                                                               │
│           │   ┌─────────────────────────────────────────────────────┐    │
│           │   │                                                     │    │
│           │   │   Describe your symptoms...                         │    │
│           │   │                                                     │    │
│           │   │   (Multiline text area, min 4 rows, rounded border) │    │
│           │   │                                                     │    │
│           │   │                                                     │    │
│           │   └─────────────────────────────────────────────────────┘    │
│           │                                                               │
│           │   ▣  Speak your symptoms instead   [ 🎤 Start Recording ]    │
│           │   (Mic icon; only shown if Web Speech API is supported)       │
│           │   (Recording active state: pulsing red dot + "Listening...")  │
│           │                                                               │
│           │   [ Analyze Symptoms → ]                                      │
│           │   (teal button, full-width on mobile, auto-width on desktop)  │
│           │                                                               │
└───────────────────────────────────────────────────────────────────────────┘
```

**Layout — Loading State**:

```
│           │   ┌─────────────────────────────────────────────────────┐    │
│           │   │                                                     │    │
│           │   │         ◌  Analyzing Symptoms...                    │    │
│           │   │         (animated spinner, teal, centered)           │    │
│           │   │         This may take a moment.                     │    │
│           │   │                                                     │    │
│           │   └─────────────────────────────────────────────────────┘    │
```

**Layout — Mild / Moderate Result**:

```
│           │   ┌─────────────────────────────────────────────────────┐    │
│           │   │  ▣ Severity:  Moderate                              │    │
│           │   │  (amber badge)                                      │    │
│           │   │                                                     │    │
│           │   │  Based on the symptoms you described:               │    │
│           │   │  (AI guidance paragraph — plain language)           │    │
│           │   │  "The symptoms you described, including..."         │    │
│           │   │                                                     │    │
│           │   │  ─────────────────────────────────────────────────  │    │
│           │   │  ▣  Medical Disclaimer                              │    │
│           │   │  This information is for guidance only and does    │    │
│           │   │  not constitute a medical diagnosis. Please         │    │
│           │   │  consult a qualified healthcare professional.       │    │
│           │   │  (muted text, small size, bordered card)            │    │
│           │   └─────────────────────────────────────────────────────┘    │
│           │                                                               │
│           │   [ Check Another Symptom ]    [ View History ]              │
```

**Layout — Emergency Alert**:

```
│           │   ┌─────────────────────────────────────────────────────┐    │
│           │   │  🚨  IMPORTANT — SEEK IMMEDIATE CARE                │    │
│           │   │  (RED background, white text, full-width banner)    │    │
│           │   │                                                     │    │
│           │   │  Your symptoms may require immediate medical        │    │
│           │   │  attention.                                         │    │
│           │   │                                                     │    │
│           │   │  Please call your doctor or go to the nearest       │    │
│           │   │  emergency room immediately.                        │    │
│           │   │                                                     │    │
│           │   │  In case of emergency, call: 112                    │    │
│           │   │                                                     │    │
│           │   └─────────────────────────────────────────────────────┘    │
```

**Main UI Components**:
- Page header with title and subtitle
- Multi-line textarea (shadcn/ui Textarea)
- Voice input button (Lucide Mic icon, pulsing animation when recording)
- Analyze button (Framer Motion hover lift effect)
- Loading card with spinner and message
- Result card: severity badge (color-coded), AI guidance text, medical disclaimer
- Emergency alert banner (Lucide AlertTriangle icon, red background)

**User Actions**:
- Type symptoms → click Analyze
- Click microphone → speak symptoms → text auto-populates → edit if needed → click Analyze
- View result → navigate to History

**Navigation from here**:
- → Medical History Page (after result)
- → Patient Dashboard

---

### 5.7 Prescription Upload

**Purpose**: Guides the patient through the 5-step prescription workflow: Upload → Extract → Review & Confirm → Explain → Set Reminders. Each step is clearly labeled.

**API**: `POST /api/v1/prescriptions/upload`, `POST /api/v1/prescriptions/{id}/confirm`

**Layout — Step 1: Upload**:

```
┌───────────────────────────────────────────────────────────────────────────┐
│  Sidebar  │                                                               │
│           │   Upload Prescription                                         │
│           │   Step 1 of 4 — Upload your prescription image               │
│           │   ●────○────○────○  (step indicators)                        │
│           │                                                               │
│           │   ┌─────────────────────────────────────────────────────┐    │
│           │   │                                                     │    │
│           │   │              ░░░░░░░░░░░░░░░                        │    │
│           │   │              (upload cloud icon, large, teal)       │    │
│           │   │                                                     │    │
│           │   │     Drag and drop your prescription here            │    │
│           │   │     or                                               │    │
│           │   │     [ Browse Files ]                                │    │
│           │   │                                                     │    │
│           │   │     Accepted: JPG, PNG, PDF  · Max size: 10MB       │    │
│           │   │                                                     │    │
│           │   └─────────────────────────────────────────────────────┘    │
│           │                                                               │
└───────────────────────────────────────────────────────────────────────────┘
```

**Layout — Step 2: Reading (Loading)**:

```
│           │   ┌─────────────────────────────────────────────────────┐    │
│           │   │   ░░░░░░░░░░░  (prescription thumbnail)             │    │
│           │   │                                                     │    │
│           │   │   ◌  Reading Prescription... Please wait.           │    │
│           │   │   (spinner + message, centered)                     │    │
│           │   └─────────────────────────────────────────────────────┘    │
```

**Layout — Step 3: Confirm Extracted Data**:

```
│           │   Step 3 of 4 — Review and confirm                           │
│           │   ●────●────●────○                                           │
│           │                                                               │
│           │   Please review the information we found.                    │
│           │   Make any corrections before saving.                        │
│           │                                                               │
│           │   ┌── Medicine 1 ──────────────────────────────────────┐    │
│           │   │  Name:        ( Amlodipine              )           │    │
│           │   │  Dosage:      ( 5mg                     )           │    │
│           │   │  Frequency:   ( Once daily              )           │    │
│           │   │  Duration:    ( 30 days                 )           │    │
│           │   │  Instructions:( Take in the morning     )           │    │
│           │   └────────────────────────────────────────────────────┘    │
│           │                                                               │
│           │   ┌── Medicine 2 ──────────────────────────────────────┐    │
│           │   │  Name:        ( Metformin               )           │    │
│           │   │  Dosage:      ( 500mg                   )           │    │
│           │   │  Frequency:   ( Twice daily             )           │    │
│           │   └────────────────────────────────────────────────────┘    │
│           │                                                               │
│           │   [ Confirm and Save → ]      [ Edit Manually ]             │
```

**Layout — Step 4: Medicine Explanations**:

```
│           │   Step 4 of 4 — Your medicines explained                     │
│           │   ●────●────●────●                                           │
│           │                                                               │
│           │   ┌─────────────────────────────────────────────────────┐    │
│           │   │  Amlodipine 5mg                                     │    │
│           │   │  ─────────────────────────────────────────────────  │    │
│           │   │  What it's for:  This medicine helps control         │    │
│           │   │  blood pressure...                                   │    │
│           │   │  How to take it: Take one tablet every morning...   │    │
│           │   │  Side effects:   May cause mild ankle swelling...   │    │
│           │   │  Warnings:       Do not stop suddenly...            │    │
│           │   └─────────────────────────────────────────────────────┘    │
│           │                                                               │
│           │   ┌─────────────────────────────────────────────────────┐    │
│           │   │  ▣  Medical Disclaimer                              │    │
│           │   │  (disclaimer card — always shown here)              │    │
│           │   └─────────────────────────────────────────────────────┘    │
│           │                                                               │
│           │   [ Set Reminders for these Medicines → ]                   │
│           │   [ Skip for now ]                                           │
```

**Main UI Components**:
- Step progress indicator (4 steps, filled as user advances)
- Drag-and-drop upload zone (dashed border, file upload icon)
- Medicine confirmation cards (each medicine in its own editable card)
- Inline-editable fields (pre-filled from AI extraction)
- Confirm and Save button (Framer Motion loading state on click)
- Medicine explanation cards (accordion-style, collapsed by default)
- Medical disclaimer card
- Reminder CTA at the end of flow

**User Actions**:
- Drag file or browse → upload
- Edit any field on confirmation screen → confirm
- Read explanations → opt in to reminders

**Navigation from here**:
- → Medication Reminders Page (if patient opts in)
- → Patient Dashboard

---

### 5.8 Medicine Explanation

**Purpose**: Standalone screen to look up any medicine — either by typing the name or uploading a medicine packaging photo. Useful outside of the prescription flow.

**API**: `POST /api/v1/medicines/explain`, `POST /api/v1/medicines/explain-image`

**Layout**:

```
┌───────────────────────────────────────────────────────────────────────────┐
│  Sidebar  │                                                               │
│           │   Medicine Explainer                                          │
│           │   Type a medicine name or upload a photo of the packaging.   │
│           │                                                               │
│           │   ┌─────────────────────────────────── ▣ ──────────────┐    │
│           │   │  Enter medicine name...               (Search icon)│    │
│           │   └────────────────────────────────────────────────────┘    │
│           │                                                               │
│           │       ─────────── or upload packaging photo ───────────      │
│           │                                                               │
│           │   ┌─────────────────────────────────────────────────────┐    │
│           │   │  ░░░  Upload a photo of the medicine box or label   │    │
│           │   │       (drag or browse — JPG, PNG — max 10MB)        │    │
│           │   └─────────────────────────────────────────────────────┘    │
│           │                                                               │
│           │   [ Explain Medicine → ]                                     │
│           │                                                               │
│           │   ──────────────────────  Result  ────────────────────────   │
│           │                                                               │
│           │   ┌─────────────────────────────────────────────────────┐    │
│           │   │  Metformin Hydrochloride 500mg                      │    │
│           │   │                                                     │    │
│           │   │  ▣ What it's for                                    │    │
│           │   │    Metformin is used to treat type 2 diabetes...    │    │
│           │   │                                                     │    │
│           │   │  ▣ How to take it                                   │    │
│           │   │    Take with meals to reduce stomach upset...       │    │
│           │   │                                                     │    │
│           │   │  ▣ Common side effects                              │    │
│           │   │    Nausea, diarrhea in early weeks...               │    │
│           │   │                                                     │    │
│           │   │  ▣ Warnings                                         │    │
│           │   │    Tell your doctor if you have kidney problems...  │    │
│           │   │                                                     │    │
│           │   │  ─────────────────────────────────────────────────  │    │
│           │   │  ▣  Medical Disclaimer (always visible)            │    │
│           │   └─────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────────────────┘
```

**Main UI Components**:
- Search input for medicine name
- Divider with "or" text
- Compact image upload zone
- Explain button
- Result card with 4 structured sections (icons from Lucide: Info, Clock, AlertCircle, ShieldAlert)
- Medical disclaimer card at the bottom of every result

**User Actions**:
- Type medicine name → click Explain
- Upload packaging photo → click Explain
- Read explanation → navigate away or search again

---

### 5.9 Medication Reminders

**Purpose**: A full reminder management screen where patients can view, add, edit, and delete medication reminders. The interface is clear and easy enough for elderly users.

**API**: `GET /api/v1/reminders/`, `POST /api/v1/reminders/`, `PUT /api/v1/reminders/{id}`, `DELETE /api/v1/reminders/{id}`

**Layout**:

```
┌───────────────────────────────────────────────────────────────────────────┐
│  Sidebar  │                                                               │
│           │   My Reminders                     [ + Add Reminder ]        │
│           │   (24px, dark, semibold)                                      │
│           │                                                               │
│           │   ─────────────────────────────────────────────────────      │
│           │                                                               │
│           │   MORNING                                                     │
│           │   ┌─────────────────────────────────────────────────────┐    │
│           │   │  ▣  08:00 AM                                        │    │
│           │   │     Amlodipine 5mg  ·  1 tablet  ·  Daily           │    │
│           │   │                         [ Edit ]  [ Delete ]        │    │
│           │   └─────────────────────────────────────────────────────┘    │
│           │                                                               │
│           │   AFTERNOON                                                   │
│           │   ┌─────────────────────────────────────────────────────┐    │
│           │   │  ▣  02:00 PM                                        │    │
│           │   │     Metformin 500mg  ·  1 tablet  ·  Daily          │    │
│           │   │                         [ Edit ]  [ Delete ]        │    │
│           │   └─────────────────────────────────────────────────────┘    │
│           │                                                               │
│           │   EVENING                                                     │
│           │   ┌─────────────────────────────────────────────────────┐    │
│           │   │  ▣  08:00 PM                                        │    │
│           │   │     Metformin 500mg  ·  1 tablet  ·  Daily          │    │
│           │   │                         [ Edit ]  [ Delete ]        │    │
│           │   └─────────────────────────────────────────────────────┘    │
│           │                                                               │
│           │   ─────────────────────────────────────────────────────      │
│           │                                                               │
│           │   ┌──── ADD REMINDER PANEL (shown on + click) ──────────┐    │
│           │   │  Medicine Name   (────────────────────────)          │    │
│           │   │  Dose            (────────────────────────)          │    │
│           │   │  Time            (── HH : MM ──) AM / PM            │    │
│           │   │  Frequency       (── Daily ──▾)                     │    │
│           │   │                  [ Save Reminder ]                  │    │
│           │   └─────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────────────────┘
```

**In-App Notification (appears as toast, top-right)**:

```
  ┌────────────────────────────────────────────┐
  │  ▣  Medication Reminder                    │
  │     Time to take your Amlodipine 5mg.      │
  │     (14px, dark)                           │
  │                          [ Dismiss ]       │
  └────────────────────────────────────────────┘
```

**Main UI Components**:
- Page header with "Add Reminder" button
- Reminders grouped by time of day (Morning, Afternoon, Evening, Night)
- Reminder card: time, medicine name, dose, frequency, Edit/Delete actions
- Add Reminder slide-in panel (or dialog)
- Toast notification (Framer Motion slide-in from top-right)

**User Actions**:
- Click "Add Reminder" → open add panel
- Click "Edit" → inline edit form
- Click "Delete" → confirmation dialog → remove reminder
- Dismiss notification toast

---

### 5.10 Medical History

**Purpose**: A chronological log of all the patient's health interactions with MediAssist — prescriptions, medicines, and symptom analyses.

**API**: `GET /api/v1/patient/history`, `GET /api/v1/patient/medicines`, `GET /api/v1/symptoms/history`

**Layout**:

```
┌───────────────────────────────────────────────────────────────────────────┐
│  Sidebar  │                                                               │
│           │   Medical History                                             │
│           │                                                               │
│           │   [ All ] [ Prescriptions ] [ Medicines ] [ Symptoms ]       │
│           │   (filter tab row — active tab has teal underline)            │
│           │                                                               │
│           │   Date Range:  (── Jul 2026 ──)  to  (── Today ──)  [Apply]  │
│           │                                                               │
│           │   ─────────────────────────────────────────────────────      │
│           │                                                               │
│           │   JULY 2026                                                   │
│           │                                                               │
│           │   ┌─────────────────────────────────────────────────────┐    │
│           │   │  ▣  Prescription  ·  July 1, 2026                   │    │
│           │   │     3 medicines confirmed · Amlodipine, Metformin,  │    │
│           │   │     Atorvastatin                    [ View Details ] │    │
│           │   └─────────────────────────────────────────────────────┘    │
│           │                                                               │
│           │   ┌─────────────────────────────────────────────────────┐    │
│           │   │  ▣  Symptom Analysis  ·  June 29, 2026              │    │
│           │   │     Severity: Moderate  ·  Headache, fatigue        │    │
│           │   │     Guidance provided              [ View Details ] │    │
│           │   └─────────────────────────────────────────────────────┘    │
│           │                                                               │
│           │   JUNE 2026                                                   │
│           │                                                               │
│           │   ┌─────────────────────────────────────────────────────┐    │
│           │   │  ▣  Prescription  ·  June 15, 2026                  │    │
│           │   │     2 medicines confirmed · Losartan, Aspirin        │    │
│           │   │                                    [ View Details ] │    │
│           │   └─────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────────────────┘
```

**Main UI Components**:
- Filter tab row (All / Prescriptions / Medicines / Symptoms)
- Date range filter
- Grouped chronological list (grouped by month)
- History entry cards with type icon, date, summary, and "View Details" action
- Entry type badges: Prescription (blue), Symptom (amber), Medicine (teal)

**User Actions**:
- Switch filter tabs → list updates
- Set date range → filtered results
- Click "View Details" → detail modal or detail page

---

### 5.11 Profile & Settings

**Purpose**: Allows patients and doctors to view and update their personal information, and manage basic account settings.

**API**: `GET /api/v1/patient/profile`, `PUT /api/v1/patient/profile`

**Layout**:

```
┌───────────────────────────────────────────────────────────────────────────┐
│  Sidebar  │                                                               │
│           │   Profile & Settings                                          │
│           │                                                               │
│           │   ┌─────────────────────────────────────────────────────┐    │
│           │   │  ░░░  (profile picture, 80px circle)                │    │
│           │   │       [ Change Photo ]                              │    │
│           │   │                                                     │    │
│           │   │  Full Name                                          │    │
│           │   │  (────────────────────────────────────)             │    │
│           │   │                                                     │    │
│           │   │  Email Address                                      │    │
│           │   │  (──────────────────────────────)  🔒 Cannot change │    │
│           │   │                                                     │    │
│           │   │  Phone Number                                       │    │
│           │   │  (────────────────────────────────────)             │    │
│           │   │                                                     │    │
│           │   │  ─────────────────────────────────────────────────  │    │
│           │   │                                                     │    │
│           │   │  (Patient only)                                     │    │
│           │   │  Date of Birth:  (read-only display)                │    │
│           │   │  Gender:         (read-only display)                │    │
│           │   │  Consent Status: ▣ Consent given on July 1, 2026   │    │
│           │   │                                                     │    │
│           │   │  (Doctor only)                                      │    │
│           │   │  Specialization: (────────────────────────────)    │    │
│           │   │  License Number: (read-only display)               │    │
│           │   │                                                     │    │
│           │   │  ─────────────────────────────────────────────────  │    │
│           │   │                                                     │    │
│           │   │  Account                                            │    │
│           │   │  [ Save Changes ]    [ Log Out ]                   │    │
│           │   └─────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────────────────┘
```

**Main UI Components**:
- Profile picture circle with "Change Photo" button
- Editable fields: full name, phone number, specialization (doctor)
- Read-only fields: email, date of birth, gender, license number
- Consent status indicator (for patients) — date and confirmation icon
- Save Changes button and Log Out button
- Success toast on profile save

**User Actions**:
- Edit name or phone → save changes
- Upload new profile photo
- Log out → redirected to Welcome Page

---

---

## 6. USER FLOW DIAGRAMS

### 6.1 Prescription Flow

```
Patient Logs In
     │
     ▼
Patient Dashboard
     │
     │  Clicks "Upload Prescription"
     ▼
Upload Screen (Step 1)
     │
     │  Uploads prescription image
     ▼
Reading Prescription... (Loading)
     │
     ├──── Success ──────────────────────────────────────┐
     │                                                    │
     ▼                                                    │
Confirmation Screen (Step 3)                              │
     │  Patient reviews AI-extracted data                 │
     │  Patient edits if needed                           │
     │  Patient clicks Confirm                            │
     ▼                                                    │
Generating Explanation... (Loading)                       │
     │                                                    │
     ▼                                                    │
Medicine Explanations (Step 4)                            │
     │  Patient reads explanations                        │
     │  Medical disclaimer shown                          │
     │                                                    │
     ├── "Set Reminders?" — Yes ─────────────────────┐   │
     │                                               │   │
     │                              ┌────────────────▼───▼───┐
     │                              │ Reminder Setup Screen   │
     │                              │ (Patient confirms times)│
     │                              │ Reminders scheduled     │
     │                              └─────────────────────────┘
     │
     ▼
     │── Extraction fails ──▶ Error Message (retry or manual entry)
```

---

### 6.2 Symptom Analysis Flow

```
Patient Logs In
     │
     ▼
Symptom Checker Screen
     │
     │  Types or speaks symptoms
     │  Clicks "Analyze Symptoms"
     ▼
Analyzing Symptoms... (Loading)
     │
     ├── MILD or MODERATE ──────────────────────────────────┐
     │                                                       │
     │                                  ┌────────────────────▼────────────┐
     │                                  │ Guidance Card                   │
     │                                  │ Plain-language guidance          │
     │                                  │ Medical disclaimer shown         │
     │                                  │ Entry saved to history           │
     │                                  └─────────────────────────────────┘
     │
     ├── SEVERE or EMERGENCY ──────────────────────────────┐
     │                                                      │
     │                             ┌────────────────────────▼──────────┐
     │                             │ EMERGENCY ALERT BANNER            │
     │                             │ Red full-width banner             │
     │                             │ "Seek immediate care · Call 112"  │
     │                             │ Entry saved to history            │
     │                             └───────────────────────────────────┘
     │
     └── AI Fails ────▶ Error message: "Service unavailable, try again"
```

---

### 6.3 Doctor Patient Review Flow

```
Doctor Logs In
     │
     ▼
Doctor Dashboard
     │
     │  Types patient name or ID in search bar
     ▼
Search Results
     │
     │  Clicks on patient card
     ▼
Generating Patient Summary... (Loading)
     │
     ▼
Patient Record Screen
     │
     ├── AI Summary paragraph (with disclaimer)
     │
     ├── Active Medicines tab
     │   (table: name, dosage, frequency, start date)
     │
     ├── Prescriptions tab
     │   (grid of prescription thumbnails with dates)
     │
     └── Symptom History tab
         (list of entries: date, severity badge, summary)
```

---

---

## 7. DESIGN SYSTEM

### 7.1 Color Palette

The MediAssist color palette is soft, clinical, and professional. It avoids aggressive or saturated colors to maintain a calm, trustworthy feel.

```
PRIMARY COLORS
─────────────────────────────────────────────────────────────────
  Primary (Teal)         #0D9488   ████████  Buttons, active states,
                                             links, badges
  Primary Light          #CCFBF1   ████████  Background tints,
                                             hover states
  Primary Dark           #0F766E   ████████  Button hover state,
                                             pressed state

NEUTRAL COLORS
─────────────────────────────────────────────────────────────────
  Background             #F8FAFC   ████████  Page background
  Surface (Card)         #FFFFFF   ████████  Card and panel background
  Border                 #E2E8F0   ████████  Dividers, card borders,
                                             input borders
  Text Primary           #0F172A   ████████  Headings, body text
  Text Secondary         #64748B   ████████  Subheadings, labels
  Text Muted             #94A3B8   ████████  Placeholders, captions

SEMANTIC COLORS
─────────────────────────────────────────────────────────────────
  Success                #10B981   ████████  Confirmed actions,
                                             active status
  Success Light          #D1FAE5   ████████  Success background tint
  Warning                #F59E0B   ████████  Moderate severity,
                                             caution states
  Warning Light          #FEF3C7   ████████  Warning background tint
  Danger                 #EF4444   ████████  Delete actions,
                                             error messages
  Danger Light           #FEE2E2   ████████  Error background tint
  Emergency              #DC2626   ████████  Emergency alert banner
  Emergency Text         #FFFFFF   ████████  Text on emergency banner

SIDEBAR
─────────────────────────────────────────────────────────────────
  Sidebar Background     #FFFFFF   ████████  White with right border
  Sidebar Border         #E2E8F0   ████████  1px right border
  Sidebar Active Item    #CCFBF1   ████████  Active nav item background
  Sidebar Active Text    #0F766E   ████████  Active nav item text
  Sidebar Inactive Text  #64748B   ████████  Inactive nav item text
```

---

### 7.2 Typography

**Font**: Inter — loaded from Google Fonts. Inter is humanist, highly readable, and works equally well for medical information and data tables.

```
SCALE
──────────────────────────────────────────────────────
  Display      48px   700 (Bold)       Page hero headings
  H1           32px   700 (Bold)       Page titles
  H2           24px   600 (Semibold)   Section headings
  H3           20px   600 (Semibold)   Card headings
  H4           16px   600 (Semibold)   Form labels, sub-sections
  Body Large   16px   400 (Regular)    Primary reading content
  Body         14px   400 (Regular)    Standard body text
  Body Small   13px   400 (Regular)    Captions, helper text
  Label        12px   500 (Medium)     Badges, table headers
  Code / Mono  13px   400 (Regular)    Technical values (Geist Mono)

LINE HEIGHT
  Headings    1.2
  Body        1.6
  Tables      1.4

LETTER SPACING
  Display, H1  -0.02em  (slightly tighter for large text)
  Labels       +0.05em  (slightly wider for small caps readability)
```

---

### 7.3 Buttons

All buttons use shadcn/ui `Button` component with Tailwind customization.

| Variant | Use Case | Appearance |
|---------|---------|-----------|
| **Primary** | Main CTA (Save, Confirm, Analyze) | Teal fill, white text, rounded-lg |
| **Secondary** | Secondary actions (Cancel, Back) | White fill, gray border, dark text |
| **Destructive** | Delete actions | Red fill, white text |
| **Ghost** | Low-emphasis actions (Skip, Learn More) | Transparent, dark text, hover tint |
| **Outline** | Alternative actions | White fill with teal border and teal text |
| **Icon** | Compact actions (Edit, Delete in tables) | Square, ghost-style, icon only |

**Sizing**:
- `sm`: 32px height — table actions, compact UIs
- `md` (default): 40px height — standard forms
- `lg`: 48px height — primary CTAs on patient-facing screens (larger touch target for elderly users)

**Framer Motion**: All buttons have a subtle `scale: 0.97` on press and `y: -1` on hover for tactile feedback.

---

### 7.4 Cards

Cards are the primary layout container throughout MediAssist.

```
Card Anatomy:
┌────────────────────────────────────────────────┐
│  Card Header (optional)                         │
│  Title (H3)  ·  Subtitle (muted)  ·  Badge     │
│  ─────────────────────────────────────────────  │
│  Card Content                                   │
│  (primary information)                          │
│  ─────────────────────────────────────────────  │
│  Card Footer (optional)                         │
│  Actions: [ Button ]  [ Button ]                │
└────────────────────────────────────────────────┘

Styling:
  Background:      #FFFFFF
  Border:          1px solid #E2E8F0
  Border Radius:   12px (rounded-xl in Tailwind)
  Box Shadow:      0 1px 3px rgba(0,0,0,0.06),
                   0 1px 2px rgba(0,0,0,0.04)
  Padding:         24px (p-6)
  Hover Shadow:    0 4px 12px rgba(0,0,0,0.08)
                   (on interactive cards, Framer Motion)
```

**Severity Badge Colors** (used on symptom results and history):

| Severity | Background | Text |
|----------|-----------|------|
| MILD | `#D1FAE5` | `#065F46` |
| MODERATE | `#FEF3C7` | `#92400E` |
| SEVERE | `#FEE2E2` | `#991B1B` |
| EMERGENCY | `#DC2626` | `#FFFFFF` |

---

### 7.5 Forms

All form elements use shadcn/ui components (Input, Select, Textarea, Checkbox) with consistent styling.

```
Input Field:
  Height:         40px (44px on mobile for touch)
  Border:         1px solid #E2E8F0
  Border Radius:  8px (rounded-md)
  Padding:        12px horizontal, 10px vertical
  Font:           14px, text-slate-900
  Placeholder:    text-slate-400
  Focus:          2px teal ring (ring-teal-500)
  Error:          1px red border + red helper text below

Label:
  Position:       Above input
  Font:           14px, 500 weight, text-slate-700
  Margin bottom:  6px

Helper Text:
  Position:       Below input
  Font:           12px, text-slate-500
  Error state:    12px, text-red-600

Form Spacing:
  Between fields: 20px (gap-5)
  Form sections:  32px (gap-8)
```

---

### 7.6 Icons

All icons use **Lucide Icons** exclusively. Icons are always paired with text labels on patient-facing screens to support accessibility for non-technical users.

| Context | Icon | Size |
|---------|------|------|
| Sidebar navigation | LayoutDashboard, Upload, Stethoscope, Pill, Bell, History, User, LogOut | 18px |
| Feature cards | Stethoscope, FileText, Bell | 24px |
| Section headers | Various | 20px |
| Emergency alert | AlertTriangle | 24px |
| Medical disclaimer | ShieldCheck | 16px |
| Reminder notification | Bell | 16px |
| Success feedback | CheckCircle | 16px |
| Loading | Loader2 (animated spin) | 20px |
| Voice input | Mic | 20px |
| File upload | UploadCloud | 32px |

---

### 7.7 Spacing

MediAssist uses an 8px base spacing unit, consistent with Tailwind CSS's default scale.

```
SPACING SCALE
──────────────────────────────────────────────────────
  2px   (0.5)   Icon padding, tight gaps
  4px   (1)     Small gaps between inline elements
  8px   (2)     Default gap between related elements
  12px  (3)     Form row gaps, badge padding
  16px  (4)     Section internal padding
  20px  (5)     Between form fields
  24px  (6)     Card padding, section gaps
  32px  (8)     Between major sections
  48px  (12)    Page section separators
  64px  (16)    Hero section vertical padding

COMPONENT-SPECIFIC
  Sidebar width:   240px (fixed)
  Content max-width: 1200px (centered on large screens)
  Card max-width:    720px (on single-column screens)
  Form max-width:    480px (registration, login)
```

---

---

## 8. RESPONSIVE DESIGN

### 8.1 Breakpoints

MediAssist uses Tailwind CSS's standard breakpoint system:

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| **xs** | 0px – 639px | Mobile — single column, bottom nav |
| **sm** | 640px – 767px | Mobile landscape — slightly wider cards |
| **md** | 768px – 1023px | Tablet — sidebar appears, compact content |
| **lg** | 1024px – 1279px | Desktop — full sidebar, multi-column cards |
| **xl** | 1280px+ | Wide desktop — max-width container centered |

### 8.2 Mobile Adaptations

| Element | Desktop | Mobile |
|---------|---------|--------|
| Navigation | Left sidebar (240px fixed) | Bottom tab bar (5 tabs) |
| Patient Dashboard | 3-column quick actions | 1-column stacked cards |
| Reminder list | Full card with time on left | Compact card, time on top |
| History timeline | Wide cards with metadata | Compact cards, less metadata |
| Symptom textarea | 4 rows min | Full screen height available |
| Prescription upload | Drag-and-drop + browse | Browse only (no drag on mobile) |
| Buttons | Auto-width inline | Full-width stacked |
| Doctor record | Multi-column tabs | Scrollable single-column tabs |

### 8.3 Bottom Navigation Bar (Mobile Only)

Replaces the sidebar on screens below `md` breakpoint:

```
┌──────────────────────────────────────────────────────┐
│  ▣          ▣           ▣           ▣           ▣   │
│ Home    Prescription  Symptoms   Reminders   History  │
└──────────────────────────────────────────────────────┘
Active icon: teal color, label visible
Inactive: gray icon, label visible
```

### 8.4 Touch Target Sizes

All interactive elements on mobile have a minimum touch target of **44px × 44px** in compliance with Apple HIG and WCAG 2.5.5. This is especially important for elderly patients using tablets or large-screen phones.

---

---

## 9. ACCESSIBILITY CONSIDERATIONS

| Area | Implementation |
|------|---------------|
| **Color Contrast** | All text meets WCAG 2.1 AA minimum contrast ratio (4.5:1 for body text, 3:1 for large text). Emergency alert (white on red) meets AAA |
| **Keyboard Navigation** | All interactive elements are reachable via Tab key. Focus rings are always visible (2px teal ring). Modal dialogs trap focus correctly using shadcn/ui's Radix UI base |
| **Screen Reader Support** | All images have `alt` text. Icons used alone have `aria-label`. Form inputs have associated `<label>` elements. Status messages use `aria-live` regions for dynamic content updates |
| **Loading States** | Loading messages are announced to screen readers via `aria-live="polite"`. The page does not change without visual feedback |
| **Error Messages** | Error messages are associated with their input fields via `aria-describedby`. They use both color and text (never color alone) |
| **Emergency Alert** | The emergency alert uses `role="alert"` and `aria-live="assertive"` so screen readers announce it immediately |
| **Font Size** | Minimum body font size is 14px. Most patient-facing content uses 16px (Body Large). Users can increase system font size and the layout scales correctly |
| **Language** | All page content uses plain, simple English. Medical terms are always accompanied by plain-language explanations |
| **Motion** | Framer Motion animations respect the user's `prefers-reduced-motion` system setting — animations are disabled or reduced for users who have requested reduced motion |
| **Form Labels** | Every input has a visible label above it. No placeholder text is used as a substitute for a label |

---

---

## 10. CONCLUSION

### 10.1 Design Summary

This document has defined the complete UI/UX design for MediAssist across 11 screens and a comprehensive design system.

| Area | Count / Value |
|------|--------------|
| Screens designed | 11 |
| User roles served | 2 (Patient, Doctor) |
| Navigation model | Sidebar (desktop) + Bottom nav (mobile) |
| Primary font | Inter (Google Fonts) |
| Color tokens | 18 named design tokens |
| Button variants | 6 |
| Breakpoints | 5 (xs, sm, md, lg, xl) |
| Accessibility standard | WCAG 2.1 AA |
| Component library | shadcn/ui + Lucide Icons + Framer Motion |

### 10.2 Design Consistency With Previous Documents

| Previous Document | How UI/UX Aligns |
|------------------|-----------------|
| DOC-0 (PRD) | Every persona's needs are reflected: Priya's simple prescription view, Ramesh's large-text reminders, Dr. Mehta's information-dense patient record |
| DOC-1 (SRS) | All 10 UI requirements (UI-01 to UI-10) are implemented. Loading states, error states, disclaimers, and emergency alerts all have defined screen implementations |
| DOC-3 (SDA) | Screen designs map directly to the page-level components and feature components defined in the frontend folder structure |
| DOC-4 (DAD) | Every screen's data display and user actions correspond to the API endpoints and table fields defined in the database and API design |

### 10.3 Forward Reference

The **Implementation, Testing & Deployment document (DOC-6)** will reference these screen designs to validate that:
- All described screens are implemented and functional
- Loading states, error states, and disclaimers are present
- Responsive layouts are tested across defined breakpoints
- Accessibility requirements are verified

---

> END OF DOCUMENT 5 — UI/UX DESIGN
>
> Parent Documents : DOC-0 (PRD), DOC-1 (SRS), DOC-3 (SDA), DOC-4 (DAD)
> Next Document   : DOC-6 — Implementation & Deployment Guide
>
> Developers implementing the frontend must follow the design system defined in Section 7.
> All component implementations must use the approved stack: React, Tailwind CSS, shadcn/ui,
> Framer Motion, and Lucide Icons as defined in DOC-3.

