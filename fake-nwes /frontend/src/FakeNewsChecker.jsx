import React, { useState } from "react";

export default function FakeNewsChecker() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, text }),
      });

      const data = await response.json();
      setResult(data.prediction);
    } catch (err) {
      setResult("Error: Could not get prediction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Fake News Checker</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label><br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <label>Text:</label><br />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows={6}
            style={{ width: "100%" }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: 10 }}>
          {loading ? "Checking..." : "Check"}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: 20 }}>
          <strong>Prediction:</strong> {result.toUpperCase()}
        </div>
      )}
    </div>
  );
}
