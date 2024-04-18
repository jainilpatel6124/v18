let form = document.getElementById("form");
let textInput = document.getElementById("textInput");

let msg = document.getElementById("msg");
let tasks = document.getElementById("tasks");
let add = document.getElementById("add");
let categoryselect = document.getElementById("categoryselect");
let priorityselect = document.getElementById("priorityselect");

// it is apply on modal 
form.addEventListener("submit", (e) => {
  e.preventDefault();
  formValidation();
});

//
var myModal = document.getElementById('form');
myModal.addEventListener('hide.bs.modal', function (event) {
  // Reset form fields when modal is closed
  document.getElementById('textInput').value = '';
  document.getElementById('categoryselect').selectedIndex = 0;
  document.getElementById('priorityselect').selectedIndex = 0;
  
});

let formValidation = () => {
  if (textInput.value === "" || categoryselect.value === "" || priorityselect.value === "") {
    console.log("failure");
    msg.innerHTML = "Please Fill All Fields";
  }  else {
    console.log("success");
    msg.innerHTML = "";
    acceptData();         
    add.setAttribute("data-bs-dismiss", "modal");
    add.click();

    (() => {
      add.setAttribute("data-bs-dismiss", "");
    })();
  }
};

let data = [{}];

let acceptData = () => {
  data.push({
    TaskTitle: textInput.value,
   
    category: categoryselect.value,
    priority: priorityselect.value,
    completed: false // default value for completed status
  });

  localStorage.setItem("data", JSON.stringify(data));

  console.log(data);
  createTasks();
};

// Function to render tasks based on filtered data
let renderTasks = (tasksArray) => {
  tasks.innerHTML = "";
  tasksArray.forEach((task, index) => {
    tasks.innerHTML += generateTaskHtml(task, index);
  });
};

let generateTaskHtml = (task, index) => {
  return `
    <div id=${index} style="min-width:40%; min-height:40%; text-wrap:wrap;   column-gap: 10px;" class="col-10 col-md-5 ">
      <span style="color:green;font-weight: 600;"> Completed <input type="checkbox"  class="marktask" id="task${index}" onchange="markTaskComplete(${index})" ${task.completed ? "checked" : ""}></span> <br/>
      <span class="fw-bold">TaskTitle : </span>
      <span >${task.TaskTitle}</span> <br/>
      <span class="fw-bold">Priority : </span>
      <span >${task.priority}</span><br/>
      <span class="fw-bold">Category : </span> 
      <span class="">${task.category}</span><br/><br/>
      <span class="options">
        <i onClick="editTask(this)" data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit fa-lg" style="color: #0780e4;"></i>

        <i onClick="sweetalert(this);createTasks()" class="fas fa-trash-alt fa-lg" style="color: #f2071f;"></i>
       
      </span>
    </div>`;
};

let createTasks = () => {
  renderTasks(data);
};

// Function to mark task as complete
let markTaskComplete = (taskId) => {
  data[taskId].completed = !data[taskId].completed;
  localStorage.setItem("data", JSON.stringify(data));
  createTasks();
//  let marked = document.getElementsByClassName("marktask")
//   marked[0].innerHTML ="green";
  
};



// sweet alert 

let sweetalert = (e) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteTask(e);
      Swal.fire("Deleted!", "Your file has been deleted.", "success").then(() => {
        // Reload the page after deletion
        location.reload();
      });
    } else {
      Swal.fire("Cancelled", "Your file is safe :)", "info");
    }
  });
};



// delete 

let deleteTask = (e) => {
  // Get the parent element of the task (the <div> containing the task)
  let taskElement = e.parentElement.parentElement;
  
  if (!taskElement) {
    console.error("Parent element not found");
    return;
  }
  
  // Get the task ID from the HTML element's id attribute
  let taskId = parseInt(taskElement.id);
  
  if (isNaN(taskId) || taskId < 0 || taskId >= data.length) {
    console.error("Invalid task ID");
    return;
  }
  
  // Remove the task element from the DOM
  taskElement.remove();
  
  // Remove the task from the data array
  data.splice(taskId, 1);
  
  // Update localStorage with the modified data
  localStorage.setItem("data", JSON.stringify(data));
  console.log("Task deleted:", taskId);
  console.log(data);
};


