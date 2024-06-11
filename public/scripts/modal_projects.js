const addProjectModal = document.getElementById('addProjectModal');
const addProjectLink = document.getElementById('addProjectLink');
const menu = document.querySelector('.menu');

// Get the close buttons
const closeBtns = document.querySelectorAll('.close-projects');

// Function to open the modal and show overlay
function openModal(modal) {
  modal.style.display = 'block';
  modal.style.overflow = 'hidden';
}

// Function to close the modal and hide overlay
function closeModal(modal) {
  modal.style.display = 'none';
}
addProjectLink.addEventListener('click', event => {
  event.preventDefault();
  openModal(addProjectModal);
});

closeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    closeModal(addProjectModal);
  });
});

window.addEventListener('click', event => {
  if (event.target === addProjectModal) {
    closeModal(addProjectModal);
  }
});
