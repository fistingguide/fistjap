-- Migration number: 0016    2026-04-18T00:50:00.000Z
ALTER TABLE profiles ADD COLUMN lat REAL;
ALTER TABLE profiles ADD COLUMN lng REAL;

UPDATE profiles
SET lat = COALESCE(lat, geo_lat),
	lng = COALESCE(lng, geo_lng);

UPDATE profiles
SET lat = 35.7512
WHERE lat IS NULL;

UPDATE profiles
SET lng = 139.7093
WHERE lng IS NULL;

DROP INDEX IF EXISTS idx_profiles_geo_lat_lng;
CREATE INDEX IF NOT EXISTS idx_profiles_lat_lng
ON profiles(lat, lng);

ALTER TABLE profiles DROP COLUMN geo_lat;
ALTER TABLE profiles DROP COLUMN geo_lng;
