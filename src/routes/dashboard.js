
const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");
const { ensureAuthenticated } = require("../middleware/authMiddleware");

// Dashboard route
// Accessible to ALL logged-in users (superadmin, admin, user)
router.get(
  "/dashboard",
  ensureAuthenticated,
  dashboardController.getDashboardData
);

module.exports = router;
