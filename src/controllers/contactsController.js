
// const db = require("../db");

// // ==============================
// // SHOW NEW CONTACT FORM
// // GET /clients/:id/contacts/new
// // ==============================
// exports.showNewContactForm = (req, res) => {
//   const clientId = req.params.id;

//   res.render("contacts/form", {
//     clientId
//   });
// };

// // ==============================
// // CREATE CONTACT
// // POST /clients/:id/contacts/new
// // ==============================
// exports.createContact = (req, res) => {
//   const clientId = req.params.id;
//   const { name, email, phone, role, notes } = req.body; // ✅ notes added

//   if (!name) {
//     return res.send("Contact name is required");
//   }

//   // 🔸 STEP 1: if new contact is primary
//   const resetPrimary = () => {
//     return new Promise((resolve, reject) => {
//       if (role !== "Primary") return resolve();

//       const sql = `
//         UPDATE contacts
//         SET role = NULL
//         WHERE client_id = ? AND role = 'Primary'
//       `;

//       db.run(sql, [clientId], (err) => {
//         if (err) return reject(err);
//         resolve();
//       });
//     });
//   };

//   // 🔸 STEP 2: Insert new contact
//   const insertContact = () => {
//     return new Promise((resolve, reject) => {
//       const sql = `
//         INSERT INTO contacts (name, email, phone, role, notes, client_id)
//         VALUES (?, ?, ?, ?, ?, ?)
//       `;

//       db.run(
//         sql,
//         [
//           name,
//           email || "",
//           phone || "",
//           role || null,
//           notes || null, // ✅ notes handled safely
//           clientId
//         ],
//         function (err) {
//           if (err) return reject(err);
//           resolve();
//         }
//       );
//     });
//   };

//   // 🔸 STEP 3: Execute safely
//   resetPrimary()
//     .then(insertContact)
//     .then(() => {
//       res.redirect(`/clients/${clientId}`);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.send("DB error while creating contact");
//     });
// };


// // ==============================
// // SHOW EDIT CONTACT FORM
// // GET /clients/:clientId/contacts/:contactId/edit
// // ==============================
// exports.showEditContactForm = (req, res) => {
//   const { clientId, contactId } = req.params;

//   db.get(
//     "SELECT * FROM contacts WHERE id = ?",
//     [contactId],
//     (err, contact) => {
//       if (err || !contact) {
//         return res.send("Contact not found");
//       }

//       res.render("contacts/form", {
//         clientId,
//         contact,
//         isEdit: true
//       });
//     }
//   );
// };

// // ==============================
// // UPDATE CONTACT
// // POST /clients/:clientId/contacts/:contactId/edit
// // ==============================
// exports.updateContact = (req, res) => {
//   const { clientId, contactId } = req.params;
//   const { name, email, phone, role, notes } = req.body;

//   if (!name) {
//     return res.send("Contact name is required");
//   }

//   const sql = `
//     UPDATE contacts
//     SET name = ?, email = ?, phone = ?, role = ?, notes = ?
//     WHERE id = ?
//   `;

//   db.run(
//     sql,
//     [name, email || "", phone || "", role || null, notes || null, contactId],
//     function (err) {
//       if (err) {
//         console.error(err);
//         return res.send("DB error while updating contact");
//       }

//       res.redirect(`/clients/${clientId}`);
//     }
//   );
// };


const db = require("../db");

// ==============================
// SHOW NEW CONTACT FORM
// GET /clients/:id/contacts/new
// ==============================
exports.showNewContactForm = (req, res) => {
  const clientId = req.params.id;

  res.render("contacts/form", {
    clientId,
    isEdit: false,   // ✅ FIX: defined
    contact: null    // ✅ FIX: safe for form reuse
  });
};

// ==============================
// CREATE CONTACT
// POST /clients/:id/contacts/new
// ==============================
exports.createContact = (req, res) => {
  const clientId = req.params.id;
  const { name, email, phone, role, notes } = req.body;

  if (!name) {
    return res.send("Contact name is required");
  }

  // 🔸 STEP 1: if new contact is primary
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

  // 🔸 STEP 2: Insert new contact
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

  // 🔸 STEP 3: Execute safely
  resetPrimary()
    .then(insertContact)
    .then(() => {
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
        isEdit: true
      });
    }
  );
};

// ==============================
// UPDATE CONTACT
// POST /clients/:clientId/contacts/:contactId/edit
// ==============================
exports.updateContact = (req, res) => {
  const { clientId, contactId } = req.params;
  const { name, email, phone, role, notes } = req.body;

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

      res.redirect(`/clients/${clientId}`);
    }
  );
};
