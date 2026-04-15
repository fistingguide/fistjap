-- Migration number: 0009    2026-04-16T00:00:00.000Z
CREATE INDEX IF NOT EXISTS idx_profiles_country_followers_id
ON profiles(country, followers_count DESC, id ASC);
