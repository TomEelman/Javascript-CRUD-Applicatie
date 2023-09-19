if (document.URL.includes("create.html")) {
  let userData = JSON.parse(localStorage.getItem('personnel')) || [];

  const SaveData = (ev) => {
    ev.preventDefault();

    const firstnameInput = document.getElementById('firstname');
    const infixInput = document.getElementById('infix');
    const lastnameInput = document.getElementById('lastname');
    const cityInput = document.getElementById('city');
    const streetandstreetnumberInput = document.getElementById('streetandstreetnumber');
    const postalcodeInput = document.getElementById('postalcode');

    // Check to see if input is empty
    if (
      !firstnameInput.value ||
      !lastnameInput.value ||
      !cityInput.value ||
      !streetandstreetnumberInput.value ||
      !postalcodeInput.value
    ) {
      // If it is empty give this error message
      alert('Vul alle velden met een * in');
      return;
    }

    //Fill the object if all input fields are filled
    let userdata = {
      Id: Date.now(),
      Firstname: firstnameInput.value,
      Infix: infixInput.value,
      Lastname: lastnameInput.value,
      City: cityInput.value,
      StreetAndStreetNumber: streetandstreetnumberInput.value,
      PostalCode: postalcodeInput.value,
    }

    // Push to local storage and redirect
    userData.push(userdata);
    localStorage.setItem('personnel', JSON.stringify(userData));
    location.replace('index.html');
  }

  //Edit User
  //Look in the Local storage key "editPerson"
  const editPersonData = localStorage.getItem("editPerson");

  if (editPersonData) {
    // Parse
    const editPerson = JSON.parse(editPersonData);
    // Fills the input fields with the existing information
    document.getElementById("firstname").value = editPerson.Firstname;
    document.getElementById("infix").value = editPerson.Infix;
    document.getElementById("lastname").value = editPerson.Lastname;
    document.getElementById("city").value = editPerson.City;
    document.getElementById("streetandstreetnumber").value = editPerson.StreetAndStreetNumber;
    document.getElementById("postalcode").value = editPerson.PostalCode;
  }

  // Set the checklist image based on edit or create mode
  if (editPersonData) {
    document.getElementById('form-img').src = 'img/checklistedit.png';
  } else {
    document.getElementById('form-img').src = 'img/checklistcreate.png';
  }

  const submitButton = document.getElementById('btn');

  // If the edit person object is filled the button will change to "Aapassen" 
  //and when you click it it will edit the user info then delte the editPerson key out of localstorage so you can still create users
  if (editPersonData) {
    submitButton.textContent = "Aanpassen";
    localStorage.removeItem("editPerson");
  }

  // If editPersonData is active it will edit the user
  submitButton.addEventListener('click', function (ev) {
    ev.preventDefault();
    if (editPersonData) {
      Edit(JSON.parse(editPersonData));
    } else {
      SaveData(ev);
    }
  });
}

