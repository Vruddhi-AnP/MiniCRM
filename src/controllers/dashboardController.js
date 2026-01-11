/**
 * Dashboard Controller
 * --------------------
 * Responsible for fetching and preparing all data required
 * for the main dashboard view.
 *
 * This includes:
 * - Key business metrics (counts)
 * - Recent clients
 * - Upcoming tasks
 *
 * Uses Promise-based helpers to keep async logic clean and readable.
 */

const db = require("../db");

/**
 * Helper function to convert db.get (single row)
 * into a Promise-based function.
 * This allows use of async/await syntax.
 */
function runGet(query, params = []) {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

/**
 * Helper function to convert db.all (multiple rows)
 * into a Promise-based function.
 * Used for queries returning lists.
 */
function runAll(query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

/**
 * GET /dashboard
 * --------------
 * Fetches all data required to render the dashboard page.
 * Uses async/await for sequential data fetching.
 */
exports.getDashboardData = async (req, res) => {
  try {
    // Debugging aid: verify session data during development
    console.log("SESSION DATA:", req.session);

    // ==============================
    // COUNTS (BUSINESS METRICS)
    // ==============================

    /**
     * Count only active clients.
     * Inactive clients are excluded from dashboard metrics.
     */
    const totalClients = await runGet(
      "SELECT COUNT(*) AS total FROM clients WHERE status = 'active'"
    );

    /**
     * Count only open tasks.
     * Completed tasks are intentionally excluded.
     */
    const totalTasks = await runGet(
      "SELECT COUNT(*) AS total FROM tasks WHERE status != 'completed'"
    );

    /**
     * Count pending invoices.
     */
    const pendingInvoices = await runGet(
      "SELECT COUNT(*) AS total FROM invoices WHERE status = 'pending'"
    );

    /**
     * Count overdue invoices separately for visibility.
     */
    const overdueInvoices = await runGet(
      "SELECT COUNT(*) AS total FROM invoices WHERE status = 'overdue'"
    );

    // ==============================
    // LATEST CLIENTS (LAST 5)
    // ==============================

    /**
     * Fetch the most recently created clients.
     * Used to show recent activity on dashboard.
     */
    const latestClients = await runAll(
      "SELECT name, email, status FROM clients ORDER BY created_at DESC LIMIT 5"
    );

    // ==============================
    // UPCOMING TASKS (NEXT 5)
    // ==============================

    /**
     * Fetch upcoming tasks sorted by due date.
     * Tasks without a due date are pushed to the bottom.
     * Completed tasks are excluded.
     */
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

    // ==============================
    // RENDER DASHBOARD VIEW
    // ==============================

    /**
     * Pass all computed values to the dashboard template.
     */
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
    // Centralized error handling for dashboard failures
    console.error("Dashboard error:", err);
    res.send("Error loading dashboard");
  }
};
