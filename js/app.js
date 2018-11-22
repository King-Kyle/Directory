// Variables initialization
const employeesDiv = document.getElementById('employees');
let employees = null;
let searchResult = [];

// JQuery AJAX function - Get employees from API
$.ajax({
  url: 'https://randomuser.me/api/?results=12',
  dataType: 'json',
  success: function(data){
    employees = data.results;
    displayEmployees(employees);
  }
});

// fetch random avatar from API
const random = Math.floor((Math.random() * 4000) + 1);
const adorableAvatarUrl = 'https://api.adorable.io/avatars/130/';
const randomAvatar = adorableAvatarUrl + random;

// Create employee card for each employee and add to employeesDiv
function displayEmployees(employees){
  for (let i = 0; i < employees.length; i++){
    const employee = employees[i];
    const employeeNumber = i;
    const portrait = randomAvatar + i;
    const name = capitalizeFirstLetter(employee.name.first) + ' ' + capitalizeFirstLetter(employee.name.last);
    const email = employee.email;
    const city = capitalizeFirstLetter(employee.location.city);

    // Employee card
    const employeeCard = document.createElement('div');
    employeeCard.className = 'employee-card';
    employeesDiv.appendChild(employeeCard);

    // Employee portrait
    const employeePortrait = document.createElement('img');
    employeePortrait.className = 'portrait';
    employeePortrait.src = portrait;
    employeePortrait.alt = 'Portrait of ' + name;
    employeeCard.appendChild(employeePortrait);

    // Details div
    const employeeDetails = document.createElement('div');
    employeeCard.appendChild(employeeDetails);

    // Employee name
    const employeeName = document.createElement('h2');
    employeeName.innerHTML = name;
    employeeDetails.appendChild(employeeName);

    // Employee email
    const employeeEmail = document.createElement('p');
    employeeEmail.innerHTML = email;
    employeeDetails.appendChild(employeeEmail);

    // Employee city
    const employeeCity = document.createElement('p');
    employeeCity.innerHTML = city;
    employeeDetails.appendChild(employeeCity);

    // Display more detailed employee info on click using closure
    employeeCard.addEventListener('click', function(){
      displayEmployee(employees, employeeNumber);
    });
  }
}

// Display single employee card
function displayEmployee(employeeArray, employeeNumber){
  const employee = employeeArray[employeeNumber];
  const portrait = randomAvatar + employeeNumber;
  const name = capitalizeFirstLetter(employee.name.first) + ' ' + capitalizeFirstLetter(employee.name.last);
  const email = employee.email;
  const city = capitalizeFirstLetter(employee.location.city);
  const phone = employee.cell;
  const address = capitalizeFirstLetter(employee.location.street) + ', ' + capitalizeFirstLetter(employee.location.city) + ' ' + employee.location.postcode;
  const birthday = 'Birthday: ' + employee.dob.date.substring(5, 7) + '/' + employee.dob.date.substring(8, 10) + '/' + employee.dob.date.substring(2, 4);

  const main = document.getElementById('main');

  // Create and display overlay div
  const overlay = document.createElement('div');
  overlay.id = 'overlay';
  main.appendChild(overlay);

  overlay.addEventListener('click', function(e){
    if (event.target !== this){
      return;
    } else {
      overlay.remove();
    }
  });

  // Create and display the employee detailed card
  const hr = document.createElement('hr');
  const employeeCard = document.createElement('div');
  employeeCard.className = 'employee-card-detailed';
  overlay.appendChild(employeeCard);

  // Create close button
  const close = document.createElement('p');
  close.className = 'close-button';
  close.innerHTML = '&times;';
  close.addEventListener('click', function(){
    overlay.remove();
  });
  employeeCard.appendChild(close);

  // Employee portrait
  const employeePortrait = document.createElement('img');
  employeePortrait.className = 'portrait';
  employeePortrait.src = portrait;
  employeePortrait.alt = 'Portrait of ' + name;
  employeeCard.appendChild(employeePortrait);

  // Employee name
  const employeeName = document.createElement('h2');
  employeeName.innerHTML = name;
  employeeCard.appendChild(employeeName);

  // Employee email
  const employeeEmail = document.createElement('p');
  employeeEmail.innerHTML = email;
  employeeCard.appendChild(employeeEmail);

  // Employee city
  const employeeCity = document.createElement('p');
  employeeCity.innerHTML = city;
  employeeCard.appendChild(employeeCity);

  employeeCard.appendChild(hr);

  // Employee phone
  const employeePhone = document.createElement('p');
  employeePhone.innerHTML = phone;
  employeeCard.appendChild(employeePhone);

  // Employee address
  const employeeAddress = document.createElement('p');
  employeeAddress.innerHTML = address;
  employeeCard.appendChild(employeeAddress);

  // Employee Birthday
  const employeeBirthday = document.createElement('p');
  employeeBirthday.innerHTML = birthday;
  employeeCard.appendChild(employeeBirthday);

  // Create back and forward buttons
  const previous = document.createElement('span');
  previous.className = 'browse-button, left-button';
  previous.innerHTML = '&lsaquo;';
  employeeCard.appendChild(previous);

  previous.addEventListener('click', function(){
    if (searchResult.length === 0){
      employeeArray = employees;
    } else {
      employeeArray = searchResult;
    }
    if ((employeeNumber -1) < 0){
      overlay.remove();
      displayEmployee(employeeArray, employeeArray.length -1);
    } else {
      overlay.remove();
      displayEmployee(employeeArray, employeeNumber - 1);
    }
  });

  const next = document.createElement('span');
  next.className = 'browse-button, right-button';
  next.innerHTML = '&rsaquo;';
  employeeCard.appendChild(next);
  next.addEventListener('click', function(){
    if (searchResult.length === 0){
      employeeArray = employees;
    } else {
      employeeArray = searchResult;
    }
    if ((employeeNumber + 1) > employeeArray.length -1){
      overlay.remove();
      displayEmployee(employeeArray, 0);
    } else {
      overlay.remove();
      displayEmployee(employeeArray, employeeNumber + 1);
    }
  });
}

// SEARCH
const searchField = document.querySelector("input[id='search']");
searchField.onkeyup = function(){
  const input = searchField.value;
  searchResult = [];

  // Refresh datalist for every character added or removed in input field
  while (employeesDiv.firstChild){
    employeesDiv.removeChild(employeesDiv.firstChild);
  }

  // If match save to search result
  for (let i = 0; i < employees.length; i++){
    if (employees[i].name.first.includes(input.toLowerCase()) || employees[i].name.last.includes(input.toLowerCase()) || employees[i].login.username.includes(input.toLowerCase())){
      searchResult.push(employees[i]);
    }
  }
  if (searchResult.length === 0){
    const message = document.createElement('p');
    message.innerHTML = 'No match found';
    employeesDiv.appendChild(message);
  }
  else {
    displayEmployees(searchResult);
  }
}

// Change the first letter of a string uppercase
function capitalizeFirstLetter(str){
  return str.replace(/\w\S*/g, function(text){
    return text.charAt(0).toUpperCase() + text.substring(1).toLowerCase();
  });
}
