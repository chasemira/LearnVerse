# Website translation (Google Cloud Translation + Firebase)

## What was implemented

- **Firebase Callable** `translateText` (`functions/index.js`) calls **Google Cloud Translation API** using the default service account for your Firebase/GCP project. API keys are **not** exposed in the web app.
- **`TranslationContext`** calls the callable (via `src/lib/translationApi.js`) for navbar UI strings and for **`translateText`** used elsewhere.
- **Firestore cache**
  - **Skill posts** (`posts/{id}`): `translations.<lang>.offer` / `translations.<lang>.request`
  - **Chat messages** (`chats/{chatId}/messages/{msgId}`): `translations.<lang>`
- **Language** is stored in `localStorage` under `appLanguage`.
- **Navbar** includes the language dropdown and uses translated labels when not English.

## What you must do (one-time)

1. **Same Firebase project**  
   Deploy functions to the **same** project as your web app (`firebaseConfig.projectId` in `src/firebase/firebase.js`). If `.firebaserc` points elsewhere, run `firebase use <your-web-app-project-id>` before deploy.

2. **Enable billing**  
   Firebase Blaze is required for Cloud Functions (free tier still applies for low usage).

3. **Enable Cloud Translation API**  
   In [Google Cloud Console](https://console.cloud.google.com) → select your Firebase project → **APIs & Services** → **Enable APIs** → enable **Cloud Translation API**.

4. **Install function dependencies & deploy**

   ```bash
   cd functions
   npm install
   cd ..
   firebase deploy --only functions
   ```

5. **IAM**  
   The default App Engine / Cloud Functions service account usually can call Translation API once it is enabled. If you see permission errors, add role **Cloud Translation API User** to the service account `PROJECT_ID@appspot.gserviceaccount.com` (or the Functions runtime SA shown in the error).

## Local emulator (optional)

```bash
cd functions && npm install && cd ..
firebase emulators:start --only functions
```

Point the client to the emulator only if you configure it (see Firebase docs for `connectFunctionsEmulator`).

## Cost note

Google Cloud Translation has a **monthly free character quota**; after that it is billed. Cached fields reduce repeat calls. Delete/disable the API or project when the demo is over if you want to avoid charges.

## Removed / obsolete

- Client-side Azure keys (`VITE_AZURE_*`) are no longer used by `TranslationContext`. You can remove them from `.env` when ready.
