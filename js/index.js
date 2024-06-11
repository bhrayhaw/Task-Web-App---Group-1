const taskManager = new TaskManager();

function addTaskToBoard(
  taskId,
  taskName,
  taskDescription,
  taskAssignedTo,
  taskDueDate,
  taskStatus
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

  // new insertion - add click listener for updating task
  taskItem.querySelector(".update-task").addEventListener("click", () => {
    const task = taskManager.getTasks().find((t) => t.id === taskId);
    if (task) {
      document.querySelector("#newTaskNameInput").value = task.name;
      document.querySelector("#newTaskDescriptionInput").value =
        task.description;
      document.querySelector("#newTaskAssignedToInput").value = task.assignedTo;
      document.querySelector("#newTaskDueDateInput").value = task.dueDate;
      document.querySelector("#newTaskStatusInput").value = task.status;
      document.querySelector("#taskFormSubmitButton").textContent =
        "Update Task";
      document.querySelector("#taskFormSubmitButton").dataset.id = task.id;
    }
  });
  // end new insertion
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

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#taskForm");
  const addCategoryBtn = document.querySelector("#addCategoryBtn");
  const taskBoard = document.querySelector("#taskBoard");
  const saveButton = document.querySelector("#taskFormSubmitButton");
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const taskName = document.querySelector("#newTaskNameInput").value.trim();
    const taskDescription = document
      .querySelector("#newTaskDescriptionInput")
      .value.trim();
    const taskAssignedTo = document
      .querySelector("#newTaskAssignedToInput")
      .value.trim();
    const taskDueDate = document.querySelector("#newTaskDueDateInput").value;
    const taskStatus = document.querySelector("#newTaskStatusInput").value;

    if (taskName && taskDescription && taskAssignedTo && taskDueDate) {
      if (saveButton.textContent === "Update Task" && saveButton.dataset.id) {
        const taskId = saveButton.dataset.id;
        const updatedTask = {
          id: taskId,
          name: taskName,
          description: taskDescription,
          assignedTo: taskAssignedTo,
          dueDate: taskDueDate,
          status: taskStatus,
        };
        taskManager.updateTask(taskId, updatedTask);
        // Find and update the existing task in the UI
        const taskItem = document.getElementById(`task-${taskId}`);
        taskItem.querySelector("h5").textContent = taskName;
        taskItem.querySelector("p:nth-of-type(1)").textContent =
          taskDescription;
        taskItem.querySelector(
          "p:nth-of-type(2)"
        ).textContent = `Assigned To: ${taskAssignedTo}`;
        taskItem.querySelector(
          "p:nth-of-type(3)"
        ).textContent = `Due Date: ${taskDueDate}`;
        taskItem.querySelector(
          "p:nth-of-type(4)"
        ).textContent = `Status: ${taskStatus}`;
        saveButton.textContent = "Add Task";
        delete saveButton.dataset.id;
      } else {
        const newTask = taskManager.addTask(
          taskName,
          taskDescription,
          taskAssignedTo,
          taskDueDate,
          taskStatus
        );
        addTaskToBoard(
          newTask.id,
          newTask.name,
          newTask.description,
          newTask.assignedTo,
          newTask.dueDate,
          newTask.status
        );
      }
      form.reset();
    } else {
      console.log("Invalid Input");
    }
  });

  addCategoryBtn.addEventListener("click", () => {
    const categoryName = document
      .querySelector("#newCategoryInput")
      .value.trim();
    if (categoryName) {
      addCategoryToBoard(categoryName);
      document.querySelector("#newCategoryInput").value = "";
    }
  });

  taskBoard.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-category")) {
      const categoryColumn = event.target.closest(".category-column");
      categoryColumn.remove();
    }
  });

  loadTasksToBoard(taskManager);
});
