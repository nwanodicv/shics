/**
 * student-results.js
 * ---------------------------------------------------
 * Professional Student Result Viewer
 * - Firebase Auth Guard
 * - Loads student results
 * - Groups by term
 * - Calculates total, average, grade
 * ---------------------------------------------------
 */

import { auth, db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* ==================================================
   AUTH GUARD (STUDENT ONLY)
================================================== */

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  const resultContainer = document.getElementById("studentResultContainer");
  if (!resultContainer) return;

  loadStudentResults(user.uid);
});


/* ==================================================
   LOAD STUDENT RESULTS
================================================== */

async function loadStudentResults(studentUID) {

  const resultContainer = document.getElementById("studentResultContainer");
  resultContainer.innerHTML = "Loading results...";

  try {

    const snapshot = await getDocs(
      collection(db, "users", studentUID, "results")
    );

    if (snapshot.empty) {
      resultContainer.innerHTML = "<p>No results available.</p>";
      return;
    }

    const resultsByTerm = {};

    snapshot.forEach(docSnap => {

      const data = docSnap.data();

      if (!resultsByTerm[data.term]) {
        resultsByTerm[data.term] = [];
      }

      resultsByTerm[data.term].push(data);
    });

    renderResults(resultsByTerm);

  } catch (error) {
    console.error(error);
    resultContainer.innerHTML = "<p>Failed to load results.</p>";
  }
}


/* ==================================================
   RENDER RESULTS BY TERM
================================================== */

function renderResults(resultsByTerm) {

  const container = document.getElementById("studentResultContainer");
  container.innerHTML = "";

  for (const term in resultsByTerm) {

    const termResults = resultsByTerm[term];

    let total = 0;

    const termDiv = document.createElement("div");
    termDiv.classList.add("term-card");

    let html = `<h3>${term}</h3>`;
    html += `<table border="1" cellpadding="5">
                <tr>
                  <th>Subject</th>
                  <th>Score</th>
                  <th>Grade</th>
                </tr>`;

    termResults.forEach(result => {

      total += result.score;

      html += `
        <tr>
          <td>${result.subject}</td>
          <td>${result.score}</td>
          <td>${calculateGrade(result.score)}</td>
        </tr>
      `;
    });

    const average = total / termResults.length;

    html += `
        <tr>
          <td><strong>Total</strong></td>
          <td colspan="2"><strong>${total}</strong></td>
        </tr>
        <tr>
          <td><strong>Average</strong></td>
          <td colspan="2"><strong>${average.toFixed(2)}</strong></td>
        </tr>
      </table>
    `;

    termDiv.innerHTML = html;
    container.appendChild(termDiv);
  }
}


/* ==================================================
   GRADE CALCULATION
================================================== */

function calculateGrade(score) {

  if (score >= 70) return "A";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  if (score >= 45) return "D";
  if (score >= 40) return "E";
  return "F";
}
