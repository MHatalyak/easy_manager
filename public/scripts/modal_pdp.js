const pdpModal = document.getElementById('pdpModal');
const openPlanBtn = document.getElementById('openPlanModal');
const addModal = document.getElementById('addTodoModal');
const openAddTodoModal = document.getElementById('openAddTodoModal');

const closeBtns = document.querySelectorAll('.close');
const closeTodoBtns = document.querySelectorAll('.close-todo');
const menu = document.querySelector('.menu');

function openModal(modal) {
  modal.style.display = 'block';
  modal.style.overflow = 'hidden';
}

// Function to close the modal and hide overlay
function closeModal(modal) {
  modal.style.display = 'none';
}
openPlanBtn.addEventListener('click', event => {
  event.preventDefault();
  openModal(pdpModal);
});

closeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    closeModal(pdpModal);
  });
});

window.addEventListener('click', event => {
  if (event.target === pdpModal || event.target === addModal) {
    closeModal(pdpModal);
    closeModal(addModal);
  }
});
openAddTodoModal.addEventListener('click', event => {
  event.preventDefault();
  openModal(addModal);
});

closeTodoBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    closeModal(addModal);
  });
});

// Close the modal when clicking outside of it

document.addEventListener('DOMContentLoaded', function () {
  var taskBoard = new Bryntum.TaskBoard({
    appendTo: 'pdpModal', // Ідентифікатор елемента, куди ви хочете додати TaskBoard
    items: [
      { id: 1, content: 'Task 1', columnId: 'todo' },
      { id: 2, content: 'Task 2', columnId: 'todo' },
      // Додайте більше завдань за необхідності
    ],
    columns: [
      { id: 'todo', text: 'To do' },
      { id: 'oncheck', text: 'On check' },
      { id: 'done', text: 'Done' },
    ],
  });
});
