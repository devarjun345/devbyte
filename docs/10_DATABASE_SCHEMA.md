# DEV BYTE â€” Standalone Database Schema Reference

This file is intentionally standalone so it can be shown independently.

## Identity
### users
`id BIGINT PK`, `email VARCHAR(255) UNIQUE NOT NULL`, `username VARCHAR(50) UNIQUE NOT NULL`, `password_hash VARCHAR(255) NOT NULL`, `role ENUM(student,mentor)`, `is_active BOOLEAN`, `is_verified BOOLEAN`, timestamps.

### student_profiles
`id PK`, `user_id FK UNIQUE`, `full_name`, `bio`, `college`, `branch`, `year`, `profile_image_url`, `github_url`, `linkedin_url`, `portfolio_url`, timestamps.

### mentor_profiles
`id PK`, `user_id FK UNIQUE`, `full_name`, `bio`, `organization`, `experience_years`, `profile_image_url`, `github_url`, `linkedin_url`, `website_url`, timestamps.

## Skills
### skills
`id PK`, `name UNIQUE`, `category`, timestamp.

### student_skills
`id PK`, `student_id FK`, `skill_id FK`, `proficiency`, `can_teach`, `years_experience`, timestamps. Unique `(student_id, skill_id)`.

### student_learning_goals
`id PK`, `student_id FK`, `skill_id FK`, `current_proficiency`, `target_proficiency`, timestamp.

## Projects
### projects
`id PK`, `owner_student_id FK`, optional `team_id FK`, `title`, `description`, `category`, `status`, `github_url`, `demo_url`, `image_url`, `is_public`, timestamps.

### project_members
`id PK`, `project_id FK`, `student_id FK`, `role`, `joined_at`. Unique `(project_id, student_id)`.

### project_skills
Composite key `(project_id, skill_id)`.

## Teams
### teams
`id PK`, `name`, `description`, `owner_student_id FK`, `is_public`, `max_members`, timestamps.

### team_members
`id PK`, `team_id FK`, `student_id FK`, `role`, `joined_at`. Unique `(team_id, student_id)`.

### team_invitations
`id PK`, `team_id FK`, `inviter_student_id FK`, `invitee_student_id FK`, `status`, `message`, `created_at`, `responded_at`.

### team_requirements
`id PK`, `team_id FK`, `role_title`, `description`, `slots`, `experience_level`, `is_open`, timestamps.

### team_requirement_skills
Composite key `(requirement_id, skill_id)`.

## Hackathons
### hackathons
`id PK`, `title`, `description`, `organizer`, `mode`, `location`, `registration_url`, `source`, `source_event_id`, `source_url`, `deadline`, `start_date`, `end_date`, `prize_description`, team-size fields, `banner_url`, `status`, `last_synced_at`, timestamps.

### hackathon_skills
Composite key `(hackathon_id, skill_id)`.

### hackathon_bookmarks
`id PK`, `student_id FK`, `hackathon_id FK`, timestamp; unique pair.

### hackathon_teams
`id PK`, `hackathon_id FK`, `team_id FK`, `status`, `registration_reference`, timestamps; unique pair.

## Skill Swap
### skill_swap_requests
`id PK`, requester/recipient student FKs, offered/requested skill FKs, `message`, `status`, timestamps.

### skill_swap_sessions
`id PK`, `request_id FK`, `scheduled_at`, `duration_minutes`, `meeting_mode`, `meeting_link`, `status`, notes, timestamps.

### skill_swap_feedback
`id PK`, `session_id FK`, `reviewer_student_id FK`, `rating`, `feedback`, timestamp; unique reviewer/session.

## Battle Arena
### coding_problems
`id PK`, `created_by_mentor_id FK`, title, description, difficulty, input/output format, constraints, time/memory limits, `status`, timestamps.

### problem_skills
Composite key `(problem_id, skill_id)`.

### test_cases
`id PK`, `problem_id FK`, input, expected output, hidden flag, sequence, timestamp.

### contests
`id PK`, `created_by_mentor_id FK`, title, description, start/end, `status`, timestamps.

### contest_problems
`contest_id`, `problem_id`, `points`, `sequence_no`; composite key.

### contest_participants
`id PK`, contest/student FKs, joined_at, final_score, rank; unique contest/student.

### submissions
`id PK`, student/problem FKs, optional contest FK, language, source_reference, status, score, submitted_at.

### submission_results
`id PK`, submission FK, test counts, execution time, memory, compiler/runtime messages, timestamp.

## Mentor sessions
### mentor_session_offerings
`id PK`, mentor FK, title, description, duration, price_amount, currency, active flag, timestamps.

### mentor_availability
`id PK`, mentor FK, day_of_week, start/end time, timezone, active.

### mentor_bookings
`id PK`, offering FK, student FK, scheduled start/end, meeting_link, booking status, payment_status, payment_reference, timestamps.

## Assignments
### assignments
`id PK`, mentor FK, title, description, assignment_type, due_at, allow_late_submission, status, timestamps.

### assignment_recipients
`id PK`, assignment FK, student FK, status, started_at, submitted_at, score; unique assignment/student.

### assignment_submissions
`id PK`, recipient FK, project_url, answer_text, source_reference, submitted_at, review fields.

## Gamification
### xp_events
`id PK`, student FK, event_type, points, reference_type, reference_id, timestamp.

### reputation_events
`id PK`, student FK, event_type, points, category, reference_type, reference_id, timestamp.

### badges
`id PK`, name, description, criteria_type, criteria_value, timestamp.

### student_badges
`id PK`, student/badge FKs, awarded_at; unique student/badge.

## AI Mentor
Optional historical note:
### ai_conversations
`id PK`, student FK, title, timestamps.
### ai_messages
`id PK`, conversation FK, role, content, timestamp.

## Note
Production source of truth should be SQLAlchemy models + Alembic migrations. This document is the human-readable schema reference.

