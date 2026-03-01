import { gallery } from "/scripts/gallery.mjs";
/**
 * Redirect user based on role after login
 */

import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const goBtn = document.getElementById("goDashboardBtn");

goBtn?.addEventListener("click", () => {
    if (!auth.currentUser) return; // let dialogbox.js open login

  onAuthStateChanged(auth, async (user) => {

    if (!user) {
      alert("Please sign in first.");
      return;
    }

    const snap = await getDoc(doc(db, "users", user.uid));

    if (!snap.exists()) return;

    const role = snap.data().role;

    if (role === "admin")
      window.location.href = "../admin/admin.html";

    if (role === "student")
      window.location.href = "../student/student.html";

    if (role === "staff")
      window.location.href = "../staff/staff.html";

    if (role === "parent")
      window.location.href = "../parents/parent.html";
  });

});


//console.log(gallery);

// DOM elements for dialog box
const openDialogButton = document.querySelector('#open-dialogbox', 'button');
const dialogBox = document.querySelector('#dialog-box', 'dialog');
const closeDialogButton = document.querySelector('#close-dialogbox', 'button');

// Event listeners to open and close the dialog box for staff dashboard information
openDialogButton.addEventListener('click', () => {
    dialogBox.showModal();
});

closeDialogButton.addEventListener('click', () => {
    dialogBox.close();
});

// DOM elements for "What to Do" dialog box
const openWhatToDoButton = document.querySelector('#open-whatToDo', 'button');
const whatToDoDialogBox = document.querySelector('#whattodo-dialogbox', 'dialog');
const closeWhatToDoButton = document.querySelector('#close-WhatToDo', 'button');
// Event listeners to open and close the dialog box for "What to Do" information

closeWhatToDoButton.addEventListener('click', () => {
    whatToDoDialogBox.close();
});

openWhatToDoButton.addEventListener('click', () => {
    whatToDoDialogBox.showModal();
});


// DOM elements for "encouragement" dialog box
const openEncouragementButton = document.querySelector('#open-encouragement', 'button');
const encouragementDialogBox = document.querySelector('#encouragement-dialogbox', 'dialog');
const closeEncouragementButton = document.querySelector('#close-encouragement', 'button');
// Event listeners to open and close the dialog box for "How It Works" information

closeEncouragementButton.addEventListener('click', () => {
    encouragementDialogBox.close();
});

openEncouragementButton.addEventListener('click', () => {
    encouragementDialogBox.showModal();
});

// DOM elements for "callToAction" dialog box
const openCallToActionButton = document.querySelector('#open-callToAction', 'button');
const callToActionDialogBox = document.querySelector('#callToAction-dialogbox', 'dialog');
const closeCallToActionButton = document.querySelector('#close-callToAction', 'button');
// Event listeners to open and close the dialog box for "Call To Action" information
openCallToActionButton.addEventListener('click', () => {
    callToActionDialogBox.showModal();
});
closeCallToActionButton.addEventListener('click', () => {
    callToActionDialogBox.close();
});

const galleryContainer = document.getElementById('gallery-container');

let innerHTML = ``;
gallery.forEach((item) => {
    //console.log(item);
    innerHTML += `
    <aside class="gallery-card">
      <img class="gallery-img" src="${item.image}" alt="${item.name}" loading="lazy" class="product-img">
      <h3>${item.name}</h3>
      <p>${item.description}</p>
    </aside>
  `;
});
// Only render gallery if container exists
if (galleryContainer) {
  galleryContainer.innerHTML = innerHTML;
}

