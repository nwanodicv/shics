/**
 * admin-dashboard.js
 * ---------------------------------------------------
 * Professional Admin Dashboard
 * - Firebase Auth Guard (admin only)
 * - Loads users from Firestore
 * - Parent ↔ Student linking
 * - Student listing
 * - Professional Result Publishing (subcollection)
 * ---------------------------------------------------
 */ 

import { auth, db } from "./firebase.js";

import {
  collection,
  getDocs,
  updateDoc,
  arrayUnion,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ==================================================
   AUTH GUARD (FIREBASE VERSION — NO LOCALSTORAGE)
================================================== */

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  // Fetch user role from Firestore
  const userDoc = await getDoc(doc(db, "users", user.uid));

  if (!userDoc.exists() || userDoc.data().role !== "admin") {
    alert("Admin access only.");
    window.location.href = "../index.html";
    return;
  }

  // If admin is confirmed → load everything
  initializeAdminPanel();
});


/* ==================================================
   MAIN INITIALIZER
================================================== */

function initializeAdminPanel() {

  loadUsers();
  loadUsersForLinking();
  loadStudentsForResults(); // NEW: load result dropdown
}


/* ==================================================
   LOAD ALL USERS (For Student Management Page)
================================================== */

async function loadUsers() {

  const snapshot = await getDocs(collection(db, "users"));

  const students = [];
  const parents = [];
  const staff = []; // ✅ NEW: staff array

  snapshot.forEach(docSnap => {
    const data = docSnap.data();

    if (data.role === "student") students.push(data);
    if (data.role === "parent") parents.push(data);
    if (data.role === "staff") staff.push(data); // ✅ NEW
  });

  renderStudents(students);
  populateParentDropdown(parents);
  populateStudentDropdown(students);

  populateStaffDropdown(staff); // ✅ NEW FUNCTION CALL
}


/* ==================================================
   RENDER STUDENTS LIST
================================================== */

