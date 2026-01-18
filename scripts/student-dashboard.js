/**
 * student-dashboard.js
 * --------------------------------------------------
 * Student dashboard:
 * - Auth guard (student only)
 * - View biodata
 * - View attendance
 * - View results
 * - View lesson notes (filtered by subject)
 * - Logout
 * --------------------------------------------------
 */

document.addEventListener("DOMContentLoaded", () => {

  /* ==================================================
     AUTH (STUDENT ONLY)
  ================================================== */
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser || currentUser.role !== "student") {
    alert("Students only");
    window.location.href = "index.html";
    return;
  }

  /* ==================================================
     LOAD STORAGE
  ================================================== */
  const students = JSON.parse(localStorage.getItem("students")) || [];
  const staffList = JSON.parse(localStorage.getItem("myStaff")) || [];

  /* ==================================================
     FIND LOGGED-IN STUDENT
  ================================================== */
  const student = students.find(s => s.id === currentUser.id);

  if (!student) {
    alert("Student record not found");
    return;
  }

  /* ===============================
   PROFILE DISPLAY
  =============================== */
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const profileId = document.getElementById("profileId");
  const profileImage = document.getElementById("profileImage");
  const photoUpload = document.getElementById("photoUpload");
  
  profileName.textContent = student.name || "—";
  profileEmail.textContent = student.email || "—";
  profileId.textContent = student.id || "—";
  
  if (student.photo) {
    profileImage.src = student.photo;
  }
  
  /* ===============================
     PHOTO UPLOAD HANDLER
  =============================== */
  photoUpload.addEventListener("change", () => {
    const file = photoUpload.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = () => {
      student.photo = reader.result;
  
      // Save update
      localStorage.setItem("students", JSON.stringify(students));
  
      profileImage.src = reader.result;
    };
  
    reader.readAsDataURL(file);
  });
  

  /* ==================================================
     WELCOME / PROFILE
  ================================================== */
  const welcomeEl = document.getElementById("studentWelcome");
  if (welcomeEl) {
    welcomeEl.textContent = `Welcome, ${student.name}`;
  }

  /* ==================================================
     ATTENDANCE
  ================================================== */
  const attendanceList = document.getElementById("attendanceList");

  if (attendanceList) {
    attendanceList.innerHTML = "";

    if (!student.attendance || student.attendance.length === 0) {
      attendanceList.innerHTML = "<li>No attendance records yet.</li>";
    } else {
      student.attendance.forEach(a => {
        const li = document.createElement("li");
        li.textContent = `${a.date} — ${a.status}`;
        attendanceList.appendChild(li);
      });
    }
  }

  /* ==================================================
     RESULTS
  ================================================== */
  const resultList = document.getElementById("resultList");

  if (resultList) {
    resultList.innerHTML = "";

    if (!student.results || student.results.length === 0) {
      resultList.innerHTML = "<li>No results published yet.</li>";
    } else {
      student.results.forEach(r => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${r.subject}</strong> — ${r.score}<br>
          <small>${r.term} | ${r.date}</small>
        `;
        resultList.appendChild(li);
      });
    }
  }

  /* ==================================================
     LESSON NOTES (FILTERED BY SUBJECT)
  ================================================== */
  const lessonList = document.getElementById("lessonNotes");

  if (lessonList) {
    lessonList.innerHTML = "";

    // Collect all lessons
    let lessons = [];
    staffList.forEach(staff => {
      staff.lessons?.forEach(lesson => {
        lessons.push({
          ...lesson,
          staffName: `${staff.firstName} ${staff.lastName}`
        });
      });
    });

    // Filter by student subjects (if defined)
    if (Array.isArray(student.subjects) && student.subjects.length > 0) {
      lessons = lessons.filter(l =>
        student.subjects.includes(l.subject)
      );
    }

    if (lessons.length === 0) {
      lessonList.innerHTML = "<li>No lesson notes available.</li>";
    } else {
      lessons.forEach(l => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${l.subject}</strong> (${l.class})<br>
          ${l.name}<br>
          <small>Uploaded by ${l.staffName} — ${l.uploadedAt}</small>
        `;
        lessonList.appendChild(li);
      });
    }
  }

    /* ==================================================
     STUDENT PROFILE (BIODATA)
  ================================================== */
  document.getElementById("profileName").textContent =
    student.name || "—";

  document.getElementById("profileId").textContent =
    student.id || "—";

  document.getElementById("profileClass").textContent =
    student.class || "—";

  document.getElementById("profileGender").textContent =
    student.gender || "—";

  document.getElementById("profileDob").textContent =
    student.dob || "—";

  document.getElementById("profileSubjects").textContent =
    Array.isArray(student.subjects)
      ? student.subjects.join(", ")
      : "—";


  /* ==================================================
     LOGOUT
  ================================================== */
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  });

});
