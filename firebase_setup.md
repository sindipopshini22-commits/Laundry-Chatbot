# Firebase Setup & Deployment Guide

Follow these steps to host your laundry chatbot and start saving orders to a database.

## 1. Firebase Console Setup
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and give it a name (e.g., `laundry-chatbot`).
3. (Optional) Enable Google Analytics and click **Create Project**.
4. Once the project is ready, click the **Web icon (</>)** to register a new web app.
5. Give your app a nickname and click **Register app**.
6. Copy the `firebaseConfig` object provided in the setup instructions.

## 2. Update the Code
1. Open `script.js`.
2. Replace the placeholder `firebaseConfig` at the top of the file with the one you copied from the console.

## 3. Enable Firestore Database
1. In the Firebase Console left menu, click **Firestore Database**.
2. Click **Create Database**.
3. Choose **Start in test mode** (allows everyone to read/write for 30 days while you test).
4. Select a location and click **Enable**.

## 4. Deploy with Firebase CLI
Since you already have `firebase-tools` installed, follow these commands in your terminal:

1. **Login**:
   ```bash
   firebase login
   ```
2. **Initialize**:
   ```bash
   cd /home/cts/Desktop/laundry_chatbot
   firebase init
   ```
   - Select **Hosting: Configure files for Firebase Hosting**.
   - Select **Use an existing project** and pick your new project.
   - For public directory, type `.` (the current folder).
   - Configure as a single-page app? **No**.
   - Set up automatic builds/deploys with GitHub? **No**.
3. **Deploy**:
   ```bash
   firebase deploy
   ```

## 5. Share with Teammates
After deployment, Firebase will give you a URL (e.g., `https://your-project.web.app`). Send this link to your teammates! They can use the chatbot, and you will see their "orders" appearing in the **Firestore Database** tab of your Firebase Console.
