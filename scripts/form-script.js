/**
 * form-script.js
 * --------------------------------------------------
 * Handles registration for:
 * - Student
 * - Staff
 * - Parent
 * Uses Firebase Authentication + Firestore
 * --------------------------------------------------
 */

import {
  auth,
  db,
  createUserWithEmailAndPassword
} from "./firebase.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ================= FORM ELEMENT ================= */
const form = document.getElementById("staffForm");

/* ================= SUBMIT HANDLER ================= */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  /* ---------- GET FORM VALUES ---------- */
  const role = document.getElementById("role").value;
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("homeaddress").value.trim();
  const subjects = document.getElementById("subjects").value.trim();

  if (!role) {
    alert("Please select a role");
    return;
  }

  try {
    /* ================= CREATE AUTH USER ================= */
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    /* =====================================================
       STEP 1: SAVE ROLE TO CENTRAL USERS COLLECTION
       (🔥 THIS FIXES YOUR LOGIN ERROR)
    ====================================================== */
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      role: role,
      email: email,
      createdAt: serverTimestamp()
    });

    /* =====================================================
       STEP 2: SAVE FULL PROFILE TO ROLE COLLECTION
    ====================================================== */
    const profileData = {
      uid: user.uid,
      name: `${firstName} ${lastName}`,
      email,
      phone,
      address,
      subjects: role === "staff" ? subjects : "",
      createdAt: serverTimestamp()
    };

    await setDoc(doc(db, role + "s", user.uid), profileData);

    alert("Registration successful. You can now sign in.");
    window.location.href = "index.html";

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});
