/**
 * auth.js
 * -----------------------------
 * Handles authentication and role-based access control (RBAC)
 */

/**
 * Get the currently logged-in user
 * @returns {Object|null}
 */
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

/**
 * Enforce access based on allowed roles
 * @param {Array} allowedRoles
 */
function requireRole(allowedRoles = []) {
  const user = getCurrentUser();

  if (!user) {
    alert("Please log in to continue.");
    window.location.href = "index.html";
    return null;
  }

  if (!allowedRoles.includes(user.role)) {
    alert("Access denied.");
    window.location.href = "index.html";
    return null;
  }

  return user;
}

/**
 * Shortcut specifically for student-only pages
 */
function requireStudent() {
  return requireRole(["student"]);
}
