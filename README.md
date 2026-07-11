# movie_recommendation_system_using-nlp

# 🎬 AI Movie Recommendation System

<p align="center">
  <img src="static/homepage.png" alt="AI Movie Recommendation System Home" width="100%">
</p>

<p align="center">
  <b>An AI-powered Movie Recommendation System with a modern OTT-inspired interface.</b>
</p>

---

## 📖 Overview

The **AI Movie Recommendation System** recommends movies similar to a user's favorite movie using **Content-Based Filtering** and **Natural Language Processing (NLP)**.

The application provides an elegant homepage with trending movie discovery, genre-based browsing, and an intelligent search experience while preserving the original recommendation engine.

---

## ✨ Features

### 🎯 AI Movie Recommendation

- Search any movie
- AI-based similar movie recommendations
- Movie overview
- Cast information
- Movie posters
- IMDb rating
- Release date
- Runtime
- User reviews with sentiment analysis

---

### 🎨 Modern Homepage

- Premium OTT-inspired UI
- Random movie recommendations on startup
- Genre-based movie browsing
- Beautiful movie cards
- Responsive design
- Smooth animations
- Interactive search interface

---

### 🤖 Sentiment Analysis

The system analyzes IMDb user reviews using a trained NLP model.

- Positive Reviews
- Negative Reviews

using

- TF-IDF Vectorizer
- Multinomial Naive Bayes

---

## 🖥️ Homepage

The homepage is designed to provide users with an engaging movie discovery experience.

### Features

- 🎬 Featured Movies
- 🎭 Genre Selection
- 🔍 Movie Search
- 🍿 Popular Movie Display
- ✨ Interactive UI
- 📱 Responsive Layout

---

## 🛠️ Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript
- Bootstrap
- AJAX

### Backend

- Python
- Flask

### Machine Learning

- Scikit-Learn
- CountVectorizer
- Cosine Similarity
- TF-IDF
- Multinomial Naive Bayes

### Dataset

- TMDB Movie Dataset
- Movie Metadata
- IMDb Reviews

---

## 📂 Project Structure

```text
Movie Recommendation System
├── static/
│   ├── css/
│   │     home.css
│   │     recommend.css
│   │
│   ├── js/
│   │     home.js
│   │     recommend.js
│   │     tmdb.js
│   │
│   └── images/
│
├── templates/
│   ├── home.html
│   └── recommend.html
│
├── nlp_model.pkl
├── tranform.pkl
├── main.py
├── requirements.txt
└── README.md
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/movie-recommendation-system.git
```

```bash
cd movie-recommendation-system
```

---

### Install Dependencies

```bash
pip install -r requirements.txt
```

---

### Run Application

```bash
python main.py
```

---

Open your browser

```
http://127.0.0.1:5000
```

---

## 📷 Screenshots

### 🏠 Home Page

```
screenshots/homepage.png
```

---

### 🎥 Recommendation Page

```
screenshots/recommendation.png
```

---

## 🧠 How Recommendation Works

1. User enters a movie name.

2. The system searches for the movie.

3. Content-Based Filtering computes similarity using movie features.

4. Cosine Similarity ranks related movies.

5. Similar movies are displayed.

6. IMDb reviews are collected.

7. NLP predicts review sentiment.

8. Recommendation page displays complete movie information.

---

## 🎯 Future Improvements

- User Authentication
- Watchlist
- Favorite Movies
- Trending Movies
- Top Rated Movies
- Actor Search
- Voice Search
- AI Chatbot
- Personalized Recommendations
- Dark/Light Theme

---

## 📈 Highlights

- Modern Netflix-inspired homepage
- AI-based recommendation engine
- IMDb review sentiment analysis
- Genre-based browsing
- Responsive design
- Interactive animations
- Flask backend
- Machine Learning integration

---

## 👨‍💻 Author

**Teja**

AI & Machine Learning Developer

---

## ⭐ Support

If you like this project,

⭐ Star this repository

🍴 Fork this repository

📢 Share it with others

---

## 📜 License

This project is intended for educational and research purposes.