function renderStudents(students) {

  const container = document.getElementById("studentList");
  if (!container) return;

  container.innerHTML = "";

  if (students.length === 0) {
    container.innerHTML = "<li>No students found.</li>";
    return;
  }

  students.forEach(student => {

    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${student.name || "No Name"}</strong>
      <br>
      ${student.email}
    `;

    container.appendChild(li);
  });
}


/* ==================================================
   POPULATE PARENT SELECT
================================================== */

function populateParentDropdown(parents) {

  const parentSelect = document.getElementById("parentSelect");
  if (!parentSelect) return;

  parentSelect.innerHTML = `<option value="">Assign Parent</option>`;

  parents.forEach(parent => {

    const option = document.createElement("option");
    option.value = parent.uid;
    option.textContent = parent.name;

    parentSelect.appendChild(option);
  });
}

/* ==================================================
   POPULATE STAFF DROPDOWN (ADMIN STAFF MANAGEMENT)
================================================== */

function populateStaffDropdown(staffList) {

  const staffSelect = document.getElementById("staffSelect");
  if (!staffSelect) return;

  // Clear existing options
  staffSelect.innerHTML = `<option value="">-- Select Staff --</option>`;

  if (staffList.length === 0) {
    console.warn("No staff found in database");
    return;
  }

  staffList.forEach(staff => {

    const option = document.createElement("option");

    option.value = staff.uid;
    option.textContent = `${staff.name} (${staff.subjects || "No Subject"})`;

    staffSelect.appendChild(option);
  });
}


/* ==================================================
   POPULATE LINKING DROPDOWNS
================================================== */

function populateStudentDropdown(students) {

  const studentSelect = document.getElementById("studentLinkSelect");
  if (!studentSelect) return;

  studentSelect.innerHTML = `<option value="">Select Student</option>`;

  students.forEach(student => {

    const option = document.createElement("option");
    option.value = student.uid;
    option.textContent = student.name;

    studentSelect.appendChild(option);
  });
}


async function loadUsersForLinking() {

  const snapshot = await getDocs(collection(db, "users"));

  const linkParentSelect = document.getElementById("linkParentSelect");
  if (!linkParentSelect) return;

  linkParentSelect.innerHTML = `<option value="">Select Parent</option>`;

  snapshot.forEach(docSnap => {

    const user = docSnap.data();

    if (user.role === "parent") {

      const option = document.createElement("option");
      option.value = user.uid;
      option.textContent = user.name;

      linkParentSelect.appendChild(option);
    }
  });
}


/* ==================================================
   LINK PARENT ↔ STUDENT
================================================== */

const linkParentBtn = document.getElementById("linkParentBtn");

if (linkParentBtn) {

  linkParentBtn.addEventListener("click", async () => {

    const parentUID = document.getElementById("linkParentSelect").value;
    const studentUID = document.getElementById("studentLinkSelect").value;

    if (!parentUID || !studentUID) {
      alert("Please select both parent and student.");
      return;
    }

    try {

      await updateDoc(doc(db, "users", parentUID), {
        children: arrayUnion(studentUID)
      });

      await updateDoc(doc(db, "users", studentUID), {
        parentIds: arrayUnion(parentUID)
      });

      alert("Parent successfully linked ✔");

    } catch (error) {
      console.error(error);
      alert("Linking failed.");
    }

  });
}


/* ==================================================
   PROFESSIONAL RESULT SYSTEM
================================================== */

/* ---------- Load students into result dropdown ---------- */
async function loadStudentsForResults() {

  const resultSelect = document.getElementById("resultStudentSelect");
  if (!resultSelect) return; // only runs on result.html

  const snapshot = await getDocs(collection(db, "users"));

  resultSelect.innerHTML = `<option value="">Select Student</option>`;

  snapshot.forEach(docSnap => {

    const user = docSnap.data();

    if (user.role === "student") {

      const option = document.createElement("option");
      option.value = user.uid;
      option.textContent = user.name;

      resultSelect.appendChild(option);
    }
  });
}


/* ---------- Publish Result ---------- */

const publishBtn = document.getElementById("publishResultBtn");

if (publishBtn) {

  publishBtn.addEventListener("click", async () => {

    const studentUID = document.getElementById("resultStudentSelect").value;
    const subject = document.getElementById("resultSubject").value.trim();
    const score = document.getElementById("resultScore").value;
    const term = document.getElementById("resultTerm").value;

    if (!studentUID || !subject || !score || !term) {
      alert("Please fill all result fields.");
      return;
    }

    try {

      // Add result as subcollection under student
      await addDoc(
        collection(db, "users", studentUID, "results"),
        {
          subject,
          score: Number(score),
          term,
          createdAt: serverTimestamp()
        }
      );

      alert("Result published successfully ✔");

      // Clear inputs
      document.getElementById("resultSubject").value = "";
      document.getElementById("resultScore").value = "";
      document.getElementById("resultTerm").value = "";

    } catch (error) {
      console.error(error);
      alert("Failed to publish result.");
    }

  });
}

/**
 * staff-management.js
 * --------------------------------------------------
 * Admin Staff Management (UPDATED FIXED VERSION)
 * - Fixed check-in error (wrong variable)
 * - Consistent date/time handling
 * - Safe Firestore writes
 * - Comments added for clarity
 * --------------------------------------------------
 */


/* ==================================================
   GLOBAL ELEMENTS
================================================== */

const staffSelect = document.getElementById("staffSelect");
const attendanceBody = document.getElementById("attendanceHistory");
const checkInBtn = document.getElementById("checkInBtn");
const checkOutBtn = document.getElementById("checkOutBtn");
const attendanceDate = document.getElementById("attendanceDate");


/* ==================================================
   HELPER: GET CURRENT DATE & TIME (CONSISTENT FORMAT)
================================================== */

function getNow() {
  const now = new Date();

  const date = now.toISOString().split("T")[0]; // YYYY-MM-DD (important for filtering)
  const time = now.toLocaleTimeString();

  return { date, time };
}


/* ==================================================
   LOAD STAFF INTO DROPDOWN
================================================== */

async function loadStaff() {
  try {
    const snapshot = await getDocs(collection(db, "users"));

    snapshot.forEach(docSnap => {
      const user = docSnap.data();

      if (user.role === "staff") {
        const option = document.createElement("option");
        option.value = docSnap.id;
        option.textContent = user.name;

        staffSelect.appendChild(option);
      }
    });

  } catch (error) {
    console.error("Error loading staff:", error);
  }
}

loadStaff();


/* ==================================================
   LOAD ATTENDANCE (ADMIN VIEW)
================================================== */

async function loadAttendance(staffId, selectedDate = null) {
  try {
    attendanceBody.innerHTML = "";

    let q;

    // Filter by staff + optional date
    if (selectedDate) {
      q = query(
        collection(db, "attendance"),
        where("staffId", "==", staffId),
        where("date", "==", selectedDate)
      );
    } else {
      q = query(
        collection(db, "attendance"),
        where("staffId", "==", staffId)
      );
    }

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      attendanceBody.innerHTML =
        `<tr><td colspan="3">No records found</td></tr>`;
      return;
    }

    snapshot.forEach(docSnap => {
      const record = docSnap.data();

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${record.action}</td>
        <td>${record.date}</td>
        <td>${record.time}</td>
      `;

      attendanceBody.appendChild(row);
    });

  } catch (error) {
    console.error("Error loading attendance:", error);
  }
}


