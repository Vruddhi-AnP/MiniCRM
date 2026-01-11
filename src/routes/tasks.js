/**
 * Task Routes
 * -----------
 * Handles all routing related to tasks.
 * Includes:
 * - Listing tasks
 * - Creating new tasks for clients
 * - Editing and updating existing tasks
 *
 * Access control is enforced using:
 * - Authentication middleware
 * - Role-based authorization middleware
 */

const express = require("express");
const router = express.Router();

// Controller containing task business logic
const taskController = require("../controllers/taskController");

// Middleware to ensure user is authenticated
const { ensureAuthenticated } = require("../middleware/authMiddleware");

// Middleware to restrict access based on user roles
const allowRoles = require("../middleware/roleMiddleware");

// ==============================
// TASK LISTING
// ==============================

/**
 * GET /tasks
 * List all tasks.
 * Accessible by: user, admin, superadmin
 */
router.get(
  "/tasks",
  ensureAuthenticated,
  allowRoles("user", "admin", "superadmin"),
  taskController.listTasks
);

// ==============================
// CREATE TASK (CLIENT-SCOPED)
// ==============================

/**
 * GET /clients/:id/tasks/new
 * Show form to create a new task for a specific client.
 * Accessible by: admin, superadmin
 */
router.get(
  "/clients/:id/tasks/new",
  ensureAuthenticated,
  allowRoles("admin", "superadmin"),
  taskController.showNewTaskForm
);

/**
 * POST /clients/:id/tasks/new
 * Create a new task for a specific client.
 * Accessible by: admin, superadmin
 */
router.post(
  "/clients/:id/tasks/new",
  ensureAuthenticated,
  allowRoles("admin", "superadmin"),
  taskController.createTask
);

// ==============================
// EDIT / UPDATE TASK
// ==============================

/**
 * GET /tasks/:id/edit
 * Show edit form for an existing task.
 * Accessible by: admin, superadmin
 */
router.get(
  "/tasks/:id/edit",
  ensureAuthenticated,
  allowRoles("admin", "superadmin"),
  taskController.showEditTaskForm
);

/**
 * POST /tasks/:id/edit
 * Update an existing task.
 * Accessible by: admin, superadmin
 */
router.post(
  "/tasks/:id/edit",
  ensureAuthenticated,
  allowRoles("admin", "superadmin"),
  taskController.updateTask
);

module.exports = router;
