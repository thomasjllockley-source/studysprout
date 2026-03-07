import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'studysprout.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL DEFAULT 'Student',
    xp INTEGER NOT NULL DEFAULT 0,
    coins INTEGER NOT NULL DEFAULT 50,
    streak_count INTEGER NOT NULL DEFAULT 0,
    last_study_date TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL DEFAULT 'Buddy',
    type TEXT NOT NULL CHECK(type IN ('hamster', 'dog', 'cat', 'raccoon')),
    happiness INTEGER NOT NULL DEFAULT 50,
    xp INTEGER NOT NULL DEFAULT 0,
    equipped_items TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS study_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    subject TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    xp_earned INTEGER NOT NULL DEFAULT 0,
    coins_earned INTEGER NOT NULL DEFAULT 0,
    completed_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS wardrobe_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('hat', 'glasses', 'scarf', 'collar', 'bow', 'cape')),
    price INTEGER NOT NULL,
    description TEXT,
    image_key TEXT
  );

  CREATE TABLE IF NOT EXISTS owned_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    purchased_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (item_id) REFERENCES wardrobe_items(id)
  );

  CREATE TABLE IF NOT EXISTS calendar_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    subject TEXT,
    event_date TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK(event_type IN ('test', 'quiz', 'homework', 'exam')),
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
if (userCount.count === 0) {
  db.prepare('INSERT INTO users (username) VALUES (?)').run('Student');
}

const itemCount = db.prepare('SELECT COUNT(*) as count FROM wardrobe_items').get();
if (itemCount.count === 0) {
  const insertItem = db.prepare(
    'INSERT INTO wardrobe_items (name, type, price, description, image_key) VALUES (?, ?, ?, ?, ?)'
  );

  const items = [
    ['Top Hat', 'hat', 30, 'A fancy top hat for your pet', 'top_hat'],
    ['Party Hat', 'hat', 20, 'A colorful party hat', 'party_hat'],
    ['Cool Shades', 'glasses', 25, 'Stylish sunglasses', 'cool_shades'],
    ['Round Specs', 'glasses', 20, 'Cute round spectacles', 'round_specs'],
    ['Warm Scarf', 'scarf', 15, 'A cozy knitted scarf', 'warm_scarf'],
    ['Rainbow Scarf', 'scarf', 35, 'A magical rainbow scarf', 'rainbow_scarf'],
    ['Star Collar', 'collar', 25, 'A collar with star charms', 'star_collar'],
    ['Bell Collar', 'collar', 15, 'A collar with a tiny bell', 'bell_collar'],
    ['Pink Bow', 'bow', 10, 'A cute pink bow', 'pink_bow'],
    ['Golden Bow', 'bow', 40, 'A luxurious golden bow', 'golden_bow'],
    ['Hero Cape', 'cape', 50, 'A mighty hero cape', 'hero_cape'],
    ['Wizard Cloak', 'cape', 45, 'A mystical wizard cloak', 'wizard_cloak'],
  ];

  const insertMany = db.transaction((items) => {
    for (const item of items) {
      insertItem.run(...item);
    }
  });

  insertMany(items);
}

export default db;
