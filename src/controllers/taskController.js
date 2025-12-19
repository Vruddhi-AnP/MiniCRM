
// for new.ejs k liyee
// const db = require("../db");

// // ==============================
// // LIST TASKS
// // GET /tasks
// // ==============================
// exports.listTasks = (req, res) => {
//   const status = req.query.status;

//   let sql = `
//     SELECT tasks.*, clients.name AS client_name
//     FROM tasks
//     LEFT JOIN clients ON tasks.client_id = clients.id
//   `;
//   let params = [];

//   if (status) {
//     sql += " WHERE tasks.status = ?";
//     params.push(status);
//   }

//   db.all(sql, params, (err, tasks) => {
//     if (err) {
//       console.error(err);
//       return res.send("DB error");
//     }

//     res.render("tasks/list", {
//       tasks,
//       currentStatus: status || "all",
//     });
//   });
// };

// // ==============================
// // SHOW NEW TASK FORM
// // GET /clients/:id/tasks/new
// // ==============================
// exports.showNewTaskForm = (req, res) => {
//   const clientId = req.params.id;

//   res.render("tasks/new", {
//     clientId,
//   });
// };

// // ==============================
// // CREATE TASK
// // POST /clients/:id/tasks/new
// // ==============================
// exports.createTask = (req, res) => {
//   const clientId = req.params.id;
//   const { title, status } = req.body;

//   if (!title) {
//     return res.send("Task title is required");
//   }

//   const sql = `
//     INSERT INTO tasks (title, status, client_id)
//     VALUES (?, ?, ?)
//   `;

//   db.run(sql, [title, status || "pending", clientId], function (err) {
//     if (err) {
//       console.error(err);
//       return res.send("DB error");
//     }

//     // 🔁 redirect back to client detail page
//     res.redirect(`/clients/${clientId}`);
//   });
// };



const db = require("../db");

// ==============================
// LIST TASKS
// GET /tasks
// ==============================
exports.listTasks = (req, res) => {
  const status = req.query.status;

  let sql = `
    SELECT tasks.*, clients.name AS client_name
    FROM tasks
    LEFT JOIN clients ON tasks.client_id = clients.id
  `;
  let params = [];

  if (status) {
    sql += " WHERE tasks.status = ?";
    params.push(status);
  }

  db.all(sql, params, (err, tasks) => {
    if (err) {
      console.error(err);
      return res.send("DB error");
    }

    res.render("tasks/list", {
      tasks,
      currentStatus: status || "all",
    });
  });
};

// ==============================
// SHOW NEW TASK FORM
// GET /clients/:id/tasks/new
// ==============================
exports.showNewTaskForm = (req, res) => {
  const clientId = req.params.id;

  // ✅ DIRECT form.ejs render (no fallback)
  res.render("tasks/form", { clientId });
};

// ==============================
// CREATE TASK
// POST /clients/:id/tasks/new
// ==============================
exports.createTask = (req, res) => {
  const clientId = req.params.id;
  const { title, status } = req.body;

  if (!title) {
    return res.send("Task title is required");
  }

  const sql = `
    INSERT INTO tasks (title, status, client_id)
    VALUES (?, ?, ?)
  `;

  db.run(sql, [title, status || "pending", clientId], function (err) {
    if (err) {
      console.error(err);
      return res.send("DB error");
    }

    res.redirect(`/clients/${clientId}`);
  });
};

