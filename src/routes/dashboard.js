/**
 * Dashboard Routes
 * ----------------
 * Handles routing for the main dashboard page.
 * The dashboard provides an overview of key business metrics.
 *
 * Access Control:
 * - Only authenticated users can access the dashboard
 * - Accessible by all roles: superadmin, admin, user
 */

const express = require("express");
const router = express.Router();

// Controller responsible for dashboard data aggregation
const dashboardController = require("../controllers/dashboardController");

// Middleware to ensure the user is logged in
const { ensureAuthenticated } = require("../middleware/authMiddleware");

// ==============================
// DASHBOARD ROUTE
// ==============================

/**
 * GET /dashboard
 * Renders the dashboard with aggregated data.
 * Requires user to be authenticated.
 */
router.get(
  "/dashboard",
  ensureAuthenticated,
  dashboardController.getDashboardData
);

module.exports = router;
