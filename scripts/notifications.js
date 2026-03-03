/**
 * notifications.js
 * --------------------------------------------------
 * Handles:
 *  - Loading global announcements
 *  - Loading user-specific notifications
 *  - Real-time updates (Firestore onSnapshot)
 *  - Mark as Read functionality
 * --------------------------------------------------
 */

import { auth, db } from "./firebase.js";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


/* ==================================================
   AUTH STATE LISTENER
   --------------------------------------------------
   When user logs in:
   - Load announcements (if section exists)
   - Load user notifications
================================================== */
onAuthStateChanged(auth, (user) => {

  // If no user logged in, stop safely
  if (!user) return;

  // Load global announcements
  loadAnnouncements();

  // Load notifications specific to logged-in user
  loadUserNotifications(user.uid);
});


/* ==================================================
   LOAD ANNOUNCEMENTS (Optional Section)
   --------------------------------------------------
   Will only run if #announcementList exists in HTML
================================================== */
function loadAnnouncements() {

  const container = document.getElementById("announcementList");

  // Stop safely if announcement section not present
  if (!container) return;

  const q = query(
    collection(db, "announcements"),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, (snapshot) => {

    // Clear previous announcements
    container.innerHTML = "";

    snapshot.forEach(docSnap => {

      const data = docSnap.data();

      // Create announcement card
      const div = document.createElement("div");
      div.classList.add("notification-card");

      div.innerHTML = `
        <h4>${data.title}</h4>
        <p>${data.message}</p>
      `;

      container.appendChild(div);
    });

  }, (error) => {
    console.error("Error loading announcements:", error);
  });
}


/* ==================================================
   LOAD USER NOTIFICATIONS
   --------------------------------------------------
   - Matches parent.html container (#notifications)
   - Real-time updates
   - Mark as read feature
   - Safe error handling
================================================== */
function loadUserNotifications(uid) {

  // Get notification container from parent.html
  const container = document.getElementById("notifications");

  // Stop safely if container not found
  if (!container) {
    console.warn("Notifications container not found in this page.");
    return;
  }

  const q = query(
    collection(db, "notifications"),
    where("recipientId", "==", uid),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, (snapshot) => {

    // Clear old notifications before rendering new ones
    container.innerHTML = "";

    // If no notifications exist
    if (snapshot.empty) {
      container.innerHTML = "<p>No notifications yet.</p>";
      return;
    }

    snapshot.forEach(docSnap => {

      const data = docSnap.data();

      // Create notification card
      const div = document.createElement("div");
      div.classList.add("notification-card");

      div.innerHTML = `
        <h4>${data.title}</h4>
        <p>${data.message}</p>
        <button data-id="${docSnap.id}">
          ${data.read ? "Read" : "Mark as Read"}
        </button>
      `;

      /* --------------------------------------------
         MARK AS READ BUTTON
         Updates Firestore document safely
      -------------------------------------------- */
      const button = div.querySelector("button");

      button.addEventListener("click", async () => {
        try {
          await updateDoc(doc(db, "notifications", docSnap.id), {
            read: true
          });
        } catch (error) {
          console.error("Error marking notification as read:", error);
        }
      });

      // Append notification card to container
      container.appendChild(div);
    });

  }, (error) => {
    console.error("Error loading notifications:", error);
  });
}