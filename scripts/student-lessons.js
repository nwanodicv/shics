/* ================= FIREBASE IMPORTS ================= */

import { db } from "../firebase.js";

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
const studentInfo = document.getElementById("studentInfo");

/* ================= DISPLAY STUDENT INFO ================= */

studentInfo.textContent = `Logged in as: ${studentUser.email}`;

/* ================= LOAD LESSON NOTES ================= */

import { onSnapshot, collection, query, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const lessonContainer = document.getElementById("studentLessons");
const subjectFilter = document.getElementById("subjectFilter");

let allLessons = [];

function loadLessonsRealtime() {
  const q = query(
    collection(db, "lessonContents"),
    where("type", "==", "lesson_note")
  );

  onSnapshot(q, (snapshot) => {
    lessonContainer.innerHTML = "";
    allLessons = [];

    const subjects = new Set();

    snapshot.forEach(docSnap => {
      const d = docSnap.data();
      allLessons.push(d);
      subjects.add(d.subject);
    });

    renderLessons(allLessons);
    populateSubjectFilter([...subjects]);
  });
}

function renderLessons(lessons) {
  lessonContainer.innerHTML = "";

  if (!lessons.length) {
    lessonContainer.innerHTML = "<p>No lesson notes available.</p>";
    return;
  }

  lessons.forEach(d => {
    lessonContainer.innerHTML += `
      <div class="lesson-card">
        <h3>${d.title}</h3>
        <p>${d.subject} — ${d.classId}</p>
        <p>Term: ${d.term}</p>
        <a href="${d.contentUrl}" target="_blank">View Lesson</a>
      </div>
    `;
  });
}

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
  const selected = subjectFilter.value;

  if (!selected) {
    renderLessons(allLessons);
  } else {
    const filtered = allLessons.filter(l => l.subject === selected);
    renderLessons(filtered);
  }
});

loadLessonsRealtime();