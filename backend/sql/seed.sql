-- FixMyCampus seed data
-- Demo users, issues, comments, upvotes and status history

-- =========================
-- USERS
-- =========================

INSERT INTO users (name, email, password_hash, role)
VALUES
(
    'Student One',
    'student@fixmycampus.test',
    '$2b$10$NXjIGqyY3y8nyhTPFzKQ5.FX.U9.kGDR8l6tuvZjZD8Ca66syx3Di',
    'student'
),
(
    'Student Two',
    'student2@fixmycampus.test',
    '$2b$10$NXjIGqyY3y8nyhTPFzKQ5.FX.U9.kGDR8l6tuvZjZD8Ca66syx3Di',
    'student'
),
(
    'Campus Admin',
    'admin@fixmycampus.test',
    '$2b$10$yYismEzEb1LP2LlfUGsvF.w7kMZdX14ybQpxz3ywrK6egcyV0twgi',
    'admin'
);

-- =========================
-- ISSUES
-- =========================

INSERT INTO issues
(title, description, category, location, status, created_by)
VALUES
(
    'Broken classroom light',
    'The ceiling light is not working in the classroom.',
    'Electrical',
    'Building A - Room 201',
    'Open',
    (SELECT id FROM users WHERE email = 'student@fixmycampus.test')
),
(
    'Water leakage in washroom',
    'There is continuous water leakage near the washroom sink.',
    'Water',
    'Building B - 2nd Floor',
    'In Progress',
    (SELECT id FROM users WHERE email = 'student2@fixmycampus.test')
),
(
    'Internet connection is slow',
    'The campus internet is very slow in this area.',
    'Internet',
    'Library - 1st Floor',
    'Resolved',
    (SELECT id FROM users WHERE email = 'student@fixmycampus.test')
);

-- =========================
-- COMMENTS
-- =========================

INSERT INTO comments (issue_id, user_id, text)
VALUES
(
    (SELECT id FROM issues WHERE title = 'Broken classroom light'),
    (SELECT id FROM users WHERE email = 'student2@fixmycampus.test'),
    'I noticed the same problem yesterday.'
),
(
    (SELECT id FROM issues WHERE title = 'Water leakage in washroom'),
    (SELECT id FROM users WHERE email = 'admin@fixmycampus.test'),
    'Maintenance team has been notified.'
),
(
    (SELECT id FROM issues WHERE title = 'Internet connection is slow'),
    (SELECT id FROM users WHERE email = 'admin@fixmycampus.test'),
    'The network issue has been fixed.'
);

-- =========================
-- UPVOTES
-- =========================

INSERT INTO upvotes (issue_id, user_id)
VALUES
(
    (SELECT id FROM issues WHERE title = 'Broken classroom light'),
    (SELECT id FROM users WHERE email = 'student2@fixmycampus.test')
),
(
    (SELECT id FROM issues WHERE title = 'Water leakage in washroom'),
    (SELECT id FROM users WHERE email = 'student@fixmycampus.test')
);

-- =========================
-- STATUS HISTORY
-- =========================

INSERT INTO status_history
(issue_id, old_status, new_status, changed_by, note)
VALUES
(
    (SELECT id FROM issues WHERE title = 'Water leakage in washroom'),
    'Open',
    'In Progress',
    (SELECT id FROM users WHERE email = 'admin@fixmycampus.test'),
    'Maintenance team assigned.'
),
(
    (SELECT id FROM issues WHERE title = 'Internet connection is slow'),
    'Open',
    'In Progress',
    (SELECT id FROM users WHERE email = 'admin@fixmycampus.test'),
    'Network team started investigating.'
),
(
    (SELECT id FROM issues WHERE title = 'Internet connection is slow'),
    'In Progress',
    'Resolved',
    (SELECT id FROM users WHERE email = 'admin@fixmycampus.test'),
    'Internet connection restored.'
);

-- Set resolved_at for the resolved issue
UPDATE issues
SET resolved_at = now()
WHERE title = 'Internet connection is slow';