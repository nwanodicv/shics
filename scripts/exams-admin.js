/**
 * exams-admin.js
 * -----------------------------------
 * Allows Admin or Staff to create exams
 */

// Allow only admin & staff
requireRole(["admin", "staff"]);

// Load stored exams or initialize empty array
const exams = JSON.parse(localStorage.getItem("exams")) || [];

// Handle exam creation
document.getElementById("createExamForm").addEventListener("submit", e => {
  e.preventDefault();

  const subject = document.getElementById("subject").value.trim();
  const className = document.getElementById("class").value.trim();
  const date = document.getElementById("date").value;

  // Create exam object
  const exam = {
    id: "exam_" + Date.now(),
    subject,
    class: className,
    date,
    createdBy: JSON.parse(localStorage.getItem("currentUser")).id || "admin"
  };

  exams.push(exam);
  localStorage.setItem("exams", JSON.stringify(exams));

  alert("Exam created successfully");
  e.target.reset();
});
