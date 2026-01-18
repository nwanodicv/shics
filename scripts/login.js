/**
 * login.js
 * -----------------------------
 * Handles login for Admin, Staff, Student, and Parent.
 * Stores authenticated user in localStorage.
 */

const ADMIN_EMAIL = "sacredharvesters@gmail.com";
const ADMIN_PASSWORD = "admin111";

window.staffLogin = function (email, password) {

  const users = JSON.parse(localStorage.getItem("users")) || [];

  /* ADMIN */
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem("currentUser", JSON.stringify({
      role: "admin",
      email
    }));
    window.location.href = "admin.html";
    return;
  }

  /* AUTH USER */
  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    alert("Invalid login credentials.");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify({
    id: user.id,
    role: user.role,
    email: user.email
  }));

  /* ROUTE BY ROLE */
  if (user.role === "staff") window.location.href = "staff.html";
  else if (user.role === "student") window.location.href = "student.html";
  else if (user.role === "parent") window.location.href = "parent.html";
  else alert("Unknown role");
};
