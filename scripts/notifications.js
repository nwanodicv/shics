// scripts/notifications.js
/**
 * notifications.js
 * ==========================
 * Renders notifications for the logged-in user
 */

const user = JSON.parse(localStorage.getItem("currentUser"));
if (!user) return;

const container = document.getElementById("notifications");
if (!container) return;

const myNotifications = getNotificationsForUser(user);

if (myNotifications.length === 0) {
  container.innerHTML = "<p>No notifications</p>";
}

myNotifications.forEach(n => {
  const div = document.createElement("div");
  div.className = "notification";

  const isRead = n.readBy.includes(user.id);

  div.innerHTML = `
    <h4>${n.title}</h4>
    <p>${n.message}</p>
    <small>${n.date}</small>
    <strong>${isRead ? "Read" : "New"}</strong>
  `;

  div.addEventListener("click", () => {
    if (!isRead) {
      markNotificationRead(n.id, user.id);
      div.querySelector("strong").textContent = "Read";
    }
  });

  container.appendChild(div);
});
