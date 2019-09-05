DROP TABLE IF EXISTS snippet;
CREATE TABLE snippet (
  id SERIAL PRIMARY KEY,
  code TEXT,
  title TEXT,
  description TEXT,
  favorites INT DEFAULT 0,
  author TEXT,
  language TEXT
);
-- Seed snippets with data
INSERT INTO
  snippet (code, title, description, language, author)
VALUES
  (
    'const america = 1776',
    'freedom',
    'I declared a const',
    'JavaScript',
    'Dandy'
  ),
  (
    '4 + 4',
    'addition',
    'This is how you add',
    'Algebra',
    'Scott'
  );