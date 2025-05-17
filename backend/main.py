import streamlit as st
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
import os

# Load and train model function
@st.cache_resource
def load_and_train_model():
    dataset_path =("fake_news_dataset_50k.csv")
    df = pd.read_csv(dataset_path)
    if "title" not in df.columns or "text" not in df.columns or "label" not in df.columns:
        st.error("CSV file must have 'title', 'text', and 'label' columns.")
        return None

    df["content"] = df["title"].astype(str) + " " + df["text"].astype(str)
    X_train, _, y_train, _ = train_test_split(df["content"], df["label"], test_size=0.2, random_state=42)

    model = Pipeline([
        ('tfidf', TfidfVectorizer(max_features=5000)),
        ('clf', LogisticRegression(max_iter=1000))
    ])
    model.fit(X_train, y_train)
    return model

# Load model
st.info("Training model... This may take a few moments.")
model = load_and_train_model()

st.title('Fake News Detection')

st.write('Enter the title and text of the news article to predict if it is fake or real.')

# Text input fields
title = st.text_input('Title')
text = st.text_area('Text')

# Submit button
if st.button('Submit'):
    if model is not None:
        if title and text:
            content = f"{title} {text}"
            try:
                prediction = model.predict([content])[0]
                st.success(f"Prediction: {'Fake' if prediction == 1 else 'Real'}")
            except Exception as e:
                st.error(f"Prediction failed: {e}")
        else:
            st.warning('Please fill in both fields.')
    else:
        st.error("Model not available.")
