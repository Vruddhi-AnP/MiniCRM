// mainn codeee

// const db = require("../db");

// // Convert db.get to promise
// function runGet(query, params = []) {
//   return new Promise((resolve, reject) => {
//     db.get(query, params, (err, row) => {
//       if (err) reject(err);
//       else resolve(row);
//     });
//   });
// }

// // Convert db.all to promise
// function runAll(query, params = []) {
//   return new Promise((resolve, reject) => {
//     db.all(query, params, (err, rows) => {
//       if (err) reject(err);
//       else resolve(rows);
//     });
//   });
// }

// exports.getDashboardData = async (req, res) => {
//   try {
//     console.log("SESSION DATA:", req.session);

//     // ===== COUNTS =====
//     const totalClients = await runGet("SELECT COUNT(*) AS total FROM clients");
//     const totalTasks = await runGet(
//       "SELECT COUNT(*) AS total FROM tasks"
//     );

//     // ===== LATEST CLIENTS (LAST 5) =====
//     const latestClients = await runAll(
//       "SELECT name, email, status FROM clients ORDER BY id DESC LIMIT 5"
//     );

//     // ===== UPCOMING TASKS (NEXT 5) =====
//     const upcomingTasks = await runAll(`
//       SELECT tasks.title, tasks.status, tasks.due_date,
//              clients.name AS client_name
//       FROM tasks
//       LEFT JOIN clients ON tasks.client_id = clients.id
//       WHERE tasks.status != 'completed'
//       ORDER BY tasks.due_date ASC
//       LIMIT 5
//     `);

//     // ===== DUMMY INVOICES =====
//     const invoices = [
//       { status: "pending", total: 1000 },
//       { status: "paid", total: 2000 },
//       { status: "overdue", total: 500 }
//     ];

//     // ===== RENDER DASHBOARD =====
//     res.render("dashboard", {
//       user: req.session.user,
//       clients: totalClients.total,
//       tasks: totalTasks.total,
//       invoices: invoices,
//       latestClients: latestClients,
//       upcomingTasks: upcomingTasks
//     });

//   } catch (err) {
//     console.error("Dashboard error:", err);
//     res.send("Error loading dashboard");
//   }
// };



const db = require("../db");

// Convert db.get to promise
function runGet(query, params = []) {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Convert db.all to promise
function runAll(query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

exports.getDashboardData = async (req, res) => {
  try {
    console.log("SESSION DATA:", req.session);

    // ===== COUNTS =====
    const totalClients = await runGet(
      "SELECT COUNT(*) AS total FROM clients"
    );

    const totalTasks = await runGet(
      "SELECT COUNT(*) AS total FROM tasks"
    );

    // ===== LATEST CLIENTS (LAST 5) =====
    const latestClients = await runAll(
      "SELECT name, email, status FROM clients ORDER BY id DESC LIMIT 5"
    );

    // ===== UPCOMING TASKS (NEXT 5) =====
    const upcomingTasks = await runAll(`
      SELECT
        tasks.title,
        tasks.status,
        tasks.due_date,
        clients.name AS client_name
      FROM tasks
      LEFT JOIN clients ON tasks.client_id = clients.id
      WHERE tasks.status != 'completed'
      ORDER BY
        CASE
          WHEN tasks.due_date IS NULL THEN 1
          ELSE 0
        END,
        tasks.due_date ASC
      LIMIT 5
    `);

    // ===== DUMMY INVOICES =====
    const invoices = [
      { status: "pending", total: 1000 },
      { status: "paid", total: 2000 },
      { status: "overdue", total: 500 }
    ];

    // ===== RENDER DASHBOARD =====
    res.render("dashboard", {
      user: req.session.user,
      clients: totalClients.total,
      tasks: totalTasks.total,
      invoices: invoices,
      latestClients: latestClients,
      upcomingTasks: upcomingTasks
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.send("Error loading dashboard");
  }
};
