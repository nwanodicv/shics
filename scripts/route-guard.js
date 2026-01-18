/**
 * ROUTE GUARD
 * Prevents users from accessing unauthorized pages
 */

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

/**
 * Redirect if user is not logged in
 */
if (!currentUser) {
  alert("Please login first");
  window.location.href = "index.html";
}

/**
 * Check page permission
 */
const currentPage = window.location.pathname.split("/").pop();
const role = currentUser?.role;
const permissions = ROLE_PERMISSIONS[role];

if (!permissions || !permissions.pages.includes(currentPage)) {
  alert("You do not have permission to access this page.");
  window.location.href = "index.html";
}
