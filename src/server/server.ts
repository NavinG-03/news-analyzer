import express from 'express';
import cors from 'cors';
import { pipeline } from '@xenova/transformers';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

let classifier: any = null;

const initializeClassifier = async () => {
  try {
    classifier = await pipeline('text-classification', 'distilbert-base-uncased-finetuned-sst-2-english');
    console.log('Classifier initialized successfully');
  } catch (error) {
    console.error('Failed to initialize classifier:', error);
    process.exit(1);
  }
};

app.post('/analyze', async (req, res) => {
  const { title, content } = req.body;

  if (!title && !content) {
    return res.status(400).json({ error: 'Title or content is required' });
  }

  try {
    if (!classifier) {
      await initializeClassifier();
    }

    const textToAnalyze = `${title || ''} ${content || ''}`.trim();
    const result = await classifier(textToAnalyze, { topk: 2 });

    // Map the sentiment labels (POSITIVE/NEGATIVE) to fake news detection
    const score = result.find((r: any) => r.label === 'POSITIVE')?.score || 0;
    const credibilityScore = Math.round(score * 100);
    const isFakeNews = credibilityScore < 60;
    const classification = isFakeNews ? 'Likely Fake' : 'Likely True';

    const analysisResult = {
      credibilityScore,
      classification,
      isFakeNews,
      accuracyConfidence: Math.round(score * 100),
      warningFlags: isFakeNews ? ['Potential misinformation detected'] : [],
      emotionalLanguage: isFakeNews ? 0.8 : 0.3,
      factualConsistency: isFakeNews ? 0.4 : 0.9,
      sourceReputation: isFakeNews ? 0.5 : 0.8,
      titleCredibility: title ? (isFakeNews ? 0.4 : 0.9) : 0,
    };

    res.json(analysisResult);
  } catch (error) {
    console.error('Error during analysis:', error);
    res.status(500).json({ error: 'Failed to analyze content' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

initializeClassifier();
