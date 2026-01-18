/**
 * REPORTS & ANALYTICS MODULE
 * Computes attendance statistics for admin
 */

/**
 * REPORTS ARE ADMIN-ONLY
 */
requireRole("admin");


// Fetch staff list
const staffList = JSON.parse(localStorage.getItem("myStaff")) || [];

// DOM references
const totalStaffEl = document.getElementById("totalStaff");
const checkedInTodayEl = document.getElementById("checkedInToday");
const absentTodayEl = document.getElementById("absentToday");
const reportTable = document.getElementById("reportTable");

// Today's date
const today = new Date().toLocaleDateString();

/**
 * Calculate summary statistics
 */
function calculateSummary() {
  let checkedInToday = 0;

  staffList.forEach(staff => {
    const hasCheckedInToday = staff.attendance?.some(
      a => a.type === "Sign In" && a.date === today
    );

    if (hasCheckedInToday) checkedInToday++;
  });

  totalStaffEl.textContent = staffList.length;
  checkedInTodayEl.textContent = checkedInToday;
  absentTodayEl.textContent = staffList.length - checkedInToday;
}

/**
 * Render detailed attendance table
 */
function renderAttendanceReport() {
  reportTable.innerHTML = "";

  staffList.forEach(staff => {
    const attendanceCount = staff.attendance?.filter(
      a => a.type === "Sign In"
    ).length || 0;

    const lastAttendance =
      staff.attendance?.slice(-1)[0]?.date || "Never";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${staff.firstName} ${staff.lastName}</td>
      <td>${attendanceCount}</td>
      <td>${lastAttendance}</td>
    `;

    reportTable.appendChild(row);
  });
}

/**
 * Filter attendance by month
 */
function getMonthlyAttendance(month, year) {
  return staffList.map(staff => {
    const records = staff.attendance?.filter(a => {
      const d = new Date(a.date);
      return d.getMonth() === month && d.getFullYear() === year;
    }) || [];

    return {
      name: `${staff.firstName} ${staff.lastName}`,
      count: records.length
    };
  });
}


// Initialize reports
calculateSummary();
renderAttendanceReport();
