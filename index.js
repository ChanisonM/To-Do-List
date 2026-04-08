let tasks = [];
let data = [];
let currentFilter = 'all'
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll("#filters button")

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
        renderTasks()
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


filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter
        // console.log(currentFilter);
        renderTasks();
    })
})



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
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    



    // Clear input and focus back to input field
    taskInput.value = "";
    taskInput.focus();
}

// Function to render tasks based on the current filter
function renderTasks() {
    taskList.innerHTML = "";
    let filteredTasks = [];
    if(currentFilter === 'all'){
        filteredTasks = tasks;
    }else if(currentFilter === 'active'){
        filteredTasks = tasks.filter(task => !task.done);
    }else if(currentFilter === 'completed'){
        filteredTasks = tasks.filter(task => task.done);
    }
    filteredTasks.forEach(task => createTask(task, false));
}

// Function to create a new task element and append it to the task list
// ฟังชันนี้จะสร้าง element ของ task ใหม่และเพิ่มเข้าไปใน list ของ task
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


    // Event listener for editing the task on double-click
    span.addEventListener('dblclick', () => {
        editTask(span, newTask);
    })

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

// Function to edit a task
function editTask(span, newTask) {
    // Create an input field and replace the span with it
    const input = document.createElement("input")
    input.type = "text";
    input.value = newTask.text 
    span.replaceWith(input);
    input.focus();

    // Event listener for saving the edited task on Enter key press
    input.addEventListener("keypress" , (e) => {
        if(e.key === "Enter") {
            saveEdit(input, span, newTask)
        }
    })
    // Event listener for saving the edited task when the input loses focus
    input.addEventListener("blur", () => {
        saveEdit(input, span, newTask)
    })
}

// Function to save the edited task
function saveEdit(input, span, newTask) {
    
    const newText =  input.value.trim()
    if(newText === ""){
        alert("Task cannot be empty.")
        input.focus();
        return;
    }
    newTask.text = newText;
    span.textContent = newText;

    input.replaceWith(span);
    saveTasks()

}


// Function to save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

