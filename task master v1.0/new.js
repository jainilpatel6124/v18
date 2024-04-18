// DOM elements
const form = document.getElementById("form");
const textInput = document.getElementById("textInput");
const dateInput = document.getElementById("dateInput");
const textarea = document.getElementById("textarea");
const msg = document.getElementById("msg");
const tasks = document.getElementById("tasks");
const add = document.getElementById("add");
const categorySelect = document.getElementById("categorySelect");
const prioritySelect = document.getElementById("prioritySelect");
const searchInput = document.getElementById("searchInput");

// Event listeners
form.addEventListener("submit", handleFormSubmission);
searchInput.addEventListener("input", searchTasks);
add.addEventListener("click", () => resetForm());

// Data initialization
let data = JSON.parse(localStorage.getItem("data")) || [];
createTasks();

// Functions
function handleFormSubmission(e) {
  e.preventDefault();
  if (formValidation()) {
    acceptData();
    $('#form').modal('hide');
  }
}

function formValidation() {
  if (textInput.value === "") {
    msg.innerHTML = "Task title cannot be blank";
    return false;
  } else {
    msg.innerHTML = "";
    return true;
  }
}

function acceptData() {
  const task = {
    text: textInput.value,
    date: dateInput.value,
    description: textarea
  }}