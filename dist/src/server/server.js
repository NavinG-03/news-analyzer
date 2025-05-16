import express from 'express';
import cors from 'cors';
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
app.post('/analyze', (req, res) => {
    const { title, content } = req.body;
    // Mocked response for now
    const mockResult = {
        credibilityScore: Math.floor(Math.random() * 100),
        classification: Math.random() > 0.5 ? 'Reliable' : 'Unreliable',
        isFakeNews: Math.random() > 0.5,
        accuracyConfidence: Math.floor(Math.random() * 100),
        warningFlags: ['Sensationalist language detected'],
        emotionalLanguage: Math.random(),
        factualConsistency: Math.random(),
        sourceReputation: Math.random(),
        titleCredibility: Math.random(),
    };
    res.json(mockResult);
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
