import { db, storage } from "./firebase.js";
import {
  collection,
  addDoc,
  query,
  where,
  serverTimestamp,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* ================= ELEMENTS ================= */
const form = document.getElementById("lessonUploadForm");
const uploadsDiv = document.getElementById("myUploads");

const fileInput = document.getElementById("fileUpload");
const titleInput = document.getElementById("title");
const subjectInput = document.getElementById("subject");
const classSelect = document.getElementById("classId");
const termSelect = document.getElementById("term");
const typeSelect = document.getElementById("type");

/* ================= AUTH ================= */
const auth = getAuth();
let currentUser = null;

/* ================= INIT ================= */
onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  currentUser = user;

  // Load uploads correctly
  loadMyUploadsRealtime(user);
});

/* ================= UPLOAD ================= */
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      if (!currentUser) throw new Error("User not authenticated");

      if (!fileInput || fileInput.files.length === 0) {
        throw new Error("No file selected");
      }

      const file = fileInput.files[0];

      const fileRef = ref(
        storage,
        `lessonContents/${currentUser.uid}/${Date.now()}_${file.name}`
      );

      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);

      await addDoc(collection(db, "lessonContents"), {
        title: titleInput?.value || "Untitled",
        subject: subjectInput?.value || "",
        classId: classSelect?.value || "",
        term: termSelect?.value || "",
        type: typeSelect?.value || "lesson_note",
        contentUrl: fileUrl,
        uploadedBy: currentUser.uid,
        uploaderName: currentUser.displayName || "Staff",
        createdAt: serverTimestamp()
      });

      alert("Upload successful!");
      form.reset();

    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      alert(err.message || "Upload failed");
    }
  });
}

/* ================= REAL-TIME UPLOADS ================= */
function loadMyUploadsRealtime(user) {
  if (!uploadsDiv) return;

  const q = query(
    collection(db, "lessonContents"),
    where("uploadedBy", "==", user.uid)
  );

  onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      uploadsDiv.innerHTML = "<p>No uploads yet.</p>";
      return;
    }

    uploadsDiv.innerHTML = "";

    snapshot.forEach(docSnap => {
      const d = docSnap.data();

      uploadsDiv.innerHTML += `
        <div class="upload-card">
          <h4>${d.title}</h4>
          <p>${d.subject} — ${d.classId}</p>
          <p>Type: ${d.type}</p>
          <p>Term: ${d.term || "-"}</p>
          <a href="${d.contentUrl}" target="_blank">View</a>
        </div>
      `;
    });
  });
}