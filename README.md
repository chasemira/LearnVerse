# LearnVerse

<img src="qualityEducation/src/components/logoWEB.png" alt="logo" width="100" height="100">

**Skills as currency — a community marketplace that makes quality learning accessible.**

LearnVerse is a community-driven platform (associated with Simon Fraser University) where people trade skills instead of cash. It's built to lower financial barriers to education by letting users offer and request lessons, connect through real-time chat, and confirm skill-exchange transactions. We're running on a React.js frontend + Firebase backend and are integrating Azure Cognitive Services for real-time translation and voice capabilities.

---

## 🚀 Quick Highlights

- **Skill-exchange listings**: create, request, confirm
- **Real-time chat and notifications** (Firebase)
- **Reputation & transaction records** to build trust
- **Planned**: Azure Cognitive Services for live text/speech translation to break language barriers

---

## 🛠️ Tech Stack

- **Frontend:** React.js (component-driven)
- **Backend:** Firebase (Authentication, Firestore, Realtime features, Cloud Functions)
- **Planned integrations:** Azure Cognitive Services (Text Translation, Speech-to-Text, Text-to-Speech)
- **Hosting/CI:** Firebase Hosting (recommended GitHub Actions for CI)

---

## 🏗️ Architecture (High Level)

1. **React client** handles UI, routing, and local state
2. **Firebase Auth** secures sign-in (OAuth / email)
3. **Firestore** stores `users`, `posts`, `chats`, `transactions`
4. **Cloud Functions** implement server-side logic (matching, notifications, translation proxies)
5. **Azure Cognitive Services** will be accessed from Cloud Functions (server-side) for secure translation and voice features

---

## 📊 Data Model

- **`users`** — profile, offered skills, wanted skills, reputation
- **`posts`** — skill listings and session details
- **`chats`** — real-time message threads (translation layer applies here)
- **`transactions`** — completed exchanges, ratings, timestamps

---

## 🚀 Getting Started (Developer)

> Minimal local setup — adapt to your environment.

### 1. Clone Repository
```bash
git clone <repo-url>
cd learnverse
```

### 2. Install Dependencies
```bash
npm install
# or
yarn
```

### 3. Firebase Setup
- Create a Firebase project
- Enable Auth, Firestore, and Cloud Functions
- Add a firebaseConfig object to `.env.local` (see example below)

### 4. Add Environment Variables
Create a `.env.local` file in your project root:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id

VITE_AZURE_TRANSLATOR_KEY=your_azure_key
VITE_AZURE_TRANSLATOR_ENDPOINT=your_azure_endpoint
VITE_AZURE_TRANSLATOR_REGION=your_azure_region
```

### 5. Run Locally
```bash
npm start
# or
yarn start
```

### 6. Build & Deploy
```bash
npm run build
firebase deploy --only hosting
```

---

## 🔒 Security Note

⚠️ **Important**: Keep Azure keys server-side (Cloud Functions). Never commit secrets to version control.

---

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
