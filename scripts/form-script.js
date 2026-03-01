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
/* ======================================================
   IMPORT FIREBASE CORE SERVICES
   ====================================================== */
import { auth, db } from "./firebase.js";

/* ======================================================
   IMPORT AUTH METHODS DIRECTLY FROM FIREBASE
   ====================================================== */
import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* ======================================================
   IMPORT FIRESTORE METHODS
   ====================================================== */
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
  role,
  name: `${firstName} ${lastName}`,
  email,
  phone,
  address,
  subjects: role === "staff" ? subjects : [],
  attendance: [],
  results: [],
  photo: "",
  createdAt: serverTimestamp()
});


    /* =====================================================
       STEP 2: SAVE FULL PROFILE TO ROLE COLLECTION
    ====================================================== */
    /* ======================================================
   SAVE USER PROFILE TO FIRESTORE
   ====================================================== */

const profileData = {
  uid: user.uid,
  role,
  firstName,
  lastName,
  name: `${firstName} ${lastName}`,
  email,
  phone,
  address,
  subjects: role === "staff" ? subjects : [],
  attendance: [],
  results: [],
  photo: "",
  createdAt: serverTimestamp()
};

/* Save user profile inside "users" collection */
await setDoc(doc(db, "users", user.uid), profileData);

    alert("Registration successful. You can now sign in.");
    window.location.href = "index.html";

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});
