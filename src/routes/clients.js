/**
 * Client Routes
 * -------------
 * Handles all routes related to:
 * - Clients
 * - Client details
 * - Client contacts
 *
 * Access control is enforced using:
 * - Authentication middleware
 * - Role-based authorization middleware
 */

const express = require("express");
const router = express.Router();

// Controllers
const clientController = require("../controllers/clientController");
const contactsController = require("../controllers/contactsController");

// Middleware
const { ensureAuthenticated } = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// ==============================
// CLIENT CRUD ROUTES
// ==============================

/**
 * GET /clients/new
 * Show form to create a new client.
 * Accessible by: admin, superadmin
 */
router.get(
  "/clients/new",
  ensureAuthenticated,
  allowRoles("admin", "superadmin"),
  clientController.showNewClientForm
);

/**
 * POST /clients/new
 * Create a new client.
 * Accessible by: admin, superadmin
 */
router.post(
  "/clients/new",
  ensureAuthenticated,
  allowRoles("admin", "superadmin"),
  clientController.createClient
);

/**
 * GET /clients/:id/edit
 * Show edit form for an existing client.
 * Accessible by: admin, superadmin
 */
router.get(
  "/clients/:id/edit",
  ensureAuthenticated,
  allowRoles("admin", "superadmin"),
  clientController.showEditClientForm
);

/**
 * GET /clients
 * List all clients.
 * Accessible by: all authenticated users
 */
router.get(
  "/clients",
  ensureAuthenticated,
  clientController.listClients
);

/**
 * GET /clients/:id
 * Show detailed view of a single client.
 * Includes contacts, tasks, and invoices.
 * Accessible by: all authenticated users
 */
router.get(
  "/clients/:id",
  ensureAuthenticated,
  clientController.getClientDetail
);

/**
 * POST /clients/:id/edit
 * Update client information.
 * Accessible by: admin, superadmin
 */
router.post(
  "/clients/:id/edit",
  ensureAuthenticated,
  allowRoles("admin", "superadmin"),
  clientController.updateClient
);

/**
 * POST /clients/:id/delete
 * Soft-delete a client by marking it inactive.
 * Accessible by: admin, superadmin
 */
router.post(
  "/clients/:id/delete",
  ensureAuthenticated,
  allowRoles("admin", "superadmin"),
  clientController.deleteClient
);

// ==============================
// CONTACT ROUTES (NESTED UNDER CLIENT)
// ==============================

/**
 * GET /clients/:id/contacts/new
 * Show form to create a new contact for a client.
 */
router.get(
  "/clients/:id/contacts/new",
  contactsController.showNewContactForm
);

/**
 * POST /clients/:id/contacts/new
 * Create a new contact for a client.
 */
router.post(
  "/clients/:id/contacts/new",
  contactsController.createContact
);

// ==============================
// EDIT CONTACT ROUTES
// ==============================

/**
 * GET /clients/:clientId/contacts/:contactId/edit
 * Show edit form for an existing contact.
 */
router.get(
  "/clients/:clientId/contacts/:contactId/edit",
  contactsController.showEditContactForm
);

/**
 * POST /clients/:clientId/contacts/:contactId/edit
 * Update an existing contact.
 */
router.post(
  "/clients/:clientId/contacts/:contactId/edit",
  contactsController.updateContact
);

module.exports = router;
