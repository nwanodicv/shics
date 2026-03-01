/**
 * parent-dashboard.js
 * --------------------------------------------------
 * Professional Parent Dashboard
 * - Firebase Auth Guard
 * - Loads linked children
 * - Loads results from subcollection
 * - Professional PDF download system
 * --------------------------------------------------
 */

import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, collection, getDocs } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export default onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  /* --------------------------------------------------
     VERIFY PARENT ROLE
  -------------------------------------------------- */

  const parentRef = doc(db, "users", user.uid);
  const parentSnap = await getDoc(parentRef);

  if (!parentSnap.exists() || parentSnap.data().role !== "parent") {
    alert("Access denied. Parent only!");
    window.location.href = "index.html";
    return;
  }

  const parent = parentSnap.data();
  console.log("Parent data:", parent);

  const childrenListEl = document.getElementById("childrenList");
  const reportCardViewEl = document.getElementById("reportCardView");
  const parentWelcome = document.getElementById("parentWelcome");
  const downloadBtn = document.getElementById("downloadBtn");

if (!downloadBtn) {
  console.error("Download button not found in HTML.");
  return;
}
  parentWelcome.textContent = `Welcome, ${parent.name}`;

  childrenListEl.innerHTML = "";
  downloadBtn.style.display = "none";

  const childrenIds = parent.children || [];

  if (!childrenIds.length) {
    childrenListEl.innerHTML = "<p>No children linked yet.</p>";
    return;
  }

  /* --------------------------------------------------
     STATE STORAGE (For PDF Download)
  -------------------------------------------------- */

  let selectedStudent = null;
  let selectedResults = [];

  /* --------------------------------------------------
     LOAD EACH CHILD
  -------------------------------------------------- */

  for (const childUID of childrenIds) {

    const studentRef = doc(db, "users", childUID);
    const studentSnap = await getDoc(studentRef);

    if (!studentSnap.exists()) continue;

    const student = studentSnap.data();

    const card = document.createElement("div");
    card.className = "child-card";

    card.innerHTML = `
      <h3>${student.name}</h3>
      <p>Class: ${student.class || "N/A"}</p>
      <button>View Report Card</button>
    `;

    card.querySelector("button").addEventListener("click", async () => {
      await renderReportCard(childUID, student);
    });

    childrenListEl.appendChild(card);
  }

  /* --------------------------------------------------
     RENDER REPORT CARD
  -------------------------------------------------- */

  async function renderReportCard(studentUID, student) {

    selectedStudent = student;
    selectedResults = [];

    reportCardViewEl.innerHTML = `
      <h2>${student.name}'s Report Card</h2>
    `;

    const resultsSnapshot = await getDocs(
      collection(db, "users", studentUID, "results")
    );

    if (resultsSnapshot.empty) {
      reportCardViewEl.innerHTML += "<p>No results published yet.</p>";
      downloadBtn.style.display = "none";
      return;
    }

    const ul = document.createElement("ul");

    resultsSnapshot.forEach(docSnap => {
      const result = docSnap.data();
      selectedResults.push(result);

      const li = document.createElement("li");

      li.innerHTML = `
        <strong>${result.subject}</strong><br>
        Score: ${result.score}<br>
        <small>${result.term || ""}</small>
      `;

      ul.appendChild(li);
    });

    reportCardViewEl.appendChild(ul);

    downloadBtn.style.display = "inline-block";
  }

  /* --------------------------------------------------
     DOWNLOAD BUTTON LISTENER
  -------------------------------------------------- */

  downloadBtn.addEventListener("click", () => {

    if (!selectedStudent || !selectedResults.length) {
      alert("No result loaded.");
      return;
    }

    downloadResult(selectedStudent, selectedResults);
  });

  /* --------------------------------------------------
     PROFESSIONAL PDF GENERATOR
  -------------------------------------------------- */

  async function downloadResult(student, results) {
  
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
      alert("PDF library not loaded.");
      return;
    }

    const doc = new jsPDF();
    let y = 20;

    /* ================================
       HELPERS: load image with error handling
    ================================= */
    async function loadImageSafe(src) {
      return await new Promise(resolve => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });
    }

    /* ================================
       SCHOOL LOGO + HEADER
    ================================= */

    const logoImg = await loadImageSafe("../images/harvester.png");
    if (logoImg) {
      try {
        doc.addImage(logoImg, "PNG", 20, y - 10, 25, 25);
      } catch (e) {
        // If addImage fails, continue without the logo
        console.warn('Failed to add logo to PDF:', e);
      }
    }
    
    // School Name (Center)
    doc.setFontSize(16);
    doc.text("SACRED HARVESTERS INT'L CHRISTIAN SCHOOL", 55, y);
    
    y += 10;
    
    doc.setFontSize(12);
    doc.text("STUDENT RESULT SHEET", 75, y);
    
    y += 20;
  
    /* ================================
       STUDENT INFO
    ================================= */
  
    doc.text(`Student Name: ${student.name}`, 20, y);
    y += 10;
  
    doc.text(`Class: ${student.class || "N/A"}`, 20, y);
    y += 10;
  
    doc.text(`Term: First Term`, 20, y);
    y += 20;
  
    /* ================================
       SUBJECT TABLE
    ================================= */
  
    let total = 0;
  
    doc.text("Subject", 20, y);
    doc.text("Score", 100, y);
    doc.text("Grade", 140, y);
    y += 10;
  
    results.forEach(result => {
  
      const grade = calculateGrade(result.score);
  
      doc.text(result.subject, 20, y);
      doc.text(String(result.score), 100, y);
      doc.text(grade, 140, y);
  
      total += Number(result.score);
      y += 10;
    });
  
    const average = (total / results.length).toFixed(2);
    const overallGrade = calculateGrade(average);
    const decision = average >= 50 ? "PASS" : "FAIL";
  
    y += 15;
    doc.text(`Total: ${total}`, 20, y);
    y += 10;
    doc.text(`Average: ${average}`, 20, y);
    y += 10;
    doc.text(`Overall Grade: ${overallGrade}`, 20, y);
    y += 10;
  
    /* ================================
       PASS / FAIL DECISION
    ================================= */
  
    doc.setFontSize(14);
    doc.text(`FINAL DECISION: ${decision}`, 20, y);
    y += 25;
  
    /* ================================
       ADD PRINCIPAL SIGNATURE IMAGE
    ================================= */
  
    const signatureImg = await loadImageSafe("../images/principal-signature.png");
    if (signatureImg) {
      try {
        doc.addImage(signatureImg, "PNG", 20, y, 50, 20);
      } catch (e) {
        console.warn('Failed to add signature to PDF:', e);
      }
    }
  
    y += 25;
    doc.setFontSize(12);
    doc.text("Principal Signature", 20, y);
  
    /* ================================
       SAVE FILE
    ================================= */
  
    doc.save(`${student.name}_Result.pdf`);
  
    function calculateGrade(score) {
    
      score = Number(score);
    
      if (score >= 70) return "A";
      if (score >= 60) return "B";
      if (score >= 50) return "C";
      if (score >= 45) return "D";
      if (score >= 40) return "E";
      return "F";
    }
    
  }


});
