function handleDragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
  setTimeout(() => {
    event.target.classList.add("invisible");
  }, 0);
  if (event.target.classList.contains("category-column")) {
    event.dataTransfer.setData("text/plain", event.target.id);
  }
}

function handleDragEnd(event) {
  event.target.classList.remove("invisible");
}

function handleDragOver(event) {
  event.preventDefault();
  const taskItemId = event.dataTransfer.getData("text/plain");
  const taskItem = document.getElementById(taskItemId);
  if (taskItem && taskItem.classList.contains("category-column")) {
    event.preventDefault();
  }
}

function handleDrop(event) {
  event.preventDefault();
  const taskItemId = event.dataTransfer.getData("text/plain");
  const taskItem = document.getElementById(taskItemId);
  const targetCategory = event.target.closest(".category-column");

  if (taskItem && targetCategory) {
    const newStatus = targetCategory.id;
    const statusParagraph = taskItem.querySelectorAll("p")[3];
    if (statusParagraph) {
      statusParagraph.innerHTML = `<strong>Status:</strong> ${
        newStatus.charAt(0).toUpperCase() + newStatus.slice(1)
      }`;
    }
    taskItem.dataset.status = newStatus;
    targetCategory.querySelector("ul").appendChild(taskItem);

    const taskId = parseInt(taskItemId.split("-")[1]);
    const task = taskManager.getTasks().find((t) => t.id === taskId);
    if (task) {
      task.status = newStatus;
      taskManager.updateTask(taskId, task);
    }
  }
  // Inside the handleDrop function

  if (taskItem && taskItem.classList.contains("category-column")) {
    const taskBoard = document.querySelector("#taskBoard");
    taskBoard.insertBefore(taskItem, targetCategory.nextSibling);
    const categories = Array.from(
      document.querySelectorAll(".category-column")
    ).map((category) => category.id);
    saveCategoriesToLocalStorage(categories);
  }
}
