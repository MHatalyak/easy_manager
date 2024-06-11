const feedbackModal = document.getElementById('feedbackModal');
const aboutModal = document.getElementById('aboutModal');
const supportModal = document.getElementById('supportModal');

// Get the links
const feedbackLink = document.getElementById('feedbackLink');
const aboutLink = document.getElementById('aboutLink');
const supportLink = document.getElementById('supportLink');
const menu = document.querySelector('.menu');

// Get the close buttons
const closeBtns = document.querySelectorAll('.close');

// Function to open the modal and show overlay
function openModal(modal) {
  modal.style.display = 'block';
  modal.style.overflow = 'hidden';
}

// Function to close the modal and hide overlay
function closeModal(modal) {
  modal.style.display = 'none';
}

// Event listeners for links
feedbackLink.addEventListener('click', event => {
  event.preventDefault(); // Prevent default link behavior
  openModal(feedbackModal);
});

aboutLink.addEventListener('click', event => {
  event.preventDefault(); // Prevent default link behavior
  openModal(aboutModal);
});

supportLink.addEventListener('click', event => {
  event.preventDefault(); // Prevent default link behavior
  openModal(supportModal);
});

// Event listeners for close buttons
closeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    closeModal(feedbackModal);
    closeModal(aboutModal);
    closeModal(supportModal);
  });
});

// Close the modal when clicking outside of it
window.addEventListener('click', event => {
  if (
    event.target === feedbackModal ||
    event.target === aboutModal ||
    event.target === supportModal
  ) {
    closeModal(feedbackModal);
    closeModal(aboutModal);
    closeModal(supportModal);
  }
});

// window.addEventListener('click', event => {
//   if (event.target === pdpModal) {
//     closeModal(pdpModal);
//   }
// });
