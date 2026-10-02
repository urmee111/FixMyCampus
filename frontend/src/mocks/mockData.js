// Fake data in the SAME shape as the real API (plan Sections 6.1 and 6.3), so pages can be built
// before the backend is ready. Each export below is the `data` part of an API response
// (what the functions in src/api/*.js return).
//
// Agreed conventions (the plan only shows an example, so Member A: please match these):
//   - JSON keys are camelCase (upvoteCount, createdAt...), the database columns are snake_case
//   - every issue has: upvoteCount, commentCount, priority, hasUpvoted (for the logged-in user), createdBy { id, name }
//   - GET /my/issues and GET /issues/similar return { items: [...] }
//   - dates are ISO strings

import { getPriority } from '../utils/priority';

const hoursAgo = (hours) => new Date(Date.now() - hours * 3600 * 1000).toISOString();

// ---------- users (match the test logins in the README) ----------

export const mockUsers = {
  student: { id: 1, name: 'Rahim Student', email: 'student@fixmycampus.test', role: 'student' },
  student2: { id: 2, name: 'Nadia Student', email: 'student2@fixmycampus.test', role: 'student' },
  admin: { id: 3, name: 'Campus Admin', email: 'admin@fixmycampus.test', role: 'admin' },
};

// POST /auth/login and POST /auth/signup  ->  data
export const mockAuthResponse = { token: 'mock-jwt-token', user: mockUsers.student };

// ---------- issues ----------

// Fills in the fields every issue has, and computes `priority` from the upvotes
const makeIssue = (issue) => ({
  photoUrl: null,
  hasUpvoted: false,
  resolvedAt: null,
  ...issue,
  priority: getPriority(issue.upvoteCount),
});

const rahim = { id: mockUsers.student.id, name: mockUsers.student.name };
const nadia = { id: mockUsers.student2.id, name: mockUsers.student2.name };

export const mockIssues = [
  makeIssue({
    id: 1,
    title: 'Ceiling fan not working',
    description: 'The ceiling fan in room 214 stopped working three days ago. It is very hot at night.',
    category: 'Electrical',
    location: 'Hall 2, Room 214',
    status: 'Open',
    upvoteCount: 12,
    commentCount: 3,
    hasUpvoted: true,
    createdBy: nadia,
    createdAt: hoursAgo(5),
    updatedAt: hoursAgo(5),
  }),
  makeIssue({
    id: 2,
    title: 'No running water in washroom',
    description: 'There has been no water in the second floor washroom since yesterday morning.',
    category: 'Water',
    location: 'CSE Building, 2nd Floor Washroom',
    status: 'In Progress',
    upvoteCount: 8,
    commentCount: 2,
    createdBy: rahim,
    createdAt: hoursAgo(30),
    updatedAt: hoursAgo(6),
  }),
  makeIssue({
    id: 3,
    title: 'Library WiFi is extremely slow',
    description: 'WiFi on the 3rd floor of the library barely loads any page, especially in the evening.',
    category: 'Internet',
    location: 'Library, 3rd Floor',
    status: 'Open',
    upvoteCount: 15,
    commentCount: 5,
    createdBy: nadia,
    createdAt: hoursAgo(48),
    updatedAt: hoursAgo(48),
  }),
  makeIssue({
    id: 4,
    title: 'Broken bench in cafeteria',
    description: 'One of the benches near the window is broken and could hurt someone.',
    category: 'Furniture',
    location: 'Cafeteria',
    status: 'Open',
    upvoteCount: 2,
    commentCount: 0,
    createdBy: rahim,
    createdAt: hoursAgo(72),
    updatedAt: hoursAgo(72),
  }),
  makeIssue({
    id: 5,
    title: 'Street light not working near main gate',
    description: 'The street light next to the main gate has been off for a week. The road is dark at night.',
    category: 'Electrical',
    location: 'Main Gate, Street Light',
    status: 'Resolved',
    upvoteCount: 6,
    commentCount: 1,
    createdBy: rahim,
    createdAt: hoursAgo(24 * 7),
    updatedAt: hoursAgo(24 * 2),
    resolvedAt: hoursAgo(24 * 2),
  }),
  makeIssue({
    id: 6,
    title: 'Dustbins overflowing',
    description: 'The dustbins on the ground floor are not emptied for days and the smell is spreading.',
    category: 'Cleanliness',
    location: 'Hall 1, Ground Floor',
    status: 'In Progress',
    upvoteCount: 5,
    commentCount: 1,
    createdBy: nadia,
    createdAt: hoursAgo(96),
    updatedAt: hoursAgo(20),
  }),
  makeIssue({
    id: 7,
    title: 'Water cooler is leaking',
    description: 'The water cooler on the first floor leaks and the corridor floor is always wet.',
    category: 'Water',
    location: 'Hall 3, 1st Floor',
    status: 'Resolved',
    upvoteCount: 4,
    commentCount: 2,
    createdBy: rahim,
    createdAt: hoursAgo(24 * 5),
    updatedAt: hoursAgo(24),
    resolvedAt: hoursAgo(24),
  }),
  makeIssue({
    id: 8,
    title: 'Lost and found box is missing',
    description: 'The lost and found box in the lobby is gone, so students cannot find lost items.',
    category: 'Other',
    location: 'Academic Building, Lobby',
    status: 'Open',
    upvoteCount: 1,
    commentCount: 0,
    createdBy: nadia,
    createdAt: hoursAgo(120),
    updatedAt: hoursAgo(120),
  }),
];

