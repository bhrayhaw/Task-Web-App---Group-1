function createTaskHTML(task) {
  const taskItem = document.createElement("li");
  taskItem.className = "list-group-item task-item";
  taskItem.draggable = true;
  taskItem.id = `task-${task.id}`;

  // Define color and text style based on priority
  let priorityColor, priorityText;
  switch (task.priority) {
    case "LOW":
      priorityColor = "gray";
      priorityText = "Low Priority";
      break;
    case "MEDIUM":
      priorityColor = "green";
      priorityText = "Medium Priority";
      break;
    case "URGENT":
      priorityColor = "red";
      priorityText = "Urgent Priority";
      break;
    default:
      priorityColor = "black";
      priorityText = "Unknown Priority";
  }

  taskItem.innerHTML = `
    <h5>${task.name}</h5>
    <p>${task.description}</p>
    <p><strong>Assigned To:</strong> ${task.assignedTo}</p>
    <p><strong>Due Date:</strong> ${task.dueDate}</p>
    <p><strong>Status:</strong> ${task.status}</p>
    <p><strong>Priority:</strong> <span style="color: ${priorityColor}; font-weight: bold;">${priorityText}</span></p>
    <div class="button-group">
      <button class="btn btn-sm btn-warning update-task">Update</button>
      <button class="btn btn-sm btn-danger delete-task">Delete</button>
      ${
        task.isDone !== "done"
          ? '<button class="btn btn-sm btn-success mark-done">Mark Done</button>'
          : ""
      }
    </div>
  `;

  taskItem.dataset.status = task.status;

  return taskItem;
}


function addTaskToBoard(task) {
  console.log("Task status:", task.status); // Log the task status

  const taskItem = createTaskHTML(task);
  const categoryColumn = document.querySelector(`#${task.status} ul`);
  if (categoryColumn) {
    categoryColumn.appendChild(taskItem);
  } else {
    console.error(`Category column for status ${task.status} not found`);
  }

  if (task.isDone === false) {
    taskItem.addEventListener("dragstart", handleDragStart);
    taskItem.addEventListener("dragend", handleDragEnd);
  } else {
    // If task is marked as done, remove or deactivate both update and mark done buttons
    const updateButton = taskItem.querySelector(".update-task");
    if (updateButton) {
      updateButton.remove(); // Remove update button
    }
    const markDoneButton = taskItem.querySelector(".mark-done");
    if (markDoneButton) {
      markDoneButton.remove(); // Remove mark done button
    }
  }
}



function deleteTask(taskId, taskItem) {
  taskManager.deleteTask(taskId);
  taskItem.remove();
}

function populateFormWithTask(task) {
  const taskNameInput = document.querySelector("#newTaskNameInput");
  const taskDescriptionInput = document.querySelector(
    "#newTaskDescriptionInput"
  );
  const taskAssignedToInput = document.querySelector("#newTaskAssignedToInput");
  const taskDueDateInput = document.querySelector("#newTaskDueDateInput");
  const taskStatusInput = document.querySelector("#newTaskStatusInput");
  const taskPriorityInput = document.querySelector("#newTaskPriorityInput");
  const saveButton = document.querySelector("#taskFormSubmitButton");

  taskNameInput.value = task.name;
  taskDescriptionInput.value = task.description;
  taskAssignedToInput.value = task.assignedTo;
  taskDueDateInput.value = task.dueDate;
  taskStatusInput.value = task.status;
  taskPriorityInput.value = task.priority;

  saveButton.textContent = "Update Task";
  saveButton.dataset.id = task.id;
}

function loadTasksToBoard(taskManager) {
  const tasks = taskManager.getTasks();
  tasks.forEach((task) => {
    addTaskToBoard(task);
  });
}

function addCategoryToBoard(categoryName) {
  const taskBoard = document.querySelector("#taskBoard");
  const newCategoryColumn = document.createElement("div");
  newCategoryColumn.classList.add("category-column");
  newCategoryColumn.id = categoryName.toLowerCase().replace(/\s+/g, "-");
  newCategoryColumn.innerHTML = `
    <h4>${categoryName} <button class="btn btn-sm btn-danger remove-category">X</button></h4>
    <ul class="list-group"></ul>
  `;

  taskBoard.appendChild(newCategoryColumn);

  newCategoryColumn.addEventListener("dragover", handleDragOver);
  newCategoryColumn.addEventListener("drop", handleDrop);
}

function removeCategory(categoryColumn) {
  let categories = JSON.parse(localStorage.getItem("categories")) || [];
  categories = categories.filter(
    (category) =>
      category.toLowerCase().replace(/\s+/g, "-") !== categoryColumn.id
  );
  saveCategoriesToLocalStorage(categories);

  categoryColumn.remove();
}

function loadCategoriesFromLocalStorage() {
  const categories = JSON.parse(localStorage.getItem("categories")) || [
    "Todo",
    "In Progress",
    "In Review",
    "Done",
  ];

  saveCategoriesToLocalStorage(categories);

  categories.forEach(addCategoryToBoard);
}

function saveCategoriesToLocalStorage(categories) {
  localStorage.setItem("categories", JSON.stringify(categories));
}
