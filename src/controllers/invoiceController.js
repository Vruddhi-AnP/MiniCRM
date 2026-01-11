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

  if (status && status !== "all") {
    conditions.push("invoices.status = ?");
    params.push(status);
  }

  if (search) {
    conditions.push("(clients.name LIKE ? OR invoices.invoice_number LIKE ?)");
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
exports.createInvoice = (req, res) => {
  const clientId = req.params.id;
  const { amount, status, issue_date, due_date, currency, notes } = req.body;

  if (!amount) {
    return res.send("Invoice amount is required");
  }

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
      nextNumber = parseInt(row.invoice_number.split("-")[2]) + 1;
    }

    const invoiceNumber = `INV-${year}-${String(nextNumber).padStart(3, "0")}`;

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

        res.redirect(`/clients/${clientId}`);
      }
    );
  });
};

// ==============================
// SHOW EDIT INVOICE FORM
// GET /invoices/:id/edit
// ==============================
exports.showEditInvoiceForm = (req, res) => {
  const invoiceId = req.params.id;

  db.get("SELECT * FROM invoices WHERE id = ?", [invoiceId], (err, invoice) => {
    if (err || !invoice) {
      console.error(err);
      return res.send("Invoice not found");
    }

    res.render("invoices/form", {
      invoice,
      isEdit: true,
      clientId: invoice.client_id
    });
  });
};

// ==============================
// UPDATE INVOICE
// POST /invoices/:id/edit
// ==============================
exports.updateInvoice = (req, res) => {
  const invoiceId = req.params.id;
  const { amount, status, issue_date, due_date, currency, notes } = req.body;

  if (!amount) {
    return res.send("Invoice amount is required");
  }

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
          status,
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

          res.redirect(`/clients/${invoice.client_id}`);
        }
      );
    }
  );
};
