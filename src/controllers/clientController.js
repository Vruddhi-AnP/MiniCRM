/**
 * Client Controller
 * -----------------
 * This file contains all business logic related to Clients.
 * Responsibilities include:
 * - Listing clients with filters
 * - Creating new clients
 * - Showing client details
 * - Editing client information
 * - Soft-deleting clients
 *
 * Database used: SQLite
 */

const db = require("../db");

// ==============================
// LIST CLIENTS
// GET /clients
// ==============================
/**
 * Fetches and displays a list of clients.
 * Supports optional filtering by:
 * - status (active / inactive / lead)
 * - search query (client name or email)
 */
exports.listClients = (req, res) => {
  const status = req.query.status || "";
  const search = req.query.q || "";

  // Base SQL query
  let sql = "SELECT * FROM clients";
  let params = [];
  let conditions = [];

  // Apply status filter if provided
  if (status) {
    conditions.push("status = ?");
    params.push(status);
  }

  // Apply search filter on name or email
  if (search) {
    conditions.push("(name LIKE ? OR email LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }

  // Append WHERE clause if any filters exist
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  // Execute query and render list view
  db.all(sql, params, (err, clients) => {
    if (err) {
      console.error(err);
      return res.send("DB error");
    }

    res.render("clients/list", {
      clients: clients || [],
      filterStatus: status,
      searchQuery: search,
    });
  });
};

// ==============================
// SHOW NEW CLIENT FORM
// GET /clients/new
// ==============================
/**
 * Renders the form to create a new client.
 * Uses the same form template as edit, controlled by isEdit flag.
 */
exports.showNewClientForm = (req, res) => {
  res.render("clients/form", {
    isEdit: false,
    client: null,
  });
};

// ==============================
// CREATE CLIENT
// POST /clients/new
// ==============================
/**
 * Creates a new client record in the database.
 * Performs basic validation before insertion.
 */
exports.createClient = (req, res) => {
  const {
    name,
    email,
    phone,
    status,
    type,
    sector,
    city,
  } = req.body;

  // Validation: client name is mandatory
  if (!name) {
    return res.send("Client name is required");
  }

  const sql = `
    INSERT INTO clients (name, email, phone, status, type, sector, city)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  // Prepare values with safe defaults
  const params = [
    name,
    email || "",
    phone || "",
    status || "active",
    type || null,
    sector || null,
    city || null,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error(err);
      return res.send("DB error while creating client");
    }

    // Redirect to clients list after successful creation
    res.redirect("/clients");
  });
};

// ==============================
// CLIENT DETAIL
// GET /clients/:id
// ==============================
/**
 * Displays full details of a single client.
 * Includes related:
 * - contacts
 * - tasks
 * - invoices
 */
exports.getClientDetail = (req, res) => {
  const clientId = req.params.id;

  // Fetch client basic information
  db.get("SELECT * FROM clients WHERE id = ?", [clientId], (err, client) => {
    if (err || !client) return res.send("Client not found");

    // Fetch client contacts
    db.all(
      "SELECT * FROM contacts WHERE client_id = ?",
      [clientId],
      (err, contacts) => {
        if (err) return res.send("Contacts error");

        // Fetch client tasks
        db.all(
          "SELECT * FROM tasks WHERE client_id = ?",
          [clientId],
          (err, tasks) => {
            if (err) return res.send("Tasks error");

            // Fetch client invoices
            db.all(
              "SELECT * FROM invoices WHERE client_id = ?",
              [clientId],
              (err, invoices) => {
                if (err) return res.send("Invoices error");

                // Render client detail page with all related data
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
/**
 * Renders the edit form for an existing client.
 * Pre-fills the form using current client data.
 */
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
/**
 * Updates an existing client's information.
 * Performs validation before updating the record.
 */
exports.updateClient = (req, res) => {
  const clientId = req.params.id;
  const {
    name,
    email,
    phone,
    status,
    type,
    sector,
    city,
  } = req.body;

  // Validation: client name is mandatory
  if (!name) {
    return res.send("Client name is required");
  }

  const sql = `
    UPDATE clients
    SET name = ?, email = ?, phone = ?, status = ?, type = ?, sector = ?, city = ?
    WHERE id = ?
  `;

  const params = [
    name,
    email || "",
    phone || "",
    status || "active",
    type || null,
    sector || null,
    city || null,
    clientId,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error(err);
      return res.send("DB error while updating client");
    }

    // Redirect back to client detail page after update
    res.redirect(`/clients/${clientId}`);
  });
};

// ==============================
// SOFT DELETE CLIENT
// POST /clients/:id/delete
// ==============================
/**
 * Soft-deletes a client by marking its status as inactive.
 * No data is permanently removed from the database.
 */
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

    // Redirect back to clients list
    res.redirect("/clients");
  });
};
