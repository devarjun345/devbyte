-- DEV BYTE MySQL schema starter/reference.
-- SQLAlchemy models + Alembic migrations are the implementation source of truth.

CREATE DATABASE IF NOT EXISTS devrank_dev;
USE devrank_dev;

CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student','mentor') NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE student_profiles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL UNIQUE,
  full_name VARCHAR(100) NOT NULL,
  bio TEXT,
  college VARCHAR(150),
  branch VARCHAR(100),
  year TINYINT,
  profile_image_url VARCHAR(500),
  github_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  portfolio_url VARCHAR(500),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE mentor_profiles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL UNIQUE,
  full_name VARCHAR(100) NOT NULL,
  bio TEXT,
  organization VARCHAR(150),
  experience_years DECIMAL(4,1),
  profile_image_url VARCHAR(500),
  github_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  website_url VARCHAR(500),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE skills (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(50) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE student_skills (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  skill_id BIGINT NOT NULL,
  proficiency ENUM('beginner','intermediate','advanced') NOT NULL,
  can_teach BOOLEAN NOT NULL DEFAULT FALSE,
  years_experience DECIMAL(4,1),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_student_skill (student_id, skill_id),
  FOREIGN KEY (student_id) REFERENCES student_profiles(id),
  FOREIGN KEY (skill_id) REFERENCES skills(id)
);

CREATE TABLE student_learning_goals (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  skill_id BIGINT NOT NULL,
  current_proficiency ENUM('beginner','intermediate','advanced') NOT NULL,
  target_proficiency ENUM('beginner','intermediate','advanced') NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES student_profiles(id),
  FOREIGN KEY (skill_id) REFERENCES skills(id)
);

CREATE TABLE teams (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  owner_student_id BIGINT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  max_members INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_student_id) REFERENCES student_profiles(id)
);

CREATE TABLE projects (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  owner_student_id BIGINT NOT NULL,
  team_id BIGINT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100),
  status ENUM('idea','in_progress','completed','archived') NOT NULL DEFAULT 'in_progress',
  github_url VARCHAR(500),
  demo_url VARCHAR(500),
  image_url VARCHAR(500),
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_student_id) REFERENCES student_profiles(id),
  FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE team_members (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  team_id BIGINT NOT NULL,
  student_id BIGINT NOT NULL,
  role VARCHAR(100) NOT NULL,
  joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_team_member (team_id, student_id),
  FOREIGN KEY (team_id) REFERENCES teams(id),
  FOREIGN KEY (student_id) REFERENCES student_profiles(id)
);

CREATE TABLE team_invitations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  team_id BIGINT NOT NULL,
  inviter_student_id BIGINT NOT NULL,
  invitee_student_id BIGINT NOT NULL,
  status ENUM('pending','accepted','rejected','cancelled') NOT NULL DEFAULT 'pending',
  message TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  responded_at DATETIME NULL,
  FOREIGN KEY (team_id) REFERENCES teams(id),
  FOREIGN KEY (inviter_student_id) REFERENCES student_profiles(id),
  FOREIGN KEY (invitee_student_id) REFERENCES student_profiles(id)
);

CREATE TABLE team_requirements (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  team_id BIGINT NOT NULL,
  role_title VARCHAR(100) NOT NULL,
  description TEXT,
  slots INT NOT NULL DEFAULT 1,
  experience_level ENUM('beginner','intermediate','advanced'),
  is_open BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE project_members (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  project_id BIGINT NOT NULL,
  student_id BIGINT NOT NULL,
  role VARCHAR(100),
  joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_project_member (project_id, student_id),
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (student_id) REFERENCES student_profiles(id)
);

CREATE TABLE project_skills (
  project_id BIGINT NOT NULL,
  skill_id BIGINT NOT NULL,
  PRIMARY KEY (project_id, skill_id),
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (skill_id) REFERENCES skills(id)
);

CREATE TABLE team_requirement_skills (
  requirement_id BIGINT NOT NULL,
  skill_id BIGINT NOT NULL,
  PRIMARY KEY (requirement_id, skill_id),
  FOREIGN KEY (requirement_id) REFERENCES team_requirements(id),
  FOREIGN KEY (skill_id) REFERENCES skills(id)
);

CREATE TABLE hackathons (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  organizer VARCHAR(150) NOT NULL,
  mode ENUM('online','offline','hybrid') NOT NULL,
  location VARCHAR(200),
  registration_url VARCHAR(500) NOT NULL,
  source VARCHAR(100) NOT NULL,
  source_event_id VARCHAR(200),
  source_url VARCHAR(500),
  deadline DATETIME NOT NULL,
  start_date DATETIME,
  end_date DATETIME,
  prize_description VARCHAR(500),
  team_size_min INT,
  team_size_max INT,
  banner_url VARCHAR(500),
  status VARCHAR(30) NOT NULL DEFAULT 'upcoming',
  last_synced_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_hackathon_deadline (deadline),
  INDEX idx_hackathon_source (source, source_event_id)
);

CREATE TABLE hackathon_skills (
  hackathon_id BIGINT NOT NULL,
  skill_id BIGINT NOT NULL,
  PRIMARY KEY (hackathon_id, skill_id),
  FOREIGN KEY (hackathon_id) REFERENCES hackathons(id),
  FOREIGN KEY (skill_id) REFERENCES skills(id)
);

CREATE TABLE hackathon_bookmarks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  hackathon_id BIGINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_hackathon_bookmark (student_id, hackathon_id),
  FOREIGN KEY (student_id) REFERENCES student_profiles(id),
  FOREIGN KEY (hackathon_id) REFERENCES hackathons(id)
);

