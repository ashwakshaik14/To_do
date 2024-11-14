const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterOptions = {
  all: document.getElementById('showAll'),
  completed: document.getElementById('showCompleted'),
  active: document.getElementById('showActive')
};
const searchBar = document.getElementById('searchBar');
const noTasksMessage = document.getElementById('noTasksMessage');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
renderTasks();


addTaskBtn.addEventListener('click', addTask);
function addTask() {
  const taskName = taskInput.value.trim();
  if (!taskName) {
    alert("Please enter a task.");
    return;
  }
  
  const task = {
    id: Date.now().toString(),
    name: taskName,
    completed: false
  };
  
  tasks.push(task);
  taskInput.value = '';
  saveAndRenderTasks();
}

function renderTasks(filter = 'all', searchTerm = '') {
  taskList.innerHTML = '';
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  }).filter(task => task.name.toLowerCase().includes(searchTerm.toLowerCase()));
  
  filteredTasks.forEach(task => createTaskElement(task));
  noTasksMessage.style.display = filteredTasks.length ? 'none' : 'block';
}

function createTaskElement(task) {
  const li = document.createElement('li');
  li.dataset.id = task.id;
  li.draggable = true;
  
  const taskName = document.createElement('span');
  taskName.textContent = task.name;
  if (task.completed) taskName.classList.add('completed');
  
  const completeBtn = document.createElement('button');
  completeBtn.textContent = '✓';
  completeBtn.style.fontSize="15px";
  completeBtn.style.width='80px';
  completeBtn.style.backgroundColor="lawngreen";
  completeBtn.onclick = () => toggleComplete(task.id);
  
  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.style.width='80px';
  editBtn.style.fontSize="15px";
  editBtn.style.color="white";
  editBtn.style.backgroundColor="cyan";
  editBtn.onclick = () => editTask(task.id);

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'X';
  deleteBtn.style.fontSize="15px";
  deleteBtn.style.color='white';
  deleteBtn.style.backgroundColor="red";
  deleteBtn.style.width='80px';
  deleteBtn.onclick = () => deleteTask(task.id);
  
  li.append(taskName, completeBtn, editBtn, deleteBtn);
  taskList.appendChild(li);
}

function toggleComplete(id) {
  const task = tasks.find(task => task.id === id);
  task.completed = !task.completed;
  saveAndRenderTasks();
}


function editTask(id) {
  const task = tasks.find(task => task.id === id);
  const newTaskName = prompt('Edit task:', task.name);
  if (newTaskName) {
    task.name = newTaskName;
    saveAndRenderTasks();
  }
}


function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveAndRenderTasks();
}

filterOptions.all.addEventListener('click', () => renderTasks('all'));
filterOptions.completed.addEventListener('click', () => renderTasks('completed'));
filterOptions.active.addEventListener('click', () => renderTasks('active'));

searchBar.addEventListener('input', () => renderTasks('all', searchBar.value));

function saveAndRenderTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

taskList.addEventListener('dragstart', e => {
  e.dataTransfer.setData('text/plain', e.target.dataset.id);
});

taskList.addEventListener('dragover', e => {
  e.preventDefault();
});

taskList.addEventListener('drop', e => {
  e.preventDefault();
  const draggedId = e.dataTransfer.getData('text');
  const droppedId = e.target.closest('li').dataset.id;

  const draggedIndex = tasks.findIndex(task => task.id === draggedId);
  const droppedIndex = tasks.findIndex(task => task.id === droppedId);

  if (draggedIndex >= 0 && droppedIndex >= 0) {
    const [draggedTask] = tasks.splice(draggedIndex, 1);
    tasks.splice(droppedIndex, 0, draggedTask);
    saveAndRenderTasks();
  }
});
