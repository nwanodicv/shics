/* ================= FIREBASE IMPORTS ================= */

import { db } from "./firebase-config.js";

import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* ================= AUTH GUARD ================= */

const student = JSON.parse(localStorage.getItem("currentUser"));

if (!student || student.role !== "student") {
  window.location.href = "index.html";
}

/* ================= DOM ELEMENT ================= */

const resultList = document.getElementById("resultList");

/* ================= LOAD STUDENT RESULTS ================= */

async function loadMyResults() {
  const q = query(
    collection(db, "results"),
    where("studentId", "==", student.id),
    where("published", "==", true)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    resultList.innerHTML = "<p>No results published yet.</p>";
    return;
  }

  snapshot.forEach(docSnap => {
    const r = docSnap.data();

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${r.term} - ${r.session}</h3>
      <ul>
        ${r.subjects.map(s => `
          <li>
            ${s.name}: CA ${s.ca}, Exam ${s.exam}, Total ${s.total}
          </li>
        `).join("")}
      </ul>
    `;

    resultList.appendChild(card);
  });
}

/* ================= INITIAL LOAD ================= */

loadMyResults();
