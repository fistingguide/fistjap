-- Migration number: 0020    2026-04-20T00:30:00.000Z
CREATE TABLE IF NOT EXISTS profile_click_events_v2 (
	profile_id INTEGER PRIMARY KEY,
	web_clicked_cnt INTEGER NOT NULL DEFAULT 0,
	tg_clicked_cnt INTEGER NOT NULL DEFAULT 0,
	FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

INSERT INTO profile_click_events_v2 (profile_id, web_clicked_cnt, tg_clicked_cnt)
SELECT
	profile_id,
	SUM(CASE WHEN source = 'website' THEN 1 ELSE 0 END) AS web_clicked_cnt,
	SUM(CASE WHEN source = 'tg' THEN 1 ELSE 0 END) AS tg_clicked_cnt
FROM profile_click_events
GROUP BY profile_id;

DROP TABLE profile_click_events;

ALTER TABLE profile_click_events_v2 RENAME TO profile_click_events;

CREATE INDEX IF NOT EXISTS idx_profile_click_events_web_clicked_cnt
ON profile_click_events(web_clicked_cnt);

CREATE INDEX IF NOT EXISTS idx_profile_click_events_tg_clicked_cnt
ON profile_click_events(tg_clicked_cnt);
