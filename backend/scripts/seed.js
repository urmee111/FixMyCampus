// Seed script: fills the database with demo data (plan Sections 5 and 14).
//
//   npm run seed -- --confirm
//
// WARNING: this TRUNCATES every table of the database in DATABASE_URL (users, issues, comments, upvotes,
// status_history) and then inserts the demo data. Without --confirm it refuses to run.
// Test logins:  student@fixmycampus.test / Student@123   admin@fixmycampus.test / Admin@123

import bcrypt from 'bcryptjs';
import { env } from '../src/config/env.js';
import { pool, withTransaction } from '../src/config/db.js';

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

// ---------- safety checks (nothing touches the database before these pass) ----------

function databaseHost() {
  try {
    return new URL(env.databaseUrl).host; // host (and port) only, never user or password
  } catch {
    return null;
  }
}

if (!process.argv.includes('--confirm')) {
  console.error('Refusing to run: this script ERASES all data in the database.');
  console.error(`Database host: ${databaseHost() ?? '(DATABASE_URL is missing or invalid)'}`);
  console.error('Run it again with:  npm run seed -- --confirm');
  process.exit(1);
}
if (!databaseHost()) {
  console.error('DATABASE_URL is missing or invalid, nothing was changed.');
  process.exit(1);
}
console.log(`About to WIPE and re-seed the database on host: ${databaseHost()}`);

// ---------- the data ----------

const STUDENT_PASSWORD = 'Student@123';
const ADMIN_PASSWORD = 'Admin@123';

// Locations are always "Place" or "Place, Spot" (a comma only between the place and the spot)
// u = which student (1-9) reported it, ago = hours since it was reported, votes = number of upvotes,
// ip = hours after creation it went In Progress, res = hours after creation it was Resolved (4 to 72).
const ISSUES = [
  // ---- Open (8)
  { t: 'Ceiling fan not working', c: 'Electrical', l: 'Classroom, Room 3 front row', s: 'Open', u: 1, ago: 30, votes: 8, d: 'The fan above the front row does not turn on at any speed, and the room gets very hot in the afternoon.' },
  { t: 'Library WiFi is very slow', c: 'Internet', l: 'Library, 2nd floor', s: 'Open', u: 2, ago: 100, votes: 6, d: 'WiFi on the second floor drops every few minutes and pages take ages to load during exam week.' },
  { t: 'Washroom tap keeps dripping', c: 'Water', l: 'Washroom, ground floor', s: 'Open', u: 3, ago: 52, votes: 4, d: 'The second tap from the door never closes fully and wastes water all day long.' },
  { t: 'Broken chairs in the study room', c: 'Furniture', l: 'Study Room', s: 'Open', u: 4, ago: 200, votes: 3, d: 'Three chairs have broken legs and wobble badly, someone could fall while studying.' },
  { t: 'Overflowing dustbin near the canteen', c: 'Cleanliness', l: 'Canteen, entrance', s: 'Open', u: 5, ago: 20, votes: 2, d: 'The bin by the entrance is full by noon and the smell reaches the tables.' },
  { t: 'Lab computer 12 will not boot', c: 'Other', l: 'Lab, bench 12', s: 'Open', u: 6, ago: 300, votes: 2, d: 'Computer 12 shows a black screen after the logo, so only 11 machines are usable.' },
  { t: 'Plaza benches need repainting', c: 'Furniture', l: 'Plaza', s: 'Open', u: 7, ago: 400, votes: 1, d: 'Paint is peeling off most of the benches and it sticks to clothes when you sit.' },
  { t: 'Projector flickers during lectures', c: 'Electrical', l: 'Classroom, Room 5', s: 'Open', u: 8, ago: 10, votes: 0, d: 'The projector flickers every few seconds, which makes slides hard to read.' },

  // ---- In Progress (6)
  { t: 'Water cooler not cold', c: 'Water', l: 'Canteen', s: 'In Progress', u: 2, ago: 120, votes: 2, ip: 6, d: 'The water cooler only gives lukewarm water even after a full day of running.' },
  { t: 'Washroom sink blocked', c: 'Water', l: 'Washroom, first floor', s: 'In Progress', u: 9, ago: 160, votes: 4, ip: 10, d: 'The last sink is blocked and water stays in the basin for hours.' },
  { t: 'Classroom floor is very dirty', c: 'Cleanliness', l: 'Classroom, Room 8', s: 'In Progress', u: 3, ago: 250, votes: 2, ip: 20, d: 'The floor has not been cleaned for days and there is dust and paper everywhere.' },
  { t: 'LAN port dead in the lab', c: 'Internet', l: 'Lab', s: 'In Progress', u: 5, ago: 350, votes: 1, ip: 5, d: 'The LAN port at the back bench gives no connection, so we cannot use the network.' },
  { t: 'Sofa torn in the girls common room', c: 'Furniture', l: 'Girls Common Room', s: 'In Progress', u: 4, ago: 450, votes: 1, ip: 30, d: 'The big sofa is torn open and the foam is coming out of the seat.' },
  { t: 'Redex gate lock is broken', c: 'Other', l: 'Redex', s: 'In Progress', u: 6, ago: 80, votes: 0, ip: 3, d: 'The side gate lock is broken so the gate stays open all night.' },

  // ---- Resolved (6)
  { t: 'Street light off at the plaza', c: 'Electrical', l: 'Plaza', s: 'Resolved', u: 1, ago: 480, votes: 2, ip: 4, res: 30, d: 'The light near the plaza stairs has been off for a week and the area is dark after sunset.' },
  { t: 'Library AC too cold', c: 'Other', l: 'Library', s: 'Resolved', u: 7, ago: 300, votes: 1, res: 18, d: 'The air conditioner is set far too low and students need jackets to study.' },
  { t: 'Broken window latch', c: 'Furniture', l: 'Study Room, window side', s: 'Resolved', u: 8, ago: 200, votes: 0, res: 6, d: 'The window latch is broken so the window bangs open when the wind blows.' },
  { t: 'Power socket sparks', c: 'Electrical', l: 'Girls Common Room, near the door', s: 'Resolved', u: 9, ago: 420, votes: 2, ip: 2, res: 48, d: 'The socket near the door sparks when a charger is plugged in, which is dangerous.' },
  { t: 'No soap in the washroom', c: 'Cleanliness', l: 'Washroom, second floor', s: 'Resolved', u: 2, ago: 150, votes: 1, res: 72, d: 'The soap dispensers have been empty for several days on the whole floor.' },
  { t: 'Canteen water filter leaking', c: 'Water', l: 'Canteen, counter side', s: 'Resolved', u: 3, ago: 360, votes: 0, ip: 8, res: 40, d: 'The water filter leaks onto the floor near the counter and the floor gets slippery.' },
];

