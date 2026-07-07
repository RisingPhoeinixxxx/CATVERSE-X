# CATVERSE-X — Software Architecture Documentation

> This document describes the complete technical architecture of CATVERSE-X:
> an AI-powered cat rescue, adoption, and guardian coordination platform.
> It covers every layer from the browser down to the database and AI engine,
> including the current implementation state and the planned extensions.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Frontend Architecture](#2-frontend-architecture)
3. [Backend Architecture](#3-backend-architecture)
4. [Database Schema](#4-database-schema)
5. [API Flow](#5-api-flow)
6. [Authentication Flow](#6-authentication-flow)
7. [AI Workflow](#7-ai-workflow)
8. [Current Gaps and Planned Extensions](#8-current-gaps-and-planned-extensions)

---

## 1. System Overview

CATVERSE-X is a three-tier web application composed of:

| Tier | Technology | Responsibility |
|------|------------|----------------|
| **Presentation** | Next.js 15 (App Router, TypeScript) | UI rendering, routing, auth state |
| **API** | FastAPI (Python 3.11+) | Business logic, REST endpoints, JWT auth |
| **Data** | PostgreSQL 17 | Persistent relational storage |
| **AI Engine** | Python modules (standalone) | Image analysis, health scoring, adoption prediction |


### High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         BROWSER / CLIENT                            │
│                                                                     │
│   Next.js 15 App Router  ─── Tailwind CSS + CSS Modules            │
│   Leaflet Map  ─── react-icons  ─── Google Fonts (Orbitron/Inter)  │
│                                                                     │
│   localStorage: JWT token, guardian_name, guardian_level           │
└──────────────────────────────┬──────────────────────────────────────┘
                               │  HTTP/REST (JSON)
                               │  Authorization: Bearer <JWT>
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        FASTAPI BACKEND                              │
│                                                                     │
│   Uvicorn ASGI server                                               │
│   CORSMiddleware  ─── OAuth2PasswordBearer  ─── Pydantic v2        │
│   Routes → Dependencies → ORM → PostgreSQL                         │
│                                                                     │
│   Planned: AI Engine HTTP bridge  ─── WebSocket layer              │
└────────────┬────────────────────────────────────────────────────────┘
             │  SQLAlchemy ORM (psycopg2)
             ▼
┌─────────────────────────────┐      ┌──────────────────────────────┐
│       POSTGRESQL 17         │      │        AI ENGINE             │
│                             │      │                              │
│  users          missions    │      │  detector/   health/         │
│  cats           shelters    │      │  embeddings/ prediction/     │
│  rescue_reports leaderboard │      │  adoption/   utils/          │
│  notifications              │      │  models/     weights/        │
└─────────────────────────────┘      └──────────────────────────────┘
```

### Request Lifecycle (summary)

```
Browser → [Next.js page/component]
        → fetch(API_URL + endpoint, { headers: { Authorization: Bearer <token> } })
        → FastAPI CORSMiddleware
        → Route handler
        → get_current_user dependency (JWT decode → DB user lookup)
        → SQLAlchemy query → PostgreSQL
        → Pydantic response model serialisation
        → JSON response → component state → re-render
```

---
## 2. Frontend Architecture

### 2.1 Technology Choices

| Concern | Choice | Reason |
|---------|--------|--------|
| Framework | Next.js 15 (App Router) | File-based routing, SSR/SSG, layouts |
| Language | TypeScript 5 | Type safety across API contracts |
| Styling | Tailwind CSS v4 + CSS Modules | Utility classes for layout; scoped modules per component |
| Map | Leaflet 1.9 + react-leaflet 5 | OpenStreetMap tiles, marker clustering, SSR-safe via `dynamic()` |
| Icons | react-icons 5 | Google, GitHub, Discord, and general UI icons |
| Fonts | Google Fonts via `next/font` | Orbitron (headings), Inter (body), Space Grotesk (UI) |
| Auth storage | `localStorage` | Token, guardian name, guardian level persisted client-side |

---

### 2.2 Routing Structure (App Router)

Every directory under `frontend/src/app/` maps to a URL segment.

```
/                   → src/app/page.tsx           → <Intro /> onboarding component
/login              → src/app/login/             → <RightPanel /> auth form + <LeftPanel /> branding
/dashboard          → src/app/dashboard/         → <Dashboard /> HUD + live panels
/report             → src/app/report/            → <ReportForm /> rescue submission
/missions           → src/app/missions/          → <MissionGrid /> + <MissionStats />
/map                → src/app/map/               → <RescueMap /> + <ActivityFeed />
/cats               → src/app/cats/              → cat listing
/adoptions          → src/app/adoptions/         → <AdoptionGrid /> + <AdoptionStats />
/shelters           → src/app/shelters/          → <ShelterGrid />
/analytics          → src/app/analytics/         → <AnalyticsDashboard /> (placeholder)
/about              → src/app/about/
/intro              → src/app/intro/
```

All authenticated pages rely on the shared `<Navbar />` component, which reads
`localStorage` on mount to show the guardian's name, level, and a logout button.

---

### 2.3 Component Hierarchy

```
RootLayout (layout.tsx)
│  Fonts: Orbitron, Inter, Space Grotesk
│  Global styles: bg-[#050816] dark theme
│
├── /  →  <Intro />  (onboarding / landing)
│
├── /login
│   ├── <LeftPanel />   branding + animated visuals
│   └── <RightPanel />  email/password form → calls login() → localStorage
│
├── /dashboard
│   ├── <Navbar />
│   ├── <Dashboard />
│   │   ├── <HudPanel title="Active Guardians" />   ← hardcoded (⚠ not yet API-driven)
│   │   ├── <HudPanel title="Cats Saved" />         ← hardcoded
│   │   ├── <HudPanel title="Mission Success" />    ← hardcoded
│   │   ├── <HudPanel title="AI Status" />          ← hardcoded
│   │   ├── <LiveImpact />                          ← hardcoded
│   │   ├── <MissionStatus />                       ← hardcoded mock missions
│   │   └── <TopGuardians />                        ← hardcoded mock guardians
│
├── /report
│   ├── <Navbar />
│   └── <ReportForm />   form → submitReport() → POST /report/
│
├── /missions
│   ├── <Navbar />
│   ├── <MissionHero />
│   ├── <MissionStats />    fetch → GET /missions/stats
│   └── <MissionGrid />     fetch → GET /missions/  → maps to <MissionCard />
│
├── /map
│   ├── <Navbar />
│   ├── <MapHero />
│   ├── <RescueMap />       fetch → GET /map/  → <LeafletMap cats={} />
│   └── <ActivityFeed />    fetch → GET /map/activity
│
├── /adoptions
│   ├── <Navbar />
│   ├── <AdoptionStats />   fetch → GET /adoptions/stats
│   └── <AdoptionGrid />    fetch → GET /adoptions/  → maps to <AdoptionCard />
│
├── /shelters
│   ├── <Navbar />
│   └── <ShelterGrid />     fetch → GET /shelters/  → maps to <ShelterCard />
│
└── /analytics
    ├── <Navbar />
    ├── <AnalyticsHero />
    ├── <AnalyticsStats />
    └── <AnalyticsDashboard />   placeholder — "Coming Soon"
```

---
### 2.4 API Integration Layer

All data fetching is done with the native `fetch` API — no third-party HTTP client.
Fetch calls are co-located in two places:

| Location | Pattern | Used by |
|----------|---------|---------|
| `frontend/lib/api.ts` | Named async functions (`login`, `register`) | Auth components |
| `frontend/src/lib/report.ts` | `submitReport()` with Bearer token | `<ReportForm />` |
| `frontend/src/lib/dashboard.ts` | `getDashboardStats()` | Intended for dashboard (not yet wired) |
| Inside `useEffect` blocks | Inline `fetch()` calls | Map, Missions, Adoptions, Shelters, Activity Feed |

All API base URLs are currently hardcoded as `http://127.0.0.1:8000`.
The intended pattern is a single `NEXT_PUBLIC_API_URL` env variable (see gaps section).

#### Auth token flow in components

```
Component mounts
  └── useEffect / event handler
        ├── reads localStorage.getItem("token")
        ├── attaches header: Authorization: Bearer <token>
        └── calls fetch(API_URL + path, options)
```

#### `<Navbar />` auth state pattern

```
useEffect (client-side only)
  └── reads localStorage("token")
        ├── token present  → setLoggedIn(true), load name + level
        └── token absent   → show "Login / Register" link

logout()
  └── localStorage.removeItem x3
        └── router.push("/login")
```

---

### 2.5 Map Architecture

Leaflet cannot run server-side because it accesses `window`. The map is isolated
behind a dynamic import with `ssr: false`:

```typescript
// RescueMap.tsx
const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });
```

```
RescueMap (data fetching shell)
│   state: cats[]
│   useEffect → GET /map/ → setCats(data)
│
└── LeafletMap (pure render, no SSR)
        MapContainer  center=[12.9716, 77.5946]  zoom=12
        TileLayer     https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
        cats.map → <Marker position=[lat, lng]>
                        <Popup> name · status · health_score · ai_score </Popup>
```

---

### 2.6 Styling Architecture

```
globals.css          Root CSS variables, resets, scroll behaviour
Tailwind v4          Layout, spacing, color utilities (bg-[#050816], antialiased)
ComponentName.css    Scoped BEM-style rules per component (co-located)
next/font            CSS variables: --font-orbitron, --font-inter, --font-space
```

The overall visual theme is a dark sci-fi mission-control aesthetic:
deep navy/black backgrounds, cyan/green accent highlights, Orbitron for
all heading text.

---
## 3. Backend Architecture

### 3.1 Technology Choices

| Concern | Choice | Reason |
|---------|--------|--------|
| Framework | FastAPI | Async-capable, automatic OpenAPI docs, Pydantic-native |
| ASGI server | Uvicorn | Production-grade, supports HTTP/1.1 and WebSockets |
| ORM | SQLAlchemy 2.x (sync session) | Declarative models, relationship mapping |
| DB driver | psycopg2-binary | PostgreSQL adapter for SQLAlchemy sync engine |
| Auth | python-jose (JWT) + passlib/bcrypt | Industry-standard token auth + secure password hashing |
| Validation | Pydantic v2 | Request/response schema enforcement, `EmailStr` |
| Config | python-dotenv | `.env` file loading into `os.getenv()` |
| Docs | FastAPI built-in | Swagger UI at `/docs`, ReDoc at `/redoc` |

---

### 3.2 Application Entry Point

`backend/app/main.py` is the single entry point. On import it:

1. Calls `Base.metadata.create_all(bind=engine)` — creates all tables if absent
2. Instantiates the `FastAPI` app with title, description, and version
3. Registers `CORSMiddleware` (currently `allow_origins=["*"]`)
4. Includes all nine route routers with their prefix and tag

```python
# startup sequence
engine created (config.py → DATABASE_URL)
  └── Base.metadata.create_all()        # DDL on first run
        └── FastAPI() app instantiated
              └── CORSMiddleware added
                    └── 9 routers registered
                          └── Uvicorn serves on :8000
```

---

### 3.3 Layer Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    FASTAPI APPLICATION                  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │               ROUTE HANDLERS  (routes/)          │   │
│  │  auth · users · report · cats · map · missions   │   │
│  │  shelters · adoptions · dashboard                │   │
│  └────────────┬─────────────────────────────────────┘   │
│               │  Depends()                              │
│  ┌────────────▼─────────────────────────────────────┐   │
│  │             DEPENDENCIES  (dependencies.py)      │   │
│  │  get_current_user  ─── oauth2_scheme             │   │
│  │  get_db (via database.py)                        │   │
│  └────────────┬─────────────────────────────────────┘   │
│               │                                         │
│  ┌────────────▼─────────────────────────────────────┐   │
│  │         PYDANTIC SCHEMAS  (schemas/)             │   │
│  │  UserCreate · UserLogin · UserResponse · Token   │   │
│  │  CatCreate · CatResponse                        │   │
│  │  ReportCreate · ReportResponse                  │   │
│  │  DashboardStats                                 │   │
│  └────────────┬─────────────────────────────────────┘   │
│               │                                         │
│  ┌────────────▼─────────────────────────────────────┐   │
│  │          SQLALCHEMY MODELS  (models/)            │   │
│  │  User · Cat · RescueReport · Mission             │   │
│  │  Shelter · Leaderboard · Notification            │   │
│  └────────────┬─────────────────────────────────────┘   │
│               │  SQLAlchemy engine (psycopg2)           │
└───────────────┼─────────────────────────────────────────┘
                │
                ▼
         PostgreSQL 17
```

---

### 3.4 Module Responsibilities

#### `config.py`
Loads all environment variables via `python-dotenv`. Exposes four module-level constants:

```
DATABASE_URL                 → SQLAlchemy engine connection string
SECRET_KEY                   → HMAC signing key for JWTs
ALGORITHM                    → "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES  → int, token TTL
```

#### `database.py`
Creates the SQLAlchemy engine and session factory. Provides the `get_db` generator
dependency used by every route that touches the database.

```python
engine = create_engine(DATABASE_URL, echo=True)   # ⚠ echo=True logs all SQL
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():           # FastAPI dependency
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

#### `security.py`
Two responsibilities: password hashing and JWT creation.

```
hash_password(plain)     → bcrypt hash via passlib CryptContext
verify_password(plain, hashed) → bool
create_access_token(data: dict) → signed JWT string
  └── adds "exp" claim: utcnow() + ACCESS_TOKEN_EXPIRE_MINUTES
```

#### `dependencies.py`
Single exported function `get_current_user`. Used as a FastAPI `Depends()` on
any protected route.

```
OAuth2PasswordBearer reads "Authorization: Bearer <token>" header
  └── jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        └── extracts "sub" (email)
              └── db.query(User).filter(User.email == email).first()
                    └── returns User ORM object or raises HTTP 401
```

---
### 3.5 Route Handlers

Each router is a self-contained `APIRouter` with a prefix and tag.
The table below shows every active endpoint, its auth requirement, and any
architectural notes.

| Router file | Prefix | Endpoints | Auth | Notes |
|-------------|--------|-----------|------|-------|
| `routes/auth.py` | `/auth` | POST `/register` POST `/login` | None | Imports `UserCreate` from legacy `schemas.py` — field mismatch bug |
| `routes/users.py` | `/users` | GET `/me` | JWT | Returns `current_user.name` — field name bug (`full_name` in model) |
| `routes/report.py` | `/report` | POST `/` | JWT | Creates `RescueReport`; has debug `print()` in handler |
| `routes/cats.py` | `/cats` | GET `/` | None | Returns all cats, no pagination |
| `routes/map.py` | `/map` | GET `/` GET `/activity` | None | `/activity` returns last 10 reports ordered by `created_at` desc |
| `routes/missions.py` | `/missions` | GET `/` GET `/stats` | None | N+1 query: 2 extra queries per mission row |
| `routes/shelters.py` | `/shelters` | GET `/` GET `/stats` | None | Stats response has misleading key names |
| `routes/adoptions.py` | `/adoptions` | GET `/` GET `/stats` | None | Filters `Cat.status == "Adoption"` |
| `routes/dashboard.py` | `/dashboard` | GET `/stats` | None | Manually opens `SessionLocal()` instead of `Depends(get_db)` — connection leak risk |

---

### 3.6 Schema Dual-File Problem

There are **two parallel schema definitions** in the project — a legacy flat
file and a proper package. The same conflict exists for models.

```
backend/app/
├── models.py          ← LEGACY: User with "name" column
├── models/            ← ACTIVE: User with "full_name", plus Cat, Mission, etc.
│
├── schemas.py         ← LEGACY: UserCreate with "name" field, Token
└── schemas/           ← ACTIVE: UserCreate with "full_name", all schemas
```

Several routes import from the legacy flat files, causing field-mismatch
runtime errors. The resolution is to delete `models.py` and `schemas.py`
(root-level) and migrate all imports to the package versions.

---

### 3.7 Stub Directories (Not Yet Implemented)

These directories exist as scaffolding but contain no code:

| Directory | Intended role |
|-----------|--------------|
| `app/services/` | Business logic layer (cat_service, auth_service, mission_service, analytics_service, …) |
| `app/api/` | AI engine HTTP integration endpoints (oracle, scanner, adoption, analytics, …) |
| `app/core/` | Shared core utilities (logging, exception handlers, settings class) |
| `app/middleware/` | Custom ASGI middleware (rate limiting, request logging) |
| `app/websocket/` | WebSocket handlers for real-time mission updates |
| `app/utils/` | Shared helper functions |

All business logic currently lives directly in route handlers as a result.

---

### 3.8 Dependency Injection Graph

```
Route handler
  ├── db: Session = Depends(get_db)
  │     └── SessionLocal() → yields db → finally db.close()
  │
  └── current_user: User = Depends(get_current_user)
        ├── token: str = Depends(oauth2_scheme)   ← reads Authorization header
        └── db: Session = Depends(get_db)         ← separate session instance
```

FastAPI resolves `get_db` independently for `get_current_user` and the route
handler — two sessions are opened per authenticated request.

---
## 4. Database Schema

### 4.1 Overview

PostgreSQL 17 is the sole data store. All tables are created via SQLAlchemy's
`Base.metadata.create_all()` at startup — no migration tool is currently in use.
There are **7 tables** across **7 ORM model files**.

```
users
cats
rescue_reports
missions
shelters
leaderboard
notifications
```

---

### 4.2 Entity-Relationship Diagram

```
┌─────────────────────┐         ┌──────────────────────────┐
│        users        │         │       rescue_reports      │
├─────────────────────┤         ├──────────────────────────┤
│ id          PK  INT │◄──┐     │ id           PK  INT     │
│ full_name       STR │   │     │ cat_name         STR     │
│ email    UNIQUE STR │   │     │ status           STR     │
│ password        STR │   │     │ health           STR     │
│ guardian_level  INT │   │     │ priority         STR     │
│ guardian_xp     INT │   │     │ description      TEXT    │
│ total_rescues   INT │   │     │ latitude         FLOAT   │
│ avatar          STR │   │     │ longitude        FLOAT   │
│ is_admin       BOOL │   │     │ image_url        STR     │
│ created_at DATETIME │   │     │ ai_summary       TEXT    │
└─────────────────────┘   │     │ reporter_id  FK  INT ────┼──► users.id
                           │     │ created_at   DATETIME    │
                           │     └──────────────────────────┘
                           │              │
                           │              │ id
                           │              ▼
                           │     ┌──────────────────────────┐
                           │     │         missions         │
                           │     ├──────────────────────────┤
                           │     │ id           PK  INT     │
                           │     │ report_id    FK  INT ────┼──► rescue_reports.id
                           └─────┼─guardian_id  FK  INT     │
                                 │ status           STR     │
                                 │ started_at   DATETIME    │
                                 │ completed_at DATETIME    │
                                 └──────────────────────────┘

┌──────────────────────────┐     ┌──────────────────────────┐
│          cats            │     │        leaderboard       │
├──────────────────────────┤     ├──────────────────────────┤
│ id           PK  INT     │     │ id           PK  INT     │
│ name             STR     │     │ user_id      FK  INT ────┼──► users.id
│ breed            STR     │     │ xp               INT     │
│ gender           STR     │     │ rank             INT     │
│ age              STR     │     │ rescues          INT     │
│ color            STR     │     └──────────────────────────┘
│ health_score     FLOAT   │
│ ai_score         FLOAT   │     ┌──────────────────────────┐
│ status           STR     │     │      notifications       │
│ latitude         FLOAT   │     ├──────────────────────────┤
│ longitude        FLOAT   │     │ id           PK  INT     │
│ image_url        STR     │     │ user_id      FK  INT ────┼──► users.id
│ description      STR     │     │ title            STR     │
│ reported_by  FK  INT ────┼──►  │ message          STR     │
│ created_at   DATETIME    │     │ read            BOOL     │
└──────────────────────────┘     │ created_at   DATETIME    │
                                 └──────────────────────────┘

┌──────────────────────────┐
│         shelters         │
├──────────────────────────┤
│ id           PK  INT     │
│ name             STR     │
│ address          STR     │
│ phone            STR     │
│ email            STR     │
│ latitude         FLOAT   │
│ longitude        FLOAT   │
│ capacity         INT     │
│ current_animals  INT     │
└──────────────────────────┘
```

---
### 4.3 Table Definitions

#### `users`
Central identity and gamification table. Every guardian, admin, and shelter
staff member is a row here.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | INTEGER | PK, index | Auto-increment |
| `full_name` | VARCHAR | NOT NULL | Display name |
| `email` | VARCHAR | UNIQUE, index, NOT NULL | Login credential |
| `password` | VARCHAR | NOT NULL | bcrypt hash, never plain text |
| `guardian_level` | INTEGER | default=1 | XP tier |
| `guardian_xp` | INTEGER | default=0 | Accumulated experience points |
| `total_rescues` | INTEGER | default=0 | Denormalised rescue counter |
| `avatar` | VARCHAR | nullable | Profile image URL |
| `is_admin` | BOOLEAN | default=False | Admin role flag |
| `created_at` | TIMESTAMPTZ | server_default=now() | Account creation time |

---

#### `cats`
Every cat known to the system — spotted, rescued, in shelter, or adopted.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | INTEGER | PK | Auto-increment |
| `name` | VARCHAR | nullable | Human-assigned name |
| `breed` | VARCHAR | nullable | |
| `gender` | VARCHAR | nullable | |
| `age` | VARCHAR | nullable | Stored as text (e.g. "~2 years") |
| `color` | VARCHAR | nullable | |
| `health_score` | FLOAT | nullable | 0–100, set by AI health module |
| `ai_score` | FLOAT | nullable | 0–100, adoption likelihood from AI |
| `status` | VARCHAR | nullable | Stray / Rescued / Critical / Adopted / Adoption |
| `latitude` | FLOAT | nullable | Sighting coordinates |
| `longitude` | FLOAT | nullable | |
| `image_url` | VARCHAR | nullable | Photo URL |
| `description` | VARCHAR | nullable | |
| `reported_by` | INTEGER | FK → users.id | Guardian who first logged the cat |
| `created_at` | TIMESTAMPTZ | server_default=now() | |

---

#### `rescue_reports`
A report filed by a guardian for a specific cat sighting or rescue need.
One cat can have many reports; one report spawns at most one mission.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | INTEGER | PK, index | |
| `cat_name` | VARCHAR | nullable | Optional name at time of report |
| `status` | VARCHAR | NOT NULL | Stray / Lost / Injured / Abandoned / Needs Medical Help |
| `health` | VARCHAR | NOT NULL | Healthy / Minor Injury / Critical / Unknown |
| `priority` | VARCHAR | NOT NULL | Low / Medium / High / Emergency |
| `description` | TEXT | nullable | Free-text incident description |
| `latitude` | FLOAT | nullable | Report location |
| `longitude` | FLOAT | nullable | |
| `image_url` | VARCHAR | nullable | Attached photo |
| `ai_summary` | TEXT | nullable | Populated by Kuro AI engine |
| `reporter_id` | INTEGER | FK → users.id | Authenticated guardian |
| `created_at` | TIMESTAMPTZ | server_default=now() | |

Relationship: `reporter = relationship("User")` — no back-populates defined yet.

---

#### `missions`
A dispatched rescue mission linked to a report and assigned to a guardian.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | INTEGER | PK | |
| `report_id` | INTEGER | FK → rescue_reports.id | Source report |
| `guardian_id` | INTEGER | FK → users.id | Assigned volunteer |
| `status` | VARCHAR | default="Assigned" | Assigned / In Progress / Completed |
| `started_at` | TIMESTAMPTZ | server_default=now() | |
| `completed_at` | DATETIME | nullable | Set when mission is closed |

---

#### `shelters`
Registered animal shelters with location and capacity data.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | INTEGER | PK | |
| `name` | VARCHAR | nullable | |
| `address` | VARCHAR | nullable | |
| `phone` | VARCHAR | nullable | |
| `email` | VARCHAR | nullable | |
| `latitude` | FLOAT | nullable | Map pin |
| `longitude` | FLOAT | nullable | |
| `capacity` | INTEGER | nullable | Max animals |
| `current_animals` | INTEGER | default=0 | Current occupancy |

---

#### `leaderboard`
Denormalised ranking table. One row per user.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | INTEGER | PK | |
| `user_id` | INTEGER | FK → users.id | |
| `xp` | INTEGER | default=0 | |
| `rank` | INTEGER | default=0 | Computed rank position |
| `rescues` | INTEGER | default=0 | Mission completion count |

---

#### `notifications`
Per-guardian notification inbox.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | INTEGER | PK | |
| `user_id` | INTEGER | FK → users.id | Recipient |
| `title` | VARCHAR | nullable | Notification heading |
| `message` | VARCHAR | nullable | Body text |
| `read` | BOOLEAN | default=False | Read/unread state |
| `created_at` | TIMESTAMPTZ | server_default=now() | |

---

### 4.4 Relationship Summary

```
users ──< rescue_reports      (one guardian files many reports)
users ──< missions            (one guardian assigned to many missions)
users ──< leaderboard         (one leaderboard entry per user)
users ──< notifications       (one inbox per user)
users ──< cats                (one guardian reports many cats)
rescue_reports ──< missions   (one report spawns at most one mission in practice)
```

Only `RescueReport.reporter` has a SQLAlchemy `relationship()` defined.
All other FK constraints are enforced at the DB level only — no ORM
back-populates or lazy-loading is configured yet.

---

### 4.5 Schema Management

| Mechanism | Status |
|-----------|--------|
| `Base.metadata.create_all()` | Active — runs on every startup, creates missing tables |
| Alembic migrations | Not configured — no `alembic.ini` or `versions/` directory |
| `database/schema.sql` | Present but empty |

This means column additions, renames, or drops on existing tables require
manual SQL or a full table drop in development. Alembic is the planned
replacement (see section 8).

---
## 5. API Flow

### 5.1 Complete Endpoint Reference

| Method | Path | Auth | Request Body | Response | Handler |
|--------|------|------|-------------|----------|---------|
| GET | `/` | — | — | `{status, project, message}` | `main.py` root |
| POST | `/auth/register` | — | `UserCreate` | `UserResponse` | `routes/auth.py` |
| POST | `/auth/login` | — | `UserLogin` | `Token` | `routes/auth.py` |
| GET | `/users/me` | JWT | — | `{id, name, email, guardian_level, created_at}` | `routes/users.py` |
| POST | `/report/` | JWT | `ReportCreate` | `ReportResponse` | `routes/report.py` |
| GET | `/cats/` | — | — | `Cat[]` | `routes/cats.py` |
| GET | `/map/` | — | — | `Cat[]` | `routes/map.py` |
| GET | `/map/activity` | — | — | `RescueReport[]` (last 10) | `routes/map.py` |
| GET | `/missions/` | — | — | `MissionView[]` | `routes/mission.py` |
| GET | `/missions/stats` | — | — | `{active, rescues, success, volunteers}` | `routes/mission.py` |
| GET | `/adoptions/` | — | — | `Cat[]` (status=Adoption) | `routes/adoptions.py` |
| GET | `/adoptions/stats` | — | — | `{available, adopted, success}` | `routes/adoptions.py` |
| GET | `/shelters/` | — | — | `Shelter[]` | `routes/shelters.py` |
| GET | `/shelters/stats` | — | — | `{registered, beds, adoptions, vets}` | `routes/shelters.py` |
| GET | `/dashboard/stats` | — | — | `{active_guardians, total_cats, …}` | `routes/dashboard.py` |

---

### 5.2 Request / Response Schemas

#### `POST /auth/register`

```
Request  (UserCreate)            Response  (UserResponse)
─────────────────────────        ──────────────────────────────────
{                                {
  "full_name": "Aarav Singh",      "id": 1,
  "email": "aarav@mail.com",       "full_name": "Aarav Singh",
  "password": "secret123"          "email": "aarav@mail.com",
}                                  "guardian_level": 1,
                                   "guardian_xp": 0,
                                   "total_rescues": 0
                                 }
```

#### `POST /auth/login`

```
Request  (UserLogin)             Response  (Token)
─────────────────────────        ─────────────────────────────────
{                                {
  "email": "aarav@mail.com",       "access_token": "<JWT string>",
  "password": "secret123"          "token_type": "bearer",
}                                  "guardian": "Aarav Singh",
                                   "level": 1
                                 }
```

#### `POST /report/`

```
Request  (ReportCreate)          Response  (ReportResponse)
─────────────────────────        ──────────────────────────────────
{                                {
  "cat_name": "Luna",              "id": 42,
  "status": "Injured",             "cat_name": "Luna",
  "health": "Critical",            "status": "Injured",
  "priority": "High",              "health": "Critical",
  "description": "...",            "priority": "High",
  "latitude": 12.9716,             "description": "...",
  "longitude": 77.5946             "latitude": 12.9716,
}                                  "longitude": 77.5946,
                                   "image_url": "",
                                   "ai_summary": "Waiting for Kuro AI...",
                                   "created_at": "2026-07-07T10:30:00Z"
                                 }
```

#### `GET /missions/`

```
Response  (MissionView[])
──────────────────────────────────────────────────────
[
  {
    "id": "RX-1",
    "type": "Injured",           ← report.status
    "location": "12.97, 77.59",  ← "lat, lng" string
    "priority": "High",
    "eta": "In Progress",        ← hardcoded string
    "volunteer": "Aarav Singh",
    "status": "Assigned"
  }
]
```

#### `GET /dashboard/stats`

```
Response
───────────────────────────────────
{
  "active_guardians": 19,
  "total_cats": 248,
  "critical_cats": 3,
  "rescued_cats": 87,
  "adopted_cats": 42,
  "rescue_reports": 156,
  "average_health": 74.31,
  "average_ai": 68.90,
  "ai_status": "ONLINE"
}
```

---
### 5.3 Core Feature Flows

#### Flow A — Submit a Rescue Report

```
Guardian fills <ReportForm />
  │
  ├─ reads localStorage("token")
  │
  └─ POST /report/
       headers: { Authorization: Bearer <token> }
       body:    { cat_name, status, health, priority,
                  description, latitude, longitude }
          │
          ▼
       FastAPI: routes/report.py :: create_report()
          │
          ├── Depends(get_current_user)
          │     └── JWT decode → db.query(User) → current_user
          │
          ├── RescueReport(
          │       cat_name=..., status=..., health=...,
          │       priority=..., description=...,
          │       latitude=..., longitude=...,
          │       image_url="",
          │       ai_summary="Waiting for Kuro AI...",
          │       reporter_id=current_user.id
          │   )
          │
          ├── db.add() → db.commit() → db.refresh()
          │
          └── returns ReportResponse (201 implicit)
                │
                ▼
             <ReportForm /> shows alert("✅ Rescue Report Submitted!")
             form fields reset to defaults
```

---

#### Flow B — Load the Mission Board

```
<MissionGrid /> mounts
  │
  └── useEffect → fetch("http://127.0.0.1:8000/missions/")
                    │
                    ▼
                 FastAPI: routes/mission.py :: get_missions()
                    │
                    ├── db.query(Mission).all()           ← query 1
                    │
                    └── for each mission:
                          db.query(RescueReport)           ← query 2 per mission
                            .filter(id == mission.report_id)
                          db.query(User)                   ← query 3 per mission
                            .filter(id == mission.guardian_id)
                          build dict { id, type, location, priority, eta,
                                       volunteer, status }
                    │
                    └── returns MissionView[]
                          │
                          ▼
                       setMissions(data)
                       maps to <MissionCard {...mission} />
```

Note: this is an N+1 pattern — 100 missions = 201 queries. See section 8.

---

#### Flow C — Load the Rescue Map

```
<RescueMap /> mounts
  │
  └── useEffect → fetch("http://127.0.0.1:8000/map/")
                    │
                    ▼
                 FastAPI: routes/map.py :: get_map_cats()
                    │
                    └── db.query(Cat).all()
                          └── returns Cat[]
                                │
                                ▼
                             setCats(data)
                             passed as prop to <LeafletMap cats={} />
                               └── cats.map → <Marker position=[lat,lng]>
                                                <Popup> name·status·scores </Popup>

<ActivityFeed /> mounts (parallel)
  └── fetch("/map/activity")
        └── db.query(RescueReport)
              .order_by(created_at.desc()).limit(10)
              └── returns RescueReport[] → setReports(data)
```

---

#### Flow D — Adoption Feed

```
<AdoptionStats /> mounts          <AdoptionGrid /> mounts
  │                                 │
  └── fetch("/adoptions/stats")     └── fetch("/adoptions/")
        │                                 │
        ▼                                 ▼
     routes/adoptions.py              routes/adoptions.py
     adoption_stats()                 get_adoptions()
        │                                 │
        ├── db.query(Cat).count()         └── db.query(Cat)
        ├── filter(status="Adoption")           .filter(status="Adoption")
        └── returns {                            .all()
              available, adopted,               └── Cat[]
              success (%)                             │
            }                                         ▼
                                               <AdoptionCard cat={} />
```

---

#### Flow E — Dashboard Stats

```
GET /dashboard/stats
  │
  └── routes/dashboard.py :: dashboard_stats()
        │
        ├── db = SessionLocal()    ← manual session (⚠ not Depends(get_db))
        │
        ├── db.query(User).count()
        ├── db.query(Cat).count()
        ├── db.query(RescueReport).count()
        ├── db.query(Cat).filter(status="Critical").count()
        ├── db.query(Cat).filter(status="Rescued").count()
        ├── db.query(Cat).filter(status="Adopted").count()
        ├── db.query(func.avg(Cat.health_score)).scalar()
        ├── db.query(func.avg(Cat.ai_score)).scalar()
        │
        └── finally: db.close()
              └── returns {active_guardians, total_cats, critical_cats,
                            rescued_cats, adopted_cats, rescue_reports,
                            average_health, average_ai, ai_status}
```

Note: 8 separate queries fired sequentially. Can be reduced to 2–3
with `func.count(case(...))` or a single aggregating query.

---

### 5.4 Error Response Format

FastAPI returns RFC 7807-style JSON for all HTTP errors:

```json
{
  "detail": "Invalid authentication credentials."
}
```

Validation errors (422) return Pydantic's default format:

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

The frontend currently catches errors as `err.message` and shows a plain
`alert()` — no structured error parsing is implemented yet.

---
## 6. Authentication Flow

### 6.1 Overview

CATVERSE-X uses **JWT Bearer token authentication** with bcrypt password hashing.
There is no session server, no cookie, and no OAuth provider integration in the
current implementation. The token is stored in `localStorage` and attached to
requests manually by each component.

| Concern | Mechanism |
|---------|-----------|
| Password storage | bcrypt via `passlib[bcrypt]` |
| Token format | JWT (HS256) signed with `SECRET_KEY` |
| Token transport | `Authorization: Bearer <token>` HTTP header |
| Token storage (client) | `localStorage` — `token`, `guardian_name`, `guardian_level` |
| Token expiry | Configurable via `ACCESS_TOKEN_EXPIRE_MINUTES` env var |
| Token refresh | Not implemented |
| Token revocation | Not implemented — no blocklist |
| Role enforcement | `is_admin` column exists on `users`; no route-level RBAC yet |

---

### 6.2 Registration Flow

```
Browser                         FastAPI                        PostgreSQL
──────                          ───────                        ──────────

User fills registration form
  full_name, email, password
         │
         ▼
POST /auth/register
{ full_name, email, password }
         │
         │                      UserCreate schema validation
         │                      (Pydantic: EmailStr, required fields)
         │                               │
         │                               ▼
         │                      db.query(User)
         │                        .filter(email == user.email)
         │                        .first()                ──────────────►  SELECT users
         │                               │                               WHERE email=?
         │                               │◄─────────────────────────────  result
         │                               │
         │                    ┌──────────▼──────────┐
         │                    │ existing_user found? │
         │                    └──────────┬──────────┘
         │                    YES        │        NO
         │                    │          │
         │          HTTP 400  │          ▼
         │◄───────────────────┘   hash_password(user.password)
         │  "Email already         └── bcrypt.hash()
         │   registered."                   │
         │                                  ▼
         │                         User(full_name=...,
         │                              email=...,
         │                              password=<hash>)
         │                                  │
         │                         db.add() → db.commit()  ──────────►  INSERT users
         │                         db.refresh(new_user)    ◄──────────  RETURNING *
         │                                  │
         │◄─────────────────────────────────┘
    HTTP 200
    UserResponse {id, full_name, email,
                  guardian_level, guardian_xp, total_rescues}
         │
         ▼
  (frontend redirects user to /login)
```

---

### 6.3 Login Flow

```
Browser                         FastAPI                        PostgreSQL
──────                          ───────                        ──────────

User fills login form
  email, password
         │
         ▼
POST /auth/login
{ email, password }
         │
         │                      UserLogin schema validation
         │                               │
         │                               ▼
         │                      db.query(User)
         │                        .filter(email == user.email)
         │                        .first()                ──────────────►  SELECT users
         │                               │                               WHERE email=?
         │                               │◄─────────────────────────────  result
         │                               │
         │                    ┌──────────▼──────────┐
         │                    │    user found?      │
         │                    └──────────┬──────────┘
         │                    NO         │        YES
         │                    │          │
         │          HTTP 401  │          ▼
         │◄───────────────────┘   verify_password(
         │  "Invalid email         plain=user.password,
         │   or password."         hashed=db_user.password
         │                       )  └── bcrypt.verify()
         │                               │
         │                    ┌──────────▼──────────┐
         │                    │  password matches?  │
         │                    └──────────┬──────────┘
         │                    NO         │        YES
         │                    │          │
         │          HTTP 401  │          ▼
         │◄───────────────────┘   create_access_token(
         │  "Invalid email         {"sub": db_user.email}
         │   or password."        )
         │                         └── jwt.encode(
         │                               payload + exp claim,
         │                               SECRET_KEY,
         │                               algorithm="HS256"
         │                             )
         │                               │
         │◄──────────────────────────────┘
    HTTP 200
    Token {
      access_token: "<JWT>",
      token_type:   "bearer",
      guardian:     "Aarav Singh",
      level:        1
    }
         │
         ▼
  localStorage.setItem("token",          data.access_token)
  localStorage.setItem("guardian_name",  data.guardian)
  localStorage.setItem("guardian_level", data.level)
         │
         ▼
  router.push("/dashboard")
```

---

### 6.4 Authenticated Request Flow

```
Component needs protected resource (e.g. POST /report/)
         │
         ▼
  token = localStorage.getItem("token")
         │
  ┌──────▼──────────────────────────────────────┐
  │ token present?                              │
  └──────┬──────────────────────────────────────┘
  NO     │      YES
  │      │       │
  │      │       ▼
  │      │  fetch(API_URL + "/report/", {
  │      │    method: "POST",
  │      │    headers: {
  │      │      "Content-Type": "application/json",
  │      │      "Authorization": "Bearer " + token
  │      │    },
  │      │    body: JSON.stringify(payload)
  │      │  })
  │      │       │
  │      │       ▼
  │      │  FastAPI: CORSMiddleware passes request
  │      │       │
  │      │       ▼
  │      │  OAuth2PasswordBearer
  │      │    extracts token from Authorization header
  │      │       │
  │      │       ▼
  │      │  get_current_user(token, db)
  │      │    jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
  │      │       │
  │      │  ┌────▼──────────────────────────┐
  │      │  │ decode success?               │
  │      │  └────┬──────────────────────────┘
  │      │  NO   │    YES
  │      │  │    │     │
  │      │  │    │     ▼
  │      │  │    │  email = payload.get("sub")
  │      │  │    │     │
  │      │  │    │  db.query(User).filter(email==email).first()
  │      │  │    │     │                          ──────────►  SELECT users
  │      │  │    │     │◄──────────────────────────────────  WHERE email=?
  │      │  │    │     │
  │      │  │    │  ┌──▼──────────────┐
  │      │  │    │  │  user found?    │
  │      │  │    │  └──┬─────────────┘
  │      │  │    │  NO │   YES
  │      │  ▼    │  │  │    │
  │  empty │  │  │  │  ▼
  │  token │  └──┴──┘  route handler executes
  │ → sends│  HTTP 401 with current_user injected
  │  empty │  "Invalid auth"
  │  Bearer│
  │  → 401 │
  └────────┘
```

---

### 6.5 JWT Token Structure

```
Header
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload
{
  "sub": "aarav@mail.com",    ← user email (subject claim)
  "exp": 1751234567           ← Unix timestamp: now + ACCESS_TOKEN_EXPIRE_MINUTES
}

Signature
  HMAC-SHA256(base64(header) + "." + base64(payload), SECRET_KEY)
```

The token carries only `sub` (email) and `exp`. Every authenticated request
re-fetches the full user row from the database via `get_current_user`.
No user data is embedded in the token itself — this is intentional but means
one extra DB query per protected request.

---

### 6.6 Client-Side Auth State

The Navbar reads auth state on every mount via `useEffect`:

```typescript
useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    setLoggedIn(true);
    setGuardianName(localStorage.getItem("guardian_name") || "Guardian");
    setGuardianLevel(localStorage.getItem("guardian_level") || "1");
  }
}, []);
```

There is **no global auth context or React state manager**. Each component
independently reads `localStorage`. This means:

- No automatic redirect on token expiry — the user sees a 401 API error
- No shared session invalidation — logout only clears one browser tab's storage
- No token expiry check before sending requests

---

### 6.7 Security Properties and Known Gaps

| Property | Status |
|----------|--------|
| Passwords hashed with bcrypt | ✅ Implemented |
| JWT signed with HS256 | ✅ Implemented |
| HTTPS enforcement | ❌ Not configured (dev only) |
| Token expiry (`exp` claim) | ✅ Implemented |
| Token refresh | ❌ Not implemented |
| Token revocation / blocklist | ❌ Not implemented |
| httpOnly cookie storage | ❌ localStorage used instead |
| Rate limiting on `/auth/login` | ❌ Not implemented |
| Password strength validation | ❌ No minimum length or complexity rule |
| RBAC (admin vs. guardian routes) | ❌ `is_admin` column exists; no enforcement |
| Social OAuth (Google/GitHub/Discord) | ❌ UI buttons present; no backend |
| CORS restricted to known origins | ❌ `allow_origins=["*"]` |

---
## 7. AI Workflow

### 7.1 Overview

The AI engine is a **standalone Python module tree** under `ai-engine/`.
It is architecturally separate from the FastAPI backend — it has no web server
of its own and is not yet wired into the API layer. The `backend/app/api/`
directory contains stub files that are intended to become the HTTP bridge
between the two.

```
Current state:   Frontend → FastAPI routes → PostgreSQL
                            (AI fields stored as defaults)

Intended state:  Frontend → FastAPI routes → AI Engine HTTP bridge
                                          ↘ PostgreSQL
                                            (AI results written back)
```

The seven directories inside `ai-engine/` each own a discrete concern in
the inference pipeline:

| Module | Role |
|--------|------|
| `detector/` | Cat presence detection in a submitted image |
| `health/` | Health score inference from visual features |
| `embeddings/` | Identity embedding generation for deduplication |
| `prediction/` | Adoption likelihood scoring |
| `adoption/` | Adoption match ranking and recommendations |
| `models/` | Model class definitions shared across modules |
| `weights/` | Trained model weight files |
| `utils/` | Shared preprocessing, image loading, normalisation |

---

### 7.2 Full Pipeline Diagram

```
Guardian submits rescue report
  (image + metadata via POST /report/)
          │
          ▼
┌─────────────────────────────────────────────┐
│             FASTAPI  /report/               │
│                                             │
│  1. Validate ReportCreate schema            │
│  2. Authenticate guardian (JWT)             │
│  3. Save RescueReport to DB                 │
│     └── image_url   = ""          (stub)    │
│     └── ai_summary  = "Waiting…"  (stub)    │
│  4. Return ReportResponse immediately       │
│  ── ── ── ── ── ── ── ── ── ── ── ── ──    │
│  5. [PLANNED] dispatch background AI task   │
└─────────────────────┬───────────────────────┘
                      │  image bytes + report metadata
                      ▼
┌─────────────────────────────────────────────┐
│          STAGE 1 — detector/                │
│                                             │
│  Input:  image (bytes / URL)                │
│  Model:  object detection (YOLO / similar)  │
│  Output: is_cat: bool, confidence: float    │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │ is_cat == False?                      │  │
│  │  └── reject pipeline,                │  │
│  │       flag report for manual review  │  │
│  └───────────────────────────────────────┘  │
└─────────────────────┬───────────────────────┘
                      │  confirmed cat image
                      ▼
┌─────────────────────────────────────────────┐
│          STAGE 2 — health/                  │
│                                             │
│  Input:  cat-confirmed image                │
│  Model:  CNN classifier / regressor         │
│  Output: health_score: float  (0–100)       │
│          health_label: str                  │
│          (Healthy / Minor Injury /          │
│           Critical / Unknown)               │
│                                             │
│  Writes → Cat.health_score                  │
│         → RescueReport.health (override)    │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│          STAGE 3 — embeddings/              │
│                                             │
│  Input:  cat image                          │
│  Model:  feature extractor (ResNet / ViT)   │
│  Output: embedding vector (N-dim float[])   │
│                                             │
│  Purpose: cat identity deduplication        │
│  ┌──────────────────────────────────────┐   │
│  │ cosine_similarity(embedding,         │   │
│  │   existing_embeddings) > threshold?  │   │
│  │  YES → link to existing Cat record   │   │
│  │  NO  → create new Cat record         │   │
│  └──────────────────────────────────────┘   │
└─────────────────────┬───────────────────────┘
                      │  cat identity resolved
                      ▼
┌─────────────────────────────────────────────┐
│          STAGE 4 — prediction/              │
│                                             │
│  Input:  health_score, breed, age,          │
│          color, gender, rescue_history      │
│  Model:  gradient boost / neural classifier │
│  Output: ai_score: float  (0–100)           │
│          adoption_likelihood: str           │
│          (High / Medium / Low)              │
│                                             │
│  Writes → Cat.ai_score                      │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│          STAGE 5 — adoption/                │
│                                             │
│  Input:  ai_score + Cat profile             │
│  Logic:  ranking + shelter matching         │
│  Output: ranked adoption candidates         │
│          shelter recommendations            │
│                                             │
│  Writes → adoption feed sort order          │
│         → RescueReport.ai_summary (text)    │
└─────────────────────────────────────────────┘
                      │
                      ▼
          DB fields updated:
            Cat.health_score  ✓
            Cat.ai_score      ✓
            RescueReport.ai_summary  ✓

          Frontend reads updated values on next fetch
```

---

### 7.3 AI Engine Module Design

#### `utils/`
Shared preprocessing utilities consumed by all pipeline stages:
- Image loading and resizing to model input dimensions
- Normalisation (mean/std subtraction)
- Format conversion (PIL ↔ numpy ↔ tensor)
- Batch preparation

#### `models/`
Model class definitions and loaders:
- Wraps framework-specific model constructors (PyTorch / TensorFlow)
- Provides a unified `load_model(path)` interface
- `weights/` holds the serialised `.pt` / `.h5` / `.onnx` files

#### `detector/`
```
Input  → image tensor
Model  → detection backbone (e.g. YOLOv8-nano for edge deployment)
Output → List[Detection{label, confidence, bbox}]
Logic  → filter for label == "cat", return top-confidence hit
```

#### `health/`
```
Input  → cropped cat image (from detector bbox)
Model  → CNN regression head
Output → health_score: float, health_label: str
Logic  → score thresholds:
           90–100 → Healthy
           60–89  → Minor Injury
           30–59  → Critical
           0–29   → Unknown / Severe
```

#### `embeddings/`
```
Input  → cat image
Model  → ResNet-50 / ViT feature extractor (penultimate layer)
Output → 512-dim or 768-dim float vector
Storage→ vector store (planned: pgvector extension or FAISS index)
Query  → ANN search for nearest neighbours above similarity threshold
```

#### `prediction/`
```
Input  → structured features: health_score, breed, age_months,
         color, gender, rescue_count, days_in_system
Model  → XGBoost classifier or MLP
Output → adoption_probability: float
         ai_score = adoption_probability * 100
```

#### `adoption/`
```
Input  → ai_score, Cat profile, available Shelter records
Logic  → rank cats by ai_score desc
         match to shelters with available capacity
         generate text summary for ai_summary field
Output → ranked list, shelter recommendation, summary string
```

---

### 7.4 Oracle AI Assistant

The `oracle/` component directory exists on the frontend (currently empty).
The `backend/app/api/oracle.py` stub is the planned backend endpoint.

Intended design:

```
Guardian types question in Oracle UI
  │
  └── POST /api/oracle/
        { query: "What should I do for an injured cat?" }
          │
          ▼
      LLM integration (OpenAI / local model)
        + RAG context from rescue_reports + Cat DB
          │
          ▼
      Streaming text response
        │
        ▼
      Oracle UI renders answer token-by-token
```

This feature is fully stubbed — no implementation exists on either side yet.

---

### 7.5 Backend Integration Points

The `backend/app/api/` stub files define where AI results enter the FastAPI
layer. The intended contract for each stub:

| Stub file | Planned endpoint | Trigger | Returns |
|-----------|-----------------|---------|---------|
| `scanner.py` | `POST /api/scan/` | Image upload | `{is_cat, confidence, bbox}` |
| `oracle.py` | `POST /api/oracle/` | Guardian query | Streaming text |
| `adoption.py` | `GET /api/adoption/rank/` | Adoption feed load | Ranked `Cat[]` |
| `analytics.py` | `GET /api/analytics/` | Analytics page | Aggregated AI metrics |
| `cats.py` | `POST /api/cats/analyse/` | New cat creation | `{health_score, ai_score}` |
| `guardians.py` | `GET /api/guardians/leaderboard/` | Leaderboard fetch | Ranked `User[]` |
| `missions.py` | `POST /api/missions/assign/` | Report triage | Suggested guardian |
| `auth.py` | Internal | Registration | Guardian welcome notification |
| `users.py` | `GET /api/users/insights/` | Profile view | Guardian activity summary |
| `shelters.py` | `GET /api/shelters/match/` | Adoption routing | Best-fit shelter |
| `websocket.py` | `WS /ws/missions/` | Mission board | Real-time status push |

---

### 7.6 Data Flow: AI Results into the Database

```
ai-engine pipeline completes
        │
        ├── health_score, health_label
        │     └── UPDATE cats SET health_score=? WHERE id=?
        │
        ├── ai_score
        │     └── UPDATE cats SET ai_score=? WHERE id=?
        │
        └── ai_summary (text)
              └── UPDATE rescue_reports
                    SET ai_summary=?
                    WHERE id=?

Frontend next fetch:
  GET /cats/        → Cat.health_score and Cat.ai_score populated
  GET /map/         → same
  GET /adoptions/   → sorted by ai_score (planned)
  GET /report/      → RescueReport.ai_summary shows analysis
```

---
## 8. Current Gaps and Planned Extensions

This section maps every known architectural gap to its root cause, impact,
and the concrete change required to close it. Items are grouped by layer and
ordered by severity within each group.

---

### 8.1 Backend — Technical Roadmap (Break Existing Features)

#### G-B1 — Duplicate ORM model causes mapper conflict
- **Root cause:** `backend/app/models.py` (legacy, `name` column) and
  `backend/app/models/user.py` (active, `full_name` column) both define a
  `User` class mapped to the `users` table. SQLAlchemy raises a conflict or
  silently uses the wrong mapping depending on import order.
- **Impact:** Registration and profile endpoints are broken or non-deterministic.
- **Fix:** Delete `backend/app/models.py`. Audit all `from app.models import User`
  statements and replace with `from app.models.user import User`.

#### G-B2 — `UserCreate` schema field mismatch causes 422 on every registration
- **Root cause:** `routes/auth.py` imports `UserCreate` from the legacy
  `app.schemas` (which has a `name` field), then writes `User(full_name=user.full_name)`.
  The legacy schema has no `full_name`, raising `AttributeError`.
- **Impact:** `POST /auth/register` always fails with a 500.
- **Fix:** Change the import to `from app.schemas.user import UserCreate`.
  Delete `backend/app/schemas.py` after migrating all consumers.

#### G-B3 — `/users/me` accesses non-existent attribute
- **Root cause:** `routes/users.py` returns `current_user.name`. The active
  `User` model uses `full_name`.
- **Impact:** `GET /users/me` raises `AttributeError` for every authenticated user.
- **Fix:** Change `"name": current_user.name` to `"name": current_user.full_name`.

#### G-B4 — Dashboard route leaks DB connections
- **Root cause:** `routes/dashboard.py` calls `SessionLocal()` directly inside
  the handler instead of using `Depends(get_db)`. An unhandled exception before
  `finally:` can leave the session open.
- **Impact:** Under any load the connection pool is exhausted.
- **Fix:** Add `db: Session = Depends(get_db)` as a route parameter and remove
  the manual `SessionLocal()` / `try/finally` block.

---

### 8.2 Backend — Security Issues

#### G-B5 — CORS wildcard with credentials enabled
- **Root cause:** `main.py` defines `origins = [...]` but passes
  `allow_origins=["*"]` to `CORSMiddleware`. Combined with
  `allow_credentials=True`, browsers block the response (CORS spec violation),
  and any origin can attempt credentialed requests.
- **Fix:** Replace `"*"` with the `origins` list already defined in the file.

#### G-B6 — No rate limiting on authentication endpoints
- **Root cause:** `POST /auth/login` and `POST /auth/register` accept unlimited
  requests from any IP.
- **Impact:** Trivially brute-forceable.
- **Fix:** Add `slowapi` middleware with per-IP limits on auth routes, or enforce
  rate limits at the reverse-proxy layer (Nginx / Cloudflare).

#### G-B7 — No password strength validation
- **Root cause:** `UserCreate.password` is a plain `str` with no constraints.
- **Fix:** Add a Pydantic `@field_validator` enforcing minimum length (≥ 8) and
  at least one non-alpha character.

#### G-B8 — `SECRET_KEY` defaults to `None` silently
- **Root cause:** `config.py` uses bare `os.getenv()` with no fallback.
  If `.env` is absent, `SECRET_KEY` is `None` and python-jose signs tokens
  with `None` as the key — all tokens are insecure but functional.
- **Fix:** Migrate `config.py` to a Pydantic `BaseSettings` class that raises
  `ValidationError` at startup if any required variable is missing or empty.

#### G-B9 — JWT stored in `localStorage` (XSS-accessible)
- **Root cause:** `localStorage` is accessible to any JavaScript running on
  the page, including injected scripts.
- **Fix (planned):** Move to `httpOnly; Secure; SameSite=Strict` cookies for
  token storage. Requires adding a `/auth/refresh` endpoint and updating all
  fetch calls to use `credentials: "include"`.

---

### 8.3 Backend — Performance Issues

#### G-B10 — N+1 queries in `/missions/`
- **Root cause:** `routes/mission.py` calls `db.query(RescueReport)` and
  `db.query(User)` inside a loop over all missions.
- **Impact:** 100 missions = 201 sequential queries per request.
- **Fix:**
  ```python
  missions = (
      db.query(Mission)
      .options(
          joinedload(Mission.report),
          joinedload(Mission.guardian)
      )
      .all()
  )
  ```
  Requires adding `relationship()` definitions to the `Mission` model.

#### G-B11 — `echo=True` in production database engine
- **Root cause:** `database.py` hardcodes `echo=True`.
- **Impact:** Every SQL statement (including parameter values containing user
  data) is logged to stdout. Privacy violation and significant log noise.
- **Fix:** `echo=os.getenv("DB_ECHO", "false").lower() == "true"`.

#### G-B12 — 8 sequential queries in `/dashboard/stats`
- **Root cause:** Each stat (total cats, critical cats, rescued cats, etc.)
  is a separate `db.query().count()` call.
- **Fix:** Consolidate using `func.count(case(...))` in a single aggregating
  query, or use a materialized view refreshed periodically.

---

### 8.4 Backend — Missing Infrastructure

#### G-B13 — No database migrations (Alembic)
- **Current state:** `Base.metadata.create_all()` runs on startup. It can
  create missing tables but cannot rename columns, add constraints, or drop
  columns on existing tables.
- **Planned state:**
  ```
  alembic init alembic
  alembic revision --autogenerate -m "initial schema"
  alembic upgrade head
  ```
  Remove `create_all` from `main.py` (or keep it behind a
  `CREATE_TABLES_ON_STARTUP=true` env flag for local dev only).

#### G-B14 — No token refresh mechanism
- **Impact:** When the JWT expires the user receives a 401 with no graceful
  recovery. The frontend shows an error and the user must log in again manually.
- **Planned fix:** Add `POST /auth/refresh` accepting a long-lived refresh
  token (stored in an `httpOnly` cookie) and returning a new short-lived
  access token.

#### G-B15 — No background task queue
- **Impact:** AI inference cannot run asynchronously after report submission.
  Long-running inference blocks the request or is never triggered.
- **Planned fix:** Integrate Celery + Redis (or FastAPI `BackgroundTasks` for
  lightweight cases). The report endpoint enqueues the AI pipeline task and
  returns immediately; the worker updates `health_score`, `ai_score`, and
  `ai_summary` when done.

#### G-B16 — Empty service layer
- **Current state:** All business logic lives directly in route handlers.
  Unit testing any logic requires spinning up a full FastAPI app and database.
- **Planned state:** Extract logic into `services/`:
  ```
  services/
    auth_service.py      register_user(), authenticate_user()
    cat_service.py       create_cat(), update_scores()
    mission_service.py   create_mission(), assign_guardian()
    report_service.py    create_report(), trigger_ai_pipeline()
    analytics_service.py aggregate_stats()
  ```

#### G-B17 — No structured logging or error tracking
- **Current state:** `print()` statements and unhandled exceptions produce
  unformatted stdout output.
- **Planned fix:** Replace with Python `logging` (structured JSON format),
  add a Sentry DSN for exception tracking, and register a FastAPI
  `exception_handler` for unhandled 500s.

#### G-B18 — Debug `print()` in production route
- **Root cause:** `routes/report.py` has
  `print("Columns:", RescueReport.__table__.columns.keys())` inside the
  request handler. Runs on every report submission.
- **Fix:** Remove the line.

#### G-B19 — `datetime.utcnow()` deprecated in Python 3.12+
- **Root cause:** `security.py` uses `datetime.utcnow()`.
- **Fix:** Replace with `datetime.now(tz=timezone.utc)`.

---

### 8.5 Frontend — Broken Functionality

#### G-F1 — Login request sends wrong payload
- **Root cause:** `frontend/lib/api.ts` `login()` sends
  `{ full_name: name, email, password }`. The variable `name` is `undefined`
  in that scope and the login endpoint only expects `email` and `password`.
- **Fix:** Remove `full_name: name` from the request body.

#### G-F2 — Credentials logged to the browser console
- **Root cause:** `lib/api.ts` has `console.log(email)` and
  `console.log(password)` in the `login()` function.
- **Fix:** Remove all credential `console.log` calls.

#### G-F3 — All API base URLs are hardcoded to `localhost`
- **Root cause:** `http://127.0.0.1:8000` is repeated in at least six files:
  `lib/api.ts`, `src/lib/report.ts`, `src/lib/dashboard.ts`,
  `RescueMap.tsx`, `ActivityFeed.tsx`, `MissionGrid.tsx`, `MissionStats.tsx`,
  `ShelterGrid.tsx`, `AdoptionGrid.tsx`, `AdoptionStats.tsx`.
- **Impact:** The frontend does not function in any deployed environment.
- **Fix:** Create `frontend/.env.local`:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:8000
  ```
  Replace all hardcoded URLs with `process.env.NEXT_PUBLIC_API_URL`.

#### G-F4 — Rescue report location hardcoded to Bangalore
- **Root cause:** `ReportForm.tsx` always submits `latitude: 12.9716,
  longitude: 77.5946`, regardless of the user's actual location.
- **Fix:** Call `navigator.geolocation.getCurrentPosition()` on form open and
  populate the coordinates from the browser. Provide a Leaflet map picker
  as a fallback for users who deny geolocation.

#### G-F5 — Dashboard, LiveImpact, MissionStatus, TopGuardians show hardcoded data
- **Root cause:** These four components contain static numbers and names
  ("248 cats saved", "Aarav: 52 rescues") rather than fetching from the API.
- **Fix:**
  - `Dashboard.tsx` → fetch `GET /dashboard/stats` and pass to `HudPanel`
  - `LiveImpact.tsx` → same source
  - `MissionStatus.tsx` → fetch `GET /missions/` (first 3 results)
  - `TopGuardians.tsx` → fetch `GET /leaderboard/` (once implemented)

#### G-F6 — No token expiry handling
- **Root cause:** No component checks whether the stored JWT is expired before
  sending requests. A 401 response surfaces as a generic error alert.
- **Fix:** Decode the JWT expiry client-side on each request (or on app load)
  and redirect to `/login` if expired, before making the API call.

#### G-F7 — Social login buttons non-functional
- **Root cause:** Google, GitHub, and Discord icons in `RightPanel.tsx` have
  no `onClick` handlers and no OAuth flow.
- **Fix:** Either implement OAuth (NextAuth.js is the natural fit for Next.js)
  or remove the buttons until the feature is ready.

#### G-F8 — No global error boundary or loading states
- **Root cause:** Components using `useEffect` + `fetch` have no skeleton
  loaders, no empty-state UI, and no React error boundaries.
- **Fix:** Wrap data-fetching sections in `Suspense` boundaries; add skeleton
  components for each data-heavy section; implement a top-level
  `error.tsx` per Next.js App Router convention.

---

### 8.6 Infrastructure — Deployment Gaps

#### G-I1 — No backend or frontend service in `docker-compose.yml`
- **Current state:** Only the PostgreSQL container is defined.
- **Planned additions:**
  ```yaml
  backend:
    build: ./backend
    env_file: ./backend/.env
    depends_on: [postgres]
    ports: ["8000:8000"]

  frontend:
    build: ./frontend
    env_file: ./frontend/.env.local
    depends_on: [backend]
    ports: ["3000:3000"]
  ```

#### G-I2 — DB password hardcoded in `docker-compose.yml`
- **Root cause:** `POSTGRES_PASSWORD: 123946@Ap` is committed to source control.
- **Fix:** Move to a `.env` file referenced via `env_file:` or
  `${POSTGRES_PASSWORD}` substitution. Add `.env` to `.gitignore`.

#### G-I3 — No CI/CD pipelines
- **Current state:** `.github/workflows/` is empty.
- **Planned pipelines:**
  ```
  ci.yml       on: [push, pull_request]
    ├── backend: ruff lint → mypy typecheck → pytest
    └── frontend: eslint → tsc --noEmit → next build

  cd.yml       on: [push to main]
    └── build Docker images → push to registry → deploy
  ```

#### G-I4 — No test suite
- **Current state:** `backend/test_security.py` is a one-off manual script.
  Zero pytest tests, zero frontend tests.
- **Planned:**
  ```
  backend/tests/
    test_auth.py        register, login, bad credentials
    test_report.py      create report, auth required
    test_missions.py    get missions, stats
    conftest.py         TestClient, in-memory SQLite fixture

  frontend/src/__tests__/
    ReportForm.test.tsx
    RightPanel.test.tsx
  ```

#### G-I5 — No Nginx / reverse proxy configuration
- **Impact:** In production, the FastAPI Uvicorn server is exposed directly.
  No TLS termination, no gzip, no static file serving, no rate limiting at
  the network layer.
- **Planned fix:** Add an `nginx/` directory with a production config that
  terminates TLS, proxies `/api/` to Uvicorn, and serves the Next.js static
  build.

---

### 8.7 Planned Architecture — Target State

The diagram below shows the full intended architecture once all gaps are closed:

```
                        ┌─────────────────────────────┐
                        │    BROWSER (Next.js 15)      │
                        │                              │
                        │  Auth: httpOnly cookie JWT   │
                        │  State: React Context        │
                        │  Env:  NEXT_PUBLIC_API_URL   │
                        └──────────────┬───────────────┘
                                       │ HTTPS
                                       ▼
                        ┌─────────────────────────────┐
                        │         NGINX               │
                        │  TLS termination            │
                        │  Rate limiting (/auth/*)    │
                        │  Proxy → :8000 (API)        │
                        │  Serve Next.js static build │
                        └──────────────┬──────────────┘
                                       │
                                       ▼
                        ┌─────────────────────────────┐
                        │    FASTAPI (Uvicorn)         │
                        │                             │
                        │  Pydantic BaseSettings      │
                        │  Alembic migrations         │
                        │  Service layer              │
                        │  RBAC (is_admin guard)      │
                        │  Structured JSON logging    │
                        │  Sentry error tracking      │
                        └──────┬───────────┬──────────┘
                               │           │
                    SQLAlchemy │           │ Celery task enqueue
                               ▼           ▼
                   ┌───────────────┐  ┌──────────────────┐
                   │ PostgreSQL 17 │  │  Redis + Celery  │
                   │  + pgvector   │  │  Worker          │
                   │  + Alembic    │  │  └── AI pipeline │
                   └───────────────┘  └──────────────────┘
                                               │
                                               ▼
                                   ┌───────────────────────┐
                                   │    AI ENGINE          │
                                   │  detector → health    │
                                   │  embeddings → predict │
                                   │  adoption → summary   │
                                   └───────────────────────┘
```

---

### 8.8 Implementation Priority Order

| Priority | ID | Gap | Effort |
|----------|----|-----|--------|
| P0 | G-B1 | Delete legacy `models.py`, fix all imports | Small |
| P0 | G-B2 | Fix `UserCreate` import in `routes/auth.py` | Small |
| P0 | G-B3 | Fix `current_user.name` → `.full_name` | Small |
| P0 | G-B5 | Fix CORS `allow_origins` | Small |
| P0 | G-F1 | Fix login payload in `lib/api.ts` | Small |
| P0 | G-F2 | Remove credential `console.log` | Small |
| P0 | G-B8 | Pydantic `BaseSettings` for config validation | Small |
| P1 | G-B4 | Fix dashboard session leak (`Depends(get_db)`) | Small |
| P1 | G-B11 | Disable `echo=True` in production | Trivial |
| P1 | G-B18 | Remove debug `print()` from report route | Trivial |
| P1 | G-B19 | Replace `datetime.utcnow()` | Trivial |
| P1 | G-F3 | Centralise API URL to env var | Medium |
| P1 | G-F4 | Real geolocation in ReportForm | Medium |
| P1 | G-B13 | Add Alembic migrations | Medium |
| P1 | G-I2 | Remove hardcoded DB password | Small |
| P2 | G-B10 | Fix N+1 queries in missions | Medium |
| P2 | G-B12 | Consolidate dashboard queries | Medium |
| P2 | G-B16 | Extract service layer | Large |
| P2 | G-F5 | Connect dashboard to real API data | Medium |
| P2 | G-F6 | Token expiry detection on frontend | Medium |
| P2 | G-B6 | Rate limiting on auth endpoints | Medium |
| P2 | G-B7 | Password strength validation | Small |
| P3 | G-B14 | Refresh token endpoint | Medium |
| P3 | G-B15 | Background task queue (Celery + Redis) | Large |
| P3 | G-B9 | httpOnly cookie token storage | Large |
| P3 | G-F7 | OAuth social login (NextAuth.js) | Large |
| P3 | G-F8 | Error boundaries + loading skeletons | Medium |
| P3 | G-B17 | Structured logging + Sentry | Medium |
| P3 | G-I1 | Complete `docker-compose.yml` | Medium |
| P3 | G-I3 | CI/CD pipelines | Medium |
| P3 | G-I4 | Test suite (pytest + React Testing Library) | Large |
| P3 | G-I5 | Nginx reverse proxy config | Medium |

---

*End of CATVERSE-X Architecture Documentation*
