-- Migration number: 0018    2026-04-19T00:30:00.000Z
CREATE TABLE IF NOT EXISTS admin_verification_sessions (
	id TEXT PRIMARY KEY,
	token_hash TEXT NOT NULL,
	email TEXT NOT NULL,
	created_at INTEGER NOT NULL,
	expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_verification_sessions_expires_at
ON admin_verification_sessions(expires_at);