// GET /issues  ->  data
export const mockIssuesResponse = {
  items: mockIssues,
  page: 1,
  limit: 10,
  total: mockIssues.length,
  totalPages: 1,
};

// GET /issues/:id  ->  data  (the issue + its comments + its status history)
export const mockIssueDetail = {
  ...mockIssues[1], // "No running water in washroom" (In Progress)
  comments: [
    {
      id: 1,
      text: 'Same problem on the 3rd floor too!',
      createdAt: hoursAgo(28),
      user: { id: nadia.id, name: nadia.name, role: 'student' },
    },
    {
      id: 2,
      text: 'Plumber assigned. The water supply will be back tomorrow morning.',
      createdAt: hoursAgo(6),
      user: { id: mockUsers.admin.id, name: mockUsers.admin.name, role: 'admin' }, // shows an "Official" badge
    },
  ],
  history: [
    {
      id: 1,
      oldStatus: null,
      newStatus: 'Open',
      note: null,
      changedAt: hoursAgo(30),
      changedBy: { id: rahim.id, name: rahim.name },
    },
    {
      id: 2,
      oldStatus: 'Open',
      newStatus: 'In Progress',
      note: 'Plumber assigned. The water supply will be back tomorrow morning.',
      changedAt: hoursAgo(6),
      changedBy: { id: mockUsers.admin.id, name: mockUsers.admin.name },
    },
  ],
};

// GET /my/issues  ->  data  (issues created by the logged-in student, id 1)
export const mockMyIssues = {
  items: mockIssues.filter((issue) => issue.createdBy.id === mockUsers.student.id),
};

// GET /issues/similar  ->  data  (up to 3 possible duplicates, never Resolved)
export const mockSimilarIssues = {
  items: [mockIssues[0]],
};

// ---------- admin stats (exactly the shape in plan Section 6.3) ----------

// GET /stats  ->  data
export const mockStats = {
  total: 42,
  byStatus: { Open: 20, 'In Progress': 12, Resolved: 10 },
  byCategory: { Electrical: 11, Water: 9, Cleanliness: 8, Furniture: 5, Internet: 6, Other: 3 },
  topUpvoted: [
    { id: 3, title: 'Library WiFi is extremely slow', upvoteCount: 25 },
    { id: 1, title: 'Ceiling fan not working', upvoteCount: 12 },
    { id: 2, title: 'No running water in washroom', upvoteCount: 8 },
  ],
  avgResolutionHours: 18.4,
  resolvedLast7Days: 6,
  topLocations: [
    { location: 'Hall 2', count: 9 },
    { location: 'Library', count: 7 },
    { location: 'CSE Building', count: 6 },
  ],
};
