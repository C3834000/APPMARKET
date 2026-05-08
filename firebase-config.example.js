/**
 * 1) העתק קובץ זה ל־firebase-config.js (באותה תיקייה כמו shopping-list.html)
 * 2) החלף את הערכים מ־Firebase Console → Project settings → Web app → Config
 * 3) Firebase Console → Authentication → Sign-in method → הפעל Google
 * 4) Authentication → Settings → Authorized domains: הוסף localhost (לפיתוח) ודומיין האחסון שלך
 * 5) בראש shopping-list.html הוסף לפני סקריפטי firebase של Google:
 *    <script src="firebase-config.js"></script>
 */
window.__SHOPPING_LIST_FIREBASE__ = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:xxxxxxxx",
};
