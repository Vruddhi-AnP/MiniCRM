const db = require("../db");

// ==============================
// SHOW NEW CONTACT FORM
// GET /clients/:id/contacts/new
// ==============================
exports.showNewContactForm = (req, res) => {
  const clientId = req.params.id;

  res.render("contacts/form", {
    clientId
  });
};

// ==============================
// CREATE CONTACT
// POST /clients/:id/contacts/new
// ==============================
exports.createContact = (req, res) => {
  const clientId = req.params.id;
  const { name, email, phone } = req.body;

  if (!name) {
    return res.send("Contact name is required");
  }

  const sql = `
    INSERT INTO contacts (name, email, phone, client_id)
    VALUES (?, ?, ?, ?)
  `;

  db.run(sql, [name, email || "", phone || "", clientId], function (err) {
    if (err) {
      console.error(err);
      return res.send("DB error while creating contact");
    }

    // redirect back to client detail
    res.redirect(`/clients/${clientId}`);
  });
};
