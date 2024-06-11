const taskManager = new TaskManager();

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
        addTaskToBoard(
          newTask.id,
          newTask.name,
          newTask.description,
          newTask.assignedTo,
          newTask.dueDate,
          newTask.status,
          newTask.priority,
          newTask.isDone
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
    } else if (event.target.classList.contains("mark-done")) {
      const taskItem = event.target.closest(".task-item");
      const taskId = parseInt(taskItem.id.split("-")[1]);
      const task = taskManager.getTasks().find((t) => t.id === taskId);
      if (task) {
        taskManager.markTaskAsDone(taskId);
        taskManager.updateTaskStatus(taskId, "done");
        const doneCategory = document.querySelector("#done ul");
        doneCategory.appendChild(taskItem);
        taskItem.querySelector("p:nth-of-type(4)").textContent = `Status: Done`;
        taskItem.querySelector(".update-task").disabled = true;
        event.target.remove();
      }
    }
  });

  document.addEventListener("dragover", handleDragOver);
  document.addEventListener("drop", handleDrop);

  loadTasksToBoard(taskManager);
  loadCategoriesFromLocalStorage();
});
