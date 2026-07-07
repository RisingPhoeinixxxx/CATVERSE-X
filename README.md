# CATVERSE-X

> An AI-powered cat rescue, adoption, and guardian network — built to protect street cats through real-time missions, intelligent health analysis, and community-driven care.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Problem Statement](#problem-statement)
- [Features](#features)
- [AI Workflow](#ai-workflow)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [API Endpoints](#api-endpoints)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Future Improvements](#future-improvements)

---

## Project Overview

CATVERSE-X is a full-stack rescue coordination platform for street and stray cats. It combines a **FastAPI backend**, a **Next.js 15 frontend**, and a modular **AI engine** to give rescue volunteers (called *Guardians*) a mission control experience — from spotting a cat in need, filing a rescue report, and dispatching a mission, all the way through to adoption tracking and health prediction.

The platform surfaces real-time rescue data on an interactive map, ranks Guardians on a leaderboard, connects adopters with shelters, and uses AI to analyse cat health from images and predict adoption likelihood.

---

## Problem Statement

Millions of street cats go untracked, untreated, and unadopted every year. Rescue efforts are fragmented — volunteers use WhatsApp groups, spreadsheets, or nothing at all. Shelters have no live visibility into incoming cases. Adopters have no easy discovery layer. And there is no feedback loop that motivates volunteers to keep helping.

CATVERSE-X solves this by giving every participant — rescuers, shelter staff, vets, and adopters — a single, real-time platform with AI-assisted triage, gamified engagement, and structured mission workflows.

---

## Features

### Guardian System
- Register and log in as a named Guardian with XP and level progression
- Personal profile tracking rescues, XP, and guardian level
- Leaderboard ranking Guardians by weekly rescue count

### Rescue Reports
- Submit rescue reports with cat name, status, health condition, and priority
- Geolocated reports plotted on a live interactive map
- Priority triage: Low / Medium / High / Emergency

### Mission Control
- Active mission board showing assigned Guardian, location, ETA, and status
- Mission stats: active count, total rescues, success rate, volunteer count
- Missions linked to rescue reports and assigned Guardians

### Live Map
- Leaflet-powered interactive map of all active cat sightings and reports
- Activity feed showing the 10 most recent rescue reports
- Shelter locations with capacity and contact data

### Adoption Network
- Browse cats available for adoption with health scores and AI scores
- Adoption stats: available, adopted, and success rate
- Shelter profiles with capacity, contact info, and animal counts

### Dashboard
- Mission control HUD with aggregate stats
- Live impact panel: cats protected, rescue missions, AI accuracy, active guardians
- Top Guardians leaderboard panel

### Oracle AI Assistant
- Dedicated Oracle interface for AI-driven rescue Q&A and guidance (frontend component ready, backend endpoint planned)

### Notifications
- User notification model supporting read/unread state per guardian

---

## AI Workflow

The `ai-engine/` directory is the standalone AI layer, structured as independent modules:

```
User submits rescue report (photo + metadata)
        │
        ▼
┌───────────────────┐
│   detector/       │  ← Cat detection in image (object detection model)
│                   │     Confirms a cat is present before processing
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│   health/         │  ← Health scoring from visual cues
│                   │     Outputs a health_score (0–100)
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│   embeddings/     │  ← Visual embedding generation
│                   │     Used for cat identity matching / deduplication
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│   prediction/     │  ← Adoption likelihood prediction
│                   │     Outputs ai_score for ranking in adoption feed
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│   adoption/       │  ← Adoption recommendation and matching logic
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│   utils/ models/  │  ← Shared preprocessing, model loading, weight files
│   weights/        │
└───────────────────┘
        │
        ▼
  Results written back to RescueReport.ai_summary
  and Cat.health_score / Cat.ai_score in the database
```

The backend `api/` directory contains stub endpoints (Oracle, Scanner, Detector, etc.) that will serve as the HTTP interface between the FastAPI backend and the AI engine once integrated.

---

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Framework | FastAPI |
| ORM | SQLAlchemy |
| Database | PostgreSQL 17 |
| Auth | JWT (python-jose) + bcrypt (passlib) |
| Validation | Pydantic v2 |
| Server | Uvicorn |
| Config | python-dotenv |

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + CSS Modules |
| Map | Leaflet + react-leaflet |
| Icons | react-icons |
| State | React hooks (useState, useEffect) |

### AI Engine
| Module | Purpose |
|---|---|
| detector | Cat presence detection |
| health | Visual health scoring |
| embeddings | Cat identity embeddings |
| prediction | Adoption likelihood prediction |
| adoption | Adoption matching |

### Infrastructure
| Tool | Purpose |
|---|---|
| Docker Compose | PostgreSQL local development |
| GitHub Actions | CI/CD (workflows directory, pipelines pending) |

---

## Folder Structure

```
CATVERSE-X/
│
├── backend/
│   ├── .env                        # Environment variables
│   ├── requirements.txt
│   └── app/
│       ├── main.py                 # FastAPI app entry point, CORS, router registration
│       ├── config.py               # Env var loading
│       ├── database.py             # SQLAlchemy engine and session factory
│       ├── dependencies.py         # JWT auth dependency (get_current_user)
│       ├── security.py             # Password hashing and JWT creation
│       │
│       ├── models/                 # SQLAlchemy ORM models
│       │   ├── user.py             # Guardian/User
│       │   ├── cat.py              # Cat with health_score, ai_score, status
│       │   ├── report.py           # RescueReport with geo-coordinates
│       │   ├── mission.py          # Mission linked to report + guardian
│       │   ├── shelter.py          # Shelter with capacity tracking
│       │   ├── leaderboard.py      # XP, rank, rescue count per user
│       │   └── notification.py     # Per-user read/unread notifications
│       │
│       ├── schemas/                # Pydantic request/response schemas
│       │   ├── user.py
│       │   ├── cat.py
│       │   ├── report.py
│       │   ├── dashboard.py
│       │   └── token.py
│       │
│       ├── routes/                 # Active API route handlers
│       │   ├── auth.py             # Register, login
│       │   ├── users.py            # /users/me profile
│       │   ├── cats.py             # Cat listing
│       │   ├── report.py           # Rescue report submission
│       │   ├── mission.py          # Mission board + stats
│       │   ├── shelters.py         # Shelter listing + stats
│       │   ├── adoptions.py        # Adoption feed + stats
│       │   ├── map.py              # Map cats + recent activity feed
│       │   └── dashboard.py        # Aggregate dashboard stats
│       │
│       ├── api/                    # AI integration endpoints (stubs)
│       │   ├── oracle.py
│       │   ├── scanner.py
│       │   ├── adoption.py
│       │   ├── analytics.py
│       │   └── ...
│       │
│       └── services/               # Business logic service layer (stubs)
│           ├── cat_service.py
│           ├── auth_service.py
│           ├── mission_service.py
│           └── ...
│
├── frontend/
│   ├── package.json
│   ├── next.config.ts
│   ├── lib/
│   │   └── api.ts                  # login(), register() — shared API client
│   └── src/
│       ├── app/                    # Next.js App Router pages
│       │   ├── page.tsx            # Landing / intro
│       │   ├── login/
│       │   ├── dashboard/
│       │   ├── map/
│       │   ├── report/
│       │   ├── missions/
│       │   ├── adoptions/
│       │   ├── cats/
│       │   ├── shelters/
│       │   ├── analytics/
│       │   ├── about/
│       │   └── intro/
│       ├── components/             # UI component library
│       │   ├── dashboard/          # HUD panels, live impact, mission status
│       │   ├── map/                # RescueMap, ActivityFeed
│       │   ├── report/             # ReportForm
│       │   ├── adoptions/          # AdoptionGrid, AdoptionStats
│       │   ├── missions/
│       │   ├── shelters/
│       │   ├── oracle/             # Oracle AI chat interface
│       │   ├── login/              # Auth panels
│       │   ├── Navbar/
│       │   ├── hero/
│       │   ├── hud/                # HudPanel stat card
│       │   └── ...
│       ├── lib/                    # Per-feature fetch helpers (report, dashboard)
│       ├── services/
│       ├── hooks/
│       ├── types/
│       └── utils/
│
├── ai-engine/
│   ├── detector/                   # Cat detection model
│   ├── health/                     # Health scoring
│   ├── embeddings/                 # Identity embeddings
│   ├── prediction/                 # Adoption prediction
│   ├── adoption/                   # Adoption matching
│   ├── models/                     # Model definitions
│   ├── weights/                    # Trained model weights
│   └── utils/                      # Shared preprocessing utilities
│
├── assets/
│   ├── branding/
│   ├── screenshots/
│   ├── mockups/
│   ├── demo/
│   └── videos/
│
├── docker-compose.yml              # PostgreSQL local dev container
└── README.md
```

---

## API Endpoints

All endpoints are prefixed from the root. The interactive docs are available at `http://localhost:8000/docs` once the backend is running.

### Authentication
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Register a new Guardian account |
| POST | `/auth/login` | — | Login and receive a JWT |

### Users
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/users/me` | JWT | Get the current Guardian's profile |

### Rescue Reports
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/report/` | JWT | Submit a new rescue report |

### Cats
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/cats/` | — | List all cats |

### Map
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/map/` | — | All cat sightings with coordinates |
| GET | `/map/activity` | — | 10 most recent rescue reports |

### Missions
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/missions/` | — | Active mission board |
| GET | `/missions/stats` | — | Mission count, rescue count, success rate |

### Adoptions
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/adoptions/` | — | Cats available for adoption |
| GET | `/adoptions/stats` | — | Adoption availability and success rate |

### Shelters
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/shelters/` | — | All registered shelters |
| GET | `/shelters/stats` | — | Registered count, available beds, capacity |

### Dashboard
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/dashboard/stats` | — | Aggregate platform stats |

---

## Installation

### Prerequisites

- Python 3.11+
- Node.js 20+
- Docker Desktop (for PostgreSQL)
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/catverse-x.git
cd catverse-x
```

---

### 2. Start the Database

```bash
docker-compose up -d
```

This starts a PostgreSQL 17 container on port `5432`. The database schema is created automatically on first backend startup.

---

### 3. Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Copy and configure the environment file
copy .env.example .env         # Windows
# cp .env.example .env         # macOS / Linux
# (then fill in the values — see Environment Variables below)

# Start the API server
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.
Interactive docs: `http://localhost:8000/docs`

---

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy and configure the environment file
copy .env.local.example .env.local    # Windows
# cp .env.local.example .env.local   # macOS / Linux
# Set NEXT_PUBLIC_API_URL=http://localhost:8000

# Start the dev server
npm run dev
```

The frontend will be available at `http://localhost:3000`.

---

## Environment Variables

### Backend — `backend/.env`

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/catverse
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### Frontend — `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Future Improvements

### Security
- Replace `allow_origins=["*"]` with an explicit allowlist of frontend origins
- Add rate limiting on `/auth/login` and `/auth/register` to prevent brute force
- Implement refresh token rotation with secure httpOnly cookies
- Add role-based access control (Guardian vs. Admin vs. Shelter Staff)
- Validate all environment variables at startup with a structured Pydantic `Settings` model

### Backend
- Integrate Alembic for database migrations (replace `create_all` with versioned migration files)
- Implement the service layer (`services/`) to move business logic out of route handlers
- Connect the `api/` AI integration endpoints to the `ai-engine/` modules
- Fix N+1 queries in `/missions/` using SQLAlchemy `joinedload`
- Add structured request logging and error tracking (e.g., Sentry)
- Add a real test suite using pytest and HTTPX async test client
- Containerise the backend and add it to `docker-compose.yml`

### Frontend
- Replace all hardcoded localhost URLs with `NEXT_PUBLIC_API_URL`
- Replace hardcoded mock data in Dashboard, LiveImpact, MissionStatus, and TopGuardians with real API calls
- Integrate browser Geolocation API (or map picker) into ReportForm for real coordinates
- Implement the Oracle AI chat interface with a streaming response pattern
- Wire up or remove the non-functional Google / GitHub / Discord social login buttons
- Add token expiry detection and auto-redirect to login when JWT expires
- Implement proper error boundaries and loading skeletons across all data-fetching components

### AI Engine
- Train and integrate the cat health scoring model into the report submission pipeline
- Implement cat identity deduplication using the embeddings module (prevent the same cat being reported multiple times)
- Connect adoption prediction scores to the adoption feed ranking
- Surface the AI summary in the rescue report detail view

### Infrastructure & DevOps
- Add GitHub Actions CI pipeline: lint, type-check, and test on every pull request
- Add production Dockerfiles for backend and frontend
- Add Nginx reverse proxy config for production deployment
- Set up environment-specific configs for staging and production

---

## Built During

This project was developed during the Coding Kitty Hackathon using:

- FastAPI
- Next.js
- PostgreSQL
- Leaflet
- SQLAlchemy
- Kiro AI (architecture review, documentation generation, project audit) 

## License

This project is currently unlicensed. Add a `LICENSE` file before any public distribution.

---

*Built with purpose — for every cat that deserves a second chance.*
