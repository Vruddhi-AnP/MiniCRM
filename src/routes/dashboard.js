
// const express = require("express");
// const router = express.Router();

// const dashboardController = require("../controllers/dashboardController");
// const { ensureAuthenticated } = require("../middleware/authMiddleware");
// const allowRoles = require("../middleware/roleMiddleware"); // ✅ NEW (safe)

// // Dashboard route
// router.get(
//   "/dashboard",
//   ensureAuthenticated,          // 🔒 login check (already working)
//   allowRoles("admin", "superadmin"),          // 🔐 role check (NEW, safe)
//   dashboardController.getDashboardData
// );

// module.exports = router;

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
