/* ==========================================================
   ADMIN NOTIFICATIONS MODULE
   This file handles:
   - Loading users by role
   - Sending announcements
   - Sending role-based notifications
   - Sending individual notifications
   ========================================================== */

import { auth, db } from "./firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ==========================================================
   ELEMENT REFERENCES
   ========================================================== */

const sendBtn = document.getElementById("sendNotificationBtn");
const typeSelect = document.getElementById("notificationType");
const roleSelect = document.getElementById("recipientRole");
const userSelect = document.getElementById("recipientUser");

/* ==========================================================
   LOAD USERS BASED ON SELECTED ROLE
   This populates the dropdown for "individual" notifications
   ========================================================== */
async function loadUsersByRole(role) {

  // Reset dropdown
  userSelect.innerHTML = "<option value=''>Select User</option>";

  // If no role selected, stop
  if (!role) return;

  try {

    // Query users collection where role matches
    const q = query(collection(db, "users"), where("role", "==", role));
    const snapshot = await getDocs(q);

    snapshot.forEach(docSnap => {

      const user = docSnap.data();

      // Create dropdown option
      const option = document.createElement("option");

      // IMPORTANT: document ID must be the user's UID
      option.value = docSnap.id;

      // Visible name
      option.textContent = user.name;

      userSelect.appendChild(option);
    });

  } catch (error) {
    console.error("Error loading users:", error);
  }
}

/* Listen for role change */
roleSelect?.addEventListener("change", () => {
  loadUsersByRole(roleSelect.value);
});


/* ==========================================================
   SEND NOTIFICATION
   Handles:
   - Announcement
   - Role-based
   - Individual
   ========================================================== */
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

    /* ==========================
       ANNOUNCEMENT (Global)
       ========================== */
    if (type === "announcement") {

      await addDoc(collection(db, "announcements"), {
        title,
        message,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.uid
      });

    }

    /* ==========================
       ROLE-BASED NOTIFICATION
       Send to all users of a role
       ========================== */
    else if (type === "role") {

      if (!role) {
        alert("Select role");
        return;
      }

      const q = query(collection(db, "users"), where("role", "==", role));
      const snapshot = await getDocs(q);

      // IMPORTANT: Use Promise.all to properly wait for all writes
      const promises = snapshot.docs.map(docSnap => {

        return addDoc(collection(db, "notifications"), {
          senderId: auth.currentUser.uid,
          recipientId: docSnap.id,   // UID
          recipientRole: role,
          title,
          message,
          read: false,
          createdAt: serverTimestamp()
        });

      });

      // Wait for ALL notifications to finish writing
      await Promise.all(promises);
    }

    /* ==========================
       INDIVIDUAL NOTIFICATION
       ========================== */
    else if (type === "individual") {

      if (!userId) {
        alert("Select user");
        return;
      }

      await addDoc(collection(db, "notifications"), {
        senderId: auth.currentUser.uid,
        recipientId: userId,   // Selected UID from dropdown
        recipientRole: role,
        title,
        message,
        read: false,
        createdAt: serverTimestamp()
      });
    }

    alert("Message sent successfully ✔");

  } catch (error) {
    console.error("Error sending notification:", error);
    alert("Error sending notification.");
  }
});