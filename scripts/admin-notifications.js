import { auth, db } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const sendBtn = document.getElementById("sendNotificationBtn");
const typeSelect = document.getElementById("notificationType");
const roleSelect = document.getElementById("recipientRole");
const userSelect = document.getElementById("recipientUser");

/* ============================
   LOAD USERS FOR INDIVIDUAL
============================ */
async function loadUsersByRole(role) {

  userSelect.innerHTML = "<option value=''>Select User</option>";

  if (!role) return;

  const q = query(collection(db, "users"), where("role", "==", role));
  const snapshot = await getDocs(q);

  snapshot.forEach(docSnap => {
    const user = docSnap.data();
    const option = document.createElement("option");
    option.value = docSnap.id;
    option.textContent = user.name;
    userSelect.appendChild(option);
  });
}

roleSelect?.addEventListener("change", () => {
  loadUsersByRole(roleSelect.value);
});


/* ============================
   SEND NOTIFICATION
============================ */
sendBtn?.addEventListener("click", async () => {

  const type = typeSelect.value;
  const role = roleSelect.value;
  const userId = userSelect.value;
  const title = document.getElementById("notificationTitle").value.trim();
  const message = document.getElementById("notificationMessage").value.trim();

  if (!title || !message) {
    alert("Title and message required.");
    return;
  }

  try {

    if (type === "announcement") {

      await addDoc(collection(db, "announcements"), {
        title,
        message,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.uid
      });

    } else if (type === "role") {

      if (!role) return alert("Select role");

      const q = query(collection(db, "users"), where("role", "==", role));
      const snapshot = await getDocs(q);

      snapshot.forEach(async (docSnap) => {
        await addDoc(collection(db, "notifications"), {
          senderId: auth.currentUser.uid,
          recipientId: docSnap.id,
          recipientRole: role,
          title,
          message,
          read: false,
          createdAt: serverTimestamp()
        });
      });

    } else if (type === "individual") {

      if (!userId) return alert("Select user");

      await addDoc(collection(db, "notifications"), {
        senderId: auth.currentUser.uid,
        recipientId: userId,
        recipientRole: role,
        title,
        message,
        read: false,
        createdAt: serverTimestamp()
      });
    }

    alert("Message sent successfully ✔");

  } catch (error) {
    console.error(error);
    alert("Error sending notification.");
  }
});