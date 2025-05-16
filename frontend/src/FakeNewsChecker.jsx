import React, { useState } from "react";

function FakeNewsChecker() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, text }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Fake News Checker</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>News Title:</label><br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginBottom: 12 }}
          />
        </div>
        <div>
          <label>News Content:</label><br />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows={6}
            style={{ width: "100%", padding: 8, marginBottom: 12 }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: "10px 20px" }}>
          {loading ? "Checking..." : "Check"}
        </button>
      </form>

      {prediction && (
        <div style={{ marginTop: 20, fontWeight: "bold" }}>
          Prediction: {prediction}
        </div>
      )}

      {error && (
        <div style={{ marginTop: 20, color: "red" }}>
          Error: {error}
        </div>
      )}
    </div>
  );
}

export default FakeNewsChecker;
