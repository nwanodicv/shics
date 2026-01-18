/* ================= FIREBASE IMPORTS ================= */

import { db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* ================= AUTH GUARD ================= */

const user = JSON.parse(localStorage.getItem("currentUser"));
if (!user || user.role !== "admin") {
  alert("Admin access only");
  window.location.href = "index.html";
}

/* ================= DOM ELEMENTS ================= */

const form = document.getElementById("resultForm");
const resultList = document.getElementById("resultList");

/* ================= UPLOAD RESULT ================= */

form.addEventListener("submit", async e => {
  e.preventDefault();

  try {
    const subjects = JSON.parse(
      document.getElementById("subjectsJson").value
    );

    await addDoc(collection(db, "results"), {
      studentId: studentId.value,
      studentName: studentName.value,
      classLevel: classLevel.value,
      term: term.value,
      session: session.value,
      subjects,
      published: false,
      createdAt: new Date()
    });

    alert("Result saved (not published)");
    form.reset();
    loadResults();

  } catch (error) {
    alert("Invalid subjects JSON");
  }
});

/* ================= LOAD RESULTS ================= */

async function loadResults() {
  resultList.innerHTML = "";

  const snapshot = await getDocs(collection(db, "results"));

  snapshot.forEach(docSnap => {
    const r = docSnap.data();
    const id = docSnap.id;

    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${r.studentName}</h3>
      <p>${r.classLevel} | ${r.term} | ${r.session}</p>
      <p>Status: ${r.published ? "Published" : "Unpublished"}</p>

      <button onclick="togglePublish('${id}', ${r.published})">
        ${r.published ? "Unpublish" : "Publish"}
      </button>
    `;

    resultList.appendChild(div);
  });
}

/* ================= PUBLISH / UNPUBLISH ================= */

window.togglePublish = async function (id, status) {
  await updateDoc(doc(db, "results", id), {
    published: !status
  });

  loadResults();
};

/* ================= INITIAL LOAD ================= */

loadResults();
