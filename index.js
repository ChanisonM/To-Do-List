let tasks = [];
let currentFilter = 'all';

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll("#filters button");

// Load tasks
window.onload = function () {
    taskInput.focus();

    try {
        tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    } catch {
        tasks = [];
    }

    renderTasks();
};

// Add task
addBtn.addEventListener("click", addTask);

// Enter key
taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

// Filter
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter;

        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        renderTasks();
    });
});

function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        // alert("Please enter a task.");
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please enter a task.",
            showConfirmButton: false,
            timer: 1500
        });
        return;
    }


    const newTask = {
        id: Date.now(),
        text: text,
        done: false,
    };

    tasks.push(newTask);
    Swal.fire({
        position: "center",
        icon: "success",
        title: "Saved!",
        showConfirmButton: false,
        timer: 1500
    });
    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}

// Render
function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = [];

    if (currentFilter === 'all') {
        filteredTasks = tasks;
    } else if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.done);
    } else if (currentFilter === 'done') {
        filteredTasks = tasks.filter(task => task.done);
    }

    filteredTasks.forEach(task => createTask(task));
}

// Create task
function createTask(task) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";



    span.textContent = task.text;

    if (task.done) {
        span.classList.add("done");
    }

    // Toggle done
    span.addEventListener("click", () => {
        task.done = !task.done;

        saveTasks();
        renderTasks();
    });


    editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        editTask(span, task);
    })

    // Delete
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        tasks = tasks.filter(t => t.id !== task.id);

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) Swal.fire({
                title: "Deleted!",
                text: "Your data has been deleted.",
                icon: "success",
            }).then(() => {
                saveTasks();
                renderTasks();
            });
        });

    });

    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

// Edit
function editTask(span, task) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = task.text;

    span.replaceWith(input);
    input.focus();

    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            saveEdit(input, task);
        }
    });

    input.addEventListener("blur", () => {
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Saved!",
            showConfirmButton: false,
            timer: 1500
        });
        saveEdit(input, task);
    });
}

// Save edit
function saveEdit(input, task) {
    const newText = input.value.trim();

    if (newText === "") {
        // alert("Task cannot be empty.");
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Task cannot be empty.",
        });
        return;
    }

    task.text = newText;
    saveTasks();
    renderTasks();
}

// Save
function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));
}