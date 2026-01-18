const user = requireStudent();
const students = JSON.parse(localStorage.getItem("students")) || [];
const student = students.find(s => s.id === user.id);

const transcriptDiv = document.getElementById("transcript");

student.reportCards.forEach(rc => {
  transcriptDiv.innerHTML += `
    <h4>${rc.term} – ${rc.session}</h4>
    <ul>
      ${rc.subjects.map(s => `
        <li>${s.name}: ${s.total}</li>
      `).join("")}
    </ul>
    <p>Average: ${rc.average} | Grade: ${rc.grade}</p>
  `;
});
