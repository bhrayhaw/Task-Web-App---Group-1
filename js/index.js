const taskManager = new TaskManager();

// Function to load categories from local storage
function loadCategoriesFromLocalStorage() {
  const categories = JSON.parse(localStorage.getItem("categories")) || [];
  categories.forEach((category) => addCategoryToBoard(category));
}

// Function to save categories to local storage
function saveCategoriesToLocalStorage(categories) {
  localStorage.setItem("categories", JSON.stringify(categories));
}

function addTaskToBoard(
  taskId,
  taskName,
  taskDescription,
  taskAssignedTo,
  taskDueDate,
  taskStatus,
  taskPriority
) {
  const taskItem = document.createElement("li");
  taskItem.className = "list-group-item task-item";
  taskItem.draggable = true;
  taskItem.id = `task-${taskId}`;
  taskItem.innerHTML = `
    <h5>${taskName}</h5>
    <p>${taskDescription}</p>
    <p><strong>Assigned To:</strong> ${taskAssignedTo}</p>
    <p><strong>Due Date:</strong> ${taskDueDate}</p>
    <p><strong>Status:</strong> ${
      taskStatus.charAt(0).toUpperCase() + taskStatus.slice(1)
    }</p>
    <p><strong>Priority:</strong> ${taskPriority}</p>
    <button class="btn btn-sm btn-primary update-task">Update</button>
    <button class="btn btn-sm btn-danger remove-task">Remove</button>
  `;
  taskItem.dataset.status = taskStatus;

  const categoryColumn = document.querySelector(`#${taskStatus} ul`);
  if (categoryColumn) {
    categoryColumn.appendChild(taskItem);
  } else {
    console.error(`Category column for status ${taskStatus} not found`);
  }

  taskItem.addEventListener("dragstart", handleDragStart);
  taskItem.addEventListener("dragend", handleDragEnd);

  taskItem.querySelector(".remove-task").addEventListener("click", () => {
    taskManager.deleteTask(taskId);
    taskItem.remove();
  });

  taskItem.querySelector(".update-task").addEventListener("click", () => {
    const task = taskManager.getTasks().find((t) => t.id === taskId);
    if (task) {
      document.querySelector("#newTaskNameInput").value = task.name;
      document.querySelector("#newTaskDescriptionInput").value = task.description;
      document.querySelector("#newTaskAssignedToInput").value = task.assignedTo;
      document.querySelector("#newTaskDueDateInput").value = task.dueDate;
      document.querySelector("#newTaskStatusInput").value = task.status;
      document.querySelector("#newTaskPriorityInput").value = task.priority;
      document.querySelector("#taskFormSubmitButton").textContent = "Update Task";
      document.querySelector("#taskFormSubmitButton").dataset.id = task.id;
    }
  });
}

function loadTasksToBoard(taskManager) {
  const tasks = taskManager.getTasks();
  tasks.forEach((task) => {
    addTaskToBoard(
      task.id,
      task.name,
      task.description,
      task.assignedTo,
      task.dueDate,
      task.status
    );
  });
}

function handleDragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
  setTimeout(() => {
    event.target.classList.add("invisible");
  }, 0);
}

function handleDragEnd(event) {
  event.target.classList.remove("invisible");
}

function handleDragOver(event) {
  event.preventDefault();
}

function handleDrop(event) {
  event.preventDefault();
  const taskItemId = event.dataTransfer.getData("text/plain");
  const taskItem = document.getElementById(taskItemId);
  const targetCategory = event.target.closest(".category-column");

  if (taskItem && targetCategory) {
    const newStatus = targetCategory.id;
    taskItem.querySelector("p strong:last-child").innerText =
      newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
    taskItem.dataset.status = newStatus;
    targetCategory.querySelector("ul").appendChild(taskItem);

    const taskId = parseInt(taskItemId.split("-")[1]);
    const task = taskManager.getTasks().find((t) => t.id === taskId);
    if (task) {
      task.status = newStatus;
      taskManager.updateTask(taskId, task); // ensure the task status is updated in TaskManager and LocalStorage
    }
  }
}

document.addEventListener("dragover", handleDragOver);
document.addEventListener("drop", handleDrop);

function addCategoryToBoard(categoryName) {
  const taskBoard = document.querySelector("#taskBoard");
  const categoryColumn = document.createElement("div");
  categoryColumn.className = "category-column";
  categoryColumn.id = categoryName.toLowerCase().replace(/\s+/g, '-');
  categoryColumn.innerHTML = `
    <h3>${categoryName}</h3>
    <button class="btn btn-sm btn-danger remove-category">X</button>
    <ul class="list-group"></ul>
  `;
  taskBoard.appendChild(categoryColumn);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#taskForm");
  const addCategoryBtn = document.querySelector("#addCategoryBtn");
  const taskBoard = document.querySelector("#taskBoard");
  const saveButton = document.querySelector("#taskFormSubmitButton");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const taskName = document.querySelector("#newTaskNameInput").value.trim();
    const taskDescription = document.querySelector("#newTaskDescriptionInput").value.trim();
    const taskAssignedTo = document.querySelector("#newTaskAssignedToInput").value.trim();
    const taskDueDate = document.querySelector("#newTaskDueDateInput").value;
    const taskStatus = document.querySelector("#newTaskStatusInput").value;
    const taskPriority = document.querySelector("#newTaskPriorityInput").value;
    

    if (taskName && taskDescription && taskAssignedTo && taskDueDate) {
      if (saveButton.textContent === "Update Task" && saveButton.dataset.id) {
        const taskId = parseInt(saveButton.dataset.id);
        const updatedTask = {
          id: taskId,
          name: taskName,
          description: taskDescription,
          assignedTo: taskAssignedTo,
          dueDate: taskDueDate,
          status: taskStatus,
        };
        taskManager.updateTask(taskId, updatedTask);
        loadTasksToBoard(taskManager); // re-render the tasks on the board
        saveButton.textContent = "Add Task";
        delete saveButton.dataset.id;
      } else {
        taskManager.addTask(
          taskName,
          taskDescription,
          taskAssignedTo,
          taskDueDate,
          taskStatus
        );
        addTaskToBoard(
          taskManager.currentId - 1,
          taskName,
          taskDescription,
          taskAssignedTo,
          taskDueDate,
          taskStatus
        );
      }
      form.reset();
    } else {
      console.log("Invalid Input");
    }
  });

  addCategoryBtn.addEventListener("click", () => {
    const categoryName = document.querySelector("#newCategoryInput").value.trim();
    if (categoryName) {
      const categories = JSON.parse(localStorage.getItem("categories")) || [];
      categories.push(categoryName);
      saveCategoriesToLocalStorage(categories);

      addCategoryToBoard(categoryName);
      document.querySelector("#newCategoryInput").value = "";
    }
  });

  taskBoard.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-category")) {
      const categoryColumn = event.target.closest(".category-column");
      let categories = JSON.parse(localStorage.getItem("categories")) || [];
      categories = categories.filter(category => category.toLowerCase().replace(/\s+/g, '-') !== categoryColumn.id);
      saveCategoriesToLocalStorage(categories);

      categoryColumn.remove();
    }
  });

  loadTasksToBoard(taskManager);
  loadCategoriesFromLocalStorage();
});
