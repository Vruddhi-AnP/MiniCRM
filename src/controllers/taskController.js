/**
 * Task Controller
 * ---------------
 * Handles all task-related business logic.
 * Responsibilities include:
 * - Listing tasks with filters
 * - Creating new tasks for clients
 * - Editing existing tasks
 * - Updating task details
 *
 * Tasks are always associated with a client.
 */

const db = require("../db");

// ==============================
// LIST TASKS
// GET /tasks
// ==============================
/**
 * Fetches and displays a list of tasks.
 * Supports:
 * - Filtering by task status
 * - Searching by task title
 * Also joins client data for contextual display.
 */
exports.listTasks = (req, res) => {
  const status = req.query.status;
  const search = req.query.q || "";

  // Base query joining tasks with client names
  let sql = `
    SELECT tasks.*, clients.name AS client_name
    FROM tasks
    LEFT JOIN clients ON tasks.client_id = clients.id
  `;

  let params = [];
  let conditions = [];

  // Apply status filter if provided and not "all"
  if (status && status !== "all") {
    conditions.push("tasks.status = ?");
    params.push(status);
  }

  // Apply search filter on task title
  if (search) {
    conditions.push("tasks.title LIKE ?");
    params.push(`%${search}%`);
  }

  // Attach WHERE clause only if filters exist
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  // Execute query and render task list view
  db.all(sql, params, (err, tasks) => {
    if (err) {
      console.error(err);
      return res.send("DB error");
    }

    res.render("tasks/list", {
      tasks,
      currentStatus: status || "all",
      searchQuery: search,
    });
  });
};

// ==============================
// SHOW NEW TASK FORM
// GET /clients/:id/tasks/new
// ==============================
/**
 * Renders the form to create a new task for a client.
 * Uses the same form template as edit mode.
 */
exports.showNewTaskForm = (req, res) => {
  const clientId = req.params.id;

  res.render("tasks/form", {
    clientId,
    isEdit: false,
    task: null
  });
};

// ==============================
// CREATE TASK
// POST /clients/:id/tasks/new
// ==============================
/**
 * Creates a new task for a client.
 * Performs basic validation before insertion.
 */
exports.createTask = (req, res) => {
  const clientId = req.params.id;
  const { title, description, assigned_to, status, due_date } = req.body;

  // Validation: task title is mandatory
  if (!title) {
    return res.send("Task title is required");
  }

  const sql = `
    INSERT INTO tasks
    (title, description, assigned_to, status, due_date, client_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      title,
      description || null,
      assigned_to || null,
      status || "pending",
      due_date || null,
      clientId
    ],
    function (err) {
      if (err) {
        console.error(err);
        return res.send("DB error");
      }

      // Redirect back to client detail page after creation
      res.redirect(`/clients/${clientId}`);
    }
  );
};

// ==============================
// SHOW EDIT TASK FORM
// GET /tasks/:id/edit
// ==============================
/**
 * Renders the edit form for an existing task.
 * Pre-fills the form using current task data.
 */
exports.showEditTaskForm = (req, res) => {
  const taskId = req.params.id;

  db.get(
    "SELECT * FROM tasks WHERE id = ?",
    [taskId],
    (err, task) => {
      if (err || !task) {
        console.error(err);
        return res.status(404).send("Task not found");
      }

      res.render("tasks/form", {
        task,
        clientId: task.client_id,
        isEdit: true
      });
    }
  );
};

// ==============================
// UPDATE TASK
// POST /tasks/:id/edit
// ==============================
/**
 * Updates an existing task.
 * Also updates the `updated_at` timestamp to track modifications.
 */
exports.updateTask = (req, res) => {
  const taskId = req.params.id;
  const { title, description, assigned_to, status, due_date } = req.body;

  // Validation: task title is mandatory
  if (!title) {
    return res.send("Task title is required");
  }

  /**
   * Fetch client_id to ensure safe redirection
   * back to the related client detail page.
   */
  db.get(
    "SELECT client_id FROM tasks WHERE id = ?",
    [taskId],
    (err, task) => {
      if (err || !task) {
        console.error(err);
        return res.send("Task not found");
      }

      const sql = `
        UPDATE tasks
        SET
          title = ?,
          description = ?,
          assigned_to = ?,
          status = ?,
          due_date = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      db.run(
        sql,
        [
          title,
          description || null,
          assigned_to || null,
          status || "pending",
          due_date || null,
          taskId
        ],
        function (err) {
          if (err) {
            console.error(err);
            return res.send("DB error");
          }

          // Redirect back to the client detail page
          res.redirect(`/clients/${task.client_id}`);
        }
      );
    }
  );
};
