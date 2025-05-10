import { AnalysisResult } from '@/services/connectanalyzer';
import { toast } from 'sonner';

interface ResultCardProps {
  result: AnalysisResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const handleShare = () => {
    const shareText = `News Analysis Result: Credibility Score - ${result.credibilityScore}`;
    navigator.clipboard.writeText(shareText);
    toast.success('Result copied to clipboard!');
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Analysis Result</h2>
      <p><strong>Credibility Score:</strong> {result.credibilityScore}</p>
      <p><strong>Classification:</strong> {result.classification}</p>
      <p><strong>Is Fake News:</strong> {result.isFakeNews ? 'Yes' : 'No'}</p>
      <p><strong>Accuracy Confidence:</strong> {result.accuracyConfidence}%</p>
      <div>
        <strong>Warning Flags:</strong>
        <ul>
          {result.warningFlags.map((flag: string, index: number) => (
            <li key={index}>{flag}</li>
          ))}
        </ul>
      </div>
      <p><strong>Emotional Language:</strong> {result.emotionalLanguage}</p>
      <p><strong>Factual Consistency:</strong> {result.factualConsistency}</p>
      <p><strong>Source Reputation:</strong> {result.sourceReputation}</p>
      <p><strong>Title Credibility:</strong> {result.titleCredibility}</p>
      <button
        onClick={handleShare}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Share Result
      </button>
    </div>
  );
};

export default ResultCard;
