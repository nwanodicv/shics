/**
 * staff-dashboard.js
 * --------------------------------------------------
 * Handles staff-only dashboard functionality:
 * - Authentication (staff only)
 * - View personal attendance history
 * - Upload lesson notes
 * - Logout (without altering attendance)
 */

/* ==================================================
   AUTHENTICATION (STAFF ONLY)
================================================== */

// Get current logged-in user
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Block access if not staff
if (!currentUser || currentUser.role !== "staff") {
  alert("Access denied. Staff only.");
  window.location.href = "index.html";
}

/* ==================================================
   DATA
================================================== */

// Load staff list
const staffList = JSON.parse(localStorage.getItem("myStaff")) || [];

// Find logged-in staff record
const staff = staffList.find(s => s.id === currentUser.id);

// Handle expired session
//if (!staff) {
//  alert("Session expired. Please login again.");
//  localStorage.removeItem("currentUser");
//  window.location.href = "index.html";
//}

/* ==================================================
   STAFF INFO DISPLAY
================================================== */

document.querySelector("#staffInfo").innerHTML = `
  <h2>Welcome, ${staff.firstName} ${staff.lastName}</h2>
  <aside>
    <p><strong>Email:</strong> ${staff.email}</p>
    <p><strong>Subjects:</strong> ${staff.department}</p>
  </aside>
`;

/* ==================================================
   ATTENDANCE HISTORY (VIEW ONLY)
================================================== */

const attendanceBody = document.querySelector("#attendanceHistory");
const viewHistoryBtn = document.querySelector("#view-history-btn");

viewHistoryBtn.addEventListener("click", () => {
  attendanceBody.innerHTML = "";

  // If admin has not checked staff in yet
  if (!staff.attendance || staff.attendance.length === 0) {
    attendanceBody.innerHTML =
      `<tr><td colspan="3">No attendance record yet</td></tr>`;
    return;
  }

  // Render ONLY this staff's attendance
  staff.attendance.forEach(record => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${record.type}</td>
      <td>${record.date}</td>
      <td>${record.time}</td>
    `;
    attendanceBody.appendChild(row);
  });
});

/* ==================================================
   LESSON NOTE UPLOAD
================================================== */

const subjectSelect = document.querySelector("#lessonSubject");
const classSelect = document.querySelector("#lessonClass");

uploadBtn.addEventListener("click", () => {
  if (!fileInput.files.length) {
    alert("Please select a lesson file.");
    return;
  }

  if (!subjectSelect.value || !classSelect.value) {
    alert("Please select subject and class.");
    return;
  }

  const file = fileInput.files[0];

  staff.lessons.push({
    id: Date.now(),
    name: file.name,
    subject: subjectSelect.value,
    class: classSelect.value,
    uploadedAt: new Date().toLocaleString()
  });

  localStorage.setItem("myStaff", JSON.stringify(staffList));

  fileInput.value = "";
  renderLessons();
});


/**
 * Render uploaded lesson notes
 */
function renderLessons() {
  lessonList.innerHTML = "";

  if (!staff.lessons.length) {
    lessonList.innerHTML = "<li>No lessons uploaded</li>";
    return;
  }

  staff.lessons.forEach(lesson => {
    const li = document.createElement("li");
    li.textContent =
      `${staff.firstName} ${staff.lastName} → ${lesson.subject} (${lesson.class}) — ${lesson.name} [${lesson.uploadedAt}]`;
    lessonList.appendChild(li);
  });
}

renderLessons();

/* ==================================================
   LOGOUT (SESSION ONLY — NO ATTENDANCE)
================================================== */

const logoutBtn = document.querySelector("#logoutBtn");

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("currentUser");

  alert("You have logged out successfully.");
  window.location.href = "index.html";
});

/* ================== Notification Section ============== */
function loadMyNotifications(user) {
  const notifications = getNotifications();

  return notifications.filter(n =>
    n.role === "all" ||
    n.role === user.role &&
    (!n.userId || n.userId === user.id)
  );
}