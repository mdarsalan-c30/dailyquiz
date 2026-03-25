# 📘 2. FRD (Functional Requirements Document)

## 👤 USER FEATURES

### Authentication
- Google login
- Guest login

### Quiz
- 1 quiz/day
- 4 options
- 1 attempt only
- Instant result

### Streak
- Increment on daily attempt
- Reset if missed

### Leaderboard
- Weekly ranking
- Points system

### Profile
- Streak
- Accuracy
- History

### Monetization
- Ads display
- Affiliate links

## ⚙️ SYSTEM FEATURES

### Daily Content
- New quiz every 24h

### Scoring
- Correct → +10 points
- Wrong → 0

### Leaderboard Reset
- Weekly reset

### Analytics
- Track user activity
- Track revenue

---

## 🎨 UI & UX DESIGN

### SCREEN 1: SPLASH (PREMIUM + CLEAN)
- Logo: Orange circle
- Background: White
- Subtitle: “Think Better Daily”
- Design: Subtle fade animation

### SCREEN 2: LOGIN (FRICTIONLESS)
- Welcome text: "Sharpen your mind daily."
- Buttons: Continue with Google, Continue as Guest
- UI Details: Google button (white + border), CTA hover (slight orange glow)

### SCREEN 3: HOME (ENTRY POINT)
- Personalization: "Hi, Arsalan 👋"
- CTA: [ Start Today’s Quiz → ] (Orange gradient, pill shape, soft shadow)
- Stats: 🔥 Streak: 7 | 🏆 Rank: #124

### SCREEN 4: QUIZ (MOST IMPORTANT)
- Layout: Question 1 of 1, Options A-D, Submit button.
- Design:
  - Background: White
  - Question Card: Light orange tint (#FFF7ED), soft shadow
  - Options: Default (white/gray), Selected (orange border), Correct (green), Wrong (red)
- Interaction: Tap option to highlight, tap submit for instant result.
- Result State: Correct/Wrong feedback + Explanation + Continue button.

### SCREEN 5: LEADERBOARD
- Clean list of users with points.
- Highlight user row (light orange bg).

### SCREEN 6: STREAK (VISUAL HOOK)
- Visualization of last 7 days.
- Completed (green), Missed (gray), Today (orange glow).

### SCREEN 7: OFFERS (REVENUE SCREEN)
- Cards for "Smart Offers" (Loans, Credit Cards).
- Design: Light orange background, orange CTA.

### SCREEN 8: PROFILE
- User stats and settings.
- Accuracy and Rank.

### 📊 MICRO UI DETAILS
- Animations: Scale down on tap, green pulse for correct, shake for wrong.
- Feedback: “Nice! Keep going 🔥”, “Try again tomorrow 💪”
- Notifications: Daily quiz live, streak reminders.
