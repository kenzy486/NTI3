const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const counterBadge = document.getElementById("counterBadge");
const errorMsg = document.getElementById("errorMsg");
const subtitle = document.getElementById("subtitle");

let tasks = [];
let idCounter = 0;

const checkIcon = `
<svg
  viewBox="0 0 24 24"
  fill="none"
  stroke="white"
  stroke-width="3"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <polyline points="20 6 9 17 4 12"></polyline>
</svg>
`;

const trashIcon = `
<svg
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <polyline points="3 6 5 6 21 6"></polyline>

  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>

  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
</svg>
`;

function updateSubtitle() {
  const remaining = tasks.filter((task) => !task.done).length;
  const total = tasks.length;

  if (total === 0) {
    subtitle.textContent = "Let's get things done today";
  } else if (remaining === 0) {
    subtitle.textContent = "Everything is done!";
  } else if (remaining === 1) {
    subtitle.textContent = "Just one more to go";
  } else {
    subtitle.textContent = `${remaining} tasks left`;
  }
}

function updateCounter() {
  const remaining = tasks.filter((task) => !task.done).length;

  if (tasks.length === 0) {
    counterBadge.textContent = "0 tasks";
  } else {
    counterBadge.textContent = `${remaining} of ${tasks.length} left`;
  }
}

function updateEmptyState() {
  if (tasks.length === 0) {
    emptyState.style.display = "block";
    taskList.style.display = "none";
  } else {
    emptyState.style.display = "none";
    taskList.style.display = "flex";
  }
}

function renderTask(task) {
  const li = document.createElement("li");

  li.className = "task";

  if (task.done) {
    li.classList.add("done");
  }

  li.dataset.id = task.id;

  li.innerHTML = `
    <button
      class="task-check"
      aria-label="Toggle task"
    >
      ${checkIcon}
    </button>

    <span class="task-text"></span>

    <button
      class="task-delete"
      aria-label="Delete task"
    >
      ${trashIcon}
    </button>
  `;

  li.querySelector(".task-text").textContent = task.text;

  li.querySelector(".task-check").addEventListener("click", () => {
    toggleTask(task.id);
  });

  li.querySelector(".task-delete").addEventListener("click", () => {
    deleteTask(task.id);
  });

  return li;
}

function addTask() {
  const value = taskInput.value.trim();

  if (!value) {
    errorMsg.classList.add("show");
    taskInput.focus();
    return;
  }

  errorMsg.classList.remove("show");

  const task = {
    id: idCounter++,
    text: value,
    done: false,
  };

  tasks.push(task);

  taskList.appendChild(renderTask(task));

  taskInput.value = "";

  updateCounter();
  updateEmptyState();
  updateSubtitle();

  taskInput.focus();
}

function toggleTask(id) {
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return;
  }

  task.done = !task.done;

  const li = taskList.querySelector(`[data-id="${id}"]`);

  if (li) {
    li.classList.toggle("done", task.done);
  }

  updateCounter();
  updateSubtitle();
}

function deleteTask(id) {
  const li = taskList.querySelector(`[data-id="${id}"]`);

  if (!li) {
    return;
  }

  li.classList.add("removing");

  setTimeout(() => {
    tasks = tasks.filter((task) => task.id !== id);

    li.remove();

    updateCounter();
    updateEmptyState();
    updateSubtitle();
  }, 200);
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

taskInput.addEventListener("input", () => {
  errorMsg.classList.remove("show");
});

updateCounter();
updateEmptyState();
updateSubtitle();
