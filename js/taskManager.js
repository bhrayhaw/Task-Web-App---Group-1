// class TaskManager {
//   constructor(currentId = 0) {
//     this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
//     this.currentId = this.tasks.length
//       ? Math.max(...this.tasks.map((task) => task.id)) + 1
//       : currentId;
//   }

//   addTask(name, description, assignedTo, dueDate, status = "TODO") {
//     this.tasks.push({
//       id: this.currentId++,
//       name,
//       description,
//       assignedTo,
//       dueDate,
//       status,
//     });
//     this.save();
//   }

//   deleteTask(taskId) {
//     this.tasks = this.tasks.filter((task) => task.id !== taskId);
//     this.save();
//   }

//   updateTaskStatus(taskId, newStatus) {
//     const task = this.tasks.find((task) => task.id === taskId);
//     if (task) {
//       task.status = newStatus;
//       this.save();
//     }
//   }

//   updateTask(taskId, updatedTask) {
//     const task = this.tasks.find((task) => task.id === taskId);
//     if (task != -1) {
//       this.tasks[task] = updatedTask;
//       this.save();
//     }
//   }

//   getTasks() {
//     return this.tasks;
//   }

//   save() {
//     localStorage.setItem("tasks", JSON.stringify(this.tasks));
//   }
// }

class TaskManager {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  }

<<<<<<< HEAD
  addTask(name, description, assignedTo, dueDate, status = "TODO", priority) {
    this.tasks.push({
      id: this.currentId++,
=======
  addTask(name, description, assignedTo, dueDate, status = "TODO") {
    const task = {
      id: this.generateUniqueId(),
>>>>>>> 815ed4d0a4c2ff83a8b62336e15246b558c152c7
      name,
      description,
      assignedTo,
      dueDate,
      status,
<<<<<<< HEAD
      priority,
    });
=======
    };
    this.tasks.push(task);
>>>>>>> 815ed4d0a4c2ff83a8b62336e15246b558c152c7
    this.save();
    return task; // Return the newly added task
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
      Object.assign(existingTask, updatedTask); // Update existing task
    } else {
      this.tasks.push(updatedTask); // Add new task
    }
    this.save();
  }

  generateUniqueId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  }

  getTasks() {
    return this.tasks;
  }

  save() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }
}


