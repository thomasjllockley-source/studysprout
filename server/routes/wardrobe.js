import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM wardrobe_items ORDER BY type, price').all();
    const owned = db.prepare('SELECT item_id FROM owned_items WHERE user_id = 1').all();
    const ownedIds = new Set(owned.map(o => o.item_id));

    const pet = db.prepare('SELECT equipped_items FROM pets WHERE user_id = 1').get();
    const equipped = pet ? JSON.parse(pet.equipped_items) : [];

    const result = items.map(item => ({
      ...item,
      owned: ownedIds.has(item.id),
      equipped: equipped.includes(item.id),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/buy/:itemId', (req, res) => {
  try {
    const { itemId } = req.params;
    const item = db.prepare('SELECT * FROM wardrobe_items WHERE id = ?').get(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const alreadyOwned = db.prepare(
      'SELECT id FROM owned_items WHERE user_id = 1 AND item_id = ?'
    ).get(itemId);
    if (alreadyOwned) {
      return res.status(400).json({ error: 'Item already owned' });
    }

    const user = db.prepare('SELECT coins FROM users WHERE id = 1').get();
    if (user.coins < item.price) {
      return res.status(400).json({ error: 'Not enough coins' });
    }

    db.prepare('UPDATE users SET coins = coins - ? WHERE id = 1').run(item.price);
    db.prepare('INSERT INTO owned_items (user_id, item_id) VALUES (1, ?)').run(itemId);

    const updatedUser = db.prepare('SELECT * FROM users WHERE id = 1').get();
    res.json({ success: true, coins: updatedUser.coins });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/equip/:itemId', (req, res) => {
  try {
    const { itemId } = req.params;
    const id = parseInt(itemId);

    const owned = db.prepare(
      'SELECT id FROM owned_items WHERE user_id = 1 AND item_id = ?'
    ).get(id);
    if (!owned) {
      return res.status(400).json({ error: 'Item not owned' });
    }

    const pet = db.prepare('SELECT * FROM pets WHERE user_id = 1').get();
    if (!pet) {
      return res.status(400).json({ error: 'No pet found' });
    }

    let equipped = JSON.parse(pet.equipped_items);
    if (equipped.includes(id)) {
      equipped = equipped.filter(i => i !== id);
    } else {
      equipped.push(id);
    }

    db.prepare('UPDATE pets SET equipped_items = ? WHERE id = ?')
      .run(JSON.stringify(equipped), pet.id);

    const updatedPet = db.prepare('SELECT * FROM pets WHERE id = ?').get(pet.id);
    res.json(updatedPet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
