
const db = require("../db");

// ==============================
// LIST CLIENTS
// GET /clients
// ==============================
exports.listClients = (req, res) => {
  const status = req.query.status || "";

  let sql = "SELECT * FROM clients";
  let params = [];

  if (status) {
    sql += " WHERE status = ?";
    params.push(status);
  }

  db.all(sql, params, (err, clients) => {
    if (err) {
      console.error(err);
      return res.send("DB error");
    }

    res.render("clients/list", {
      clients: clients || [],
      filterStatus: status,
    });
  });
};

// ==============================
// SHOW NEW CLIENT FORM
// GET /clients/new
// ==============================
exports.showNewClientForm = (req, res) => {
  // ✅ FIX: pass both isEdit + client
  res.render("clients/form", {
    isEdit: false,
    client: null
  });
};

// ==============================
// CREATE CLIENT
// POST /clients/new
// ==============================
exports.createClient = (req, res) => {
  const { name, email, phone, status } = req.body;

  if (!name) {
    return res.send("Client name is required");
  }

  const sql = `
    INSERT INTO clients (name, email, phone, status)
    VALUES (?, ?, ?, ?)
  `;

  const params = [
    name,
    email || "",
    phone || "",
    status || "active",
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error(err);
      return res.send("DB error while creating client");
    }

    res.redirect("/clients");
  });
};

// ==============================
// CLIENT DETAIL
// GET /clients/:id
// ==============================
exports.getClientDetail = (req, res) => {
  const clientId = req.params.id;

  db.get("SELECT * FROM clients WHERE id = ?", [clientId], (err, client) => {
    if (err || !client) return res.send("Client not found");

    db.all(
      "SELECT * FROM contacts WHERE client_id = ?",
      [clientId],
      (err, contacts) => {
        if (err) return res.send("Contacts error");

        db.all(
          "SELECT * FROM tasks WHERE client_id = ?",
          [clientId],
          (err, tasks) => {
            if (err) return res.send("Tasks error");

            db.all(
              "SELECT * FROM invoices WHERE client_id = ?",
              [clientId],
              (err, invoices) => {
                if (err) return res.send("Invoices error");

                res.render("clients/detail", {
                  client,
                  contacts,
                  tasks,
                  invoices,
                });
              }
            );
          }
        );
      }
    );
  });
};

// ==============================
// SHOW EDIT CLIENT FORM
// GET /clients/:id/edit
// ==============================
exports.showEditClientForm = (req, res) => {
  const clientId = req.params.id;

  db.get("SELECT * FROM clients WHERE id = ?", [clientId], (err, client) => {
    if (err) {
      console.error(err);
      return res.send("DB error");
    }

    if (!client) {
      return res.send("Client not found");
    }

    res.render("clients/form", {
      client,
      isEdit: true,
    });
  });
};

// ==============================
// UPDATE CLIENT
// POST /clients/:id/edit
// ==============================
exports.updateClient = (req, res) => {
  const clientId = req.params.id;
  const { name, email, phone, status } = req.body;

  if (!name) {
    return res.send("Client name is required");
  }

  const sql = `
    UPDATE clients
    SET name = ?, email = ?, phone = ?, status = ?
    WHERE id = ?
  `;

  const params = [
    name,
    email || "",
    phone || "",
    status || "active",
    clientId,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error(err);
      return res.send("DB error while updating client");
    }

    res.redirect(`/clients/${clientId}`);
  });
};

// ==============================
// SOFT DELETE CLIENT (MAKE INACTIVE)
// POST /clients/:id/delete
// ==============================
exports.deleteClient = (req, res) => {
  const clientId = req.params.id;

  const sql = `
    UPDATE clients
    SET status = 'inactive'
    WHERE id = ?
  `;

  db.run(sql, [clientId], function (err) {
    if (err) {
      console.error(err);
      return res.send("DB error while deactivating client");
    }

    res.redirect("/clients");
  });
};







