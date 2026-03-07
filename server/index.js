import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.js';
import petRoutes from './routes/pets.js';
import sessionRoutes from './routes/sessions.js';
import wardrobeRoutes from './routes/wardrobe.js';
import calendarRoutes from './routes/calendar.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'StudySprout API running' });
});

app.use('/api/user', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/wardrobe', wardrobeRoutes);
app.use('/api/calendar', calendarRoutes);

app.listen(PORT, () => {
  console.log(`StudySprout API running on http://localhost:${PORT}`);
});
