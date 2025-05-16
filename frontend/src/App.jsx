import { useState } from "react";

export default function App() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    setError(null);
    setPrediction(null);

    if (!title.trim() || !text.trim()) {
      setError("Please provide both title and content.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, text }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 600, margin: "0 auto" }}>
      <h1>Fake News Detector</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="News Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: "0.5rem" }}
        />
        <br />
        <br />
        <textarea
          placeholder="News Content"
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: "100%", padding: "0.5rem" }}
        />
        <br />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Checking..." : "Check News"}
        </button>
      </form>

      {prediction !== null && (
        <p style={{ color: prediction === 1 ? "red" : "green", marginTop: "1rem" }}>
          {prediction === 1 ? "Fake News" : "Real News"}
        </p>
      )}

      {error && (
        <p style={{ color: "red", marginTop: "1rem" }}>
          Error: {error}
        </p>
      )}
    </div>
  );
}
