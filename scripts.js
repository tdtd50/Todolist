const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const todosList = document.getElementById("todos-list");
const itemsLeft = document.getElementById("item-left");
const clearCompletedBtn = document.getElementById("clear-completed");
const emptyState = document.querySelector(".empty-state");
const dateElement = document.getElementById("date");
const filters = document.querySelectorAll(".filter");

let todos = [];
let currentFilter = "all";

// 点击添加按钮
addTaskBtn.addEventListener("click", () => addTodo(taskInput.value));

// 回车添加
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTodo(taskInput.value);
});

clearCompletedBtn.addEventListener("click", clearCompleted);

function addTodo(text) {
  if (text.trim() === "") return;

  const todo = {
    id: Date.now(),
    text: text.trim(),
    completed: false,
  };

  todos.push(todo);
  saveTodos();
  renderTodos();
  taskInput.value = "";
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
  updateItemsCount();
  checkEmptyState();
}

function updateItemsCount() {
  const uncompleted = todos.filter((t) => !t.completed);
  itemsLeft.textContent = `${uncompleted.length} item${uncompleted.length !== 1 ? "s" : ""} left`;
}

function checkEmptyState() {
  const filtered = filterTodos(currentFilter);
  if (filtered.length === 0) emptyState.classList.remove("hidden");
  else emptyState.classList.add("hidden");
}

function renderTodos() {
  todosList.innerHTML = "";
  todosList.classList.remove("hidden");

  const filtered = filterTodos(currentFilter);
  filtered.forEach((todo) => {
    const li = document.createElement("li");
    li.classList.add("todo-item");
    if (todo.completed) li.classList.add("completed");

    const label = document.createElement("label");
    label.classList.add("checkbox-container");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("todo-checkbox");
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const checkmark = document.createElement("span");
    checkmark.classList.add("checkmark");

    label.appendChild(checkbox);
    label.appendChild(checkmark);

    const span = document.createElement("span");
    span.classList.add("todo-item-text");
    span.textContent = todo.text;

    const delBtn = document.createElement("button");
    delBtn.classList.add("delete-btn");
    delBtn.innerHTML = '<i class="fa-solid fa-times"></i>';
    delBtn.addEventListener("click", () => deleteTodo(todo.id));

    li.appendChild(label);
    li.appendChild(span);
    li.appendChild(delBtn);

    todosList.appendChild(li);
  });

  updateItemsCount();
  checkEmptyState();
}

function filterTodos(filter) {
  switch (filter) {
    case "active":
      return todos.filter((t) => !t.completed);
    case "completed":
      return todos.filter((t) => t.completed);
    default:
      return todos;
  }
}

function toggleTodo(id) {
  todos = todos.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  renderTodos();
}

function clearCompleted() {
  todos = todos.filter((t) => !t.completed);
  saveTodos();
  renderTodos();
}

filters.forEach((f) => {
  f.addEventListener("click", () => setActiveFilter(f.getAttribute("data-filter")));
});

function setActiveFilter(filter) {
  currentFilter = filter;
  filters.forEach((f) => f.classList.toggle("active", f.getAttribute("data-filter") === filter));
  renderTodos();
}

function setDate() {
  const options = { weekday: "long", month: "short", day: "numeric" };
  dateElement.textContent = new Date().toLocaleDateString("en-US", options);
}

function loadTodos() {
  const stored = localStorage.getItem("todos");
  if (stored) todos = JSON.parse(stored);
  renderTodos();
}

window.addEventListener("DOMContentLoaded", () => {
  loadTodos();
  setDate();
});
