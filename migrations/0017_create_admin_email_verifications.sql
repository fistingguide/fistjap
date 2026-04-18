-- Migration number: 0017    2026-04-19T00:00:00.000Z
CREATE TABLE IF NOT EXISTS admin_email_verifications (
	id TEXT PRIMARY KEY,
	email TEXT NOT NULL,
	code_hash TEXT NOT NULL,
	created_at INTEGER NOT NULL,
	expires_at INTEGER NOT NULL,
	consumed_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_admin_email_verifications_expires_at
ON admin_email_verifications(expires_at);
