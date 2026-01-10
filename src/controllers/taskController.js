
const db = require("../db");

// ==============================
// LIST TASKS
// GET /tasks
// ==============================
exports.listTasks = (req, res) => {
  const status = req.query.status;
  const search = req.query.q || "";

  let sql = `
    SELECT tasks.*, clients.name AS client_name
    FROM tasks
    LEFT JOIN clients ON tasks.client_id = clients.id
  `;

  let params = [];
  let conditions = [];

  if (status) {
    conditions.push("tasks.status = ?");
    params.push(status);
  }

  if (search) {
    conditions.push("tasks.title LIKE ?");
    params.push(`%${search}%`);
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

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
exports.showNewTaskForm = (req, res) => {
  const clientId = req.params.id;
  res.render("tasks/form", { clientId });
};

// ==============================
// CREATE TASK
// POST /clients/:id/tasks/new
// ==============================
exports.createTask = (req, res) => {
  const clientId = req.params.id;
  const { title, status, due_date } = req.body;

  if (!title) {
    return res.send("Task title is required");
  }

  const sql = `
    INSERT INTO tasks (title, status, due_date, client_id)
    VALUES (?, ?, ?, ?)
  `;

  db.run(
    sql,
    [title, status || "pending", due_date || null, clientId],
    function (err) {
      if (err) {
        console.error(err);
        return res.send("DB error");
      }

      res.redirect(`/clients/${clientId}`);
    }
  );
};

// ==============================
// SHOW EDIT TASK FORM (SAFE ADD)
// GET /tasks/:id/edit
// ==============================
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
        isEdit: true
      });
    }
  );
};

// ==============================
// UPDATE TASK (SAFE ADD)
// POST /tasks/:id/edit
// ==============================
exports.updateTask = (req, res) => {
  const taskId = req.params.id;
  const { title, status, due_date } = req.body;

  if (!title) {
    return res.send("Task title is required");
  }

  // 🔹 First get client_id (SAFE)
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
        SET title = ?, status = ?, due_date = ?
        WHERE id = ?
      `;

      db.run(
        sql,
        [title, status, due_date || null, taskId],
        function (err) {
          if (err) {
            console.error(err);
            return res.send("DB error");
          }

          // ✅ SAFE REDIRECT
          res.redirect(`/clients/${task.client_id}`);
        }
      );
    }
  );
};
