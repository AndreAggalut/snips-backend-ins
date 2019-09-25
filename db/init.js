const bcrypt = require('bcrypt');
const db = require('./index');

exports.createTables = () =>
  db.query(
    `
  DROP TABLE IF EXISTS snippet;
  DROP TABLE IF EXISTS author;
  --
  CREATE TABLE author (name TEXT PRIMARY KEY, password TEXT);
  CREATE TABLE snippet (
    id SERIAL PRIMARY KEY,
    code TEXT,
    title TEXT,
    description TEXT,
    favorites INT DEFAULT 0,
    -- establish snippet-author relationship
    author TEXT REFERENCES author,
    language TEXT
  );`
  );

exports.seedAuthors = () =>
  db.query(`DELETE FROM author`).then(() =>
    db.query(
      `
  -- Seed author data
  INSERT INTO
    author (name, password)
  VALUES
    ('Dandy', $1),
    ('Scott', $1);`,
      [bcrypt.hashSync('password', 2)]
    )
  );

exports.seedSnippets = () =>
  db.query(`DELETE FROM snippet`).then(() =>
    db.query(
      `
  -- Seed snippet data
  INSERT INTO
    snippet (code, title, description, language, author)
  VALUES
    (
      'const america = 1776',
      'freedom',
      'I declared a const',
      'JavaScript',
      'Scott'
    ),
    (
      '4 + 2',
      'addition',
      'This is how you add',
      'Algebra',
      'Scott'
  );`
    )
  );
