# 🧪 DailyQ Testing & Build Guide

Follow these steps to test the application locally and build the final APK.

---

## 🛠️ Step 1: Database Setup
1. Open your MySQL client (e.g., MySQL Workbench or XAMPP).
2. Run the script found in `backend/schema.sql` to create the database and tables.
3. (Optional) Insert a test quiz:
   ```sql
   INSERT INTO questions (date, question, options, correct_answer, explanation, category) 
   VALUES (CURDATE(), 'What is Repo Rate?', '["Rate at which RBI lends to banks", "Rate at which banks lend to RBI", "Rate of interest on savings", "None"]', 'Rate at which RBI lends to banks', 'Repo rate is the rate at which RBI lends to banks.', 'Finance');
   ```

---

## 🚀 Step 2: Start the Backend Server
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies (if not done):
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node app.js
   ```
   *You should see: `Server is running on port 5000`*

---

## 📱 Step 3: Run the Flutter App
1. Open another terminal and navigate to the flutter folder:
   ```bash
   cd daily_q_app
   ```
2. Run the app on a connected device or emulator:
   ```bash
   flutter run
   ```
   *Note: If using a physical device, change `localhost` in `lib/core/api_service.dart` to your computer's IP address.*

---

## 📦 Step 4: Build the APK
To generate the final APK for installation on Android phones:
1. Run the build command:
   ```bash
   flutter build apk --release
   ```
2. The APK will be located at:
   `build/app/outputs/flutter-apk/app-release.apk`

---

## 🔍 What to Test
1. **Splash Screen**: Ensure it fades in and redirects to Login.
2. **Registration**: Create a new account and verify it works.
3. **Login**: Log in with your new credentials.
4. **Home**: Check if your name appears and stats are fetched.
5. **Quiz**: Complete today's quiz and see your points update.
6. **Leaderboard**: See your rank among other users.
7. **Logout**: Verify you can log out and the session is cleared.
