/**
 * login.js
 * ---------------------------------------
 * Handles login for:
 * - Admin (hard-coded)
 * - Staff / Student / Parent (Firebase Auth)
 */

import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const db = getFirestore();

/* ================= ADMIN CREDENTIALS ================= */
const ADMIN_EMAIL = "sacredharvesters@gmail.com";
const ADMIN_PASSWORD = "@Myadmin1"; // change later

/* ================= MAIN LOGIN FUNCTION ================= */
async function staffLogin(email, password) {

  /* ---------- ADMIN LOGIN ---------- */
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const adminUser = {
      role: "admin",
      email
    };

    localStorage.setItem("currentUser", JSON.stringify(adminUser));
    window.location.href = "admin.html";
    return;
  }

  /* ---------- FIREBASE LOGIN ---------- */
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const user = cred.user;

  /* ---------- GET USER ROLE FROM FIRESTORE ---------- */
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    throw new Error("User role not found");
  }

  const userData = snap.data();

  /* ---------- STORE SESSION ---------- */
  localStorage.setItem("currentUser", JSON.stringify({
    uid: user.uid,
    role: userData.role,
    email: user.email
  }));

  /* ---------- REDIRECT ---------- */
  if (userData.role === "student") {
    window.location.href = "student.html";
  } else if (userData.role === "staff") {
    window.location.href = "staff.html";
  } else if (userData.role === "parent") {
    window.location.href = "parent.html";
  } else {
    throw new Error("Unknown role");
  }
}

/* ================= EXPORT ================= */
export { staffLogin };