let editTask = (e) => {
  let selectedTask = e.parentElement.parentElement;

  textInput.value = selectedTask.children[3].innerHTML;
  
  categoryselect.value = selectedTask.children[9].innerHTML;
  priorityselect.value = selectedTask.children[6].innerHTML;
  deleteTask(e);
};

let resetForm = () => {
  textInput.value = "";
  
  categoryselect.value = "";
  priorityselect.value = "";
};

(() => {
  data = JSON.parse(localStorage.getItem("data")) || []
  console.log(data);
  createTasks();
})();

// search 
let searchInput = document.getElementById("searchInput");

let searchTasks = () => {
  let searchText = searchInput.value.toLowerCase();
  let filteredData = data.filter(task => {
    return task.TaskTitle.toLowerCase().includes(searchText) || 
           
           task.category.toLowerCase().includes(searchText) || 
           task.priority.toLowerCase().includes(searchText);
  });
  renderTasks(filteredData);
};

searchInput.addEventListener("input", searchTasks);

// Filtering tasks
document.getElementById("prioritySelect").addEventListener("change", function() {
  filterByPriority(this.value);
});

document.getElementById("categorySelect").addEventListener("change", function() {
  filterByCategory(this.value);
});

document.getElementById("statusSelect").addEventListener("change", function() {
  filterByStatus(this.value);
});

function filterByPriority(priority) {
  let filteredTasks;
  if (priority === "All") {
    // If no priority selected, show all tasks
    filteredTasks = data;
  } else {
    // Filter tasks by priority
    filteredTasks = data.filter(task => task.priority === priority);
  }
  renderTasks(filteredTasks);
}

function filterByCategory(category) {
  let filteredTasks;
  if (category === "All") {
    // If no category selected, show all tasks
    filteredTasks = data;
  } else {
    // Filter tasks by category
    filteredTasks = data.filter(task => task.category === category);
  }
  renderTasks(filteredTasks);
}

function filterByStatus(status) {
  let filteredTasks;
  if (status === "All") {
    // If no status selected, show all tasks
    filteredTasks = data;
  } else if (status === "Completed") {
    // Filter tasks by completed status
    filteredTasks = data.filter(task => task.completed);
  } else if (status === "Incomplete") {
    // Filter tasks by incomplete status
    filteredTasks = data.filter(task => !task.completed);
  }
  renderTasks(filteredTasks);
}



// Example usage:
 


// function to  get everything(completed and inProgress)



 

// csv

let exportToCSV = () => {
  // Generate header row
  const headers = Object.keys(data[0]);

  // Convert data to CSV format
  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(",")].concat(data.map(task => headers.map(header => {
   
      return task[header];
    
  }).join(","))).join("\n");

  // Create a hidden link element
  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csvContent));
  link.setAttribute("download", "tasks.csv");

  // Simulate a click on the link to trigger the download
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
};

// Add event listener to trigger CSV export
document.getElementById("exportToCSV").addEventListener("click", exportToCSV);

 
// emptying the input fields
document.getElementById("prioritySelect").addEventListener("click", function() {
  document.getElementById("categorySelect").selectedIndex = 0;
  document.getElementById("statusSelect").selectedIndex = 0;
});

document.getElementById("categorySelect").addEventListener("click", function() {
  document.getElementById("prioritySelect").selectedIndex = 0;
  document.getElementById("statusSelect").selectedIndex = 0;
});

document.getElementById("statusSelect").addEventListener("click", function() {
  document.getElementById("prioritySelect").selectedIndex = 0;
  document.getElementById("categorySelect").selectedIndex = 0;
});