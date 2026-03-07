import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = 1').get();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/', (req, res) => {
  try {
    const { username } = req.body;
    if (username) {
      db.prepare('UPDATE users SET username = ? WHERE id = 1').run(username);
    }
    const user = db.prepare('SELECT * FROM users WHERE id = 1').get();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
