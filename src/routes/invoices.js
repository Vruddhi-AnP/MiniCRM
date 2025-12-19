// const express = require("express");
// const router = express.Router();
// const invoiceController = require("../controllers/invoiceController");

// // List invoices
// router.get("/invoices", invoiceController.listInvoices);

// module.exports = router;


const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");

// List invoices
router.get("/invoices", invoiceController.listInvoices);

// New invoice form
router.get(
  "/clients/:id/invoices/new",
  invoiceController.showNewInvoiceForm
);

// Save invoice
router.post(
  "/clients/:id/invoices/new",
  invoiceController.createInvoice
);

module.exports = router;
