
const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");

const { ensureAuthenticated } = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// ✅ List invoices (USER + ADMIN + SUPERADMIN)
router.get(
  "/invoices",
  ensureAuthenticated,
  allowRoles("user", "admin", "superadmin"),
  invoiceController.listInvoices
);

// ❌ New invoice form (ADMIN + SUPERADMIN ONLY)
router.get(
  "/clients/:id/invoices/new",
  ensureAuthenticated,
  allowRoles("admin", "superadmin"),
  invoiceController.showNewInvoiceForm
);

// ❌ Save invoice (ADMIN + SUPERADMIN ONLY)
router.post(
  "/clients/:id/invoices/new",
  ensureAuthenticated,
  allowRoles("admin", "superadmin"),
  invoiceController.createInvoice
);

module.exports = router;
