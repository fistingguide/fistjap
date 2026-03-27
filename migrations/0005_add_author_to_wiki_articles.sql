-- Migration number: 0005    2026-03-27T03:00:00.000Z
ALTER TABLE wiki_articles ADD COLUMN author TEXT NOT NULL DEFAULT 'fistingguide';

UPDATE wiki_articles
SET author = 'fistingguide'
WHERE author IS NULL OR TRIM(author) = '';
