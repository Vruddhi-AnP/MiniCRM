
const db = require("../db");

// ==============================
// LIST INVOICES
// GET /invoices
// ==============================
exports.listInvoices = (req, res) => {
  const status = req.query.status;
  const search = req.query.q || "";

  let sql = `
    SELECT invoices.*, clients.name AS client_name
    FROM invoices
    LEFT JOIN clients ON invoices.client_id = clients.id
  `;

  let params = [];
  let conditions = [];

  if (status) {
    conditions.push("invoices.status = ?");
    params.push(status);
  }

  if (search) {
    conditions.push(
      "(clients.name LIKE ? OR invoices.invoice_number LIKE ?)"
    );
    params.push(`%${search}%`, `%${search}%`);
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

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
exports.showNewInvoiceForm = (req, res) => {
  const clientId = req.params.id;
  res.render("invoices/form", { clientId });
};

// ==============================
// CREATE INVOICE
// POST /clients/:id/invoices/new
// ==============================
exports.createInvoice = (req, res) => {
  const clientId = req.params.id;
  const { amount, status } = req.body;

  if (!amount) {
    return res.send("Invoice amount is required");
  }

  // 🔑 STEP 1: Get last invoice number
  const year = new Date().getFullYear();

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

    let nextNumber = 1;

    if (row && row.invoice_number) {
      const lastSeq = parseInt(row.invoice_number.split("-")[2]);
      nextNumber = lastSeq + 1;
    }

    const invoiceNumber = `INV-${year}-${String(nextNumber).padStart(3, "0")}`;

    // 🔑 STEP 2: Insert invoice with generated invoice_number
    const insertSql = `
      INSERT INTO invoices (invoice_number, amount, status, client_id)
      VALUES (?, ?, ?, ?)
    `;

    db.run(
      insertSql,
      [invoiceNumber, amount, status || "pending", clientId],
      function (err) {
        if (err) {
          console.error(err);
          return res.send("DB error");
        }

        res.redirect(`/clients/${clientId}`);
      }
    );
  });
};
