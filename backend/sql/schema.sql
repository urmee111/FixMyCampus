-- FixMyCampus database schema
-- Run this once in the Supabase SQL Editor.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(10) NOT NULL DEFAULT 'student'
        CHECK (role IN ('student', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE issues (
    id SERIAL PRIMARY KEY,
    title VARCHAR(120) NOT NULL
        CHECK (length(trim(title)) >= 5),
    description TEXT NOT NULL
        CHECK (length(trim(description)) >= 10),
    category VARCHAR(20) NOT NULL
        CHECK (category IN (
            'Electrical',
            'Water',
            'Cleanliness',
            'Furniture',
            'Internet',
            'Other'
        )),
    location VARCHAR(120) NOT NULL,
    photo_url TEXT,
    status VARCHAR(15) NOT NULL DEFAULT 'Open'
        CHECK (status IN ('Open', 'In Progress', 'Resolved')),
    created_by INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at TIMESTAMPTZ
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    issue_id INT NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text VARCHAR(500) NOT NULL
        CHECK (length(trim(text)) >= 1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE upvotes (
    issue_id INT NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (issue_id, user_id)
);

CREATE TABLE status_history (
    id SERIAL PRIMARY KEY,
    issue_id INT NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    old_status VARCHAR(15),
    new_status VARCHAR(15) NOT NULL,
    changed_by INT NOT NULL REFERENCES users(id),
    note VARCHAR(300),
    changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_issues_status
    ON issues(status);

CREATE INDEX idx_issues_category
    ON issues(category);

CREATE INDEX idx_issues_created_by
    ON issues(created_by);

CREATE INDEX idx_issues_title_trgm
    ON issues USING gin (title gin_trgm_ops);

CREATE INDEX idx_comments_issue
    ON comments(issue_id);