const addClientModal = document.getElementById('addClientModal');
const addClientLink = document.getElementById('addClientLink');
const menu = document.querySelector('.menu');

// Get the close buttons
const closeBtns = document.querySelectorAll('.close-client');

// Function to open the modal and show overlay
function openModal(modal) {
  modal.style.display = 'block';
  modal.style.overflow = 'hidden';
}

// Function to close the modal and hide overlay
function closeModal(modal) {
  modal.style.display = 'none';
}
addClientLink.addEventListener('click', event => {
  event.preventDefault();
  openModal(addClientModal);
});

closeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    closeModal(addClientModal);
  });
});

window.addEventListener('click', event => {
  if (event.target === addClientModal) {
    closeModal(addClientModal);
  }
});
