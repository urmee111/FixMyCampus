// Seed script: fills the database with demo data. Run with `npm run seed`.
//
// TODO (Member C, plan Section 14): insert
//   - 3 users (passwords hashed with bcryptjs):
//       student@fixmycampus.test  / Student@123   (role student)
//       student2@fixmycampus.test / Student@123   (role student)
//       admin@fixmycampus.test    / Admin@123     (role admin)
//   - ~20 realistic issues (e.g. "Hall 2, Room 214", "Library 3rd Floor", "Cafeteria"),
//     mixed statuses, a few Resolved ones with resolved_at set so the charts look alive
//   - some upvotes, comments and status_history rows
// Make it safe to re-run (clear the tables first, or use ON CONFLICT DO NOTHING).

import { pool } from '../src/config/db.js';

async function seed() {
  console.log('TODO: seed data is not implemented yet (see plan Section 14).');
}

seed()
  .catch((err) => {
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end()); // close the connection so the script can exit
