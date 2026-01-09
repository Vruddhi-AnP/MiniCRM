
const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

const { ensureAuthenticated } = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// ✅ List tasks (USER + ADMIN + SUPERADMIN)
router.get(
  "/tasks",
  ensureAuthenticated,
  allowRoles("user", "admin", "superadmin"),
  taskController.listTasks
);

// ❌ New task form (ADMIN + SUPERADMIN ONLY)
router.get(
  "/clients/:id/tasks/new",
  ensureAuthenticated,
  allowRoles("admin", "superadmin"),
  taskController.showNewTaskForm
);

// ❌ Save task (ADMIN + SUPERADMIN ONLY)
router.post(
  "/clients/:id/tasks/new",
  ensureAuthenticated,
  allowRoles("admin", "superadmin"),
  taskController.createTask
);

module.exports = router;
