const user = JSON.parse(localStorage.getItem("currentUser"));
if (!user) return;

const bell = document.getElementById("notificationBell");
const badge = document.getElementById("notificationCount");
const box = document.querySelector(".notifications-section");

const unread = getNotificationsForUser(user)
  .filter(n => !n.readBy.includes(user.id)).length;

badge.textContent = unread;
badge.style.display = unread > 0 ? "inline-block" : "none";

bell.addEventListener("click", () => {
  box.classList.toggle("show");
});