CREATE TABLE hackathon_teams (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  hackathon_id BIGINT NOT NULL,
  team_id BIGINT NOT NULL,
  status ENUM('interested','registered','submitted','completed') NOT NULL DEFAULT 'interested',
  registration_reference VARCHAR(200),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_hackathon_team (hackathon_id, team_id),
  FOREIGN KEY (hackathon_id) REFERENCES hackathons(id),
  FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE skill_swap_requests (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  requester_student_id BIGINT NOT NULL,
  recipient_student_id BIGINT NOT NULL,
  offered_skill_id BIGINT NOT NULL,
  requested_skill_id BIGINT NOT NULL,
  message TEXT,
  status ENUM('pending','accepted','rejected','cancelled','completed') NOT NULL DEFAULT 'pending',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (requester_student_id) REFERENCES student_profiles(id),
  FOREIGN KEY (recipient_student_id) REFERENCES student_profiles(id),
  FOREIGN KEY (offered_skill_id) REFERENCES skills(id),
  FOREIGN KEY (requested_skill_id) REFERENCES skills(id)
);

CREATE TABLE skill_swap_sessions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  request_id BIGINT NOT NULL,
  scheduled_at DATETIME NOT NULL,
  duration_minutes INT NOT NULL,
  meeting_mode ENUM('online','offline') NOT NULL DEFAULT 'online',
  meeting_link VARCHAR(500),
  status ENUM('scheduled','completed','cancelled','no_show') NOT NULL DEFAULT 'scheduled',
  session_notes TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES skill_swap_requests(id)
);

CREATE TABLE skill_swap_feedback (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  session_id BIGINT NOT NULL,
  reviewer_student_id BIGINT NOT NULL,
  rating TINYINT NOT NULL,
  feedback TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_swap_feedback (session_id, reviewer_student_id),
  FOREIGN KEY (session_id) REFERENCES skill_swap_sessions(id),
  FOREIGN KEY (reviewer_student_id) REFERENCES student_profiles(id)
);

CREATE TABLE coding_problems (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  created_by_mentor_id BIGINT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  difficulty ENUM('easy','medium','hard') NOT NULL,
  input_format TEXT,
  output_format TEXT,
  constraints TEXT,
  time_limit_ms INT NOT NULL DEFAULT 2000,
  memory_limit_mb INT NOT NULL DEFAULT 256,
  status ENUM('draft','published','archived') NOT NULL DEFAULT 'draft',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by_mentor_id) REFERENCES mentor_profiles(id)
);

CREATE TABLE problem_skills (
  problem_id BIGINT NOT NULL,
  skill_id BIGINT NOT NULL,
  PRIMARY KEY (problem_id, skill_id),
  FOREIGN KEY (problem_id) REFERENCES coding_problems(id),
  FOREIGN KEY (skill_id) REFERENCES skills(id)
);

CREATE TABLE test_cases (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  problem_id BIGINT NOT NULL,
  input_data LONGTEXT NOT NULL,
  expected_output LONGTEXT NOT NULL,
  is_hidden BOOLEAN NOT NULL DEFAULT TRUE,
  sequence_no INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (problem_id) REFERENCES coding_problems(id)
);

CREATE TABLE contests (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  created_by_mentor_id BIGINT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  status ENUM('draft','upcoming','live','ended') NOT NULL DEFAULT 'draft',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by_mentor_id) REFERENCES mentor_profiles(id)
);

CREATE TABLE contest_problems (
  contest_id BIGINT NOT NULL,
  problem_id BIGINT NOT NULL,
  points INT NOT NULL,
  sequence_no INT NOT NULL,
  PRIMARY KEY (contest_id, problem_id),
  FOREIGN KEY (contest_id) REFERENCES contests(id),
  FOREIGN KEY (problem_id) REFERENCES coding_problems(id)
);

