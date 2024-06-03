class TaskManager {
  constructor(currentId = 0) {
    this.tasks = [];
    this.currentId = currentId;
  }
  addTask(name, description, assignedTo, dueDate, status = "TODO") {
    this.tasks.push({
      id: this.currentId++,
      name,
      description,
      assignedTo,
      dueDate,
      status,
    });
  }
}
