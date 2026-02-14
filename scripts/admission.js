let admissions = [];

async function fetchAdmissionOfficerData() {
   const response = await fetch("../data/admission.json");
   const data = await response.json();
   const myData = data.admissionOfficer;
   console.log(myData);
   displayAdmissionOfficerData(myData)

}
fetchAdmissionOfficerData();

const innerHTML = document.querySelector('.offer');

function displayAdmissionOfficerData(admissions) {
    admissions.forEach((a) => {
        // generate html element
        const card = document.createElement('section');
        const fullName = document.createElement('h2');
        const photo = document.createElement('img');
        const myRole = document.createElement('p');
    
        fullName.textContent = a.name;
        photo.setAttribute('src', a.image);
        photo.setAttribute('alt', `image of ${a.name}`);
        photo.setAttribute('loading', 'lazy');
        photo.setAttribute('width', '300');
        photo.setAttribute('height', '300');
        myRole.textContent = a.role;

        card.appendChild(photo);
        card.appendChild(fullName);
        card.appendChild(myRole);
        
        innerHTML.appendChild(card);
    });
    
}
displayAdmissionOfficerData();
