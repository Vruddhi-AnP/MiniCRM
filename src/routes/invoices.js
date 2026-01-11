/**
 * Invoice Routes
 * --------------
 * Handles all routing related to invoices.
 * Includes:
 * - Listing invoices
 * - Creating new invoices for clients
 * - Editing and updating existing invoices
 *
 * Access control is enforced using:
 * - Authentication middleware
 * - Role-based authorization middleware
 */

const express = require("express");
const router = express.Router();

// Controller containing invoice business logic
const invoiceController = require("../controllers/invoiceController");

// Middleware to ensure user is authenticated
const { ensureAuthenticated } = require("../middleware/authMiddleware");

// Middleware to restrict access based on user roles
const allowRoles = require("../middleware/roleMiddleware");

// ==============================
// INVOICE LISTING
// ==============================

/**
 * GET /invoices
 * List all invoices.
 * Accessible by: user, admin, superadmin
 */
router.get(
  "/invoices",
  ensureAuthenticated,
  allowRoles("user", "admin", "superadmin"),
  invoiceController.listInvoices
);

// ==============================
// CREATE INVOICE (CLIENT-SCOPED)
// ==============================

/**
 * GET /clients/:id/invoices/new
 * Show form to create a new invoice for a specific client.
 * Accessible by: admin, superadmin
 */
router.get(
  "/clients/:id/invoices/new",
  ensureAuthenticated,
  allowRoles("admin", "superadmin"),
  invoiceController.showNewInvoiceForm
);

/**
 * POST /clients/:id/invoices/new
 * Create a new invoice for a specific client.
 * Accessible by: admin, superadmin
 */
router.post(
  "/clients/:id/invoices/new",
  ensureAuthenticated,
  allowRoles("admin", "superadmin"),
  invoiceController.createInvoice
);

// ==============================
// EDIT / UPDATE INVOICE
// ==============================

/**
 * GET /invoices/:id/edit
 * Show edit form for an existing invoice.
 * Accessible by: admin, superadmin
 */
router.get(
  "/invoices/:id/edit",
  ensureAuthenticated,
  allowRoles("admin", "superadmin"),
  invoiceController.showEditInvoiceForm
);

/**
 * POST /invoices/:id/edit
 * Update an existing invoice.
 * Accessible by: admin, superadmin
 */
router.post(
  "/invoices/:id/edit",
  ensureAuthenticated,
  allowRoles("admin", "superadmin"),
  invoiceController.updateInvoice
);

module.exports = router;
