/* ================= FIREBASE IMPORTS ================= */

import { db } from "./firebase-config.js";

import {
  collection,
  getDocs,
  updateDoc,
  doc,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* ================= AUTH GUARD ================= */

// Only admin allowed
const adminUser = JSON.parse(localStorage.getItem("currentUser"));

if (!adminUser || adminUser.role !== "admin") {
  alert("Admin access only");
  window.location.href = "index.html";
}

/* ================= DOM ELEMENT ================= */

const lessonContainer = document.getElementById("lessonContainer");

/* ================= LOAD ALL LESSONS ================= */

async function loadAllLessons() {
  lessonContainer.innerHTML = "<p>Loading lessons...</p>";

  try {
    // Admin sees ALL lessons
    const q = query(
      collection(db, "lessons"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    lessonContainer.innerHTML = "";

    if (snapshot.empty) {
      lessonContainer.innerHTML = "<p>No lessons uploaded.</p>";
      return;
    }

    snapshot.forEach(docSnap => {
      const lesson = docSnap.data();
      const lessonId = docSnap.id;

      // Create lesson card
      const card = document.createElement("article");
      card.className = "lesson-card";

      card.innerHTML = `
        <h3>${lesson.title}</h3>

        <p><strong>Type:</strong> ${lesson.type.toUpperCase()}</p>
        <p><strong>Subject:</strong> ${lesson.subject}</p>
        <p><strong>Class:</strong> ${lesson.classLevel}</p>
        <p><strong>Staff:</strong> ${lesson.staffName}</p>
        <p><strong>Status:</strong> ${lesson.status}</p>

        <a href="${lesson.fileUrl}" target="_blank">View File</a>

        ${
          lesson.type === "note"
            ? renderAdminActions(lesson.status, lessonId)
            : `<p><em>Lesson plan (admin only)</em></p>`
        }
      `;

      lessonContainer.appendChild(card);
    });

  } catch (error) {
    console.error("Error loading lessons:", error);
    lessonContainer.innerHTML = "<p>Error loading lessons.</p>";
  }
}

/* ================= ACTION BUTTONS ================= */

function renderAdminActions(status, id) {
  // Approved lessons don't need buttons
  if (status === "approved") {
    return `<p style="color:green;"><strong>Approved</strong></p>`;
  }

  return `
    <div class="action-buttons">
      <button onclick="approveLesson('${id}')">Approve</button>
      <button onclick="rejectLesson('${id}')">Reject</button>
    </div>
  `;
}

/* ================= APPROVE LESSON ================= */

window.approveLesson = async function (lessonId) {
  const ref = doc(db, "lessons", lessonId);

  await updateDoc(ref, {
    status: "approved"
  });

  alert("Lesson approved");
  loadAllLessons();
};

/* ================= REJECT LESSON ================= */

window.rejectLesson = async function (lessonId) {
  const ref = doc(db, "lessons", lessonId);

  await updateDoc(ref, {
    status: "rejected"
  });

  alert("Lesson rejected");
  loadAllLessons();
};

/* ================= INITIAL LOAD ================= */

loadAllLessons();
