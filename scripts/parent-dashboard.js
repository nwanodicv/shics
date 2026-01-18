/**
 * parent-dashboard.js
 * --------------------------------------------------
 * Handles Parent Dashboard logic:
 * - Auth guard (parent only)
 * - Load linked children
 * - Render children list
 * - Display report card when a child is selected
 * --------------------------------------------------
 */

document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     AUTH GUARD (PARENT ONLY)
  =============================== */
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser || currentUser.role !== "parent") {
    alert("Parents only");
    window.location.href = "index.html";
    return;
  }

  /* ===============================
     LOAD DATA FROM STORAGE
  =============================== */
  const parents = JSON.parse(localStorage.getItem("parents")) || [];
  const students = JSON.parse(localStorage.getItem("students")) || [];

  /* ===============================
     FIND LOGGED-IN PARENT RECORD
  =============================== */
  const parent = parents.find(
    p => p.id === currentUser.id || p.email === currentUser.email
  );

  /* ===============================
     DOM ELEMENTS
  =============================== */
  const childrenListEl = document.getElementById("childrenList");
  const reportCardViewEl = document.getElementById("reportCardView");

  childrenListEl.innerHTML = "";
  reportCardViewEl.innerHTML = "<p>Select a child to view report card.</p>";

  if (!parent) {
    childrenListEl.innerHTML = "<p>No parent record found.</p>";
    return;
  }

  /* ===============================
     GET LINKED CHILDREN IDS
  =============================== */
  const childrenIds = Array.isArray(parent.children) ? parent.children : [];

  if (childrenIds.length === 0) {
    childrenListEl.innerHTML = "<p>No children linked yet.</p>";
    return;
  }

  /* ===============================
     RENDER CHILDREN LIST
  =============================== */
  childrenIds.forEach(childId => {
    const student = students.find(s => s.id === childId);
    if (!student) return;

    // Create child card
    const card = document.createElement("div");
    card.className = "child-card";
    card.innerHTML = `
      <h3>${student.name}</h3>
      <p>Class: ${student.class || "N/A"}</p>
      <button>View Report Card</button>
    `;

    // Handle click → show report card
    card.querySelector("button").addEventListener("click", () => {
      renderReportCard(student);
    });

    childrenListEl.appendChild(card);
  });

  /* ===============================
     RENDER REPORT CARD
  =============================== */
  function renderReportCard(student) {
    reportCardViewEl.innerHTML = "";

    const title = document.createElement("h2");
    title.textContent = `${student.name}'s Report Card`;
    reportCardViewEl.appendChild(title);

    // No results yet
    if (!Array.isArray(student.results) || student.results.length === 0) {
      reportCardViewEl.innerHTML += "<p>No results published yet.</p>";
      return;
    }

    // Render results
    const ul = document.createElement("ul");

    student.results.forEach(result => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${result.subject}</strong><br>
        Score: ${result.score}<br>
        <small>${result.term || ""} ${result.date || ""}</small>
      `;
      ul.appendChild(li);
    });

    reportCardViewEl.appendChild(ul);
  }

  /* ===============================
     LOGOUT HANDLER
  =============================== */
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  });

  console.log("Current User:", currentUser);
  console.log("Parents:", parents);
  console.log("Resolved Parent:", parent);
  console.log("Children IDs:", childrenIds);
  console.log("Students:", students);
  

});
