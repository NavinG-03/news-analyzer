import { useState } from 'react';

export default function App() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, text }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Fake News Detector</h1>
      <div>
        <input
          type="text"
          placeholder="News Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        /><br /><br />
        <textarea
          placeholder="News Content"
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea><br /><br />
        <button onClick={handleSubmit}>Check News</button>
        {prediction !== null && (
          <p style={{ color: prediction === 1 ? 'red' : 'green' }}>
            {prediction === 1 ? 'Fake News' : 'Real News'}
          </p>
        )}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      </div>
    </div>
  );
}
