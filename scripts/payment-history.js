/**
 * payment-history.js
 * -------------------------
 * Admin views all payments
 */

requireRole(["admin"]);

const payments = JSON.parse(localStorage.getItem("payments")) || [];
const paymentList = document.getElementById("paymentList");

if (payments.length === 0) {
  paymentList.innerHTML = "<li>No payments recorded</li>";
} else {
  payments.forEach(p => {
    const li = document.createElement("li");
    li.textContent =
      `${p.name} | ${p.date} | Status: ${p.status}`;
    paymentList.appendChild(li);
  });
}
