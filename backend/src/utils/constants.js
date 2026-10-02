// Fixed lists shared by validators and controllers.
// These MUST match the CHECK constraints in sql/schema.sql.

export const CATEGORIES = ['Electrical', 'Water', 'Cleanliness', 'Furniture', 'Internet', 'Other'];

export const STATUSES = ['Open', 'In Progress', 'Resolved'];

export const ROLES = ['student', 'admin'];

// Which status an admin may move an issue to, from each status (plan Section 6.3).
// Resolved -> Open is the "reopen" case. Everything not listed here is rejected with 400.
export const STATUS_TRANSITIONS = {
  Open: ['In Progress', 'Resolved'],
  'In Progress': ['Resolved'],
  Resolved: ['Open'],
};
