from flask import Flask, request, jsonify
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
import threading
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

model = None

def load_and_train_model():
    global model
    try:
        logger.info("Loading dataset and training model...")
        dataset_path = os.path.join(os.path.dirname(__file__), "fake_news_dataset_50k.csv")
        df = pd.read_csv(dataset_path)
        if "title" not in df.columns or "text" not in df.columns or "label" not in df.columns:
            raise ValueError("CSV file must have 'title', 'text', and 'label' columns.")
        df["content"] = df["title"].astype(str) + " " + df["text"].astype(str)
        X_train, _, y_train, _ = train_test_split(df["content"], df["label"], test_size=0.2, random_state=42)
        model = Pipeline([
            ('tfidf', TfidfVectorizer(max_features=5000)),
            ('clf', LogisticRegression(max_iter=1000))
        ])
        model.fit(X_train, y_train)
        logger.info("✅ Model training completed successfully.")
    except Exception as e:
        logger.error(f"❌ Failed to train model: {e}", exc_info=True)

@app.route('/')
def root():
    return jsonify({"message": "Fake News Detection API is running."})

@app.route('/predict', methods=['POST'])
def predict():
    global model
    if model is None:
        return jsonify({"error": "Model is still loading, try again later."}), 503
    data = request.get_json()
    title = data.get("title", "")
    text = data.get("text", "")
    content = f"{title} {text}"
    try:
        prediction = model.predict([content])[0]
        return jsonify({"result": prediction})
    except Exception as e:
        logger.error(f"Prediction failed: {e}", exc_info=True)
        return jsonify({"error": "Prediction failed."}), 500

if __name__ == "__main__":
    threading.Thread(target=load_and_train_model).start()
    app.run(host="0.0.0.0", port=8000)
