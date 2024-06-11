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
}
