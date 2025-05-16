import express from 'express';
import cors from 'cors';
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
// ✅ Add this route to test backend is reachable
app.get('/', (_req, res) => {
    res.send('Server is running!');
});
// You can also add your API routes below
// app.post('/analyze', ...);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
