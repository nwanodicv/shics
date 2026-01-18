// Get the html element for modification//
const navButton = document.querySelector('#ham-btn');
const navLinks = document.querySelector('#nav-links');

// toggle the show class off and on//
navButton.addEventListener('click', () => {
   navButton.classList.toggle('show');
   navLinks.classList.toggle('show');
   console.log('navigation bar loaded.')
});

