from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
import threading

class NewsItem(BaseModel):
    title: str
    text: str

app = FastAPI(title="Fake News Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None

def load_and_train_model():
    global model
    df = pd.read_csv("fake_news_dataset_50k.csv")
    df["content"] = df["title"] + " " + df["text"]
    X_train, _, y_train, _ = train_test_split(df["content"], df["label"], test_size=0.2, random_state=42)
    model = Pipeline([
        ('tfidf', TfidfVectorizer(max_features=5000)),
        ('clf', LogisticRegression(max_iter=1000))
    ])
    model.fit(X_train, y_train)
    print("Model training completed.")

@app.on_event("startup")
def startup_event():
    threading.Thread(target=load_and_train_model).start()

@app.get("/")
def root():
    return {"message": "Fake News Detection API is running."}

@app.post("/predict")
def predict(news: NewsItem):
    if model is None:
        raise HTTPException(status_code=503, detail="Model is still loading, try again shortly.")
    content = news.title + " " + news.text
    prediction = model.predict([content])[0]
    return {"prediction": prediction}
