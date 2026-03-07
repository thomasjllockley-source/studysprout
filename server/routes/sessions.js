import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const sessions = db.prepare(
      'SELECT * FROM study_sessions WHERE user_id = 1 ORDER BY completed_at DESC LIMIT 50'
    ).all();
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { subject, duration_minutes, completed } = req.body;
    if (!subject || !duration_minutes) {
      return res.status(400).json({ error: 'Subject and duration are required' });
    }

    const dur = parseInt(duration_minutes);
    if (!Number.isInteger(dur) || dur < 1 || dur > 180) {
      return res.status(400).json({ error: 'Duration must be an integer between 1 and 180' });
    }

    if (completed !== true) {
      return res.status(400).json({ error: 'Session must be completed to earn rewards' });
    }

    const xpEarned = dur * 2;
    const coinsEarned = dur;

    db.prepare(
      'INSERT INTO study_sessions (user_id, subject, duration_minutes, xp_earned, coins_earned) VALUES (1, ?, ?, ?, ?)'
    ).run(subject, dur, xpEarned, coinsEarned);

    const user = db.prepare('SELECT * FROM users WHERE id = 1').get();
    const today = new Date().toISOString().split('T')[0];
    const lastDate = user.last_study_date;

    let newStreak = user.streak_count;
    if (!lastDate) {
      newStreak = 1;
    } else if (lastDate === today) {
      // same day, keep streak
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      if (lastDate === yesterdayStr) {
        newStreak = user.streak_count + 1;
      } else {
        newStreak = 1;
      }
    }

    db.prepare(
      'UPDATE users SET xp = xp + ?, coins = coins + ?, streak_count = ?, last_study_date = ? WHERE id = 1'
    ).run(xpEarned, coinsEarned, newStreak, today);

    const pet = db.prepare('SELECT * FROM pets WHERE user_id = 1').get();
    let happinessGain = 0;
    if (pet) {
      happinessGain = Math.min(15, Math.max(5, Math.floor(dur / 5)));
      const newHappiness = Math.min(100, pet.happiness + happinessGain);
      const newPetXp = Math.min(100, pet.xp + Math.floor(xpEarned / 4));
      db.prepare('UPDATE pets SET happiness = ?, xp = ? WHERE id = ?').run(newHappiness, newPetXp, pet.id);
    }

    const updatedUser = db.prepare('SELECT * FROM users WHERE id = 1').get();
    const updatedPet = db.prepare('SELECT * FROM pets WHERE user_id = 1').get();

    res.json({
      session: {
        subject,
        duration_minutes: dur,
        xp_earned: xpEarned,
        coins_earned: coinsEarned,
      },
      user: updatedUser,
      pet: updatedPet,
      happiness_gain: happinessGain,
      streak: newStreak,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
