
const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");

const { ensureAuthenticated } = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// ✅ List invoices (ADMIN + SUPERADMIN)
router.get(
  "/invoices",
  ensureAuthenticated,
  allowRoles("admin", "superadmin"),
  invoiceController.listInvoices
);

// New invoice form (LOGIN ONLY)
router.get(
  "/clients/:id/invoices/new",
  ensureAuthenticated,
  invoiceController.showNewInvoiceForm
);

// Save invoice
router.post(
  "/clients/:id/invoices/new",
  ensureAuthenticated,
  invoiceController.createInvoice
);

module.exports = router;
