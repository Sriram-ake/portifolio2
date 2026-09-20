# Ake Sri Ram — Developer Portfolio

A premium, production-ready full-stack developer portfolio.

- **Frontend:** React 18 · TypeScript (strict) · Vite · Tailwind CSS · Framer Motion · GSAP · Recharts
- **Backend:** FastAPI (Python) · httpx · Pydantic v2
- **AI Assistant:** NVIDIA NIM (with a grounded rule-based fallback)
- **Email:** Brevo (transactional API)
- **Coding stats:** GitHub, LeetCode, CodeChef, HackerRank, GeeksforGeeks, Codeforces

> No fabricated data. Projects, certifications, achievements, and coding
> statistics are either loaded from verified sources or shown as graceful
> "coming soon" states until real data is added.

---

## Project structure

```
portifolio/
├── frontend/                 # React + TS + Vite app
│   ├── src/
│   │   ├── components/        # layout, ui, hero, about, education, skills,
│   │   │                      # projects, certifications, coding, chatbot,
│   │   │                      # assistant, contact, journey, achievements
│   │   ├── data/              # single source of truth for editable content
│   │   ├── hooks/             # useReducedMotion, useScrollSpy, useCoding, useChat, ...
│   │   ├── services/          # typed API client
│   │   ├── animations/        # Framer variants + GSAP reveal hook
│   │   ├── lib/               # utils, navigation, markdown renderer
│   │   ├── styles/            # design tokens + global CSS
│   │   └── types/             # shared TypeScript types
│   └── ...
└── backend/                  # FastAPI app
    ├── app/
    │   ├── main.py            # app + CORS + security headers + routing
    │   ├── config.py          # env-driven settings
    │   ├── schemas.py         # Pydantic models
    │   ├── data.py            # verified portfolio content
    │   ├── cache.py           # TTL cache + rate limiter
    │   ├── routes/            # health, content, coding, chat, contact
    │   ├── services/          # coding_service, nvidia, brevo, context
    │   └── scrapers/          # per-platform data clients
    └── tests/                 # pytest suite
```

---

## Editing content (no UI changes needed)

All personal content lives in `frontend/src/data/` (and mirrored in
`backend/app/data.py` for the AI assistant / content API):

| File | What it holds |
|------|---------------|
| `profile.ts` | Name, role, education, CGPA, summary, resume path |
| `socialLinks.ts` | Verified profile URLs (Instagram stays `null` until provided) |
| `education.ts` | Education timeline |
| `skills.ts` | Skill categories + honest proficiency labels |
| `projects.ts` | Projects (empty by default — add real ones) |
| `certifications.ts` | Certificates (empty by default — add real ones) |
| `achievements.ts` | Achievements (section hidden while empty) |
| `journey.ts` | Developer journey milestones |
| `codingPlatforms.ts` | Coding platform usernames + profile URLs |

### Adding a resume
Drop the PDF at `frontend/public/resume/Ake-Sri-Ram-Resume.pdf` and set
`resumeUrl` in `profile.ts`. Until then the button shows a disabled
"coming soon" state.

---

## Getting started

### 1. Backend

```bash
cd backend
python -m venv .venv
# Windows:  .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # then fill in any keys you have
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/api/docs

The backend runs fine with **no keys**:
- The AI assistant uses a grounded rule-based responder.
- Coding stats use public APIs (GitHub/LeetCode/Codeforces work without keys;
  others degrade gracefully).
- The contact form reports honestly that email isn't configured.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173 (Vite proxies `/api` → `http://localhost:8000`).

---

## Environment variables (`backend/.env`)

| Variable | Purpose |
|----------|---------|
| `FRONTEND_URL` | Allowed CORS origin |
| `GITHUB_TOKEN` | Optional read-only token for higher GitHub rate limits |
| `CODING_CACHE_TTL` | Coding stats cache seconds (default 3600) |
| `NVIDIA_NIM_API_KEY` | Enables the LLM assistant (else fallback) |
| `NVIDIA_NIM_MODEL` | NIM model id |
| `BREVO_API_KEY` / `BREVO_SENDER_EMAIL` / `CONTACT_RECEIVER_EMAIL` | Contact email |

**Secrets never reach the frontend.** The browser only calls `POST /api/chat`
and `POST /api/contact`.

---

## API reference

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Health + service status |
| GET | `/api/profile` | Profile |
| GET | `/api/education` | Education timeline |
| GET | `/api/skills` | Skill categories |
| GET | `/api/projects` | Projects |
| GET | `/api/certifications` | Certifications |
| GET | `/api/coding` | Aggregated stats (all platforms) |
| GET | `/api/coding/{platform}` | Single platform stats |
| GET | `/api/coding/{platform}/heatmap` | Daily activity calendar (`github`, `leetcode`) |
| POST | `/api/chat` | Streaming assistant response |
| POST | `/api/contact` | Send a contact message |

Add `?force=true` to coding endpoints to bypass the cache.

---

## Testing

```bash
cd backend
.venv/Scripts/python -m pytest      # (or `pytest` inside the venv)
```

Covers content endpoints, coding normalization, single-platform failure
isolation, chat fallback grounding (no hallucination), and contact validation.

Frontend:

```bash
cd frontend
npm run type-check   # strict TS
npm run lint         # ESLint
npm run build        # production build
```

---

## Building for production

```bash
cd frontend && npm run build        # outputs frontend/dist
```

Serve `frontend/dist` from any static host (Vercel, Netlify, Cloudflare Pages,
S3, Nginx). Run the backend with a production server, e.g.:

```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
```

Set `FRONTEND_URL` to your deployed frontend origin and point the frontend's
`VITE_API_BASE_URL` at the backend origin (or reverse-proxy `/api`).

---

## Accessibility & performance

- Semantic HTML, skip link, keyboard-navigable nav, modals, and chat.
- Focus-visible rings, ARIA labels, form labels + inline errors, live regions.
- Full `prefers-reduced-motion` support (animations reduce to static states).
- Lazy-loaded charts, code-split bundles, lazy images, cached API responses.
- SEO: title/description, Open Graph, Twitter cards, JSON-LD, robots, sitemap.
"# portifolio2" 
