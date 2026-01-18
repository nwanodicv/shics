/**
 * grade-entry.js
 * -----------------------------------
 * Allows staff to enter student scores
 */

requireRole(["admin", "staff"]);

const exams = JSON.parse(localStorage.getItem("exams")) || [];
const students = JSON.parse(localStorage.getItem("students")) || [];
const results = JSON.parse(localStorage.getItem("results")) || [];

// Simple grading logic
function getGrade(score) {
  if (score >= 70) return "A";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  if (score >= 45) return "D";
  return "F";
}

// Save result
function saveResult(examId, studentId, score) {
  const grade = getGrade(score);

  results.push({
    examId,
    studentId,
    score,
    grade,
    remark: grade === "F" ? "Needs Improvement" : "Good"
  });

  localStorage.setItem("results", JSON.stringify(results));
}
