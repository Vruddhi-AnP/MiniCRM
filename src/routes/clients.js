// const express = require("express");
// const router = express.Router();
// const clientController = require("../controllers/clientController");

// const { ensureAuthenticated } = require("../middleware/authMiddleware");
// const allowRoles = require("../middleware/roleMiddleware");

// // 🔥 NEW CLIENT FORM (LOGIN ONLY)
// router.get(
//   "/clients/new",
//   ensureAuthenticated,
//   clientController.showNewClientForm
// );

// // 🔥 CREATE CLIENT
// router.post(
//   "/clients/new",
//   ensureAuthenticated,
//   clientController.createClient
// );

// // ✅ List clients (ADMIN + SUPERADMIN)
// router.get(
//   "/clients",
//   ensureAuthenticated,
//   allowRoles("admin", "superadmin"),
//   clientController.listClients
// );

// // ✅ Client detail (ADMIN + SUPERADMIN)
// router.get(
//   "/clients/:id",
//   ensureAuthenticated,
//   allowRoles("admin", "superadmin"),
//   clientController.getClientDetail
// );

// module.exports = router;


const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");

const { ensureAuthenticated } = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// 🔥 NEW CLIENT FORM (ADMIN + SUPERADMIN ONLY)
router.get(
  "/clients/new",
  ensureAuthenticated,
  allowRoles("admin", "superadmin"),
  clientController.showNewClientForm
);

// 🔥 CREATE CLIENT (ADMIN + SUPERADMIN ONLY)
router.post(
  "/clients/new",
  ensureAuthenticated,
  allowRoles("admin", "superadmin"),
  clientController.createClient
);

// ✅ List clients (ALL LOGGED-IN USERS)
router.get(
  "/clients",
  ensureAuthenticated,
  clientController.listClients
);

// ✅ Client detail (ALL LOGGED-IN USERS)
router.get(
  "/clients/:id",
  ensureAuthenticated,
  clientController.getClientDetail
);

module.exports = router;
