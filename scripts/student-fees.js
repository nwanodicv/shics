/**
 * student-fees.js
 * -------------------------
 * Displays fees for logged-in student
 */

requireRole(["student"]);

const student = JSON.parse(localStorage.getItem("currentUser"));
const fees = JSON.parse(localStorage.getItem("fees")) || [];

const myFeesDiv = document.getElementById("myFees");

// Filter fees by student's class
const myFees = fees.filter(fee => fee.className === student.class);

// Display
if (myFees.length === 0) {
  myFeesDiv.textContent = "No fees assigned yet.";
} else {
  myFees.forEach(fee => {
    const p = document.createElement("p");
    p.textContent = `Class: ${fee.className} | Amount: $${fee.amount}`;
    myFeesDiv.appendChild(p);
  });
}
