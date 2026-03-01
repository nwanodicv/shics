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

import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



  
onAuthStateChanged(auth, (user) => {

  if (!user) return;

  loadAnnouncements();
  loadUserNotifications(user.uid);
});


/* =============================
   LOAD ANNOUNCEMENTS
============================= */
function loadAnnouncements() {

  const container = document.getElementById("announcementList");
  if (!container) return;

  const q = query(
    collection(db, "announcements"),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, (snapshot) => {

    container.innerHTML = "";

    snapshot.forEach(docSnap => {

      const data = docSnap.data();

      const div = document.createElement("div");
      div.classList.add("notification-card");

      div.innerHTML = `
        <h4>${data.title}</h4>
        <p>${data.message}</p>
      `;

      container.appendChild(div);
    });
  });
}


/* =============================
   LOAD USER NOTIFICATIONS
   (Enhanced with Bell + Counter)
============================= */
function loadUserNotifications(uid) {

  const container = document.getElementById("notificationList");
  const bellCount = document.getElementById("notificationCount");
  const dropdown = document.getElementById("notificationDropdown");

  if (!container) return;

  const q = query(
    collection(db, "notifications"),
    where("recipientId", "==", uid),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, (snapshot) => {

    container.innerHTML = "";
    dropdown.innerHTML = "";

    let unreadCount = 0;

    snapshot.forEach(docSnap => {

      const data = docSnap.data();

      // Count unread notifications
      if (!data.read) {
        unreadCount++;
      }

      /* =============================
         MAIN PAGE NOTIFICATION CARD
      ============================= */
      const div = document.createElement("div");
      div.classList.add("notification-card");

      div.innerHTML = `
        <h4>${data.title}</h4>
        <p>${data.message}</p>
        <button data-id="${docSnap.id}">
          ${data.read ? "Read" : "Mark as Read"}
        </button>
      `;

      // Mark as read button
      div.querySelector("button").addEventListener("click", async () => {
        await updateDoc(doc(db, "notifications", docSnap.id), {
          read: true
        });
      });

      container.appendChild(div);


      /* =============================
         DROPDOWN NOTIFICATION ITEM
      ============================= */
      const dropItem = document.createElement("div");
      dropItem.classList.add("dropdown-item");

      dropItem.innerHTML = `
        <strong>${data.title}</strong>
        <p>${data.message}</p>
      `;

      // If unread, highlight it
      if (!data.read) {
        dropItem.classList.add("unread");
      }

      dropdown.appendChild(dropItem);
    });

    /* =============================
       UPDATE BELL COUNTER
    ============================= */
    bellCount.textContent = unreadCount;

    // Hide counter if zero
    bellCount.style.display = unreadCount > 0 ? "inline-block" : "none";

    // Show empty message if no notifications
    if (snapshot.empty) {
      dropdown.innerHTML = `<p class="empty-message">No notifications</p>`;
    }

  });
}

/* =============================
   BELL TOGGLE FUNCTIONALITY
============================= */
document.addEventListener("DOMContentLoaded", () => {

  const bell = document.getElementById("notificationBell");
  const dropdown = document.getElementById("notificationDropdown");

  if (!bell || !dropdown) return;

  bell.addEventListener("click", () => {
    dropdown.classList.toggle("show-dropdown");
  });

});