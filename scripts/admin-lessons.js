import { onSnapshot, collection, query, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const lessonPlansList = document.getElementById("lessonPlansList");
const lessonNotesList = document.getElementById("lessonNotesList");

function loadAdminLessonsRealtime() {
  const q = query(collection(db, "lessonContents"));

  onSnapshot(q, (snapshot) => {
    lessonPlansList.innerHTML = "";
    lessonNotesList.innerHTML = "";

    if (snapshot.empty) {
      lessonPlansList.innerHTML = "<p>No lessons available.</p>";
      return;
    }

    snapshot.forEach(docSnap => {
      const d = docSnap.data();

      const html = `
        <div class="lesson-card">
          <h3>${d.title}</h3>
          <p>${d.subject} — ${d.classId}</p>
          <p>Term: ${d.term}</p>
          <a href="${d.contentUrl}" target="_blank">View</a>
        </div>
      `;

      if (d.type === "lesson_plan") {
        lessonPlansList.innerHTML += html;
      } else {
        lessonNotesList.innerHTML += html;
      }
    });
  });
}

loadAdminLessonsRealtime();