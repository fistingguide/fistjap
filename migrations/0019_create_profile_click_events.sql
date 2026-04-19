-- Migration number: 0019    2026-04-20T00:00:00.000Z
CREATE TABLE IF NOT EXISTS profile_click_events (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	profile_id INTEGER NOT NULL,
	source TEXT NOT NULL CHECK (source IN ('website', 'tg')),
	clicked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_profile_click_events_profile_id
ON profile_click_events(profile_id);

CREATE INDEX IF NOT EXISTS idx_profile_click_events_source
ON profile_click_events(source);

CREATE INDEX IF NOT EXISTS idx_profile_click_events_clicked_at
ON profile_click_events(clicked_at);

CREATE INDEX IF NOT EXISTS idx_profile_click_events_profile_source_clicked_at
ON profile_click_events(profile_id, source, clicked_at DESC);
