# DEV BYTE â€” Software Architecture Document (SAD)

## 1. Application modules
- Auth
- Students
- Mentors
- Skills
- Projects
- Teams
- Hackathons
- Skill Swap
- Battle Arena
- Contests
- Mentor Sessions
- Assignments
- Gamification
- AI

## 2. Backend pattern
Router â†’ schema validation â†’ service/business logic â†’ SQLAlchemy/data access â†’ database.

## 3. Integration boundaries
- Hackathon sources â†’ ingestion adapters.
- Gemini â†’ AI service.
- Google Meet â†’ meeting URL.
- Code runner â†’ isolated execution boundary.

## 4. Key flows
### Team Matcher
Team/hackathon requirements â†’ candidate retrieval â†’ deterministic compatibility â†’ optional Gemini explanation â†’ invite.

### AI Mentor
Question â†’ authorized student context â†’ Gemini â†’ validated answer â†’ optional link to actual platform problems.

### Hackathon
Source â†’ adapter â†’ normalization â†’ deduplication â†’ database â†’ FastAPI â†’ frontend â†’ original source/registration page.

### Battle Arena
Problem â†’ submission â†’ queue â†’ isolated runner â†’ tests â†’ result â†’ XP/reputation.

## 5. Ownership
Backend: APIs, database, services, AI, ingestion, judge and backend tests.
Frontend: pages, routing, components, forms, API client, dashboards and UI tests.
Shared: API contract, integration, demo data, Git workflow and documentation.

