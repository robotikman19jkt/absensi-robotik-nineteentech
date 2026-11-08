// ══════════════════════════════════════════════════════════════
// KONFIGURASI FIREBASE REALTIME DATABASE (NINETEENTECH)
// ══════════════════════════════════════════════════════════════
// Salin config dari Firebase Console:
// Project Settings -> General -> Your apps -> Web app (</>)
// 
// Pastikan Realtime Database sudah dibuat di menu "Build -> Realtime Database"
// Atur Rules menjadi:
// {
//   "rules": {
//     ".read": true,
//     ".write": true
//   }
// }
// ══════════════════════════════════════════════════════════════

window.FIREBASE_CONFIG = {
  apiKey: "PASTE_API_KEY_DISINI",
  authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://PASTE_PROJECT_ID-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE_PROJECT_ID.appspot.com",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID"
};
