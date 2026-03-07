# StudySprout

A modern learning platform built with Express (Node.js) backend and Vite React frontend.

## Project Structure

```
studysprout/
├── server/                 # Express backend (port 3001)
│   ├── package.json
│   └── index.js
├── client/                 # Vite React frontend (port 5173)
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── App.css
│       └── index.css
├── package.json            # Root package with concurrently script
└── replit.md
```

## Setup & Running

The application runs via the "Start application" workflow with:

```bash
npm run install:all && npm run dev
```

This will:
1. Install dependencies in root, server, and client directories
2. Start both servers concurrently:
   - **Backend**: Express API on `http://localhost:3001`
   - **Frontend**: Vite React on `http://localhost:5173`

## Tech Stack

- **Backend**: Express.js (Node.js)
- **Frontend**: React 18 + Vite
- **Communication**: Axios with proxy configuration
- **Styling**: CSS

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/courses` - Get available courses

## Development

- Frontend runs on port 5173 with hot module replacement
- Backend runs on port 3001 with API endpoints
- Frontend proxies `/api/*` requests to backend at port 3001
