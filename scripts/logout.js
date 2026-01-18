/**
 * Logout handler
 */
document.addEventListener("click", e => {
  if (e.target.id === "logoutLink") {
    localStorage.removeItem("currentUser");
    alert("Logged out successfully");
    window.location.href = "index.html";
  }
});

/**
 * LOGOUT FUNCTION
 */
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}
