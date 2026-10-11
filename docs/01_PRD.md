# DEV BYTE â€” Product Requirements Document (PRD)

## 1. Product
DEV BYTE is an all-in-one student development ecosystem connecting students and mentors through professional profiles, portfolios, teams, hackathon discovery, peer skill exchange, competitive coding, mentor sessions, AI assistance, and activity-based reputation.

Tagline: **One Platform. Better Teams. Better Careers.**

## 2. Problem
Students use fragmented platforms for profiles/networking, projects/code, coding practice, hackathons, communities and mentorship. Skills and achievements are scattered, team formation is difficult, and there is no unified activity-based student identity.

## 3. Users
### Student
Learns, builds, competes, collaborates, finds hackathons, exchanges skills and books mentors.

### Mentor
Maintains expertise profile, creates problems/contests/assignments, reviews student work and offers free or paid mentoring sessions.

## 4. Product goals
- Working web prototype by September 22, 2026.
- Demonstrate the complete student journey.
- Demonstrate two meaningful AI features: AI Team Matcher and AI Mentor.
- Build a maintainable architecture that can be extended as the product grows.

## 5. Product features
Authentication; Student Profile; Mentor Profile; Skills; Projects/Portfolio; Teams; Hackathon Finder; AI Team Matcher; Skill Swap; Battle Arena; Contests; Mentor Sessions; Assignments; XP; Reputation; Badges; Leaderboard; AI Mentor; Student and Mentor dashboards.

## 6. Main demo journeys
### A â€” Hackathon â†’ Team
Hackathon Finder â†’ event requirements â†’ missing team role/skills â†’ AI Team Matcher â†’ candidate â†’ invitation â†’ accepted â†’ team.

### B â€” Solve â†’ Earn â†’ Rank
Battle Arena â†’ problem â†’ C++/Python/Java submission â†’ isolated judge â†’ result â†’ XP/reputation event â†’ leaderboard.

### C â€” Peer Skill Exchange
Skill profile â†’ matching â†’ request â†’ accept â†’ online Google Meet session â†’ completion â†’ feedback.

### D â€” Mentor session
Find mentor â†’ choose free/paid offering â†’ availability â†’ booking â†’ Google Meet â†’ feedback.

### E â€” AI Mentor
Question â†’ authorized student context â†’ Gemini â†’ personalized learning answer â†’ actual DEV BYTE problem recommendation where applicable.

## 7. Business rules
- Primary roles: Student and Mentor.
- Mentor verification is outside the current product scope.
- No public Admin self-registration.
- Resource ownership is enforced server-side.
- Skill Swap is Student â†” Student.
- Mentor Sessions are Mentor â†’ Student.
- Battle Arena correctness is determined by deterministic judging.
- AI is advisory and cannot directly perform privileged actions.
- Hackathon registration remains external.
- Notifications/alerts are outside the current product scope.

## 8. Out of scope
Mentor verification, recruiter/college panels, notifications/alerts, full real-time messaging, AI Career Assistant, AI Hackathon Matcher, AI Code Review, 1v1/team real-time battles, automatic Google Meet creation, real production payouts, advanced multi-agent infrastructure.

## 9. Success criteria
Core demo workflows work end-to-end; APIs are documented; shared development environment works for both developers; important backend flows have tests; source URLs are preserved for aggregated hackathons.

