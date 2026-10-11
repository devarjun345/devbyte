# DEV BYTE â€” Feature Traceability List (FTL)

FTL is used here as **Feature Traceability List**: it links a feature to its product requirement, frontend, backend, data and acceptance test.

| ID | Feature | Frontend | Backend | Data | Acceptance |
|---|---|---|---|---|---|
| F-01 | Auth | Login/Register/guards | Auth/JWT | users | Auth tests |
| F-02 | Student profile | Profile | Student service | student_profiles | CRUD |
| F-03 | Mentor profile | Mentor pages | Mentor service | mentor_profiles | CRUD |
| F-04 | Skills | Skill UI | Skill service | skills/student_skills/goals | CRUD |
| F-05 | Projects | Portfolio | Project service | projects/members/skills | CRUD |
| F-06 | Teams | Team pages | Team service | teams/members/invites/requirements | Join/invite |
| F-07 | Hackathons | List/details/filter | ingestion + service | hackathons/skills/bookmarks | ingest/view/redirect |
| F-08 | AI Team Matcher | Matcher UI | retrieval/scoring/AI | teams/students/skills | real candidate |
| F-09 | Skill Swap | Swap UI | request/session service | swap tables | request-to-session |
| F-10 | Battle Arena | Problem/editor/results | problem/submission/judge | arena tables | correct code accepted |
| F-11 | Contest | Contest UI | Contest service | contests/participants | join/score |
| F-12 | Mentor Sessions | Offer/booking UI | session service | offerings/availability/bookings | booking flow |
| F-13 | Assignments | Assignment UI | assignment service | assignment tables | submit/review |
| F-14 | XP | XP display | event service | xp_events | event recorded |
| F-15 | Reputation | profile/reputation | reputation service | reputation_events | score updates |
| F-16 | Badges | badge UI | achievement service | badges/student_badges | criteria pass |
| F-17 | Leaderboard | ranking UI | ranking service | calculated/cached ranking | ordering correct |
| F-18 | AI Mentor | chat UI | AI mentor service | conversations/messages optional | contextual response |

