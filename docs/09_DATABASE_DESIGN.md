# DEV BYTE â€” Database Design

## Database
MySQL with SQLAlchemy 2.x and Alembic.

## Core data domains
Identity; profiles; skills; projects; teams; hackathons; Skill Swap; Battle Arena; Mentor Sessions; Assignments; gamification; AI Mentor history.

## Key relationships
users â†’ student_profiles / mentor_profiles.
student_profiles â†” skills.
student_profiles â†’ projects.
projects â†” skills and project_members.
students â†” teams via team_members.
teams â†’ team_requirements â†’ skills.
hackathons â†” skills.
hackathons â†” teams via hackathon_teams.
students â†” Skill Swap requests â†’ sessions â†’ feedback.
mentors â†’ coding_problems â†’ test_cases.
mentors â†’ contests â†’ contest_problems/participants.
students â†’ submissions â†’ submission_results.
mentors â†’ session_offerings â†’ availability/bookings.
mentors â†’ assignments â†’ assignment_recipients â†’ submissions.
students â†’ xp_events/reputation_events/badges.

## Important integrity
Unique email/username/skill; unique memberships/joins/bookmarks/contest participation; foreign keys; transactions for invitation/booking state changes.

