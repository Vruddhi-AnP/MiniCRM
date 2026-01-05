
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
