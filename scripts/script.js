import { gallery } from "/scripts/gallery.mjs";

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
galleryContainer.innerHTML = innerHTML;


