let tasks = [];
let data = [];
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

// Focus on the input field when the page loads
window.onload = function () {
    taskInput.focus();
    

    try {
        data = JSON.parse(localStorage.getItem("tasks")) || [];
    } catch {
        data = [];
    }
    if (data) {
        tasks = data;
        tasks.forEach((task) => {
            createTask(task, false); // false means don't save to localStorage again
        });
    }
    
};

// Event listener for the Add Task button
addBtn.addEventListener("click", addTask);

// Event listener for the Enter key in the input field
taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

function addTask() {
    // Get the input value and trim whitespace
    const text = taskInput.value.trim();

    // Validation: Check if the input is empty
    if (text == "") {
        alert("Please enter a task.");
        return;
    }

    // Create a new task object
    const newTask = {
        id: Date.now(),
        text: text,
        done: false,
    };

    createTask(newTask);
    console.log(newTask);



    // Clear input and focus back to input field
    taskInput.value = "";
    taskInput.focus();
}

// Function to create a new task element and append it to the task list
function createTask(newTask, save = true) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    // Set the text content of the span to the task text
    span.textContent = newTask.text;



    // If the task is marked as done, add the 'done' class to the span
    if (newTask.done) {
        span.classList.add("done");
    }

    // Event listener for toggling the done state of the task
    span.addEventListener("click", function () {
        span.classList.toggle("done");
        newTask.done = !newTask.done;
        saveTasks();
    });

    // Delete Button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function (e) {
        e.stopPropagation(); // Prevent the click from bubbling up to the span
        taskList.removeChild(li);
        // Remove the task from the tasks array and update localStorage
        tasks = tasks.filter((task) => task.id !== newTask.id);
        saveTasks();
    });

    // Append elements
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    // Save the task to localStorage if save is true
    if (save) {
        tasks.push(newTask);
        saveTasks();
    }
}
// Function to save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
