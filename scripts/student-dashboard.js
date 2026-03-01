/**
 * student-dashboard.js
 * --------------------------------------------------
 * Secure student dashboard using Firebase Auth
 * --------------------------------------------------
 */

import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

  /* ===============================================
     AUTH GUARD (FIREBASE SESSION BASED)
  =============================================== */

  onAuthStateChanged(auth, async (user) => {

    if (!user) {
      alert("Please login first.");
      window.location.href = "index.html";
      return;
    }

    /* FETCH USER DOCUMENT */
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      alert("User record not found.");
      return;
    }

    const student = snap.data();

    /* ROLE CHECK */
    if (student.role !== "student") {
      alert("Access denied. Students only!");
      window.location.href = "index.html";
      return;
    }

    /* ===============================================
       LOAD STUDENT DATA
    =============================================== */

    document.getElementById("studentWelcome").textContent =
      `Welcome, ${student.name}`;

    document.getElementById("profileName").textContent =
      student.name || "—";

    document.getElementById("profileEmail").textContent =
      student.email || "—";

    document.getElementById("profileId").textContent =
      student.uid || "—";

    document.getElementById("profileClass").textContent =
      student.class || "—";

    document.getElementById("profileGender").textContent =
      student.gender || "—";

    document.getElementById("profileDob").textContent =
      student.dob || "—";

    document.getElementById("profileSubjects").textContent =
      Array.isArray(student.subjects)
        ? student.subjects.join(", ")
        : "—";

    document.getElementById("profilePhone").textContent =
      student.phone || "—";

    document.getElementById("profileAddress").textContent =
      student.address || "—";

  });

});
console.log("User UID:", auth.currentUser.uid);
