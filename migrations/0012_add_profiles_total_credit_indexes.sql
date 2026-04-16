-- Migration number: 0012    2026-04-16T00:20:00.000Z
CREATE INDEX IF NOT EXISTS idx_profiles_total_credit_id
ON profiles(total_credit DESC, id ASC);

CREATE INDEX IF NOT EXISTS idx_profiles_country_total_credit_id
ON profiles(country, total_credit DESC, id ASC);