// notes the admin writes when changing a status (the same text becomes an "Official" comment)
const IP_NOTES = ['Maintenance team has been informed', 'Technician assigned for tomorrow', 'Parts have been ordered', null];
const RES_NOTES = ['Fixed and checked on site', 'Replaced the broken part', null, 'Cleaned and checked again'];
const STUDENT_COMMENTS = [
  'Same problem here, please fix it soon.',
  'This has been like this for more than a week.',
  'Thanks for reporting, I use this place daily.',
  'Still not fixed as of today.',
  'It is getting worse every day.',
];

// ---------- helpers ----------

// One INSERT ... RETURNING id with $1, $2... placeholders (no user text is ever put into the SQL)
async function insert(client, text, params) {
  const result = await client.query(text, params);
  return result.rows[0].id;
}

async function seed() {
  const now = Date.now();
  const studentHash = await bcrypt.hash(STUDENT_PASSWORD, 10);
  const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const summary = await withTransaction(async (client) => {
    await client.query('TRUNCATE TABLE status_history, upvotes, comments, issues, users RESTART IDENTITY CASCADE');

    // ---- users: student 1..9, then the admin
    const studentIds = [];
    for (let n = 1; n <= 9; n++) {
      const email = n === 1 ? 'student@fixmycampus.test' : `student${n}@fixmycampus.test`;
      const name = n <= 2 ? `Student ${n === 1 ? 'One' : 'Two'}` : `Student ${['Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'][n - 3]}`;
      studentIds.push(await insert(client, 'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id', [name, email, studentHash, 'student']));
    }
    const adminId = await insert(client, 'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id', ['Campus Admin', 'admin@fixmycampus.test', adminHash, 'admin']);

    const counts = { issues: 0, upvotes: 0, comments: 0, history: 0 };
    const byStatus = { Open: 0, 'In Progress': 0, Resolved: 0 };

    for (const [index, issue] of ISSUES.entries()) {
      const ownerId = studentIds[issue.u - 1];
      const createdAt = new Date(now - issue.ago * HOUR);
      const inProgressAt = issue.ip ? new Date(createdAt.getTime() + issue.ip * HOUR) : null;
      const resolvedAt = issue.res ? new Date(createdAt.getTime() + issue.res * HOUR) : null;
      const updatedAt = resolvedAt || inProgressAt || createdAt;

      const issueId = await insert(
        client,
        `INSERT INTO issues (title, description, category, location, status, created_by, created_at, updated_at, resolved_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [issue.t, issue.d, issue.c, issue.l, issue.s, ownerId, createdAt, updatedAt, resolvedAt],
      );
      counts.issues++;
      byStatus[issue.s]++;

      // status_history: null -> Open (by the reporter), then each transition by the admin
      const addHistory = async (oldStatus, newStatus, userId, note, at) => {
        await client.query(
          'INSERT INTO status_history (issue_id, old_status, new_status, changed_by, note, changed_at) VALUES ($1, $2, $3, $4, $5, $6)',
          [issueId, oldStatus, newStatus, userId, note, at],
        );
        counts.history++;
        // a note is also posted as an official admin comment, exactly like PATCH /issues/:id/status does
        if (note) {
          await client.query('INSERT INTO comments (issue_id, user_id, text, created_at) VALUES ($1, $2, $3, $4)', [issueId, adminId, `Status changed to ${newStatus}: ${note}`, at]);
          counts.comments++;
        }
      };
      await addHistory(null, 'Open', ownerId, null, createdAt);
      if (inProgressAt) await addHistory('Open', 'In Progress', adminId, IP_NOTES[index % IP_NOTES.length], inProgressAt);
      if (resolvedAt) await addHistory(inProgressAt ? 'In Progress' : 'Open', 'Resolved', adminId, RES_NOTES[index % RES_NOTES.length], resolvedAt);

      // upvotes: one per student, never the owner, never the admin
      const voters = studentIds.filter((id) => id !== ownerId);
      const start = index % voters.length;
      for (let v = 0; v < issue.votes; v++) {
        const voterId = voters[(start + v) % voters.length];
        const votedAt = new Date(createdAt.getTime() + (v + 1) * 2 * HOUR);
        await client.query('INSERT INTO upvotes (issue_id, user_id, created_at) VALUES ($1, $2, $3)', [issueId, voterId, votedAt]);
        counts.upvotes++;
      }

      // 0 to 2 student comments, written after the issue was reported
      const studentCommentCount = index % 3;
      for (let k = 0; k < studentCommentCount; k++) {
        const writer = voters[(index + k + 1) % voters.length];
        const at = new Date(createdAt.getTime() + (k + 1) * 3 * HOUR);
        await client.query('INSERT INTO comments (issue_id, user_id, text, created_at) VALUES ($1, $2, $3, $4)', [issueId, writer, STUDENT_COMMENTS[(index + k) % STUDENT_COMMENTS.length], at]);
        counts.comments++;
      }
      // a plain admin comment on a few issues
      if (index % 5 === 0 && issue.s !== 'Resolved') {
        await client.query('INSERT INTO comments (issue_id, user_id, text, created_at) VALUES ($1, $2, $3, $4)', [issueId, adminId, 'We have seen this report and are looking into it.', new Date(createdAt.getTime() + 5 * HOUR)]);
        counts.comments++;
      }
    }
    return { users: studentIds.length + 1, ...counts, byStatus };
  });

  console.log('Seed finished:');
  console.log(`  users:          ${summary.users} (9 students + 1 admin)`);
  console.log(`  issues:         ${summary.issues} (Open ${summary.byStatus.Open}, In Progress ${summary.byStatus['In Progress']}, Resolved ${summary.byStatus.Resolved})`);
  console.log(`  upvotes:        ${summary.upvotes}`);
  console.log(`  comments:       ${summary.comments}`);
  console.log(`  status history: ${summary.history}`);
  console.log('  logins: student@fixmycampus.test / Student@123   admin@fixmycampus.test / Admin@123');
}

seed()
  .catch((err) => {
    console.error('Seeding failed (the transaction was rolled back):', err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end()); // close the connection so the script can exit
