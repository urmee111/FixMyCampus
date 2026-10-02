// Validation for the issue endpoints (plan Sections 6.3 and 7 "Issues" / "Listing").

import { z } from 'zod';
import { CATEGORIES, STATUSES } from '../utils/constants.js';

const categoryMessage = `Category must be one of: ${CATEGORIES.join(', ')}`;
const statusMessage = `Status must be one of: ${STATUSES.join(', ')}`;

// ---------- small reusable pieces ----------

const category = z.enum(CATEGORIES, { error: categoryMessage });

// "?status=" (empty) is treated like "not sent", so empty filter boxes don't cause 400s
const emptyToUndefined = (value) => (value === '' ? undefined : value);

// Optional text filter: trimmed, empty -> not sent
const optionalText = z.preprocess(emptyToUndefined, z.string().trim().optional());

// ---------- body schemas ----------

// POST /issues. (The photo is NOT here: it arrives as a file and is handled by upload.js)
export const createIssueSchema = z.object({
  title: z
    .string({ error: 'Title is required' })
    .trim()
    .min(1, 'Title is required') // first rule so an empty title says "required"
    .min(5, 'Title must be at least 5 characters')
    .max(120, 'Title must be at most 120 characters'),
  description: z
    .string({ error: 'Description is required' })
    .trim()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be at most 2000 characters'),
  category,
  // Stored as "Building, Spot" e.g. "Hall 2, Room 214"
  location: z
    .string({ error: 'Location is required' })
    .trim()
    .min(1, 'Location is required')
    .max(120, 'Location must be at most 120 characters'),
});

// PUT /issues/:id uses the same fields. Zod removes unknown keys, so a "status" sent in the
// body is silently ignored (status can only change through PATCH /issues/:id/status).
export const updateIssueSchema = createIssueSchema;

// ---------- params ----------

// Used for any route with /:id  ->  "/issues/abc" gives 400, not a database crash
export const idParamSchema = z.object({
  id: z.coerce
    .number({ error: 'Issue id must be a positive whole number' })
    .int('Issue id must be a positive whole number')
    .positive('Issue id must be a positive whole number')
    .max(2147483647, 'Issue id must be a positive whole number'), // Postgres INT limit
});

// ---------- query strings ----------

// GET /issues?q=&category=&status=&location=&sort=&page=&limit=
export const listIssuesQuerySchema = z.object({
  q: optionalText,
  category: z.preprocess(emptyToUndefined, category.optional()),
  status: z.preprocess(
    emptyToUndefined,
    z.enum(STATUSES, { error: statusMessage }).optional(),
  ),
  location: optionalText,
  sort: z
    .preprocess(
      emptyToUndefined,
      z.enum(['upvotes', 'newest', 'oldest'], {
        error: 'Sort must be one of: upvotes, newest, oldest',
      }),
    )
    .default('upvotes'),
  page: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number({ error: 'Page must be a whole number' })
      .int('Page must be a whole number')
      .min(1, 'Page must be 1 or greater')
      .default(1),
  ),
  // limit above 50 is not an error, it is capped at 50
  limit: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number({ error: 'Limit must be a whole number' })
      .int('Limit must be a whole number')
      .min(1, 'Limit must be at least 1')
      .transform((n) => Math.min(n, 50))
      .default(10),
  ),
});

// GET /issues/similar?title=&category=&building=  (title: at least 5 characters after trim)
// A duplicate needs the same category AND the same building, so all three are required.
export const similarQuerySchema = z.object({
  title: z
    .string({ error: 'Title is required' })
    .trim()
    .min(1, 'Title is required') // first rule so an empty title says "required"
    .min(5, 'Title must be at least 5 characters')
    .max(120, 'Title must be at most 120 characters'),
  category: z.enum(CATEGORIES, { error: categoryMessage }),
  building: z
    .string({ error: 'Building is required' })
    .trim()
    .min(1, 'Building is required')
    .max(120, 'Building must be at most 120 characters'),
});
