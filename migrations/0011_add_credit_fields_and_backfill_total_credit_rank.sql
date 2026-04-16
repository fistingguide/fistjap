-- Migration number: 0011    2026-04-16T00:10:00.000Z
UPDATE profiles
SET total_credit =
	(COALESCE(followers_count, 0) / 10.0) +
	(COALESCE(tg_msg_cnt, 0) * 1.0) +
	(COALESCE(tg_photo_cnt, 0) * 2.0) +
	(COALESCE(tg_video_cnt, 0) * 10.0) +
	COALESCE(list_star_event_cnt, 0) +
	COALESCE(super_credit, 0);

WITH ranked AS (
	SELECT
		id,
		ROW_NUMBER() OVER (ORDER BY total_credit DESC, id ASC) AS next_rank
	FROM profiles
)
UPDATE profiles
SET rank = (
	SELECT ranked.next_rank
	FROM ranked
	WHERE ranked.id = profiles.id
);
