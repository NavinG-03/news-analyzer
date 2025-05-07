import express, { Request, Response } from 'express';
import cors from 'cors';
import { pipeline } from '@xenova/transformers';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

interface AnalyzeRequest {
  title: string;
  text: string;
}

interface AnalyzeResponse {
  credibilityScore: number;
  classification: string;
  isFakeNews: boolean;
  accuracyConfidence: number;
  warningFlags: string[];
  emotionalLanguage: number;
  factualConsistency: number;
  sourceReputation: number;
  titleCredibility: number;
}

let classifier: any = null;
(async () => {
  classifier = await pipeline('zero-shot-classification', 'facebook/bart-large-mnli');
  console.log('Hugging Face model loaded');
})();

const detectClickbait = (text: string): boolean => {
  const clickbaitPatterns = [
    /you won't believe/i,
    /shocking/i,
    /mind-?blowing/i,
    /jaw-?dropping/i,
    /incredible/i,
    /breaking/i,
    /this is why/i,
  ];
  return clickbaitPatterns.some((pattern) => pattern.test(text));
};

const detectSensationalism = (text: string): boolean => {
  const sensationalPatterns = [
    /outrageous/i,
    /alarming/i,
    /terrifying/i,
    /devastating/i,
    /horrible/i,
    /amazing/i,
    /wonderful/i,
    /extraordinary/i,
  ];
  return sensationalPatterns.some((pattern) => pattern.test(text));
};

const detectMisleadingStats = (text: string): boolean => {
  const statsPatterns = [/\d{2,}%/i, /thousands/i, /millions/i, /billions/i];
  return statsPatterns.some((pattern) => pattern.test(text));
};

const detectUnreliableSources = (text: string): boolean => {
  const sourcePatterns = [/anonymous/i, /unnamed/i, /unverified/i, /sources say/i, /someone said/i];
  return sourcePatterns.some((pattern) => pattern.test(text));
};

app.post('/api/analyze', async (req: Request<{}, {}, AnalyzeRequest>, res: Response) => {
  try {
    const { title, text } = req.body;

    if (!title && !text) {
      return res.status(400).json({ error: 'Title or text is required' });
    }

    const lowerTitle = title.toLowerCase();
    const lowerText = text.toLowerCase();
    const combinedText = `${lowerTitle} ${lowerText}`;

    const inputText = title + ' ' + text;
    const labels = ['reliable', 'unreliable'];
    const result = await classifier(inputText, labels, { multi_label: false });
    const credibilityScore = Math.round(result.scores[result.labels.indexOf('reliable')] * 100);
    const isFakeNews = result.labels[0] === 'unreliable';

    const titleHasClickbait = detectClickbait(lowerTitle);
    const titleHasQuestion = /\?/.test(title);
    const titleAllCaps = title === title.toUpperCase() && title.length > 10;
    const hasClickbait = detectClickbait(combinedText);
    const hasExaggeration = /all|every|none|always|never|best|worst|greatest|perfect/i.test(combinedText);
    const hasEmotionalLanguage = detectSensationalism(combinedText);
    const hasMisleadingStats = detectMisleadingStats(combinedText);
    const hasUnreliableSources = detectUnreliableSources(combinedText);
    const isBriefText = text.length < 100;

    const titleCredibilityScore = 100 - (
      (titleHasClickbait ? 20 : 0) +
      (titleHasQuestion ? 10 : 0) +
      (titleAllCaps ? 15 : 0)
    );

    const emotionalLanguageScore = hasEmotionalLanguage ? 45 : 85;
    const factualConsistencyScore = hasMisleadingStats ? 40 : hasExaggeration ? 60 : 80;
    const sourceReputationScore = hasUnreliableSources ? 30 : Math.floor(Math.random() * 40) + 40;

    const issues = [
      hasClickbait,
      hasExaggeration,
      hasEmotionalLanguage,
      hasMisleadingStats,
      hasUnreliableSources,
      titleHasClickbait,
      titleAllCaps,
    ].filter(Boolean).length;

    let adjustedCredibilityScore = credibilityScore - (issues * 5);
    if (isBriefText) adjustedCredibilityScore -= 10;
    if (titleHasClickbait) adjustedCredibilityScore -= 15;
    if (title && !text) adjustedCredibilityScore -= 40;

    adjustedCredibilityScore = Math.max(10, Math.min(95, adjustedCredibilityScore));

    const accuracyConfidence = Math.min(95, Math.max(60, 100 - Math.abs(adjustedCredibilityScore - 50) / 2));

    const warningFlags: string[] = [];
    if (titleHasClickbait) warningFlags.push('Title contains clickbait phrases');
    if (titleAllCaps) warningFlags.push('Title uses all capital letters (sensationalist)');
    if (hasClickbait) warningFlags.push('Contains clickbait phrases or sensationalist language');
    if (hasExaggeration) warningFlags.push('Uses sweeping generalizations or absolute claims');
    if (hasEmotionalLanguage) warningFlags.push('Contains emotionally charged language that may influence perception');
    if (hasMisleadingStats) warningFlags.push('Contains statistics without proper context or verification');
    if (hasUnreliableSources) warningFlags.push('References anonymous or unverified sources');
    if (isBriefText) warningFlags.push('Content is very brief, limiting factual verification');

    const response: AnalyzeResponse = {
      credibilityScore: adjustedCredibilityScore,
      classification:
        adjustedCredibilityScore >= 80 ? 'Likely Reliable' :
        adjustedCredibilityScore >= 60 ? 'Somewhat Reliable' :
        adjustedCredibilityScore >= 40 ? 'Potentially Misleading' :
        'Likely Unreliable',
      isFakeNews,
      accuracyConfidence,
      warningFlags,
      emotionalLanguage: emotionalLanguageScore,
      factualConsistency: factualConsistencyScore,
      sourceReputation: sourceReputationScore,
      titleCredibility: titleCredibilityScore,
    };

    res.json(response);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze content' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
