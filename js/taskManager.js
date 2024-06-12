class TaskManager {
  constructor() {
    this.tasks = [];
    this.currentId = 1;
    this.loadTasksFromLocalStorage(); // Load tasks from local storage on initialization
  }

  addTask(name, description, assignedTo, dueDate, status, priority) {
    const task = {
      id: this.currentId++,
      name,
      description,
      assignedTo,
      dueDate,
      status,
      priority,
      isDone: false,
    };
    this.tasks.push(task);
    this.saveTasksToLocalStorage(); // Save tasks to local storage
    return task;
  }

  getTasks() {
    return this.tasks;
  }

  getTaskById(taskId) {
    return this.tasks.find((task) => task.id === taskId);
  }

  updateTask(taskId, updatedTask) {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = updatedTask;
      this.saveTasksToLocalStorage(); // Save tasks to local storage
    }
  }

  deleteTask(taskId) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    this.saveTasksToLocalStorage(); // Save tasks to local storage
  }

  markTaskAsDone(taskId) {
    const task = this.getTaskById(taskId);
    if (task) {
      task.isDone = true;
      task.status = "done"; // Update task status
      this.saveTasksToLocalStorage(); // Save tasks to local storage
    }
  }

  updateTaskStatus(taskId, newStatus) {
    const task = this.getTaskById(taskId);
    if (task) {
      task.status = newStatus;
      this.saveTasksToLocalStorage(); // Save tasks to local storage
    }
  }

  saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
      // Update currentId to be the next available ID
      this.currentId =
        this.tasks.length > 0
          ? Math.max(...this.tasks.map((task) => task.id)) + 1
          : 1;
      // Set isDone property based on task status
      this.tasks.forEach(task => {
        if (task.status === "done") {
          task.isDone = true;
        } else {
          task.isDone = false;
        }
      });
    }
  }

}