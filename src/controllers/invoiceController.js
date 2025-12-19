
// for new.ejs ke liye
// const db = require("../db");

// // ==============================
// // LIST INVOICES
// // GET /invoices
// // ==============================
// exports.listInvoices = (req, res) => {
//   const status = req.query.status;

//   let sql = `
//     SELECT invoices.*, clients.name AS client_name
//     FROM invoices
//     LEFT JOIN clients ON invoices.client_id = clients.id
//   `;
//   let params = [];

//   if (status) {
//     sql += " WHERE invoices.status = ?";
//     params.push(status);
//   }

//   db.all(sql, params, (err, invoices) => {
//     if (err) {
//       console.error(err);
//       return res.send("DB error");
//     }

//     res.render("invoices/list", {
//       invoices,
//       currentStatus: status || "all",
//     });
//   });
// };

// // ==============================
// // SHOW NEW INVOICE FORM
// // GET /clients/:id/invoices/new
// // ==============================
// exports.showNewInvoiceForm = (req, res) => {
//   const clientId = req.params.id;

//   res.render("invoices/new", {
//     clientId,
//   });
// };

// // ==============================
// // CREATE INVOICE
// // POST /clients/:id/invoices/new
// // ==============================
// exports.createInvoice = (req, res) => {
//   const clientId = req.params.id;
//   const { amount, status } = req.body;

//   if (!amount) {
//     return res.send("Invoice amount is required");
//   }

//   const sql = `
//     INSERT INTO invoices (amount, status, client_id)
//     VALUES (?, ?, ?)
//   `;

//   db.run(sql, [amount, status || "pending", clientId], function (err) {
//     if (err) {
//       console.error(err);
//       return res.send("DB error");
//     }

//     // 🔁 redirect back to client detail page
//     res.redirect(`/clients/${clientId}`);
//   });
// };



const db = require("../db");

// ==============================
// LIST INVOICES
// GET /invoices
// ==============================
exports.listInvoices = (req, res) => {
  const status = req.query.status;

  let sql = `
    SELECT invoices.*, clients.name AS client_name
    FROM invoices
    LEFT JOIN clients ON invoices.client_id = clients.id
  `;
  let params = [];

  if (status) {
    sql += " WHERE invoices.status = ?";
    params.push(status);
  }

  db.all(sql, params, (err, invoices) => {
    if (err) {
      console.error(err);
      return res.send("DB error");
    }

    res.render("invoices/list", {
      invoices,
      currentStatus: status || "all",
    });
  });
};

// ==============================
// SHOW NEW INVOICE FORM
// GET /clients/:id/invoices/new
// ==============================
exports.showNewInvoiceForm = (req, res) => {
  const clientId = req.params.id;

  // ✅ CLEAN & CORRECT: directly render form.ejs
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

  const sql = `
    INSERT INTO invoices (amount, status, client_id)
    VALUES (?, ?, ?)
  `;

  db.run(sql, [amount, status || "pending", clientId], function (err) {
    if (err) {
      console.error(err);
      return res.send("DB error");
    }

    // 🔁 redirect back to client detail page
    res.redirect(`/clients/${clientId}`);
  });
};

