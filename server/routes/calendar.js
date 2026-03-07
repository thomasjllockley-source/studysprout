import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const events = db.prepare(
      'SELECT * FROM calendar_events WHERE user_id = 1 ORDER BY event_date ASC'
    ).all();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { title, subject, event_date, event_type, notes } = req.body;
    if (!title || !event_date || !event_type) {
      return res.status(400).json({ error: 'Title, date, and type are required' });
    }
    if (!['test', 'quiz', 'homework', 'exam'].includes(event_type)) {
      return res.status(400).json({ error: 'Invalid event type' });
    }

    const result = db.prepare(
      'INSERT INTO calendar_events (user_id, title, subject, event_date, event_type, notes) VALUES (1, ?, ?, ?, ?, ?)'
    ).run(title, subject || null, event_date, event_type, notes || null);

    const event = db.prepare('SELECT * FROM calendar_events WHERE id = ?').get(result.lastInsertRowid);
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, subject, event_date, event_type, notes } = req.body;

    const event = db.prepare('SELECT * FROM calendar_events WHERE id = ? AND user_id = 1').get(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const finalType = event_type || event.event_type;
    if (!['test', 'quiz', 'homework', 'exam'].includes(finalType)) {
      return res.status(400).json({ error: 'Invalid event type' });
    }

    db.prepare(
      'UPDATE calendar_events SET title = ?, subject = ?, event_date = ?, event_type = ?, notes = ? WHERE id = ?'
    ).run(
      title || event.title,
      subject !== undefined ? subject : event.subject,
      event_date || event.event_date,
      finalType,
      notes !== undefined ? notes : event.notes,
      id
    );

    const updated = db.prepare('SELECT * FROM calendar_events WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const event = db.prepare('SELECT * FROM calendar_events WHERE id = ? AND user_id = 1').get(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    db.prepare('DELETE FROM calendar_events WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
