CREATE TABLE users
(
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL
);

-- CREATE TABLE groups
-- (
--     username TEXT PRIMARY KEY,
--     password TEXT NOT NULL
-- );

-- CREATE TABLE pages (
--     id INTEGER PRIMARY KEY,
--     title TEXT NOT NULL,
--     created_by INTEGER,
--     FOREIGN KEY (created_by) REFERENCES users(id)
-- );

CREATE TABLE cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    status TEXT DEFAULT "to-do"
--  created_by INTEGER,
--  FOREIGN KEY (created_by) REFERENCES users(id)
);