CREATE TABLE contest_participants (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  contest_id BIGINT NOT NULL,
  student_id BIGINT NOT NULL,
  joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  final_score INT NOT NULL DEFAULT 0,
  rank INT,
  UNIQUE KEY uq_contest_student (contest_id, student_id),
  FOREIGN KEY (contest_id) REFERENCES contests(id),
  FOREIGN KEY (student_id) REFERENCES student_profiles(id)
);

CREATE TABLE submissions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  problem_id BIGINT NOT NULL,
  contest_id BIGINT NULL,
  language ENUM('cpp','python','java') NOT NULL,
  source_reference VARCHAR(500) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'queued',
  score INT NOT NULL DEFAULT 0,
  submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES student_profiles(id),
  FOREIGN KEY (problem_id) REFERENCES coding_problems(id),
  FOREIGN KEY (contest_id) REFERENCES contests(id)
);

CREATE TABLE submission_results (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  submission_id BIGINT NOT NULL,
  tests_passed INT NOT NULL DEFAULT 0,
  tests_total INT NOT NULL DEFAULT 0,
  execution_time_ms INT,
  memory_used_kb BIGINT,
  compiler_message TEXT,
  runtime_message TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES submissions(id)
);

CREATE TABLE mentor_session_offerings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  mentor_id BIGINT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  duration_minutes INT NOT NULL,
  price_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (mentor_id) REFERENCES mentor_profiles(id)
);

CREATE TABLE mentor_availability (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  mentor_id BIGINT NOT NULL,
  day_of_week TINYINT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  timezone VARCHAR(64) NOT NULL DEFAULT 'Asia/Kolkata',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  FOREIGN KEY (mentor_id) REFERENCES mentor_profiles(id)
);

CREATE TABLE mentor_bookings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  offering_id BIGINT NOT NULL,
  student_id BIGINT NOT NULL,
  scheduled_start DATETIME NOT NULL,
  scheduled_end DATETIME NOT NULL,
  meeting_link VARCHAR(500),
  status ENUM('pending','confirmed','completed','cancelled','no_show') NOT NULL DEFAULT 'pending',
  payment_status ENUM('not_required','pending','paid','failed','refunded') NOT NULL DEFAULT 'not_required',
  payment_reference VARCHAR(200),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (offering_id) REFERENCES mentor_session_offerings(id),
  FOREIGN KEY (student_id) REFERENCES student_profiles(id),
  INDEX idx_booking_time (scheduled_start, scheduled_end)
);

CREATE TABLE assignments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  mentor_id BIGINT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  assignment_type ENUM('coding','project') NOT NULL,
  due_at DATETIME,
  allow_late_submission BOOLEAN NOT NULL DEFAULT FALSE,
  status ENUM('draft','published','active','closed') NOT NULL DEFAULT 'draft',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (mentor_id) REFERENCES mentor_profiles(id)
);

CREATE TABLE assignment_recipients (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  assignment_id BIGINT NOT NULL,
  student_id BIGINT NOT NULL,
  status ENUM('not_started','in_progress','submitted','reviewed','overdue') NOT NULL DEFAULT 'not_started',
  started_at DATETIME,
  submitted_at DATETIME,
  score INT,
  UNIQUE KEY uq_assignment_student (assignment_id, student_id),
  FOREIGN KEY (assignment_id) REFERENCES assignments(id),
  FOREIGN KEY (student_id) REFERENCES student_profiles(id)
);

CREATE TABLE assignment_submissions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  assignment_recipient_id BIGINT NOT NULL,
  project_url VARCHAR(500),
  answer_text TEXT,
  source_reference VARCHAR(500),
  submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at DATETIME,
  reviewer_score INT,
  reviewer_feedback TEXT,
  FOREIGN KEY (assignment_recipient_id) REFERENCES assignment_recipients(id)
);

CREATE TABLE xp_events (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  points INT NOT NULL,
  reference_type VARCHAR(100),
  reference_id BIGINT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES student_profiles(id)
);

CREATE TABLE reputation_events (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  points INT NOT NULL,
  category VARCHAR(50) NOT NULL,
  reference_type VARCHAR(100),
  reference_id BIGINT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES student_profiles(id)
);

CREATE TABLE badges (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  criteria_type VARCHAR(100) NOT NULL,
  criteria_value INT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE student_badges (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  badge_id BIGINT NOT NULL,
  awarded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_student_badge (student_id, badge_id),
  FOREIGN KEY (student_id) REFERENCES student_profiles(id),
  FOREIGN KEY (badge_id) REFERENCES badges(id)
);

CREATE TABLE ai_conversations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  title VARCHAR(200),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES student_profiles(id)
);

CREATE TABLE ai_messages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  conversation_id BIGINT NOT NULL,
  role ENUM('user','assistant','system') NOT NULL,
  content LONGTEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES ai_conversations(id)
);

