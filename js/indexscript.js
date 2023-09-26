const idInput = document.getElementById('idInput');
const firstnameInput = document.getElementById('firstname');
const infixInput = document.getElementById('infix');
const lastnameInput = document.getElementById('lastname');
const cityInput = document.getElementById('city');
const postalcodeInput = document.getElementById('postalcode');
const streetInput = document.getElementById('street');
const streetnumberInput = document.getElementById('streetnumber');
const additiveInput = document.getElementById('additive');
const userForm = document.getElementById('userForm');
const submitButtonCreate = document.getElementById('submitButtonCreate');
const submitButtonEdit = document.getElementById('submitButtonEdit');
const arrow_backtocreate = document.getElementById('arrow-backtocreate');
const create_txt = document.getElementById('create-txt');
const edit_txt = document.getElementById('edit-txt');

init()
function init() {
  displayPersonnelData()
  if (userForm) {
    userForm.style.display = "block";
    submitButtonEdit.style.display = "none";
  }

  addEventListeners()
}

function addEventListeners() {

  if(submitButtonCreate){
    submitButtonCreate.addEventListener('click', addUser);
  }

  if(submitButtonEdit){
    submitButtonEdit.addEventListener('click', updateUser);
  }
}

function getUsersFromLocalStorage() {
  return JSON.parse(localStorage.getItem('personnel')) || [];
}

function showEditUserForm(ev) {
  const userId = ev.target.attributes["data-userid"].value;
  const users = getUsersFromLocalStorage();
  const userIndex = users.findIndex((users) => users.Id == userId);
  if (userForm) {
    userForm.style.display = "block";
    edit_txt.style.display = "block";
    submitButtonCreate.style.display = "none";
    fillUserForm(users[userIndex])
  }
  if (userId) {
    arrow_backtocreate.style.display = "block";
    submitButtonEdit.style.display = "block";
    edit_txt.style.display = "block";
    create_txt.style.display = "none";
  }
}

function arrowBackToCreate() {
  location.reload()
}

function fillUserForm(user) {
  idInput.value = user.Id;
  firstnameInput.value = user.Firstname;
  infixInput.value = user.Infix;
  lastnameInput.value = user.Lastname;
  cityInput.value = user.City;
  postalcodeInput.value = user.PostalCode;
  streetInput.value = user.Street;
  streetnumberInput.value = user.Streetnumber;
  additiveInput.value = user.Additive;
}

function clearUserList() {
  if (confirm("Weet je het zeker dit zal alle gebruikers verwijderen!")) {
    localStorage.clear()
    location.reload()
  } else {
    location.reload()
  }
}

function validateUserData() {
  let isValid = true;
  if (
    !firstnameInput.value ||
    !lastnameInput.value ||
    !cityInput.value ||
    !postalcodeInput.value ||
    !streetInput.value ||
    !streetnumberInput.value
  ) {
    isValid = false
    alert("Vul alle velden met een * in")
  }
  return isValid;
}

function addUser() {
  if (validateUserData(true)) {
    let user = {
      Id: Date.now(),
      Firstname: firstnameInput.value,
      Infix: infixInput.value,
      Lastname: lastnameInput.value,
      City: cityInput.value,
      PostalCode: postalcodeInput.value,
      Street: streetInput.value,
      Streetnumber: streetnumberInput.value,
      Additive: additiveInput.value,
    }

    const userData = getUsersFromLocalStorage()

    userData.push(user);

    localStorage.setItem('personnel', JSON.stringify(userData));

  }
}

function updateUser() {
  const editUserId = idInput.value;
  const userData = getUsersFromLocalStorage();
  const editUserIndex = userData.findIndex((user) => user.Id == editUserId);

  if (validateUserData(true)) {
    if (editUserIndex !== -1) {
      userData[editUserIndex] = {
        Id: editUserId,
        Firstname: firstnameInput.value,
        Infix: infixInput.value,
        Lastname: lastnameInput.value,
        City: cityInput.value,
        PostalCode: postalcodeInput.value,
        Street: streetInput.value,
        Streetnumber: streetnumberInput.value,
        Additive: additiveInput.value,
      };

      localStorage.setItem('personnel', JSON.stringify(userData));
    }
  }
}

