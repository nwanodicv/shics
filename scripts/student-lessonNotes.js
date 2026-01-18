/* ================= FIREBASE IMPORTS ================= */

// Import database instance
import { db } from "./firebase-config.js";

// Import Firestore helpers
import {
  collection,
  query,
  where,
  getDocs,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* ================= DOM ELEMENT ================= */

// Container where lesson notes will be displayed
const lessonNotesContainer = document.getElementById("lessonNotesContainer");

/* ================= FETCH STUDENT INFO ================= */

// Get logged-in student data from localStorage
// (This should have been saved during login)
const studentData = JSON.parse(localStorage.getItem("studentUser"));

/* ================= LOAD LESSON NOTES ================= */

async function loadLessonNotes() {
  try {
    // Clear container to avoid duplication
    lessonNotesContainer.innerHTML = "";

    // Safety check
    if (!studentData) {
      lessonNotesContainer.innerHTML = "<p>Please log in again.</p>";
      return;
    }

    /* 
      Query Firestore:
      - Only lesson notes
      - Matching student's class
      - Ordered by upload date
    */
    const q = query(
      collection(db, "lessonContents"),
      where("type", "==", "lesson_note"),
      where("classId", "==", studentData.classId),
      orderBy("createdAt", "desc")
    );

    // Fetch documents
    const snapshot = await getDocs(q);

    // If no lesson notes exist
    if (snapshot.empty) {
      lessonNotesContainer.innerHTML = "<p>No lesson notes available.</p>";
      return;
    }

    // Loop through each lesson note
    snapshot.forEach(doc => {
      const note = doc.data();

      // Create lesson card
      const card = document.createElement("div");
      card.className = "lesson-card";

      // Populate card UI
      card.innerHTML = `
        <h3>${note.title}</h3>
        <p><strong>Subject:</strong> ${note.subject}</p>
        <p><strong>Term:</strong> ${note.term}</p>
        <p><strong>Teacher:</strong> ${note.uploaderName}</p>
        <a href="${note.contentUrl}" target="_blank">View Lesson Note</a>
      `;

      // Add card to UI
      lessonNotesContainer.appendChild(card);
    });

  } catch (error) {
    // Error handling
    console.error("Error loading lesson notes:", error);
    lessonNotesContainer.innerHTML = "<p>Error loading lesson notes.</p>";
  }
}

/* ================= INITIAL LOAD ================= */

// Load lesson notes when page opens
loadLessonNotes();
