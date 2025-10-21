import { pool } from './db.js';

export async function runMigrations() {
  // Ensure users table has oauth columns and nullable password_hash
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Check columns in users table
    const [cols] = await conn.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users'
    `);
    const names = new Set(cols.map(c => c.COLUMN_NAME));

    if (!names.has('oauth_provider')) {
      await conn.query(`ALTER TABLE users ADD COLUMN oauth_provider VARCHAR(50) NULL`);
    }
    if (!names.has('oauth_id')) {
      await conn.query(`ALTER TABLE users ADD COLUMN oauth_id VARCHAR(255) NULL`);
    }

    // Make password_hash nullable for OAuth-only accounts
    if (names.has('password_hash')) {
      // Try to make it NULLABLE (ignore if already nullable)
      try {
        await conn.query(`ALTER TABLE users MODIFY password_hash VARCHAR(255) NULL`);
      } catch {}
    }

    // Ensure unique composite index on (oauth_provider, oauth_id)
    const [indexes] = await conn.query(`SHOW INDEX FROM users`);
    const hasComposite = indexes.some(i => i.Key_name === 'unique_oauth');
    if (!hasComposite) {
      // Drop any existing single indexes to avoid conflicts (best-effort)
      try { await conn.query(`ALTER TABLE users ADD UNIQUE KEY unique_oauth (oauth_provider, oauth_id)`); } catch {}
    }

    await conn.commit();
  } catch (e) {
    await conn.rollback();
    // Log and rethrow to fail fast in dev
    console.error('Migration error:', e.message);
    throw e;
  } finally {
    conn.release();
  }
}
