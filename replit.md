# StudySprout

A gamified study platform with virtual pets, study timer, XP/coins system, streak tracking, wardrobe shop, and test calendar.

## Tech Stack

- **Backend**: Express.js + better-sqlite3 (port 3001)
- **Frontend**: React 18 + Vite (port 5173)
- **State Management**: React Context API
- **HTTP Client**: Axios with Vite proxy
- **Icons**: Lucide React
- **Concurrency**: concurrently (runs both servers)

## Project Structure

```
studysprout/
├── package.json              # Root scripts (install:all, dev)
├── server/
│   ├── package.json
│   ├── db.js                 # SQLite database setup + schema + seed data
│   ├── index.js              # Express server entry point
│   └── routes/
│       ├── user.js           # GET/PATCH /api/user
│       ├── pets.js           # GET/POST/PATCH /api/pets
│       ├── sessions.js       # GET/POST /api/sessions
│       ├── wardrobe.js       # GET /api/wardrobe, POST buy/equip
│       └── calendar.js       # CRUD /api/calendar
├── client/
│   ├── package.json
│   ├── vite.config.js        # Vite config with proxy to backend
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx           # React Router setup
│       ├── App.css           # All component styles
│       ├── index.css         # Global resets
│       ├── api.js            # Axios instance
│       ├── context/
│       │   └── AppContext.jsx  # Global state provider
│       ├── components/
│       │   ├── Layout.jsx      # App shell + bottom nav
│       │   ├── PetDisplay.jsx  # Pet emoji renderer
│       │   ├── ProgressBar.jsx # Reusable progress bar
│       │   └── StatsCard.jsx   # Stat display card
│       └── pages/
│           ├── Home.jsx        # Dashboard with pet + stats
│           ├── StartSession.jsx # Subject + duration picker
│           ├── Timer.jsx       # Circular countdown timer
│           ├── Result.jsx      # Session completion + rewards
│           ├── Wardrobe.jsx    # Shop + equip items
│           └── Calendar.jsx    # Monthly calendar + events
└── replit.md
```

## Running

```bash
npm run install:all && npm run dev
```

## Database

SQLite database (`server/studysprout.db`) with tables:
- `users` - XP, coins, streak
- `pets` - type (hamster/dog/cat/raccoon), happiness, XP, equipped items
- `study_sessions` - subject, duration, rewards
- `wardrobe_items` - 12 seeded items (hats, glasses, scarves, collars, bows, capes)
- `owned_items` - purchased items per user
- `calendar_events` - tests, quizzes, homework, exams

## Game Mechanics

- **XP**: duration_minutes * 2 per session
- **Coins**: duration_minutes per session
- **Pet Happiness**: +5 to +15 based on duration
- **Streak**: Increments daily, resets if gap > 1 day
