const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");
const contactsController = require("../controllers/contactsController");


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

// ✏️ EDIT CLIENT FORM (ADMIN + SUPERADMIN ONLY)  ← ✅ ADDED
router.get(
  "/clients/:id/edit",
  ensureAuthenticated,
  allowRoles("admin", "superadmin"),
  clientController.showEditClientForm
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

// ✏️ UPDATE CLIENT (ADMIN + SUPERADMIN ONLY)
router.post(
  "/clients/:id/edit",
  ensureAuthenticated,
  allowRoles("admin", "superadmin"),
  clientController.updateClient
);

// 🗑 DELETE CLIENT (ADMIN + SUPERADMIN ONLY)
router.post(
  "/clients/:id/delete",
  ensureAuthenticated,
  allowRoles("admin", "superadmin"),
  clientController.deleteClient
);

// ==============================
// CONTACTS
// ==============================
router.get(
  "/clients/:id/contacts/new",
  contactsController.showNewContactForm
);

router.post(
  "/clients/:id/contacts/new",
  contactsController.createContact
);



module.exports = router;
