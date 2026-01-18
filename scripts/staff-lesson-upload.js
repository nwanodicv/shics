import { db, storage } from "./firebase-config.js";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const form = document.getElementById("lessonUploadForm");
const uploadsDiv = document.getElementById("myUploads");

const staff = JSON.parse(localStorage.getItem("currentUser"));

/* ================= UPLOAD ================= */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const file = document.getElementById("file").files[0];

    const fileRef = ref(
      storage,
      `lessonContents/${staff.id}/${Date.now()}_${file.name}`
    );

    await uploadBytes(fileRef, file);
    const fileUrl = await getDownloadURL(fileRef);

    await addDoc(collection(db, "lessonContents"), {
      title: title.value,
      subject: subject.value,
      classId: classId.value,
      term: term.value,
      type: type.value,
      contentUrl: fileUrl,
      uploadedBy: staff.id,
      uploaderName: staff.name || "Staff",
      createdAt: serverTimestamp()
    });

    alert("Upload successful!");
    form.reset();
    loadMyUploads();

  } catch (err) {
    console.error(err);
    alert("Upload failed");
  }
});
/* ================= MY UPLOADS ================= */
async function loadMyUploads() {
  uploadsDiv.innerHTML = "";

  const q = query(
    collection(db, "lessonContents"),
    where("uploadedBy", "==", staff.id)
  );

  const snapshot = await getDocs(q);

  snapshot.forEach(doc => {
    const d = doc.data();

    uploadsDiv.innerHTML += `
      <div class="upload-card">
        <h4>${d.title}</h4>
        <p>${d.subject} — ${d.classId}</p>
        <p>Type: ${d.type}</p>
        <a href="${d.contentUrl}" target="_blank">View</a>
      </div>
    `;
  });
}

loadMyUploads();