function deleteUser(userId) {
  const userData = getUsersFromLocalStorage();
  const deleteUserIndex = userData.findIndex((user) => user.Id == userId);

  if (confirm("Weet je het zeker dit zal deze gebruiker verwijderen!")) {
    userData.splice(deleteUserIndex, 1);
    localStorage.setItem('personnel', JSON.stringify(userData));
    location.reload()
  } else {
    location.reload()
  }
}

function showModal(person) {

  const modal = document.createElement("div");
  modal.className = "person-modal";

  const personModal = document.createElement("div");
  personModal.className = "person-modal";
  document.body.appendChild(personModal);


  modal.innerHTML =
    `<div class="modal-background modal-visible">
        <div class="modal">
          <span class="close" onclick="closeModal()">&times;</span>
          <h2>Details van ${person.Firstname} ${person.Lastname}</h2>
          <p>ID: ${person.Id}</p>
          <p>Volledige naam: ${person.Firstname} ${person.Infix} ${person.Lastname}</p>
          <p>Woonplaats & Postcode: ${person.City}, ${person.PostalCode}</p>
          <p>Straat en Straatnummer: ${person.Street}, ${person.Streetnumber}${person.Additive}</p>
          <button id="DeleteButtonInModal" class="delete-button-modal">Persoon verwijderen<i class="fa fa-trash-o" aria-hidden="true"></i></button>
        </div>
      </div>`;
  document.body.appendChild(modal);

  var deleteButtonInModal = document.getElementById("DeleteButtonInModal");
  deleteButtonInModal.onclick = () => deleteUser(person.Id);
}

function closeModal() {
  const modals = document.querySelectorAll(".person-modal");
  for (const modal of modals) {
    modal.innerHTML = "";
  }
}

function displayPersonnelData() {

  userList = getUsersFromLocalStorage()
  var personnelList = document.getElementById("first-lastnameList");

  if (userList.length === 0) {

    document.getElementById("no-users-message").innerHTML = ("Geen gebruikers gevonden");

  } else {

    for (var i = 0; i < userList.length; i++) {
      const Id = userList[i].Id;
      const firstname = userList[i].Firstname;
      const lastname = userList[i].Lastname;
      const infix = userList[i].Infix;

      var personDiv = document.createElement("ul");
      personDiv.id = "person_" + Id;
      personDiv.className = "person_block";

      var firstnameElement = document.createElement("p");
      firstnameElement.textContent = "Naam: " + firstname + " " + infix + " " + lastname;

      var idElement = document.createElement("p");
      idElement.textContent = "ID:" + Id;

      var infoIcon = document.createElement("i");
      infoIcon.className = "fa fa-info";
      infoIcon.addEventListener("click", (function (person) {
        return function () {
          showModal(person);
        };
      })
        (userList[i]));

      var potloodIcon = document.createElement("i");
      potloodIcon.className = "fa fa-pencil";
      potloodIcon.setAttribute("data-userId", `${Id}`);
      potloodIcon.addEventListener("click", showEditUserForm);

      var trashIcon = document.createElement("i");
      trashIcon.className = "fa fa-trash";
      trashIcon.addEventListener("click", deleteUser);

      personDiv.appendChild(trashIcon);
      personDiv.appendChild(potloodIcon);
      personDiv.appendChild(infoIcon);
      personDiv.appendChild(firstnameElement);
      personDiv.appendChild(idElement);
      personnelList.appendChild(personDiv);
    }
  }
}

window.onclick = function (event) {
  if (event.target.classList.contains("modal-background")) {
    closeModal();
  }
}