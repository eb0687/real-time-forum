

PRAGMA foreign_keys = ON;
PRAGMA temp_store = MEMORY;           -- Keeps temporary tables in memory for performance.
PRAGMA cache_size = -50000;  -- Sets cache size to around 5MB


CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nickname TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS cookies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userid INTEGER NOT NULL UNIQUE,
    cookie TEXT NOT NULL,
    FOREIGN KEY (userid) REFERENCES users (id)
);