function Edit(person) {
  // Takes the info you want to change
  let personnelData = JSON.parse(localStorage.getItem("personnel")) || [];

  const editIndex = personnelData.findIndex((element) => element.Id === person.Id);

  if (editIndex !== -1) {
    // Edits Information
    personnelData[editIndex].Firstname = document.getElementById('firstname').value;
    personnelData[editIndex].Infix = document.getElementById('infix').value;
    personnelData[editIndex].Lastname = document.getElementById('lastname').value;
    personnelData[editIndex].City = document.getElementById('city').value;
    personnelData[editIndex].StreetAndStreetNumber = document.getElementById('streetandstreetnumber').value;
    personnelData[editIndex].PostalCode = document.getElementById('postalcode').value;

    // Local storage update
    localStorage.setItem("personnel", JSON.stringify(personnelData));

    // Redirect
    location.replace("index.html");
  }
}
if (document.URL.includes("index.html")) {
  function showModal(person) {

    //More information function 
    const modal = document.createElement("div");
    modal.className = "person-modal";

    //Modal structure
    modal.innerHTML = `
      <div class="modal-background modal-visible">
        <div class="modal">
          <span class="close" onclick="closeModal()">&times;</span>
          <h2>Details van ${person.Firstname} ${person.Lastname}</h2>
          <p>ID: ${person.Id}</p>
          <p>Volledige naam: ${person.Firstname} ${person.Infix} ${person.Lastname}</p>
          <p>Woonplaats & Postcode: ${person.City}, ${person.PostalCode}</p>
          <p>Straat en Straatnummer: ${person.StreetAndStreetNumber}</p>
          <button id="EditButtonInModal" class="edit-button-modal">Personeels gegevens aanpassen<i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>
          <button id="DeleteButtonInModal" class="delete-button-modal">Persoon verwijderen<i class="fa fa-trash-o" aria-hidden="true"></i></button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Get info out of local storage
    var personnelData = localStorage.getItem("personnel");

    // parse
    var personnelObject = JSON.parse(personnelData);

    //Loop 
    for (var i = 0; i < personnelObject.length; i++) {

      // Edit Function For button in modal 
      var EditButtonInModal = document.getElementById("EditButtonInModal");
      EditButtonInModal.addEventListener("click", (function (editperson) {
        return function () {
          Edit(editperson);
        };
      })
        (personnelObject[i])
      );

      // Delete Function For button in modal 
      var DeleteButtonInModal = document.getElementById("DeleteButtonInModal");
      DeleteButtonInModal.addEventListener("click", (function (deleteperson) {
        return function () {
          Delete(deleteperson);
          location.reload();
        };
      })
        (personnelObject[i])
      );

    }
  }

  // Function to close modal with the x
  function closeModal() {
    const modals = document.querySelectorAll(".person-modal");
    for (const modal of modals) {
      modal.innerHTML = "";
    }
  }
  // Function to close modal with clicking on the background
  window.onclick = function (event) {
    if (event.target.classList.contains("modal-background")) {
      closeModal();
    }
  }

  //Delete function 
  function Delete(person) {
    var personnelData = localStorage.getItem("personnel");
    var personnelObject = JSON.parse(personnelData);
    var list = personnelObject.findIndex(function (element) {
      return element.Id === person.Id;
    });

    if (list !== -1) {
      // Deletes user from the Object
      personnelObject.splice(list, 1);

      // Update the local storage
      localStorage.setItem("personnel", JSON.stringify(personnelObject));

      // Delete's user from the list
      var personDiv = document.getElementById("person_" + person.Id);
      if (personDiv) {
        personDiv.remove();
      }
    }
  }

  function Edit(person) {

    localStorage.setItem("editPerson", JSON.stringify(person));

    location.replace("create.html");

  }

  // Make a modal for every added person
  const personModal = document.createElement("div");
  personModal.className = "person-modal";
  document.body.appendChild(personModal);

  function displayPersonnelData() {
    // Get info out of local storage
    var personnelData = localStorage.getItem("personnel");

    // parse
    var personnelObject = JSON.parse(personnelData);

    // Where all the information is being displayed
    var personnelList = document.getElementById("first-lastnameList");

    for (var i = 0; i < personnelObject.length; i++) {
      var Id = personnelObject[i].Id;
      var firstname = personnelObject[i].Firstname;
      var lastname = personnelObject[i].Lastname;
      var infix = personnelObject[i].Infix;

      // Make a block for every added person
      var personDiv = document.createElement("ul");
      personDiv.id = "person_" + Id;
      personDiv.className = "person_block";

      //Trash icon / Delete Function
      var trashIcon = document.createElement("i");
      trashIcon.className = "fa fa-trash";
      trashIcon.addEventListener("click", (function (deleteperson) {
        return function () {
          Delete(deleteperson);
        };
      })
        (personnelObject[i])
      );

      //Pencil icon / Edit Function
      var potloodIcon = document.createElement("i");
      potloodIcon.className = "fa fa-pencil";
      potloodIcon.addEventListener("click", (function (editperson) {
        return function () {
          Edit(editperson);
        };
      })
        (personnelObject[i])
      );

      //More information icon / More information Function
      var infoIcon = document.createElement("i");
      infoIcon.className = "fa fa-info";
      infoIcon.addEventListener("click", (function (person) {
        return function () {
          showModal(person);
        };
      })
        (personnelObject[i])
      );

      var firstnameElement = document.createElement("p");
      firstnameElement.textContent = "Naam: " + firstname + " " + infix + " " + lastname;

      var idElement = document.createElement("p");
      idElement.textContent = "ID:" + Id;

      // icons
      personDiv.appendChild(trashIcon);
      personDiv.appendChild(potloodIcon);
      personDiv.appendChild(infoIcon);
      personDiv.appendChild(firstnameElement);
      personDiv.appendChild(idElement);
      personnelList.appendChild(personDiv);
    }
  }
}
// If the page loads displayPersonnelData
window.addEventListener("load", displayPersonnelData);