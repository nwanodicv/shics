/**
 * login.js
 * ---------------------------------------
 * Handles login for:
 * - Admin
 * - Staff
 * - Student
 * - Parent
 * Using Firebase Auth + Firestore
 */

import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =====================================================
   MAIN LOGIN FUNCTION
===================================================== */
 async function staffLogin(email, password) {

  // Sign in with Firebase Auth
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const user = cred.user;

  // Fetch user profile from Firestore
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    throw new Error("User role not found.");
  }

  const userData = snap.data();

  /* =====================================================
     ROLE-BASED REDIRECTION
  ===================================================== */

  if (userData.role === "admin") {
    window.location.href = "../admin/admin.html";
  }
  else if (userData.role === "student") {
    window.location.href = "../student/student.html";
  }
  else if (userData.role === "staff") {
    window.location.href = "../staff/staff.html";
  }
  else if (userData.role === "parent") {
    window.location.href = "../parents/parent.html";
  }
  else {
    throw new Error("Unknown role.");
  }
}

/* =====================================================
   EXPORT FUNCTION
===================================================== */
export { staffLogin };
