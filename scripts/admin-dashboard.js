/**
 * admin-dashboard.js
 * --------------------------------------------------
 * Handles all admin operations:
 * - Authentication (Admin only)
 * - Staff management & attendance
 * - Student & parent visibility
 * - Result & attendance controls
 * --------------------------------------------------
 */

document.addEventListener("DOMContentLoaded", () => {

  /* ==================================================
     AUTH (ADMIN ONLY)
  ================================================== */
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "admin") {
    alert("Admins only");
    window.location.href = "index.html";
    return;
  }

  /* ==================================================
     LOAD STORAGE (SINGLE SOURCE OF TRUTH)
  ================================================== */
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const parents = JSON.parse(localStorage.getItem("parents")) || [];
  const students = JSON.parse(localStorage.getItem("students")) || [];
  let staffList = JSON.parse(localStorage.getItem("myStaff")) || [];

  /* ==================================================
     STAFF SYNC (USERS → myStaff) — SAFE
  ================================================== */
  users
    .filter(u => u.role === "staff")
    .forEach(u => {
      if (!staffList.some(s => s.id === u.id)) {
        staffList.push({
          id: u.id,
          firstName: u.firstName || u.email.split("@")[0],
          lastName: u.lastName || "",
          email: u.email,
          attendance: [],
          lessons: []
        });
      }
    });

  localStorage.setItem("myStaff", JSON.stringify(staffList));

  /* ==================================================
     ELEMENT REFERENCES
  ================================================== */
  const staffSelect = document.getElementById("staffSelect");
  const attendanceBody = document.getElementById("attendanceHistory");
  const attendanceDateInput = document.getElementById("attendanceDate");
  const checkInBtn = document.getElementById("checkInBtn");
  const checkOutBtn = document.getElementById("checkOutBtn");
  const adminLessonList = document.getElementById("adminLessonList");
  const parentSelect = document.getElementById("parentSelect");
  const studentSelect = document.getElementById("resultStudentSelect");
  const attendanceStudentSelect = document.getElementById("attendanceStudentSelect");
  const studentList = document.getElementById("studentList");

  let selectedStaffId = null;

  /* ==================================================
     UTILITIES
  ================================================== */
  const todayISO = () => new Date().toISOString().split("T")[0];

  const saveStaff = () =>
    localStorage.setItem("myStaff", JSON.stringify(staffList));

  const clearAttendanceTable = (msg = "No attendance records") => {
    attendanceBody.innerHTML = `<tr><td colspan="3">${msg}</td></tr>`;
  };

  /* ==================================================
     STAFF DROPDOWN
  ================================================== */
  function populateStaffDropdown() {
    staffSelect.innerHTML = `<option value="">Select Staff</option>`;

    staffList.forEach(s => {
      const option = document.createElement("option");
      option.value = s.id;
      option.textContent = `${s.firstName} ${s.lastName}`;
      staffSelect.appendChild(option);
    });

    clearAttendanceTable();
    checkInBtn.disabled = true;
    checkOutBtn.disabled = true;
  }

  populateStaffDropdown();

  /* ==================================================
     ATTENDANCE RENDER
  ================================================== */
  function renderAttendance(staff) {
    attendanceBody.innerHTML = "";

    if (!staff || !staff.attendance || staff.attendance.length === 0) {
      clearAttendanceTable();
      return;
    }

    const date = attendanceDateInput.value;
    const records = date
      ? staff.attendance.filter(a => a.date === date)
      : staff.attendance;

    if (!records.length) {
      clearAttendanceTable("No attendance for selected date");
      return;
    }

    records.forEach(r => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.type}</td>
        <td>${r.date}</td>
        <td>${r.time}</td>
      `;
      attendanceBody.appendChild(tr);
    });
  }

  /* ==================================================
     STAFF SELECTION
  ================================================== */
  staffSelect.addEventListener("change", e => {
    selectedStaffId = Number(e.target.value);
    const staff = staffList.find(s => s.id === selectedStaffId);

    checkInBtn.disabled = !staff;
    checkOutBtn.disabled = !staff;

    renderAttendance(staff);
  });

  /* ==================================================
     CHECK-IN / CHECK-OUT
  ================================================== */
  checkInBtn.addEventListener("click", () => {
    const staff = staffList.find(s => s.id === selectedStaffId);
    if (!staff) return;

    if (staff.attendance.some(a => a.type === "Sign In" && a.date === todayISO())) {
      return alert("Already checked in today");
    }

    staff.attendance.push({
      type: "Sign In",
      date: todayISO(),
      time: new Date().toLocaleTimeString()
    });

    saveStaff();
    renderAttendance(staff);
  });

  checkOutBtn.addEventListener("click", () => {
    const staff = staffList.find(s => s.id === selectedStaffId);
    if (!staff) return;

    staff.attendance.push({
      type: "Logout",
      date: todayISO(),
      time: new Date().toLocaleTimeString()
    });

    saveStaff();
    renderAttendance(staff);
  });

  attendanceDateInput.addEventListener("change", () => {
    const staff = staffList.find(s => s.id === selectedStaffId);
    renderAttendance(staff);
  });

  /* ==================================================
     ADMIN VIEW — STUDENTS & PARENTS (FIXED)
  ================================================== */
  function loadParents() {
    if (!parentSelect) return;

    parentSelect.innerHTML = `<option value="">Assign Parent</option>`;
    parents.forEach(parent => {
      const option = document.createElement("option");
      option.value = parent.id;
      option.textContent = parent.name || "Unnamed Parent";
      parentSelect.appendChild(option);
    });
  }

  function loadStudents() {
    if (studentList) studentList.innerHTML = "";

    if (studentSelect)
      studentSelect.innerHTML = `<option value="">Select Student</option>`;

    if (attendanceStudentSelect)
      attendanceStudentSelect.innerHTML = `<option value="">Select Student</option>`;

    students.forEach(student => {
      const studentName = student.name || "Unnamed Student";

      if (studentList) {
        const li = document.createElement("li");
        li.textContent = studentName;
        studentList.appendChild(li);
      }

      [studentSelect, attendanceStudentSelect].forEach(select => {
        if (!select) return;
        const option = document.createElement("option");
        option.value = student.id;
        option.textContent = studentName;
        select.appendChild(option);
      });
    });
  }

  loadParents();
  loadStudents();

    /* ==================================================
     PARENT ↔ STUDENT LINKING (FIXED & WORKING)
  ================================================== */

  const linkParentSelect = document.getElementById("linkParentSelect");
  const studentLinkSelect = document.getElementById("studentLinkSelect");
  const linkParentBtn = document.getElementById("linkParentBtn");
  const publishResultBtn = document.getElementById("publishResultBtn");
  const resultSubject = document.getElementById("resultSubject");
  const resultScore = document.getElementById("resultScore");
  const resultTerm = document.getElementById("resultTerm");


  /* Populate parent dropdown (linking) */
  function loadParentsForLinking() {
    if (!linkParentSelect) return;

    linkParentSelect.innerHTML = `<option value="">Select Parent</option>`;
    parents.forEach(parent => {
      const option = document.createElement("option");
      option.value = parent.id;
      option.textContent = parent.name || "Unnamed Parent";
      linkParentSelect.appendChild(option);
    });
  }

  /* Populate student dropdown (linking) */
  function loadStudentsForLinking() {
    if (!studentLinkSelect) return;

    studentLinkSelect.innerHTML = `<option value="">Select Student</option>`;
    students.forEach(student => {
      const option = document.createElement("option");
      option.value = student.id;
      option.textContent = student.name || "Unnamed Student";
      studentLinkSelect.appendChild(option);
    });
  }

  loadParentsForLinking();
  loadStudentsForLinking();

  /* Link parent to student */
  linkParentBtn.addEventListener("click", () => {
    const parentId = Number(linkParentSelect.value);
    const studentId = Number(studentLinkSelect.value);
  
    if (!parentId || !studentId) {
      alert("Please select both parent and student");
      return;
    }
  
    const parent = parents.find(p => p.id === parentId);
    const student = students.find(s => s.id === studentId);
  
    if (!parent || !student) {
      alert("Parent or Student not found");
      return;
    }
  
    // --- Ensure arrays exist ---
    parent.children = parent.children || [];
    student.parentIds = student.parentIds || [];
  
    // --- Link both sides ---
    if (!parent.children.includes(studentId)) {
      parent.children.push(studentId);
    }
  
    if (!student.parentIds.includes(parentId)) {
      student.parentIds.push(parentId);
    }
  
    localStorage.setItem("parents", JSON.stringify(parents));
    localStorage.setItem("students", JSON.stringify(students));
  
    alert("Parent successfully linked to student ✔");
  });

  // /* ==================================================
  //    RESULT PUBLICATION (WITH NOTIFICATIONS)
  // ================================================== */
  publishResultBtn.addEventListener("click", () => {
    const studentId = Number(studentSelect.value);
    const subject = resultSubject.value.trim();
    const score = resultScore.value.trim();
    const term = resultTerm.value;
  
    if (!studentId || !subject || !score || !term) {
      alert("All fields are required");
      return;
    }
  
    const student = students.find(s => s.id === studentId);
    if (!student) {
      alert("Student not found");
      return;
    }
  
    student.results = student.results || [];
  
    const result = {
      subject,
      score,
      term,
      date: new Date().toLocaleDateString()
    };
  
    student.results.push(result);
    localStorage.setItem("students", JSON.stringify(students));
  
    notifyResultPublished(student, result);
  
    alert("Result published successfully ✔");
  
    resultSubject.value = "";
    resultScore.value = "";
    resultTerm.value = "";
  });




  /* ==================================================
     ADMIN VIEW — LESSON NOTES
  ================================================== */
  function renderLessonsForAdmin() {
    adminLessonList.innerHTML = "";

    staffList.forEach(staff => {
      staff.lessons?.forEach(lesson => {
        const li = document.createElement("li");
        li.textContent =
          `${staff.firstName} ${staff.lastName} → ${lesson.name} (${lesson.uploadedAt})`;
        adminLessonList.appendChild(li);
      });
    });

    if (!adminLessonList.children.length) {
      adminLessonList.innerHTML = "<li>No lesson uploaded</li>";
    }
  }

  function notifyResultPublished(student, result) {
    // Notify student
    createNotification({
      title: "New Result Published",
      message: `${result.subject} (${result.term}) has been published.`,
      role: "student"
    });
  
    // Notify parents
    const parents = JSON.parse(localStorage.getItem("parents")) || [];
  
    parents
      .filter(p => p.children?.includes(student.id))
      .forEach(parent => {
        createNotification({
          title: "Child Result Published",
          message: `${student.name}'s ${result.subject} result is now available.`,
          role: "parent"
        });
      });
  }


  const markAttendanceBtn = document.getElementById("markAttendanceBtn");

  // /* ==================================================
  //    STUDENT ATTENDANCE MARKING
  // ================================================== */
  markAttendanceBtn.addEventListener("click", () => {
    const studentId = Number(attendanceStudentSelect.value);
    const status = document.getElementById("attendanceStatus").value;
  
    if (!studentId) {
      alert("Please select a student");
      return;
    }
  
    const student = students.find(s => s.id === studentId);
    if (!student) {
      alert("Student not found");
      return;
    }
  
    student.attendance = student.attendance || [];
  
    student.attendance.push({
      date: todayISO(),
      status
    });
  
    localStorage.setItem("students", JSON.stringify(students));
    alert("Attendance recorded ✔");
  });
  


  renderLessonsForAdmin();

});