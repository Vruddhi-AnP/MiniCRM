
const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");

const { ensureAuthenticated } = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// 🔥 NEW CLIENT FORM (LOGIN ONLY)
router.get(
  "/clients/new",
  ensureAuthenticated,
  clientController.showNewClientForm
);

// 🔥 CREATE CLIENT
router.post(
  "/clients/new",
  ensureAuthenticated,
  clientController.createClient
);

// ✅ List clients (ADMIN + SUPERADMIN)
router.get(
  "/clients",
  ensureAuthenticated,
  allowRoles("admin", "superadmin"),
  clientController.listClients
);

// ✅ Client detail (ADMIN + SUPERADMIN)
router.get(
  "/clients/:id",
  ensureAuthenticated,
  allowRoles("admin", "superadmin"),
  clientController.getClientDetail
);

module.exports = router;


