/**
 * parent-results.js
 * -----------------------------------
 * Allows parent to view child's results only
 */

requireRole(["parent"]);

const user = JSON.parse(localStorage.getItem("currentUser"));
const parents = JSON.parse(localStorage.getItem("parents")) || [];
const exams = JSON.parse(localStorage.getItem("exams")) || [];
const results = JSON.parse(localStorage.getItem("results")) || [];

const parent = parents.find(p => p.id === user.id);
const childResults = results.filter(r => r.studentId === parent.studentId);

const list = document.getElementById("childResults");

if (childResults.length === 0) {
  list.innerHTML = "<p>No results available.</p>";
} else {
  childResults.forEach(r => {
    const exam = exams.find(e => e.id === r.examId);

    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${exam.subject}</strong><br>
      Score: ${r.score}<br>
      Grade: ${r.grade}<br>
      Remark: ${r.remark}
      <hr>
    `;
    list.appendChild(div);
  });
}

requireRole(["parent"]);

//const parent = JSON.parse(localStorage.getItem("loggedInUser"));
const students = JSON.parse(localStorage.getItem("students")) || [];
const child = students.find(s => s.parentId === parent.id);

const select = document.getElementById("childTermSelect");
const display = document.getElementById("childReportDisplay");

(child?.reportCards || []).forEach((rc, i) => {
  const opt = document.createElement("option");
  opt.value = i;
  opt.textContent = `${rc.term} (${rc.session})`;
  select.appendChild(opt);
});

select.addEventListener("change", () => {
  const rc = child.reportCards[select.value];
  display.innerHTML = `
    <h4>${child.name}</h4>
    <p>${rc.term} – ${rc.session}</p>
    <p>Average: ${rc.average}</p>
    <p>Grade: ${rc.grade}</p>
    <p>Remarks: ${rc.remarks}</p>
  `;
});

// Print Logic
document.getElementById("printReportBtn").addEventListener("click", () => {
  window.print();
});

