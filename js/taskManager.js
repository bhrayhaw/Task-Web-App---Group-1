class TaskManager {
  constructor(currentId = 0) {
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    this.currentId = this.tasks.length
      ? Math.max(...this.tasks.map((task) => task.id)) + 1
      : currentId;
  }

  addTask(name, description, assignedTo, dueDate, status = "TODO", priority) {
    this.tasks.push({
      id: this.currentId++,
      name,
      description,
      assignedTo,
      dueDate,
      status,
      priority,
    });
    this.save();
  }

  deleteTask(taskId) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    this.save();
  }

  updateTaskStatus(taskId, newStatus) {
    const task = this.tasks.find((task) => task.id === taskId);
    if (task) {
      task.status = newStatus;
      this.save();
    }
  }

  updateTask(taskId, updatedTask) {
    const task = this.tasks.find((task) => task.id === taskId);
    if (task != -1) {
      this.tasks[task] = updatedTask;
      this.save();
    }
  }

  getTasks() {
    return this.tasks;
  }

  save() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }
}


