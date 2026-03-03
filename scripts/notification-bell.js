// notification-bell.js
/**
 * Notification Bell Logic
 * - Displays unread notification count
 * - Toggles notification dropdown
 * - Fetches notifications for the logged-in user
 */
document.addEventListener("DOMContentLoaded", () => {
  // Get current user from localStorage (set during login)
  const badge = document.getElementById("notificationCount");
  const box = document.querySelector(".notifications-section");
  const bell = document.getElementById("notificationBell");
  if (!bell) return;

  const user = JSON.parse(localStorage.getItem("currentUser"));
  
  
  const unread = getNotificationsForUser(user)
    .filter(n => !n.readBy.includes(user.id)).length;
  
  badge.textContent = unread;
  badge.style.display = unread > 0 ? "inline-block" : "none";
  
  bell.addEventListener("click", () => {
    box.classList.toggle("show");
  });
  
});