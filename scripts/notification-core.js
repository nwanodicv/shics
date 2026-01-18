/**
 * notifications-core.js
 * ==========================
 * SINGLE source of truth for notifications
 */

// ---------- STORAGE ----------
function getNotifications() {
  return JSON.parse(localStorage.getItem("notifications")) || [];
}

function saveNotifications(notifications) {
  localStorage.setItem("notifications", JSON.stringify(notifications));
}

// ---------- CREATE ----------
function createNotification({ title, message, role }) {
  const notifications = getNotifications();

  notifications.unshift({
    id: crypto.randomUUID(),
    title,
    message,
    role,
    readBy: [],
    date: new Date().toLocaleString()
  });

  saveNotifications(notifications);
}

// ---------- FETCH ----------
function getNotificationsForUser(user) {
  return getNotifications().filter(n =>
    n.role === "all" || n.role === user.role
  );
}

// ---------- READ ----------
function markNotificationRead(notificationId, userId) {
  const notifications = getNotifications();

  notifications.forEach(n => {
    if (n.id === notificationId && !n.readBy.includes(userId)) {
      n.readBy.push(userId);
    }
  });

  saveNotifications(notifications);
}
