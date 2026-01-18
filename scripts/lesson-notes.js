import { db } from "./firebase-config.js";
import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const lessonNotesContainer = document.getElementById("lessonNotes");

async function loadStudentLessonNotes() {
  try {
    const student = JSON.parse(localStorage.getItem("studentUser"));
    if (!student) return;

    const q = query(
      collection(db, "lessonContents"),
      where("classId", "==", student.classId),
      where("type", "==", "lesson_note")
    );

    const snapshot = await getDocs(q);

    lessonNotesContainer.innerHTML = "";

    snapshot.forEach(doc => {
      const note = doc.data();

      lessonNotesContainer.innerHTML += `
        <div class="lesson-card">
          <h3>${note.title}</h3>
          <p><strong>Subject:</strong> ${note.subject}</p>
          <p><strong>Term:</strong> ${note.term}</p>
          <a href="${note.contentUrl}" target="_blank">View Lesson Note</a>
        </div>
      `;
    });

  } catch (err) {
    console.error("Lesson note error:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadStudentLessonNotes);
