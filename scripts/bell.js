/**
 * BELL FUNCTIONALITY
 * Displays notifications for logged-in user
 */

const bellBtn = document.getElementById("bellBtn");
const notifDropdown = document.getElementById("notifDropdown");
const notifList = document.getElementById("notifList");
const notifCount = document.getElementById("notifCount");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

/**
 * Load notifications into bell dropdown
 */
function loadNotifications() {
  if (!currentUser) return;

  const notifications = getRoleNotifications(currentUser.role);
  const unread = notifications.filter(n => !n.read);

  notifCount.textContent = unread.length;
  notifCount.style.display = unread.length ? "inline" : "none";

  notifList.innerHTML = "";

  notifications.forEach(n => {
    const li = document.createElement("li");
    li.className = n.read ? "" : "unread";

    li.innerHTML = `
      <strong>${n.title}</strong>
      <p>${n.message}</p>
      <small>${n.date}</small>
    `;

    li.onclick = () => {
      markAsRead(n.id);
      loadNotifications();
    };

    notifList.appendChild(li);
  });
}

/**
 * Toggle dropdown
 */
bellBtn.addEventListener("click", () => {
  notifDropdown.classList.toggle("hidden");
  loadNotifications();
});
