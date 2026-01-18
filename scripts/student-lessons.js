/* ================= FIREBASE IMPORTS ================= */

import { db } from "./firebase-config.js";

import {
  collection,
  query,
  where,
  orderBy,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* ================= AUTH GUARD ================= */

// Ensure only students can access this page
const studentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!studentUser || studentUser.role !== "student") {
  alert("Students only");
  window.location.href = "index.html";
}

/* ================= DOM ELEMENTS ================= */

const lessonList = document.getElementById("lessonList");
const subjectFilter = document.getElementById("subjectFilter");
const studentInfo = document.getElementById("studentInfo");

/* ================= DISPLAY STUDENT INFO ================= */

studentInfo.textContent = `Logged in as: ${studentUser.email}`;

/* ================= LOAD LESSON NOTES ================= */

async function loadLessonNotes() {
  lessonList.innerHTML = "<p>Loading lessons...</p>";

  try {
    // Firestore query:
    // - Only lesson notes
    // - Ordered by newest
    const q = query(
      collection(db, "lessons"),
      where("type", "==", "note"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    lessonList.innerHTML = "";

    if (snapshot.empty) {
      lessonList.innerHTML = "<p>No lesson notes available.</p>";
      return;
    }

    const subjects = new Set();

    snapshot.forEach(doc => {
      const lesson = doc.data();

      // Collect subjects for filter
      subjects.add(lesson.subject);

      // Create lesson card
      const card = document.createElement("article");
      card.className = "lesson-card";

      card.innerHTML = `
        <h3>${lesson.title}</h3>
        <p><strong>Subject:</strong> ${lesson.subject}</p>
        <p><strong>Class:</strong> ${lesson.classLevel}</p>
        <p><strong>Teacher:</strong> ${lesson.staffName}</p>
        <a href="${lesson.fileUrl}" target="_blank">
          View / Download
        </a>
      `;

      lessonList.appendChild(card);
    });

    populateSubjectFilter([...subjects]);

  } catch (error) {
    console.error("Error loading lessons:", error);
    lessonList.innerHTML = "<p>Error loading lessons.</p>";
  }
}

/* ================= SUBJECT FILTER ================= */

function populateSubjectFilter(subjects) {
  subjectFilter.innerHTML = `<option value="">All Subjects</option>`;

  subjects.forEach(sub => {
    const opt = document.createElement("option");
    opt.value = sub;
    opt.textContent = sub;
    subjectFilter.appendChild(opt);
  });
}

subjectFilter.addEventListener("change", () => {
  const selected = subjectFilter.value.toLowerCase();
  const cards = document.querySelectorAll(".lesson-card");

  cards.forEach(card => {
    const subject = card
      .querySelector("p")
      .textContent
      .toLowerCase();

    card.style.display =
      !selected || subject.includes(selected)
        ? "block"
        : "none";
  });
});

/* ================= INITIAL LOAD ================= */

loadLessonNotes();
