# 🏗️ 3. BACKEND ARCHITECTURE & 🗄️ DATABASE SCHEMA

## 🔧 Recommended Stack
- **Frontend**: Flutter (Dart)
- **Backend**: Node.js (Express.js)
- **Database**: MySQL (hosted on Hostinger VPS)
- **Authentication**: Firebase Auth (for Google/Guest token validation)
- **Caching**: Redis (Optional for leaderboard)

## 🧱 Architecture Flow
Mobile App → Node.js API → MySQL Database

### Core Services
1. **Quiz Engine**: MySQL queries for daily questions.
2. **Streak Engine**: Update user streak logic in Node.js.
3. **Leaderboard Engine**: SQL order by points.
4. **Monetization Engine**: Serves affiliate links from DB.

---

## 🗄️ 4. DATABASE SCHEMA (MySQL Tables)

### `users`
- `id` (INT, PK, AI), `firebase_uid` (VARCHAR, UNIQUE), `name` (VARCHAR), `email` (VARCHAR), `streak` (INT), `last_active_date` (DATE), `points` (INT), `created_at` (TIMESTAMP)

### `questions`
- `id` (INT, PK, AI), `date` (DATE), `question` (TEXT), `options` (JSON), `correct_answer` (VARCHAR), `explanation` (TEXT), `category` (VARCHAR)

### `user_answers`
- `id` (INT, PK, AI), `user_id` (INT, FK), `question_id` (INT, FK), `selected_answer` (VARCHAR), `is_correct` (BOOLEAN), `answered_at` (TIMESTAMP)

### `leaderboard` (Can be a view or a dedicated table for caching)
- `user_id` (INT, FK), `points` (INT), `week` (INT), `rank` (INT)

### `offers`
- `id` (INT, PK, AI), `title` (VARCHAR), `description` (TEXT), `cta` (VARCHAR), `link` (VARCHAR), `category` (VARCHAR)
