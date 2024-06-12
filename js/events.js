function handleDragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
}

function handleDragEnd(event) {
  event.preventDefault();
  const taskItem = event.target;
  const updateButton = taskItem.querySelector(".update-task");
  const markDoneButton = taskItem.querySelector(".mark-done");
  if (updateButton) {
    updateButton.remove(); // Remove update button
  }
  if (markDoneButton) {
    markDoneButton.remove(); // Remove mark done button
  }
}

function handleDragOver(event) {
  event.preventDefault();
}

// function handleDrop(event) {
//   event.preventDefault();
//   const taskId = event.dataTransfer.getData("text/plain");
//   const taskItem = document.getElementById(taskId);
//   const newStatus = event.target.closest(".category-column").id;
//   const task = taskManager.getTaskById(parseInt(taskId.split("-")[1]));

//   if (task && newStatus !== "done") {
//     taskManager.updateTaskStatus(task.id, newStatus);
//     event.target
//       .closest(".category-column")
//       .querySelector("ul")
//       .appendChild(taskItem);
//     taskItem.querySelector(
//       "p:nth-of-type(4)"
//     ).textContent = `Status: ${newStatus}`;
//   }
// }

function handleDrop(event) {
  event.preventDefault();
  const taskItemId = event.dataTransfer.getData("text/plain");
  const taskItem = document.getElementById(taskItemId);
  const targetCategory = event.target.closest(".category-column");

  if (taskItem && targetCategory) {
    const newStatus = targetCategory.id;
    const taskId = parseInt(taskItemId.split("-")[1]);
    const task = taskManager.getTaskById(taskId);

    if (task) {
      // Update the task object's status
      task.status = newStatus;
      taskManager.saveTasksToLocalStorage();

      // Remove the old task item
      taskItem.remove();

      // Create a new task item with the updated status
      addTaskToBoard(task);

      // If task is moved to done category, remove or deactivate update button
      if (newStatus === "done") {
        const updateButton = taskItem.querySelector(".update-task");
        if (updateButton) {
          updateButton.remove(); // Remove update button
        }
      }
    }
  }
}
