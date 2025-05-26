import streamlit as st
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

# Load and train model function
@st.cache_resource
def load_and_train_model():
    dataset_path = "fake_news_dataset_50k.csv"

    try:
        df = pd.read_csv(dataset_path)
    except FileNotFoundError:
        st.error(f"Dataset not found at: {dataset_path}")
        return None, None

    required_cols = {"title", "text", "label"}
    if not required_cols.issubset(df.columns):
        st.error(f"Dataset must include the following columns: {required_cols}")
        return None, None

    # Combine title and text
    df["content"] = df["title"].astype(str) + " " + df["text"].astype(str)

    # Check label distribution
    st.write("### Label Distribution")
    st.write(df["label"].value_counts())

    # Split dataset with stratification
    X_train, X_test, y_train, y_test = train_test_split(
        df["content"], df["label"], test_size=0.2, stratify=df["label"], random_state=42)

    # Pipeline with TF-IDF and Logistic Regression
    model = Pipeline([
        ('vectorizer', TfidfVectorizer(max_features=5000, stop_words='english')),
        ('classifier', LogisticRegression(max_iter=1000))
    ])

    # Train model
    model.fit(X_train, y_train)

    # Evaluate model
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    st.write(f"### Model Accuracy: {acc:.2%}")
    st.text("Classification Report:")
    st.text(classification_report(y_test, y_pred))

    return model, acc

# App title
st.title('📰 Fake News Detection App')

# Load and train the model
st.info("⏳ Training or loading the model...")
model, acc = load_and_train_model()

if model is None:
    st.stop()
else:
    st.success("✅ Model is trained and ready.")

st.write("Enter the title and text of the news article to check if it's real or fake.")

# User inputs
title = st.text_input('📝 Title')
text = st.text_area('📰 Text')

# Prediction
if st.button('🚀 Submit'):
    if title and text:
        content = f"{title} {text}"
        try:
            prediction = model.predict([content])[0]
            label = 'Fake' if prediction == 1 else 'Real'
            st.success(f"🧠 Prediction: **{label}**")
        except Exception as e:
            st.error(f"Prediction failed: {e}")
    else:
        st.warning('⚠️ Please fill in both the title and text fields.')
