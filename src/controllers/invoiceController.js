/**
 * Invoice Controller
 * ------------------
 * Handles all invoice-related business logic.
 * Responsibilities include:
 * - Listing invoices with filters
 * - Creating new invoices with auto-generated numbers
 * - Editing existing invoices
 * - Updating invoice details
 *
 * Uses SQLite as the database.
 */

const db = require("../db");

// ==============================
// LIST INVOICES
// GET /invoices
// ==============================
/**
 * Fetches and displays a list of invoices.
 * Supports:
 * - Filtering by invoice status
 * - Searching by client name or invoice number
 */
exports.listInvoices = (req, res) => {
  const status = req.query.status;
  const search = req.query.q || "";

  // Base query joining invoices with client data
  let sql = `
    SELECT invoices.*, clients.name AS client_name
    FROM invoices
    LEFT JOIN clients ON invoices.client_id = clients.id
  `;

  let params = [];
  let conditions = [];

  // Apply status filter if provided and not "all"
  if (status && status !== "all") {
    conditions.push("invoices.status = ?");
    params.push(status);
  }

  // Apply search filter on client name or invoice number
  if (search) {
    conditions.push("(clients.name LIKE ? OR invoices.invoice_number LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }

  // Attach WHERE clause only if filters exist
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  // Execute query and render invoice list view
  db.all(sql, params, (err, invoices) => {
    if (err) {
      console.error(err);
      return res.send("DB error");
    }

    res.render("invoices/list", {
      invoices,
      currentStatus: status || "all",
      searchQuery: search,
    });
  });
};

// ==============================
// SHOW NEW INVOICE FORM
// GET /clients/:id/invoices/new
// ==============================
/**
 * Renders the form to create a new invoice for a client.
 * Reuses the same form template as edit mode.
 */
exports.showNewInvoiceForm = (req, res) => {
  const clientId = req.params.id;

  res.render("invoices/form", {
    clientId,
    isEdit: false,
    invoice: null
  });
};

// ==============================
// CREATE INVOICE
// POST /clients/:id/invoices/new
// ==============================
/**
 * Creates a new invoice for a client.
 * Automatically generates a unique invoice number
 * in the format: INV-YYYY-XXX
 */
exports.createInvoice = (req, res) => {
  const clientId = req.params.id;
  const { amount, status, issue_date, due_date, currency, notes } = req.body;

  // Validation: invoice amount is mandatory
  if (!amount) {
    return res.send("Invoice amount is required");
  }

  const year = new Date().getFullYear();

  /**
   * Fetch the last invoice number for the current year
   * to generate the next sequential invoice number.
   */
  const getLastInvoiceSql = `
    SELECT invoice_number
    FROM invoices
    WHERE invoice_number LIKE ?
    ORDER BY id DESC
    LIMIT 1
  `;

  db.get(getLastInvoiceSql, [`INV-${year}-%`], (err, row) => {
    if (err) {
      console.error(err);
      return res.send("DB error");
    }

    // Determine next invoice sequence number
    let nextNumber = 1;
    if (row && row.invoice_number) {
      nextNumber = parseInt(row.invoice_number.split("-")[2]) + 1;
    }

    const invoiceNumber = `INV-${year}-${String(nextNumber).padStart(3, "0")}`;

    // Insert new invoice record
    const sql = `
      INSERT INTO invoices
      (invoice_number, amount, currency, status, issue_date, due_date, notes, client_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
      sql,
      [
        invoiceNumber,
        amount,
        currency || "INR",
        status || "pending",
        issue_date || null,
        due_date || null,
        notes || null,
        clientId
      ],
      function (err) {
        if (err) {
          console.error(err);
          return res.send("DB error");
        }

        // Redirect back to client detail after creation
        res.redirect(`/clients/${clientId}`);
      }
    );
  });
};

// ==============================
// SHOW EDIT INVOICE FORM
// GET /invoices/:id/edit
// ==============================
/**
 * Renders the edit form for an existing invoice.
 * Pre-fills the form with current invoice data.
 */
exports.showEditInvoiceForm = (req, res) => {
  const invoiceId = req.params.id;

  db.get(
    "SELECT * FROM invoices WHERE id = ?",
    [invoiceId],
    (err, invoice) => {
      if (err || !invoice) {
        console.error(err);
        return res.send("Invoice not found");
      }

      res.render("invoices/form", {
        invoice,
        isEdit: true,
        clientId: invoice.client_id
      });
    }
  );
};

// ==============================
// UPDATE INVOICE
// POST /invoices/:id/edit
// ==============================
/**
 * Updates an existing invoice.
 * Only editable fields are updated; invoice number remains unchanged.
 */
exports.updateInvoice = (req, res) => {
  const invoiceId = req.params.id;
  const { amount, status, issue_date, due_date, currency, notes } = req.body;

  // Validation: invoice amount is mandatory
  if (!amount) {
    return res.send("Invoice amount is required");
  }

  // Fetch client_id to redirect correctly after update
  db.get(
    "SELECT client_id FROM invoices WHERE id = ?",
    [invoiceId],
    (err, invoice) => {
      if (err || !invoice) {
        console.error(err);
        return res.send("Invoice not found");
      }

      const sql = `
        UPDATE invoices
        SET
          amount = ?,
          currency = ?,
          status = ?,
          issue_date = ?,
          due_date = ?,
          notes = ?
        WHERE id = ?
      `;

      db.run(
        sql,
        [
          amount,
          currency || "INR",
          status || "pending",
          issue_date || null,
          due_date || null,
          notes || null,
          invoiceId
        ],
        function (err) {
          if (err) {
            console.error(err);
            return res.send("DB error");
          }

          // Redirect back to client detail page
          res.redirect(`/clients/${invoice.client_id}`);
        }
      );
    }
  );
};
