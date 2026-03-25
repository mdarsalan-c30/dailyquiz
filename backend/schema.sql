-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    firebase_uid VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(255),
    streak INT DEFAULT 0,
    last_active_date DATE,
    points INT DEFAULT 0,
    referral_code VARCHAR(20) UNIQUE,
    referred_by_id INT REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Questions Table
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    explanation TEXT,
    category VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- User Answers Table
CREATE TABLE IF NOT EXISTS user_answers (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    question_id INT NOT NULL REFERENCES questions(id),
    selected_answer VARCHAR(255) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    answered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, question_id)
);

-- Monetization Hub
CREATE TABLE IF NOT EXISTS offers (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cta VARCHAR(100),
    link VARCHAR(512) NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Static Content Table (CMS)
CREATE TABLE IF NOT EXISTS static_content (
    key VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
