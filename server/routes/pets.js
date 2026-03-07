import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const pet = db.prepare('SELECT * FROM pets WHERE user_id = 1').get();
    res.json(pet || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { name, type } = req.body;
    if (!name || !type) {
      return res.status(400).json({ error: 'Name and type are required' });
    }
    if (!['hamster', 'dog', 'cat', 'raccoon'].includes(type)) {
      return res.status(400).json({ error: 'Invalid pet type' });
    }

    const existing = db.prepare('SELECT id FROM pets WHERE user_id = 1').get();
    if (existing) {
      db.prepare('UPDATE pets SET name = ?, type = ?, happiness = 50, xp = 0, equipped_items = ? WHERE user_id = 1')
        .run(name, type, '[]');
    } else {
      db.prepare('INSERT INTO pets (user_id, name, type) VALUES (1, ?, ?)').run(name, type);
    }

    const pet = db.prepare('SELECT * FROM pets WHERE user_id = 1').get();
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { happiness, xp, equipped_items, name } = req.body;

    const pet = db.prepare('SELECT * FROM pets WHERE id = ?').get(id);
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    if (happiness !== undefined) {
      const clampedHappiness = Math.max(0, Math.min(100, happiness));
      db.prepare('UPDATE pets SET happiness = ? WHERE id = ?').run(clampedHappiness, id);
    }
    if (xp !== undefined) {
      const clampedXp = Math.max(0, Math.min(100, xp));
      db.prepare('UPDATE pets SET xp = ? WHERE id = ?').run(clampedXp, id);
    }
    if (equipped_items !== undefined) {
      db.prepare('UPDATE pets SET equipped_items = ? WHERE id = ?').run(JSON.stringify(equipped_items), id);
    }
    if (name !== undefined) {
      db.prepare('UPDATE pets SET name = ? WHERE id = ?').run(name, id);
    }

    const updated = db.prepare('SELECT * FROM pets WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
