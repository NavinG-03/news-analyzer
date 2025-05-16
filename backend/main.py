from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
import threading
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class NewsData(BaseModel):
    title: str
    text: str

app = FastAPI(title="Fake News Detection API")

# Allow all origins for CORS (adjust in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None

def load_and_train_model():
    global model
    try:
        logger.info("Loading dataset and training model...")
        df = pd.read_csv("fake_news_dataset_50k.csv")

        if not {"title", "text", "label"}.issubset(df.columns):
            raise ValueError("CSV file must have 'title', 'text', and 'label' columns.")

        df["content"] = df["title"].astype(str) + " " + df["text"].astype(str)
        X_train, _, y_train, _ = train_test_split(df["content"], df["label"], test_size=0.2, random_state=42)

        model = Pipeline([
            ('tfidf', TfidfVectorizer(max_features=5000)),
            ('clf', LogisticRegression(max_iter=1000))
        ])
        model.fit(X_train, y_train)
        logger.info("✅ Model training completed.")
    except Exception as e:
        logger.error(f"❌ Failed to train model: {e}")

@app.on_event("startup")
def startup_event():
    threading.Thread(target=load_and_train_model).start()

@app.get("/")
async def root():
    return {"message": "Fake News Detection API is running."}

@app.post("/predict")
async def predict(news: NewsData):
    if model is None:
        raise HTTPException(status_code=503, detail="Model is still loading, try again later.")
    content = f"{news.title} {news.text}"
    try:
        prediction = model.predict([content])[0]
        # Assuming label 1 = Fake, 0 = Real (adjust accordingly)
        return {"prediction": "Fake" if prediction == 1 else "Real"}
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(status_code=500, detail="Prediction failed.")
