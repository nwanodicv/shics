/**
 * fees-admin.js
 * -------------------------
 * Allows admin to create and manage fees
 */

// Restrict access to Admin only
requireRole(["admin"]);

// Get stored fees or initialize empty array
const fees = JSON.parse(localStorage.getItem("fees")) || [];

// DOM elements
const feeForm = document.getElementById("feeForm");
const feeList = document.getElementById("feeList");

// Handle form submission
feeForm.addEventListener("submit", e => {
  e.preventDefault();

  const className = document.getElementById("className").value.trim();
  const amount = document.getElementById("amount").value;

  // Create fee object
  fees.push({
    id: Date.now(),
    className,
    amount
  });

  // Save to localStorage
  localStorage.setItem("fees", JSON.stringify(fees));

  feeForm.reset();
  renderFees();
});

// Display fees
function renderFees() {
  feeList.innerHTML = "";

  fees.forEach(fee => {
    const li = document.createElement("li");
    li.textContent = `${fee.className} - $${fee.amount}`;
    feeList.appendChild(li);
  });
}

renderFees();
