/**
 * Contact Controller
 * ------------------
 * Handles all contact-related operations for a client.
 * Responsibilities include:
 * - Showing contact creation form
 * - Creating new contacts
 * - Editing existing contacts
 * - Updating contact information
 *
 * Special handling:
 * - Ensures only one "Primary" contact exists per client
 */

const db = require("../db");

// ==============================
// SHOW NEW CONTACT FORM
// GET /clients/:id/contacts/new
// ==============================
/**
 * Renders the form to create a new contact for a specific client.
 * Reuses the same form template as edit mode.
 */
exports.showNewContactForm = (req, res) => {
  const clientId = req.params.id;

  res.render("contacts/form", {
    clientId,
    isEdit: false,   // Indicates create mode
    contact: null    // Ensures form fields are empty
  });
};

// ==============================
// CREATE CONTACT
// POST /clients/:id/contacts/new
// ==============================
/**
 * Creates a new contact for a client.
 * Includes special logic to ensure only one "Primary" contact
 * exists per client at any given time.
 */
exports.createContact = (req, res) => {
  const clientId = req.params.id;
  const { name, email, phone, role, notes } = req.body;

  // Validation: contact name is mandatory
  if (!name) {
    return res.send("Contact name is required");
  }

  /**
   * STEP 1:
   * If the new contact is marked as "Primary",
   * reset any existing Primary contact for the same client.
   */
  const resetPrimary = () => {
    return new Promise((resolve, reject) => {
      if (role !== "Primary") return resolve();

      const sql = `
        UPDATE contacts
        SET role = NULL
        WHERE client_id = ? AND role = 'Primary'
      `;

      db.run(sql, [clientId], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  };

  /**
   * STEP 2:
   * Insert the new contact into the database.
   */
  const insertContact = () => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO contacts (name, email, phone, role, notes, client_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.run(
        sql,
        [
          name,
          email || "",
          phone || "",
          role || null,
          notes || null,
          clientId
        ],
        function (err) {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  };

  /**
   * STEP 3:
   * Execute steps in sequence to maintain data consistency.
   */
  resetPrimary()
    .then(insertContact)
    .then(() => {
      // Redirect back to client detail page after success
      res.redirect(`/clients/${clientId}`);
    })
    .catch((err) => {
      console.error(err);
      res.send("DB error while creating contact");
    });
};

// ==============================
// SHOW EDIT CONTACT FORM
// GET /clients/:clientId/contacts/:contactId/edit
// ==============================
/**
 * Renders the edit form for an existing contact.
 * Pre-fills the form using the current contact data.
 */
exports.showEditContactForm = (req, res) => {
  const { clientId, contactId } = req.params;

  db.get(
    "SELECT * FROM contacts WHERE id = ?",
    [contactId],
    (err, contact) => {
      if (err || !contact) {
        return res.send("Contact not found");
      }

      res.render("contacts/form", {
        clientId,
        contact,
        isEdit: true   // Indicates edit mode
      });
    }
  );
};

// ==============================
// UPDATE CONTACT
// POST /clients/:clientId/contacts/:contactId/edit
// ==============================
/**
 * Updates an existing contact's information.
 * Performs basic validation before saving changes.
 */
exports.updateContact = (req, res) => {
  const { clientId, contactId } = req.params;
  const { name, email, phone, role, notes } = req.body;

  // Validation: contact name is mandatory
  if (!name) {
    return res.send("Contact name is required");
  }

  const sql = `
    UPDATE contacts
    SET name = ?, email = ?, phone = ?, role = ?, notes = ?
    WHERE id = ?
  `;

  db.run(
    sql,
    [name, email || "", phone || "", role || null, notes || null, contactId],
    function (err) {
      if (err) {
        console.error(err);
        return res.send("DB error while updating contact");
      }

      // Redirect back to the client detail page
      res.redirect(`/clients/${clientId}`);
    }
  );
};
