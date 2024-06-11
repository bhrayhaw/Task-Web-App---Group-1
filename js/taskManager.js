class TaskManager {
  constructor(currentId = 0) {
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    this.currentId = this.tasks.length
      ? Math.max(...this.tasks.map((task) => task.id)) + 1
      : currentId;
  }

  addTask(name, description, assignedTo, dueDate, status = "TODO", priority) {
    const task = {
      id: this.currentId++,
      name,
      description,
      assignedTo,
      dueDate,
      status,
      priority,
    };
    this.tasks.push(task);
    this.save();
    return task;
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
    const existingTask = this.tasks.find((task) => task.id === taskId);
    if (existingTask) {
      Object.assign(existingTask, updatedTask);
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
