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
    <button class="btn btn-sm btn-success mark-done">Mark as Done</button>
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
      document.querySelector("#newTaskDescriptionInput").value =
        task.description;
      document.querySelector("#newTaskAssignedToInput").value = task.assignedTo;
      document.querySelector("#newTaskDueDateInput").value = task.dueDate;
      document.querySelector("#newTaskStatusInput").value = task.status;
      document.querySelector("#newTaskPriorityInput").value = task.priority;
      saveButton.textContent = "Update Task";
      saveButton.dataset.id = taskId;
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
      task.status,
      task.priority
    );
  });
}

// Function to load categories from local storage
function loadCategoriesFromLocalStorage() {
  const categories = JSON.parse(localStorage.getItem("categories")) || [];
  categories.forEach((category) => addCategoryToBoard(category));
}

// Function to save categories to local storage
function saveCategoriesToLocalStorage(categories) {
  localStorage.setItem("categories", JSON.stringify(categories));
}

function addCategoryToBoard(categoryName) {
  const taskBoard = document.querySelector("#taskBoard");
  const categoryColumn = document.createElement("div");
  categoryColumn.className = "category-column";
  categoryColumn.id = categoryName.toLowerCase().replace(/\s+/g, "-");
  categoryColumn.innerHTML = `
    <h3>${categoryName}</h3>
    <button class="btn btn-sm btn-danger remove-category">X</button>
    <ul class="list-group"></ul>
  `;
  taskBoard.appendChild(categoryColumn);
}
