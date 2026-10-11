# DEV BYTE â€” API Contract

Base prefix: `/api`

## Auth
POST `/auth/register`
POST `/auth/login`
POST `/auth/logout`
GET `/auth/me`

## Student
GET/PATCH `/students/me`
GET `/students/{id}`
GET `/students`

## Mentor
GET/PATCH `/mentors/me`
GET `/mentors`
GET `/mentors/{id}`

## Skills
GET `/skills`
POST `/students/me/skills`
PATCH `/students/me/skills/{id}`
DELETE `/students/me/skills/{id}`
POST `/students/me/learning-goals`
DELETE `/students/me/learning-goals/{id}`

## Projects
GET `/projects/me`
POST `/projects`
GET/PATCH/DELETE `/projects/{id}`

## Teams
GET/POST `/teams`
GET/PATCH `/teams/{id}`
POST `/teams/{id}/join-requests`
POST `/teams/{id}/invitations`
PATCH `/team-invitations/{id}`

## Hackathons
GET `/hackathons`
GET `/hackathons/{id}`
POST/DELETE `/hackathons/{id}/bookmark`

## AI Team Matcher
POST `/team-matching/search`
POST `/team-matching/invite`

## Skill Swap
GET `/skill-swap/matches`
POST `/skill-swap/requests`
GET `/skill-swap/requests`
PATCH `/skill-swap/requests/{id}`
POST `/skill-swap/sessions`
PATCH `/skill-swap/sessions/{id}`
POST `/skill-swap/sessions/{id}/feedback`

## Battle Arena
GET `/problems`
GET `/problems/{id}`
POST/PATCH `/problems` (mentor)
POST `/submissions`
GET `/submissions/{id}`
GET `/submissions/me`
GET/POST `/contests`
GET `/contests/{id}`
POST `/contests/{id}/join`

## Mentor Sessions
GET/POST `/mentor-sessions/offerings`
PATCH `/mentor-sessions/offerings/{id}`
GET/POST `/mentor-sessions/availability`
POST `/mentor-sessions/bookings`
GET `/mentor-sessions/bookings/me`
PATCH `/mentor-sessions/bookings/{id}`

## Assignments
GET `/assignments`
POST `/assignments` (mentor)
GET `/assignments/{id}`
POST `/assignments/{id}/submit`
POST `/assignments/{id}/review` (mentor)

## Gamification
GET `/gamification/me`
GET `/leaderboard`
GET `/contests/{id}/leaderboard`

## AI Mentor
POST `/ai/mentor/chat`
GET `/ai/mentor/conversations`
GET `/ai/mentor/conversations/{id}`

## Rules
Typed Pydantic request/response schemas, authorization on every protected resource, pagination for lists, consistent error payloads, no secrets/password hashes in responses.
