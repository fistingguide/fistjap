-- Migration number: 0003    2026-03-27T00:10:00.000Z
ALTER TABLE profiles ADD COLUMN country TEXT NOT NULL DEFAULT 'Japan';
ALTER TABLE profiles ADD COLUMN city TEXT NOT NULL DEFAULT 'Tokyo';

CREATE INDEX IF NOT EXISTS idx_profiles_country ON profiles(country);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city);
