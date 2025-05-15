import axios from 'axios';

export interface AnalysisResult {
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

export const analyzeNews = async (title: string, content: string): Promise<AnalysisResult> => {
  try {
    const response = await axios.post('https://<codespace-id>-3000.app.github.dev/analyze', {
      title,
      content,
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing news:', error);
    throw new Error('Failed to analyze news');
  }
};
