ALTER TABLE profiles ADD COLUMN province TEXT NOT NULL DEFAULT 'Tokyo';

UPDATE profiles
SET province = CASE
	WHEN TRIM(COALESCE(province, '')) = '' THEN 'Tokyo'
	ELSE province
END;
