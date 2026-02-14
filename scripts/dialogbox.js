/**
 * dialogbox.js
 * -----------------------------------------
 * Handles sign-in dialog for all users
 */

import { staffLogin } from "./login.js";

const heroSignInBtn = document.querySelector(".hero-signin");
const staffNavLink = document.querySelector(".staff-dashboard-page");
const goToDashboard = document.querySelector(".hero-signup");

/* ================= OPEN LOGIN DIALOG ================= */
function openStaffLoginDialog() {
  const dialogStaff = document.createElement("dialog");

  dialogStaff.innerHTML = `
    <form class="sign-in-form" id="staffLoginForm">
      <h3>Sign In</h3>

      <label>
        Email
        <input type="email" id="loginEmail" required />
      </label>

      <label>
        Password
        <input type="password" id="loginPassword" required />
      </label>

      <button type="submit">Sign In</button>

      <aside class="create-account">
        <h2 class="sign-up">Create Account</h2>
      </aside>
    </form>
  `;

  document.body.appendChild(dialogStaff);
  dialogStaff.showModal();

  /* ===== SIGN UP REDIRECT ===== */
  dialogStaff.querySelector(".sign-up").addEventListener("click", () => {
    window.location.href = "form.html";
  });

  /* ===== HANDLE LOGIN ===== */
  const form = dialogStaff.querySelector("#staffLoginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = dialogStaff.querySelector("#loginEmail").value.trim();
    const password = dialogStaff.querySelector("#loginPassword").value.trim();

    try {
      await staffLogin(email, password);
      dialogStaff.close();
    } catch (err) {
      alert(err.message);
    }
  });

  dialogStaff.addEventListener("close", () => dialogStaff.remove());
}

/* ================= EVENT LISTENERS ================= */
heroSignInBtn?.addEventListener("click", openStaffLoginDialog);
staffNavLink?.addEventListener("click", e => {
  e.preventDefault();
  openStaffLoginDialog();
});
goToDashboard?.addEventListener("click", e => {
  e.preventDefault();
  openStaffLoginDialog();
});
