-- Migration number: 0013    2026-04-18T00:00:00.000Z
ALTER TABLE profiles ADD COLUMN geo_lat REAL;
ALTER TABLE profiles ADD COLUMN geo_lng REAL;

CREATE INDEX IF NOT EXISTS idx_profiles_geo_lat_lng
ON profiles(geo_lat, geo_lng);
