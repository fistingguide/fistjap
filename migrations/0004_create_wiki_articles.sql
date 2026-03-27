-- Migration number: 0004    2026-03-27T02:00:00.000Z
CREATE TABLE IF NOT EXISTS wiki_articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT 'for test',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO wiki_articles (title, content) VALUES ('For Test 1', 'for test');
INSERT INTO wiki_articles (title, content) VALUES ('For Test 2', 'for test');
INSERT INTO wiki_articles (title, content) VALUES ('For Test 3', 'for test');
