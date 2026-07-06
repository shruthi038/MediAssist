<div align="center">

# 🏥 MediAssist

### A Multi-Agent Personal Healthcare Assistant

*Empowering patients to understand their health — powered by Google Gemini AI*

---

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111+-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![LangGraph](https://img.shields.io/badge/LangGraph-Multi--Agent-FF6B35?style=flat)](https://langchain-ai.github.io/langgraph/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com)
[![gemini](https://img.shields.io/badge/Google-gemini--2.5--flash-4285F4?style=flat&logo=google&logoColor=white)](https://ai.google.dev)

</div>

---

## 📋 Overview

MediAssist is a full-stack web application that acts as a personal healthcare assistant for patients and a record-viewing portal for doctors. It combines a React frontend, a Python/FastAPI backend, and a LangGraph-orchestrated multi-agent AI system powered by Google's **gemini-2.5-flash** multimodal model.

MediAssist helps patients:
- Upload and understand prescription images
- Analyze symptoms with severity triage and plain-language guidance
- Receive medication reminders
- Maintain a personal medical history

Doctors can view patient records and AI-generated patient summaries.

> ⚠️ **Medical Disclaimer**: MediAssist is an informational tool only. It does not diagnose conditions or replace professional medical advice. All AI-generated content is accompanied by a mandatory medical disclaimer.

---

## 🧩 Key Features

| Feature | Description |
|---------|-------------|
| 📄 **Prescription Understanding** | Upload a prescription image; AI extracts medicines, dosages, and frequencies |
| 🩺 **Symptom Analysis** | Describe symptoms by text or voice; receive severity triage and guidance |
| 💊 **Medicine Explainer** | Plain-language explanations of medicines — from text or packaging photos |
| ⏰ **Medication Reminders** | Schedule in-app reminders based on your confirmed medicines |
| 📊 **Medical History** | Chronological timeline of all prescriptions, symptoms, and medicines |
| 👨‍⚕️ **Doctor Portal** | Doctors can search patients and view AI-generated patient summaries |

---

## 🛠️ Technology Stack

### Frontend
| Technology | Role |
|-----------|------|
| **React 18 + Vite** | Component-based SPA; fast development and optimized builds |
| **Tailwind CSS** | Utility-first styling; consistent, responsive design |
| **shadcn/ui** | Accessible, pre-built UI components |
| **Framer Motion** | Smooth animations and page transitions |
| **Lucide Icons** | Consistent SVG icon set |
| **Web Speech API** | Browser-native voice input — no audio stored server-side |

### Backend
| Technology | Role |
|-----------|------|
| **Python 3.11+** | Backend language; first-class AI/ML ecosystem support |
| **FastAPI** | Web framework; auto-generated OpenAPI docs; async support |
| **LangGraph** | Multi-agent graph orchestration with conditional routing |
| **SQLModel** | ORM combining SQLAlchemy + Pydantic |
| **APScheduler** | In-process job scheduler for medication reminders |
| **PyJWT + passlib[bcrypt]** | JWT authentication and secure password hashing |
| **Google gemini-2.5-flash** | Multimodal AI for prescription, symptom, and medicine tasks |

### Database & Storage
| Technology | Role |
|-----------|------|
| **Supabase (PostgreSQL 14+)** | Managed relational database |
| **Supabase Storage** | S3-compatible object storage for prescription and medicine images |

### Deployment
| Platform | Role |
|---------|------|
| **Vercel** | Frontend hosting (React/Vite static deployment) |
| **Hugging Face Spaces (Docker)** | Backend hosting (FastAPI in Docker container) |
| **Docker** | Backend containerization for consistent environments |
| **GitHub** | Version control and CI/CD integration |

---

## 🤖 AI Agent Architecture

MediAssist uses a LangGraph-orchestrated multi-agent pipeline. Each agent handles one specialized task:

```
                         ┌─────────────────────┐
                         │   LangGraph Graph    │
                         └──────────┬──────────┘
                                    │
          ┌─────────────────────────┼──────────────────────────┐
          │                         │                          │
   [Symptom Path]         [Prescription Path]          [Doctor Path]
          │                         │                          │
   ┌──────▼──────┐         ┌────────▼────────┐        ┌───────▼──────────┐
   │ Triage      │         │ Prescription    │        │ Doctor Summary   │
   │ Agent       │         │ Extraction      │        │ Agent            │
   └──────┬──────┘         │ Agent           │        └──────────────────┘
          │                └────────┬────────┘
   ┌──────▼──────┐                  │ (after patient confirmation)
   │ Symptom     │         ┌────────┴────────┐
   │ Analysis    │         │                 │
   │ Agent       │   ┌─────▼──────┐  ┌──────▼──────┐
   └─────────────┘   │ Medicine   │  │ Reminder    │
                     │ Explanation│  │ Agent       │
                     │ Agent      │  │ (Python     │
                     └────────────┘  │  logic only)│
                                     └─────────────┘
```

> The **Reminder Agent** uses deterministic Python logic (a `FREQUENCY_MAP`) — no LLM call — for reliable, cost-free reminder scheduling.

---

## 📁 Project Structure

```
mediassist/
│
├── frontend/           # React + Vite application
├── backend/            # FastAPI + LangGraph application
├── database/           # SQL migration scripts and schema reference
├── docs/               # Full documentation suite (DOC-0 through DOC-6)
├── assets/             # Project-level assets (logos, design files)
├── .gitignore
└── README.md
```

---

## 📚 Documentation

The complete documentation suite lives in the `docs/` directory:

| Document | Title |
|----------|-------|
| `01_Product_Requirements_Document.md` | Product vision, user personas, scope, and constraints |
| `02_Software_Requirements_Specification.md` | Detailed functional and non-functional requirements |
| `03_System_Design_Architecture.md` | System architecture, LangGraph agents, component design |
| `04_Database_API_Design.md` | Database schema, ER diagram, and all API endpoints |
| `05_UIUX_Design.md` | Screen designs, navigation flows, and design system |
| `06_Implementation_Deployment_Guide.md` | Implementation guide, algorithms, testing, and deployment |

---

## ⚙️ Environment Variables

The following environment variables are required for the backend. Copy `backend/.env.example` to `backend/.env` and fill in your values:

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google AI Studio API key |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (backend only) |
| `DATABASE_URL` | PostgreSQL connection string from Supabase |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) |
| `JWT_ALGORITHM` | `HS256` |
| `JWT_EXPIRE_HOURS` | `24` |
| `STORAGE_BUCKET` | `mediassist-uploads` |
| `ALLOWED_ORIGINS` | Your Vercel frontend URL |

Frontend requires:

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Full URL of the deployed FastAPI backend |

---

## 🚀 Development Setup

> **Full setup instructions** are in [`docs/06_Implementation_Deployment_Guide.md`](docs/06_Implementation_Deployment_Guide.md).

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 20 LTS |
| Python | 3.11+ |
| Git | Latest |
| Docker Desktop | Latest |

### Quick Start (Local)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/mediassist.git
cd mediassist

# 2. Backend setup
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
source .venv/bin/activate       # macOS/Linux
pip install -r requirements.txt
cp .env.example .env            # Fill in your environment variables
uvicorn main:app --reload

# 3. Frontend setup (new terminal)
cd frontend
npm install
cp .env.example .env.local      # Set VITE_API_BASE_URL=http://localhost:8000
npm run dev
```

---

## 🌐 Deployment

| Layer | Platform |
|-------|----------|
| Frontend | [Vercel](https://vercel.com) — zero-config React/Vite deployment |
| Backend | [Hugging Face Spaces](https://huggingface.co/spaces) — Docker container |
| Database | [Supabase](https://supabase.com) — managed PostgreSQL |

---

## 🔒 Security

- Passwords hashed with **bcrypt** (work factor 12)
- Stateless **JWT authentication** with 24-hour token expiry
- All API keys stored as **environment secrets** — never in source code
- All AI outputs validated against **Pydantic schemas** before storage or display
- Emergency alert messaging is **hardcoded** — never AI-generated

---

## ⚠️ Disclaimer

MediAssist is an educational/internship project. It is **not a certified medical device** and must not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.

---

<div align="center">

Built with ❤️ as a college internship project · Powered by Google gemini-2.5-flash

</div>
