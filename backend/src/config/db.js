// PostgreSQL connection pool (plain SQL with the `pg` package, no ORM).
// The pool connects lazily, so the server can start even if the database is down.

import pg from 'pg';
import { env } from './env.js';

// Supabase (and most hosted databases) require SSL. Local Postgres does not.
const isLocal = /localhost|127\.0\.0\.1/.test(env.databaseUrl || '');

export const pool = new pg.Pool({
  connectionString: env.databaseUrl,
  ssl: isLocal ? false : { rejectUnauthorized: false },
  max: 5, // never open more than 5 connections (hosted databases limit them)
  idleTimeoutMillis: 10000, // close a connection that sat unused for 10 s, before the Supabase pooler cuts it behind our back
  connectionTimeoutMillis: 10000, // fail with an error if no connection could be opened within 10 s (instead of hanging)
  keepAlive: true, // TCP keep-alive packets, so idle connections are not silently dropped on the way
});

// A connection that is waiting unused in the pool can be cut by the database side.
// The pool then emits 'error'. Log it and carry on: the pool just opens a new connection next time.
// Without this handler the error would crash the whole server.
pool.on('error', (err) => {
  console.error(`Database pool error (the pool will open a new connection): ${err.message}`, err.code || '');
});

// "The connection was dead" (the pooler cut it), as opposed to "the query was wrong"
function isConnectionError(err) {
  return err?.code === 'ECONNRESET' || /Connection terminated unexpectedly/i.test(err?.message || '');
}

// Only plain SELECTs: running a read twice is harmless. Never an INSERT / UPDATE / DELETE, and not even
// "WITH ... INSERT ... RETURNING" (which starts with WITH): a cut write may ALREADY have been saved,
// so running it again could save it twice.
const isSelect = (text) => typeof text === 'string' && /^\s*select\b/i.test(text);

// Shortcut used by the models:  await query('SELECT * FROM users WHERE id = $1', [id])
// ALWAYS pass user input in the params array ($1, $2...), never inside the SQL string.
// If a SELECT fails because its connection was cut, it is retried ONCE on a fresh connection.
export async function query(text, params) {
  try {
    return await pool.query(text, params);
  } catch (err) {
    if (isSelect(text) && isConnectionError(err)) {
      console.warn(`Database connection was lost (${err.message}). Retrying the SELECT once.`);
      return pool.query(text, params); // if this fails too, the error goes to the caller
    }
    throw err;
  }
}

// Runs several queries as ONE unit: either all of them are saved, or (if anything fails) none.
//   await withTransaction(async (client) => {
//     await client.query('INSERT ...', [...]);
//     await client.query('INSERT ...', [...]);
//   });
// Transactions are never retried automatically: the caller sees the error and can decide.
export async function withTransaction(callback) {
  const client = await pool.connect();

  // The pool only listens for errors of IDLE connections. If this connection dies while we hold it
  // (even between two statements), the 'error' event would have no listener and would crash the server.
  const onClientError = (err) => console.error(`Database connection error during a transaction: ${err.message}`);
  client.on('error', onClientError);

  let connectionIsDead = false;
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch {
      connectionIsDead = true; // ROLLBACK failed too, so the connection is broken. We still report the ORIGINAL error.
    }
    throw err;
  } finally {
    client.removeListener('error', onClientError);
    client.release(connectionIsDead); // true = throw this connection away instead of putting it back in the pool
  }
}
