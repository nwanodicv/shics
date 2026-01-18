/* ================= FIREBASE IMPORTS ================= */

// Import Firestore database instance
import { db } from "./firebase-config.js";

// Import Firestore helpers
import {
  collection,
  query,
  where,
  getDocs,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* ================= DOM ELEMENT ================= */

// Table body where attendance rows will be inserted
const attendanceBody = document.getElementById("attendanceBody");

/* ================= LOAD LOGGED-IN STUDENT ================= */

// Get student login session from localStorage
const studentUser = JSON.parse(localStorage.getItem("studentUser"));

/* ================= LOAD ATTENDANCE ================= */

async function loadAttendance() {
  try {
    // Clear existing table rows
    attendanceBody.innerHTML = "";

    // Safety check
    if (!studentUser) {
      attendanceBody.innerHTML =
        "<tr><td colspan='3'>Please log in again.</td></tr>";
      return;
    }

    /*
      Query attendance collection:
      - Match logged-in student ID
      - Ordered by date (latest first)
    */
    const q = query(
      collection(db, "attendance"),
      where("studentId", "==", studentUser.id),
      orderBy("date", "desc")
    );

    // Fetch attendance records
    const snapshot = await getDocs(q);

    // If no attendance record exists
    if (snapshot.empty) {
      attendanceBody.innerHTML =
        "<tr><td colspan='3'>No attendance records yet.</td></tr>";
      return;
    }

    // Loop through attendance records
    snapshot.forEach(doc => {
      const record = doc.data();

      // Create table row
      const tr = document.createElement("tr");

      // Populate row cells
      tr.innerHTML = `
        <td>${record.date}</td>
        <td>${record.status}</td>
        <td>${record.markedBy || "Admin"}</td>
      `;

      // Append row to table
      attendanceBody.appendChild(tr);
    });

  } catch (error) {
    // Handle errors
    console.error("Error loading attendance:", error);
    attendanceBody.innerHTML =
      "<tr><td colspan='3'>Error loading attendance.</td></tr>";
  }
}

/* ================= INITIAL LOAD ================= */

// Load attendance when page opens
loadAttendance();
