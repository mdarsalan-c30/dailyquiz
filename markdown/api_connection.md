# 🔌 5. API DESIGN & 🔗 SCREEN ↔ BACKEND CONNECTION

## 🔐 AUTH
- Handled by Firebase Auth

## 🧠 QUIZ
- **GET** `/quiz/today`: Returns question and options.
- **POST** `/quiz/answer`: Submits answer, returns result and explanation.

## 🔥 STREAK
- **GET** `/user/streak`: Returns current and best streak.

## 🏆 LEADERBOARD
- **GET** `/leaderboard`: Returns top users and current user's rank.

## 📊 STATS
- **GET** `/user/stats`: Returns accuracy and total attempts.

## 💰 OFFERS
- **GET** `/offers`: Returns affiliate offers.

---

## 🔗 6. SCREEN ↔ BACKEND CONNECTION

- **AUTH SCREEN**: Firebase Auth
- **HOME**: `GET /user/streak`, `GET /user/stats`
- **QUIZ SCREEN**: `GET /quiz/today`, `POST /quiz/answer`
- **LEADERBOARD**: `GET /leaderboard`
- **STREAK SCREEN**: `GET /user/streak`
- **OFFERS SCREEN**: `GET /offers`
