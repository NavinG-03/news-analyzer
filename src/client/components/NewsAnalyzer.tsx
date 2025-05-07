import React, { useState } from 'react';
import { Button } from "@radix-ui/react-button";
import { Textarea } from "@radix-ui/react-textarea";
import { Input } from "@radix-ui/react-input";
import { analyzeText } from '../../services/connectanalyzer';
import ResultCard from '../ResultCard';
import { toast } from "@radix-ui/react-toast";

const NewsAnalyzer: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!title && !text) {
      toast.error("Please enter a title or content to analyze");
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysisResult = await analyzeText(title, text);
      setResult(analysisResult);
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze content. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setTitle('');
    setText('');
    setResult(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Analyze Content</h2>
        
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            News Title
          </label>
          <Input 
            id="title"
            placeholder="Enter the news title..." 
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            className="mb-4"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            News Content
          </label>
          <Textarea 
            id="content"
            placeholder="Paste news article content to analyze..." 
            className="min-h-[180px]"
            value={text}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <Button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </Button>
          <Button 
            variant="outline"
            onClick={handleClear}
          >
            Clear
          </Button>
        </div>
      </div>
      {result && <ResultCard result={result} />}
    </div>
  );
};

export default NewsAnalyzer;
