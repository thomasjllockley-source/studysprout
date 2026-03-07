import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'StudySprout API running' });
});

app.get('/api/courses', (req, res) => {
  res.json({
    courses: [
      { id: 1, name: 'Introduction to Learning', description: 'Get started with StudySprout' }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`StudySprout API running on http://localhost:${PORT}`);
});
