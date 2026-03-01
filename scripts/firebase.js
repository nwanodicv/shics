import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyD1c8kbY0CFM27wFc1fzF5Zc16XozrXKoY",
  authDomain: "shics-dashboard.firebaseapp.com",
  projectId: "shics-dashboard",
  storageBucket: "shics-dashboard.appspot.com", // ✅ fixed
  messagingSenderId: "457028395432",
  appId: "1:457028395432:web:6f6707e7d086487ea0bd9d"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };