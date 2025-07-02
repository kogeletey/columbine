import { Database } from "bun:sqlite";

const db = new Database("cofounders.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    telegram_id TEXT,
    idea TEXT,
    skills TEXT,
    portfolio TEXT,
    created_at DATETIME
  );

  CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    generated_profile TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS interactions (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    profile_id INTEGER,
    liked BOOLEAN,
    timestamp DATETIME,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(profile_id) REFERENCES profiles(id)
  );
`);

export default db;
