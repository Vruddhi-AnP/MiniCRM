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

    // ===== COUNTS (REAL BUSINESS LOGIC) =====

    // ✅ Active clients only
    const totalClients = await runGet(
      "SELECT COUNT(*) AS total FROM clients WHERE status = 'active'"
    );

    // ✅ Open tasks only (exclude completed)
    const totalTasks = await runGet(
      "SELECT COUNT(*) AS total FROM tasks WHERE status != 'completed'"
    );

    // ✅ Invoice counts (case-fixed)
    const pendingInvoices = await runGet(
      "SELECT COUNT(*) AS total FROM invoices WHERE status = 'pending'"
    );

    const overdueInvoices = await runGet(
      "SELECT COUNT(*) AS total FROM invoices WHERE status = 'overdue'"
    );

    // ===== LATEST CLIENTS (LAST 5) =====
    const latestClients = await runAll(
      "SELECT name, email, status FROM clients ORDER BY created_at DESC LIMIT 5"
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

    // ===== RENDER DASHBOARD =====
    res.render("dashboard", {
      user: req.session.user,
      clients: totalClients.total,
      tasks: totalTasks.total,
      pendingInvoices: pendingInvoices.total,
      overdueInvoices: overdueInvoices.total,
      latestClients: latestClients,
      upcomingTasks: upcomingTasks
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.send("Error loading dashboard");
  }
};
