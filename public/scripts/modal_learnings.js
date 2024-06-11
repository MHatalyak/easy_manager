const addModal = document.getElementById('addModal');
const addLink = document.getElementById('addLink');
const menu = document.querySelector('.menu');
const icon = document.querySelector('.add-learning');

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
addLink.addEventListener('click', event => {
  event.preventDefault();
  openModal(addModal);
});

closeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    closeModal(addModal);
  });
});

window.addEventListener('click', event => {
  if (event.target === addModal) {
    closeModal(addModal);
  }
});

// document
//   .getElementById('sendLearningBtn')
//   .addEventListener('click', function (event) {
//     event.preventDefault(); // Зупинити стандартну поведінку форми

//     var learningName = document.getElementById('learningName').value;
//     var source = document.getElementById('source').value;
//     var accessFor = document.getElementById('accessFor').value;

//     var learning = {
//       learning_name: learningName,
//       source: source,
//       access_for: accessFor,
//       id: generateId(), // Генерація випадкового ідентифікатора
//     };

//     // Відправити об'єкт learning на сервер для збереження
//   });

// function generateId() {
//   return Math.random().toString(36).substr(2, 9); // Генерація випадкового рядка
// }

