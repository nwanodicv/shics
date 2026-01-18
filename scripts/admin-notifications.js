requireRole(["admin"]);

const form = document.getElementById("notifyForm");

form.addEventListener("submit", e => {
  e.preventDefault();

  const title = document.getElementById("notifTitle").value.trim();
  const message = document.getElementById("notifMessage").value.trim();
  const role = document.getElementById("notifRole").value;

  if (!title || !message || !role) {
    alert("All fields are required");
    return;
  }

  createNotification({ title, message, role });

  alert("Notification sent successfully ✔");
  form.reset();
});
