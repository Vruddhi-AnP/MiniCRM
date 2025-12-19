// const express = require("express");
// const router = express.Router();
// const taskController = require("../controllers/taskController");

// // List tasks
// router.get("/tasks", taskController.listTasks);

// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const taskController = require("../controllers/taskController");

// // ==============================
// // SHOW NEW TASK FORM (CLIENT SPECIFIC)
// // GET /clients/:id/tasks/new
// // ==============================
// router.get("/clients/:id/tasks/new", taskController.showNewTaskForm);

// // ==============================
// // LIST TASKS
// // GET /tasks
// // ==============================
// router.get("/tasks", taskController.listTasks);

// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const taskController = require("../controllers/taskController");

// // 🔥 NEW TASK FORM (IMPORTANT: above others)
// router.get(
//   "/clients/:id/tasks/new",
//   taskController.showNewTaskForm
// );

// // List tasks
// router.get("/tasks", taskController.listTasks);

// module.exports = router;


const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// List tasks
router.get("/tasks", taskController.listTasks);

// New task form
router.get(
  "/clients/:id/tasks/new",
  taskController.showNewTaskForm
);

// Save task
router.post(
  "/clients/:id/tasks/new",
  taskController.createTask
);

module.exports = router;
