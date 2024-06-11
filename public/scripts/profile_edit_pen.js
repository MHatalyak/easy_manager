function editField(fieldName) {
  const fieldElement = document.querySelector(`[name="${fieldName}"]`);
  const fieldValue = fieldElement.textContent.trim();

  const inputElement = document.createElement('input');
  inputElement.setAttribute('type', 'text');
  inputElement.setAttribute('name', fieldName);
  inputElement.setAttribute('value', fieldValue);

  fieldElement.innerHTML = '';
  fieldElement.appendChild(inputElement);

  const editIcon = document.getElementById(
    `edit${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`
  );
  editIcon.style.display = 'none';

  const saveIcon = document.createElement('span');
  saveIcon.innerHTML = '<i class="far fa-save"></i>';
  saveIcon.classList.add('edit-icon');
  saveIcon.onclick = function () {
    saveField(fieldName);
  };
  fieldElement.appendChild(saveIcon);
}

function saveField(fieldName) {
  const inputElement = document.querySelector(`[name="${fieldName}"]`);
  const fieldValue = inputElement.value;

  // Here you can send the updated field value to the server using fetch or any other method

  const fieldElement = inputElement.parentNode;
  fieldElement.textContent = fieldValue;

  const editIcon = document.getElementById(
    `edit${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`
  );
  editIcon.style.display = 'inline-block';
}
