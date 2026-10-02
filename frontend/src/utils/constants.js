// Fixed lists used by forms, filters and badges.
// CATEGORIES and STATUSES must match the backend (backend/src/utils/constants.js).

export const CATEGORIES = ['Electrical', 'Water', 'Cleanliness', 'Furniture', 'Internet', 'Other'];

export const STATUSES = ['Open', 'In Progress', 'Resolved'];

// Placeholder list for the "Building" dropdown. EDIT THIS to match your real campus.
// The report form saves the location as "Building, Spot" (e.g. "Hall 2, Room 214"),
// and the duplicate check compares the building part exactly.
export const BUILDINGS = [
  'Hall 1',
  'Hall 2',
  'Hall 3',
  'Library',
  'CSE Building',
  'Academic Building',
  'Cafeteria',
  'Sports Complex',
  'Main Gate',
];

// Status colors (plan Section 10): Open = blue, In Progress = amber, Resolved = green.
// Full class names on purpose: Tailwind only generates classes it can find as plain text.
export const STATUS_COLORS = {
  Open: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
  'In Progress': 'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200',
  Resolved: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
};

// Priority colors (plan Section 8): High = red, Medium = orange, Low = green.
export const PRIORITY_COLORS = {
  High: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
  Medium: 'bg-orange-100 text-orange-900 dark:bg-orange-900/50 dark:text-orange-200',
  Low: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
};
