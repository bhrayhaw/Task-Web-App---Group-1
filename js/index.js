const taskManager = new TaskManager();

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#taskForm");
  const addCategoryBtn = document.querySelector("#addCategoryBtn");
  const taskBoard = document.querySelector("#taskBoard");
  const saveButton = document.querySelector("#taskFormSubmitButton");
  const dueDateInput = document.getElementById("newTaskDueDateInput");

  // Set `min` attribute immediately
  setDueDateMin();

  // Function to set min attribute
  function setDueDateMin() {
    const currentDate = new Date().toISOString().split("T")[0];
    dueDateInput.min = currentDate;
  }

  // Listen for changes to the due date input
  dueDateInput.addEventListener("input", setDueDateMin);

  document.addEventListener("click", (event) => {
    const categoryNameElement = event.target.closest(".category-name");
    if (categoryNameElement) {
      event.preventDefault(); // Prevent the default behavior of the Enter key
      const oldCategoryName = categoryNameElement.textContent.trim();
      const inputField = document.createElement("input");
      inputField.type = "text";
      inputField.value = oldCategoryName;
      categoryNameElement.replaceWith(inputField);
      inputField.focus();
      inputField.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          const newCategoryName = inputField.value.trim();
          if (newCategoryName && newCategoryName !== oldCategoryName) {
            categoryNameElement.textContent = newCategoryName;
            const categories =
              JSON.parse(localStorage.getItem("categories")) || [];
            const categoryIndex = categories.findIndex(
              (name) => name === oldCategoryName
            );
            if (categoryIndex !== -1) {
              categories[categoryIndex] = newCategoryName;
              localStorage.setItem("categories", JSON.stringify(categories));

              // Update tasks if category name changed
              const tasks = taskManager.getTasks();
              tasks.forEach((task) => {
                if (
                  task.status ===
                  oldCategoryName.toLowerCase().replace(/\s+/g, "-")
                ) {
                  task.status = newCategoryName
                    .toLowerCase()
                    .replace(/\s+/g, "-");
                  taskManager.saveTasksToLocalStorage();
                }
              });
            }
          }
          inputField.replaceWith(categoryNameElement);
        }
      });
    }
  });

  // Change cursor style to "pointer" when hovering over category name
  document.addEventListener("mouseover", (event) => {
    if (event.target.classList.contains("category-column")) {
      event.target.style.cursor = "pointer";
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const taskName = document.querySelector("#newTaskNameInput").value.trim();
    const taskDescription = document
      .querySelector("#newTaskDescriptionInput")
      .value.trim();
    const taskAssignedTo = document
      .querySelector("#newTaskAssignedToInput")
      .value.trim();
    const taskDueDate = document.getElementById("newTaskDueDateInput").value;
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
          priority: taskPriority,
          isDone: false,
        };
        taskManager.updateTask(taskId, updatedTask);
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
        taskItem.querySelector(
          "p:nth-of-type(5)"
        ).textContent = `Priority: ${taskPriority}`;
        saveButton.textContent = "Add Task";
        delete saveButton.dataset.id;
      } else {
        const newTask = taskManager.addTask(
          taskName,
          taskDescription,
          taskAssignedTo,
          taskDueDate,
          taskStatus,
          taskPriority
        );
        addTaskToBoard(newTask);
      }
      form.reset();
    } else {
      alert("Please fill out all fields.");
    }
  });

  addCategoryBtn.addEventListener("click", () => {
    const categoryName = document
      .querySelector("#newCategoryInput")
      .value.trim();
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
      categories = categories.filter(
        (category) =>
          category.toLowerCase().replace(/\s+/g, "-") !== categoryColumn.id
      );
      saveCategoriesToLocalStorage(categories);

      categoryColumn.remove();
    } else if (event.target.classList.contains("delete-task")) {
      const taskItem = event.target.closest(".task-item");
      const taskId = parseInt(taskItem.id.split("-")[1]);
      deleteTask(taskId, taskItem);
    } else if (event.target.classList.contains("mark-done")) {
      const taskItem = event.target.closest(".task-item");
      const taskId = parseInt(taskItem.id.split("-")[1]);
      const task = taskManager.getTaskById(taskId);
      if (task) {
        taskManager.markTaskAsDone(taskId);
        taskManager.updateTaskStatus(taskId, "done");
        const doneCategory = document.querySelector("#done ul");
        doneCategory.appendChild(taskItem);
        taskItem.querySelector("p:nth-of-type(4)").textContent = `Status: Done`;
        const updateButton = taskItem.querySelector(".update-task");
        if (updateButton) {
          updateButton.disabled = true; // Only set 'disabled' property if updateButton exists
        }
        event.target.remove();

        // Make the task item non-draggable after moving to 'done'
        taskItem.draggable = false;
        taskItem.removeEventListener("dragstart", handleDragStart);
        taskItem.removeEventListener("dragend", handleDragEnd);
      }
    } else if (event.target.classList.contains("update-task")) {
      const taskItem = event.target.closest(".task-item");
      const taskId = parseInt(taskItem.id.split("-")[1]);
      const task = taskManager.getTaskById(taskId);
      if (task) {
        populateFormWithTask(task);
      }
    }
  });

  document.addEventListener("dragover", handleDragOver);
  document.addEventListener("drop", handleDrop);

  loadTasksToBoard(taskManager);
  loadCategoriesFromLocalStorage();
});
