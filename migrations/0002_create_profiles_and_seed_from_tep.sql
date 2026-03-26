-- Migration number: 0002    2026-03-27T00:00:00.000Z
CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL DEFAULT '',
    handle TEXT NOT NULL,
    bio TEXT NOT NULL DEFAULT '',
    profile_url TEXT NOT NULL DEFAULT '',
    avatar TEXT NOT NULL DEFAULT '',
    sexual_orientation TEXT NOT NULL DEFAULT '同性恋',
    followers_count INTEGER NOT NULL DEFAULT 20,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_handle ON profiles(handle);
CREATE INDEX IF NOT EXISTS idx_profiles_followers ON profiles(followers_count DESC, id ASC);
