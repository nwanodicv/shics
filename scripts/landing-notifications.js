/**
 * landing-notifications.js
 * -----------------------------------------
 * Loads latest announcements to landing page
 * Real-time listener (production safe)
 * Does NOT require login
 * Does NOT affect authentication logic
 * -----------------------------------------
 */

import { db } from "./firebase.js";

import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =====================================================
   LOAD RECENT ANNOUNCEMENTS FOR PUBLIC LANDING PAGE
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("landingAnnouncementList");

  // If element does not exist, stop execution safely
  if (!container) return;

  try {

    // Query latest 3 announcements only
    const q = query(
      collection(db, "announcements"),
      orderBy("createdAt", "desc"),
      limit(3)
    );

    // Real-time listener
    onSnapshot(q, (snapshot) => {

      // Clear previous items
      container.innerHTML = "";

      if (snapshot.empty) {
        container.innerHTML = "<p>No announcements available.</p>";
        return;
      }

      snapshot.forEach(docSnap => {

        const data = docSnap.data();

        // Create wrapper
        const aside = document.createElement("aside");
        aside.classList.add("announcement-content");

        aside.innerHTML = `
          <img src="images/calendar-days.svg" alt="Announcement icon" loading="lazy">
          <p class="ptm-parag">${data.title}</p>
          <p class="date-parag">
            ${data.createdAt?.toDate().toDateString() || ""}
          </p>
        `;

        container.appendChild(aside);
      });

    });

  } catch (error) {
    console.error("Landing announcements error:", error);
  }

});