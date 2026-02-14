let items = [];


async function fetchAboutData() {
    const response = await fetch('/data/about.json');// Fetch the data from the URL
    const data = await response.json();// Parse the JSON data
    items = data.details; // Store the data in the members array
    displayAbouts(items); // Call function to display members
};
fetchAboutData(); // keep only this one


const secondScreenContainer = document.querySelector('.second-screen-container');

function displayAbouts(items) {
    items.forEach((item) => {
       
       // Create elements for the member card
        let card = document.createElement('section');
        let FullName = document.createElement('h2');
        let image = document.createElement('img');
       

        // Set the content and attributes// Set the content and attributes
        FullName.textContent = item.name;
        image.setAttribute('src', item.image);
        image.setAttribute('alt', `Image of ${item.name}`);
        image.setAttribute('loading', 'lazy');
        image.setAttribute('width', '300');
        image.setAttribute('height', '300');

        // Append elements to the card
        card.appendChild(image);
        card.appendChild(FullName);

        // Append the card to the container
        secondScreenContainer.appendChild(card);
    });
};
displayAbouts(items);