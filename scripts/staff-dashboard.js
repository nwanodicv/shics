/**
 * staff-dashboard.js
 * --------------------------------------------------
 * Secure Staff Dashboard (Professional Version)
 * - Firebase Auth Guard
 * - Loads staff profile
 * - Loads attendance history (Firestore)
 * - Logout
 * --------------------------------------------------
 */

import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


/* ==================================================
   AUTH GUARD (STAFF ONLY)
================================================== */

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  try {

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists() || snap.data().role !== "staff") {
      alert("Access denied. Staff only.");
      window.location.href = "index.html";
      return;
    }

    const staff = snap.data();

    /* ==============================================
       DISPLAY STAFF PROFILE INFO
    ============================================== */

    document.getElementById("staffInfo").innerHTML = `
      <h2>Welcome, ${staff.name}</h2>
      <p><strong>Email:</strong> ${staff.email}</p>
      <p><strong>Subjects:</strong> ${staff.subjects || "Not Assigned"}</p>
      <p><strong>Phone:</strong> ${staff.phone || "N/A"}</p>
      <p><strong>Qualification:</strong> ${staff.qualification || "N/A"}</p>
    `;

    /* ==============================================
       LOAD ATTENDANCE HISTORY
    ============================================== */

    await loadAttendance(user.uid);

  } catch (error) {
    console.error("Staff dashboard error:", error);
    alert("Error loading dashboard.");
  }

});


/* ==================================================
   LOAD STAFF ATTENDANCE FROM FIRESTORE
================================================== */

/* ==================================================
   LOAD STAFF ATTENDANCE FROM FIRESTORE (FIXED)
================================================== */

async function loadAttendance(staffId) {

  const attendanceBody = document.getElementById("attendanceHistory");

  try {

    attendanceBody.innerHTML = "";

    /* =========================================
       FIX: Removed orderBy to avoid index error
       (You can add it back after creating index)
    ========================================= */
    const q = query(
      collection(db, "attendance"),
      where("staffId", "==", staffId)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      attendanceBody.innerHTML =
        `<tr><td colspan="3">No attendance records yet</td></tr>`;
      return;
    }

    /* =========================================
       OPTIONAL: Manual sorting by timestamp
       (so we still get latest first)
    ========================================= */
    const records = [];

    snapshot.forEach(docSnap => {
      records.push(docSnap.data());
    });

    // Sort manually (latest first)
    records.sort((a, b) => {
      return (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0);
    });

    records.forEach(record => {

      const row = document.createElement("tr");

      /* =========================================
         FIX: Removed type/status column (not used)
      ========================================= */
      row.innerHTML = `
        <td>${record.action}</td>
        <td>${record.date}</td>
        <td>${record.time}</td>
      `;

      attendanceBody.appendChild(row);
    });

  } catch (error) {
    console.error("Error loading attendance:", error);

    /* =========================================
       IMPROVED ERROR MESSAGE (DEBUG FRIENDLY)
    ========================================= */
    attendanceBody.innerHTML =
      `<tr><td colspan="3">Error loading attendance</td></tr>`;
  }
}