/* ==================================================
   STAFF SELECTION CHANGE
================================================== */

staffSelect?.addEventListener("change", () => {
  const staffId = staffSelect.value;

  if (staffId) {
    loadAttendance(staffId);
  }
});


/* ==================================================
   DATE FILTER
================================================== */

attendanceDate?.addEventListener("change", () => {
  const staffId = staffSelect.value;
  const selectedDate = attendanceDate.value;

  if (staffId) {
    loadAttendance(staffId, selectedDate);
  }
});


/* ==================================================
   CHECK-IN FUNCTION (FIXED)
================================================== */

checkInBtn?.addEventListener("click", async () => {

  const staffId = staffSelect?.value;

  if (!staffId) {
    alert("Please select a staff");
    return;
  }

  try {

    const { date, time } = getNow();

    // OPTIONAL: get staff info (for better records)
    const staffDoc = await getDoc(doc(db, "users", staffId));

    /* =========================================
       FIXED WRITE (IMPORTANT FIX)
       - was using undefined variable before
    ========================================= */
    await addDoc(collection(db, "attendance"), {
      staffId: staffId, // ✅ FIXED (was wrong before)
      staffName: staffDoc.exists() ? staffDoc.data().name : "Unknown",
      action: "Check-In",
      date: date,
      time: time,
      timestamp: serverTimestamp()
    });

    alert("Checked in successfully");

    loadAttendance(staffId);

  } catch (error) {
    console.error("Check-in error:", error);
    alert("Error checking in");
  }

});


/* ==================================================
   CHECK-OUT FUNCTION
================================================== */

checkOutBtn?.addEventListener("click", async () => {

  const staffId = staffSelect?.value;

  if (!staffId) {
    alert("Please select a staff");
    return;
  }

  try {

    const { date, time } = getNow();

    const staffDoc = await getDoc(doc(db, "users", staffId));

    await addDoc(collection(db, "attendance"), {
      staffId: staffId,
      staffName: staffDoc.exists() ? staffDoc.data().name : "Unknown",
      action: "Check-Out",
      date: date,
      time: time,
      timestamp: serverTimestamp()
    });

    alert("Checked out successfully");

    loadAttendance(staffId);

  } catch (error) {
    console.error("Check-out error:", error);
    alert("Error checking out");
  }

});