// Initialize a new instance of TaskManager
const taskManager = new TaskManager();

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#taskForm");
  const addCategoryBtn = document.querySelector("#addCategoryBtn");
  const taskBoard = document.querySelector("#taskBoard");

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent form submission

    const taskName = document.querySelector("#newTaskNameInput").value.trim();
    const taskDescription = document
      .querySelector("#newTaskDescriptionInput")
      .value.trim();
    const taskAssignedTo = document
      .querySelector("#newTaskAssignedToInput")
      .value.trim();
    const taskDueDate = document.querySelector("#newTaskDueDateInput").value;
    const taskStatus = document.querySelector("#newTaskStatusInput").value;

    // console.log("Form Submitted:", {
    //   taskName,
    //   taskDescription,
    //   taskAssignedTo,
    //   taskDueDate,
    //   taskStatus,
    // });

    if (
      validFormFieldInput({
        taskName,
        taskDescription,
        taskAssignedTo,
        taskDueDate,
        taskStatus,
      })
    ) {
      // console.log("Valid Input, Adding Task");
      addTaskToBoard(
        taskName,
        taskDescription,
        taskAssignedTo,
        taskDueDate,
        taskStatus
      );
      taskManager.addTask(
        taskName,
        taskDescription,
        taskAssignedTo,
        taskDueDate,
        taskStatus
      );
      console.log("Current Tasks:", taskManager.tasks);
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
});

function validFormFieldInput(data) {
  const { taskName, taskDescription, taskAssignedTo, taskDueDate, taskStatus } =
    data;

  if (taskName === "") {
    console.error("Task Name is required.");
    return false;
  }

  if (taskDescription === "") {
    console.error("Task Description is required.");
    return false;
  }

  if (taskAssignedTo === "") {
    console.error("Assigned To is required.");
    return false;
  }

  if (taskDueDate === "") {
    console.error("Due Date is required.");
    return false;
  }

  if (taskStatus === "") {
    console.error("Status is required.");
    return false;
  }

  return true;
}

function addTaskToBoard(
  taskName,
  taskDescription,
  taskAssignedTo,
  taskDueDate,
  taskStatus
) {
  const taskItem = document.createElement("li");
  taskItem.className = "list-group-item task-item";
  taskItem.draggable = true;
  taskItem.innerHTML = `
        <h5>${taskName}</h5>
        <p>${taskDescription}</p>
        <p><strong>Assigned To:</strong> ${taskAssignedTo}</p>
        <p><strong>Due Date:</strong> ${taskDueDate}</p>
        <p><strong>Status:</strong> ${
          taskStatus.charAt(0).toUpperCase() + taskStatus.slice(1)
        }</p>
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
}

function addCategoryToBoard(categoryName) {
  const categoryId = categoryName.toLowerCase().replace(/\s+/g, "-");
  const categoryColumn = document.createElement("div");
  categoryColumn.className = "col-md-3 category-column";
  categoryColumn.id = categoryId;
  categoryColumn.innerHTML = `
        <h4>${categoryName} <button class="btn btn-sm btn-danger remove-category">X</button></h4>
        <ul class="list-group" ondrop="handleDrop(event)" ondragover="handleDragOver(event)"></ul>
    `;

  const taskBoard = document.querySelector("#taskBoard");
  taskBoard.appendChild(categoryColumn);
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
  }
}

document.addEventListener("dragover", handleDragOver);
document.addEventListener("drop", handleDrop);


