/**
 * payments.js
 * -------------------------
 * Simulates payment and records it
 */

requireRole(["student", "parent"]);

const user = JSON.parse(localStorage.getItem("currentUser"));
const payments = JSON.parse(localStorage.getItem("payments")) || [];

document.getElementById("payNow").addEventListener("click", () => {

  payments.push({
    id: Date.now(),
    payer: user.id,
    name: user.firstName,
    date: new Date().toLocaleString(),
    status: "Paid"
  });

  localStorage.setItem("payments", JSON.stringify(payments));

  document.getElementById("paymentStatus").textContent =
    "Payment recorded successfully ✔";
});
