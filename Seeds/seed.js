// // backend/seeds/seed.js
// const db = require('../src/db');

// db.serialize(() => {
//   // Create clients
//   db.run(`
//     CREATE TABLE IF NOT EXISTS clients (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT NOT NULL,
//       company TEXT,
//       email TEXT,
//       phone TEXT,
//       address TEXT,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//       updated_at DATETIME
//     );
//   `);

//   // Create contacts
//   db.run(`
//     CREATE TABLE IF NOT EXISTS contacts (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       client_id INTEGER NOT NULL,
//       name TEXT NOT NULL,
//       email TEXT,
//       phone TEXT,
//       role TEXT,
//       notes TEXT,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//       FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
//     );
//   `);

//   // Create tasks
//   db.run(`
//     CREATE TABLE IF NOT EXISTS tasks (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       title TEXT NOT NULL,
//       description TEXT,
//       client_id INTEGER,
//       contact_id INTEGER,
//       status TEXT DEFAULT 'todo',
//       priority INTEGER DEFAULT 3,
//       due_date DATE,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//       updated_at DATETIME,
//       FOREIGN KEY (client_id) REFERENCES clients(id),
//       FOREIGN KEY (contact_id) REFERENCES contacts(id)
//     );
//   `);

//   // Create invoices
//   db.run(`
//     CREATE TABLE IF NOT EXISTS invoices (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       client_id INTEGER NOT NULL,
//       invoice_number TEXT UNIQUE,
//       amount REAL NOT NULL,
//       currency TEXT DEFAULT 'INR',
//       status TEXT DEFAULT 'pending',
//       issue_date DATE,
//       due_date DATE,
//       notes TEXT,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//       FOREIGN KEY (client_id) REFERENCES clients(id)
//     );
//   `);

//   // Insert demo clients (if not already present)
//   db.run(`
//     INSERT INTO clients (name, company, email, phone, address)
//     VALUES
//       ('Asha Patel', 'Asha Designs', 'asha@example.com', '9876543210', 'Ahmedabad, India'),
//       ('Ravi Kumar', 'Ravi Consulting', 'ravi@example.com', '9123456780', 'Surat, India');
//   `, function(err) {
//     if (err) {
//       console.log('Clients insert likely skipped (duplicate?)', err.message);
//     } else {
//       console.log('Inserted demo clients');
//     }
//   });

//   // Insert demo contacts
//   db.run(`
//     INSERT INTO contacts (client_id, name, email, phone, role, notes)
//     VALUES
//       (1, 'Asha Billing', 'billing@ashadesigns.com', '9811122233', 'Billing', 'Main billing contact'),
//       (2, 'Ravi Admin', 'admin@raviconsult.com', '9900099000', 'Primary', 'Main contact for projects');
//   `, function(err) {
//     if (err) {
//       console.log('Contacts insert likely skipped (duplicate?)', err.message);
//     } else {
//       console.log('Inserted demo contacts');
//     }
//   });

//   // Insert demo tasks
//   db.run(`
//     INSERT INTO tasks (title, description, client_id, contact_id, status, priority, due_date)
//     VALUES
//       ('Design homepage', 'Create mockups for client homepage', 1, 1, 'in_progress', 2, '2025-12-20'),
//       ('Prepare invoice Q4', 'Prepare and send invoice for Q4', 2, 2, 'todo', 1, '2025-12-15');
//   `, function(err) {
//     if (err) {
//       console.log('Tasks insert likely skipped (duplicate?)', err.message);
//     } else {
//       console.log('Inserted demo tasks');
//     }
//   });

//   // Insert demo invoices
//   db.run(`
//     INSERT INTO invoices (client_id, invoice_number, amount, currency, status, issue_date, due_date, notes)
//     VALUES
//       (1, 'INV-2025-001', 15000.00, 'INR', 'pending', '2025-11-01', '2025-11-30', 'Website design deposit'),
//       (2, 'INV-2025-002', 9000.00, 'INR', 'paid', '2025-10-15', '2025-11-14', 'Consulting fee');
//   `, function(err) {
//     if (err) {
//       console.log('Invoices insert likely skipped (duplicate?)', err.message);
//     } else {
//       console.log('Inserted demo invoices');
//     }
//   });

// }); // end serialize

// // Close DB after short delay to ensure queries complete
// setTimeout(() => {
//   db.close((err) => {
//     if (err) {
//       console.error('Error closing DB', err.message);
//     } else {
//       console.log('Database seed finished and connection closed.');
//     }
//   });
// }, 500);





// // backend/seeds/seed.js
// const db = require('../src/db');

// db.serialize(() => {

//   // ===== Create tables =====

//   // Users table (for admin + others)
//   db.run(`
//     CREATE TABLE IF NOT EXISTS users (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       email TEXT UNIQUE NOT NULL,
//       password TEXT NOT NULL,
//       role TEXT DEFAULT 'user',
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//     );
//   `);

//   // Clients table
//   db.run(`
//     CREATE TABLE IF NOT EXISTS clients (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT NOT NULL,
//       company TEXT,
//       email TEXT,
//       phone TEXT,
//       address TEXT,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//       updated_at DATETIME
//     );
//   `);

//   // Contacts table
//   db.run(`
//     CREATE TABLE IF NOT EXISTS contacts (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       client_id INTEGER NOT NULL,
//       name TEXT NOT NULL,
//       email TEXT,
//       phone TEXT,
//       role TEXT,
//       notes TEXT,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//       FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
//     );
//   `);

//   // Tasks table
//   db.run(`
//     CREATE TABLE IF NOT EXISTS tasks (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       title TEXT NOT NULL,
//       description TEXT,
//       client_id INTEGER,
//       contact_id INTEGER,
//       status TEXT DEFAULT 'todo',
//       priority INTEGER DEFAULT 3,
//       due_date DATE,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//       updated_at DATETIME,
//       FOREIGN KEY (client_id) REFERENCES clients(id),
//       FOREIGN KEY (contact_id) REFERENCES contacts(id)
//     );
//   `);

//   // Invoices table
//   db.run(`
//     CREATE TABLE IF NOT EXISTS invoices (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       client_id INTEGER NOT NULL,
//       invoice_number TEXT UNIQUE,
//       amount REAL NOT NULL,
//       currency TEXT DEFAULT 'INR',
//       status TEXT DEFAULT 'pending',
//       issue_date DATE,
//       due_date DATE,
//       notes TEXT,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//       FOREIGN KEY (client_id) REFERENCES clients(id)
//     );
//   `);

//   // ===== Insert demo data =====

//   // Insert admin user
//   db.run(`
//     INSERT INTO users (email, password, role)
//     VALUES ('admin@apw.local', 'admin123', 'admin');
//   `, function(err) {
//     if (err) {
//       console.log('Admin insert likely skipped (duplicate?)', err.message);
//     } else {
//       console.log('Inserted admin user');
//     }
//   });

//   // Insert demo clients
//   db.run(`
//     INSERT INTO clients (name, company, email, phone, address)
//     VALUES
//       ('Asha Patel', 'Asha Designs', 'asha@example.com', '9876543210', 'Ahmedabad, India'),
//       ('Ravi Kumar', 'Ravi Consulting', 'ravi@example.com', '9123456780', 'Surat, India');
//   `, function(err) {
//     if (err) {
//       console.log('Clients insert likely skipped (duplicate?)', err.message);
//     } else {
//       console.log('Inserted demo clients');
//     }
//   });

//   // Insert demo contacts
//   db.run(`
//     INSERT INTO contacts (client_id, name, email, phone, role, notes)
//     VALUES
//       (1, 'Asha Billing', 'billing@ashadesigns.com', '9811122233', 'Billing', 'Main billing contact'),
//       (2, 'Ravi Admin', 'admin@raviconsult.com', '9900099000', 'Primary', 'Main contact for projects');
//   `, function(err) {
//     if (err) {
//       console.log('Contacts insert likely skipped (duplicate?)', err.message);
//     } else {
//       console.log('Inserted demo contacts');
//     }
//   });

//   // Insert demo tasks
//   db.run(`
//     INSERT INTO tasks (title, description, client_id, contact_id, status, priority, due_date)
//     VALUES
//       ('Design homepage', 'Create mockups for client homepage', 1, 1, 'in_progress', 2, '2025-12-20'),
//       ('Prepare invoice Q4', 'Prepare and send invoice for Q4', 2, 2, 'todo', 1, '2025-12-15');
//   `, function(err) {
//     if (err) {
//       console.log('Tasks insert likely skipped (duplicate?)', err.message);
//     } else {
//       console.log('Inserted demo tasks');
//     }
//   });

//   // Insert demo invoices
//   db.run(`
//     INSERT INTO invoices (client_id, invoice_number, amount, currency, status, issue_date, due_date, notes)
//     VALUES
//       (1, 'INV-2025-001', 15000.00, 'INR', 'pending', '2025-11-01', '2025-11-30', 'Website design deposit'),
//       (2, 'INV-2025-002', 9000.00, 'INR', 'paid', '2025-10-15', '2025-11-14', 'Consulting fee');
//   `, function(err) {
//     if (err) {
//       console.log('Invoices insert likely skipped (duplicate?)', err.message);
//     } else {
//       console.log('Inserted demo invoices');
//     }
//   });

// }); // end serialize

// // Close DB after short delay to ensure queries complete
// setTimeout(() => {
//   db.close((err) => {
//     if (err) {
//       console.error('Error closing DB', err.message);
//     } else {
//       console.log('Database seed finished and connection closed.');
//     }
//   });
// }, 500);

// main seed.js
// const db = require('../src/db');
// const bcrypt = require('bcrypt');

// async function seed() {
//   db.serialize(async () => {

//     // ===== Create tables =====

//     // Users table
//     db.run(`
//       CREATE TABLE IF NOT EXISTS users (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         email TEXT UNIQUE NOT NULL,
//         password TEXT NOT NULL,
//         role TEXT DEFAULT 'user',
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//       );
//     `);

//     // Clients table
//     db.run(`
//       CREATE TABLE IF NOT EXISTS clients (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT NOT NULL,
//         company TEXT,
//         email TEXT,
//         phone TEXT,
//         address TEXT,
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//         updated_at DATETIME
//       );
//     `);

//     // Contacts table
//     db.run(`
//       CREATE TABLE IF NOT EXISTS contacts (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         client_id INTEGER NOT NULL,
//         name TEXT NOT NULL,
//         email TEXT,
//         phone TEXT,
//         role TEXT,
//         notes TEXT,
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
//       );
//     `);

//     // Tasks table
//     db.run(`
//       CREATE TABLE IF NOT EXISTS tasks (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         title TEXT NOT NULL,
//         description TEXT,
//         client_id INTEGER,
//         contact_id INTEGER,
//         status TEXT DEFAULT 'todo',
//         priority INTEGER DEFAULT 3,
//         due_date DATE,
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//         updated_at DATETIME,
//         FOREIGN KEY (client_id) REFERENCES clients(id),
//         FOREIGN KEY (contact_id) REFERENCES contacts(id)
//       );
//     `);

//     // Invoices table
//     db.run(`
//       CREATE TABLE IF NOT EXISTS invoices (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         client_id INTEGER NOT NULL,
//         invoice_number TEXT UNIQUE,
//         amount REAL NOT NULL,
//         currency TEXT DEFAULT 'INR',
//         status TEXT DEFAULT 'pending',
//         issue_date DATE,
//         due_date DATE,
//         notes TEXT,
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (client_id) REFERENCES clients(id)
//       );
//     `);

//     // ===== Insert demo data =====

//     // 🔐 Hash password first
//     const hashedPassword = await bcrypt.hash("admin123", 10);

//     // Insert admin user
//     db.run(`
//       INSERT INTO users (email, password, role)
//       VALUES (?, ?, ?)
//     `,
//       ['admin@apw.local', hashedPassword, 'admin'],
//       function (err) {
//         if (err) {
//           console.log('Admin insert likely skipped (duplicate?)', err.message);
//         } else {
//           console.log('Inserted admin user (hashed)');
//         }
//       }
//     );

//     // Demo clients
//     db.run(`
//       INSERT INTO clients (name, company, email, phone, address)
//       VALUES
//         ('Asha Patel', 'Asha Designs', 'asha@example.com', '9876543210', 'Ahmedabad, India'),
//         ('Ravi Kumar', 'Ravi Consulting', 'ravi@example.com', '9123456780', 'Surat, India');
//     `);

//     // Demo contacts
//     db.run(`
//       INSERT INTO contacts (client_id, name, email, phone, role, notes)
//       VALUES
//         (1, 'Asha Billing', 'billing@ashadesigns.com', '9811122233', 'Billing', 'Main billing contact'),
//         (2, 'Ravi Admin', 'admin@raviconsult.com', '9900099000', 'Primary', 'Main contact for projects');
//     `);

//     // Demo tasks
//     db.run(`
//       INSERT INTO tasks (title, description, client_id, contact_id, status, priority, due_date)
//       VALUES
//         ('Design homepage', 'Create mockups for client homepage', 1, 1, 'in_progress', 2, '2025-12-20'),
//         ('Prepare invoice Q4', 'Prepare and send invoice for Q4', 2, 2, 'todo', 1, '2025-12-15');
//     `);

//     // Demo invoices
//     db.run(`
//       INSERT INTO invoices (client_id, invoice_number, amount, currency, status, issue_date, due_date, notes)
//       VALUES
//         (1, 'INV-2025-001', 15000.00, 'INR', 'pending', '2025-11-01', '2025-11-30', 'Website design deposit'),
//         (2, 'INV-2025-002', 9000.00, 'INR', 'paid', '2025-10-15', '2025-11-14', 'Consulting fee');
//     `);
//   });

//   // Close DB
//   setTimeout(() => {
//     db.close((err) => {
//       if (err) console.error('Error closing DB', err.message);
//       else console.log('Database seed finished and connection closed.');
//     });
//   }, 500);
// }

// seed();


const db = require('../src/db');
const bcrypt = require('bcrypt');

async function seed() {
  db.serialize(async () => {

    // ===== Create tables =====

    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Clients table ✅ FIXED (status column added)
    db.run(`
      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        company TEXT,
        email TEXT,
        phone TEXT,
        address TEXT,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME
      );
    `);

    // Contacts table
    db.run(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        role TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
      );
    `);

    // Tasks table
    db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        client_id INTEGER,
        contact_id INTEGER,
        status TEXT DEFAULT 'todo',
        priority INTEGER DEFAULT 3,
        due_date DATE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME,
        FOREIGN KEY (client_id) REFERENCES clients(id),
        FOREIGN KEY (contact_id) REFERENCES contacts(id)
      );
    `);

    // Invoices table
    db.run(`
      CREATE TABLE IF NOT EXISTS invoices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        invoice_number TEXT UNIQUE,
        amount REAL NOT NULL,
        currency TEXT DEFAULT 'INR',
        status TEXT DEFAULT 'pending',
        issue_date DATE,
        due_date DATE,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id)
      );
    `);

    // ===== Insert demo data =====

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Insert admin user
    db.run(
      `
      INSERT OR IGNORE INTO users (email, password, role)
      VALUES (?, ?, ?)
      `,
      ['admin@apw.local', hashedPassword, 'admin'],
      () => console.log('Admin user ensured')
    );

    // Demo clients ✅ FIXED (status added)
    db.run(`
      INSERT INTO clients (name, company, email, phone, address, status)
      VALUES
        ('Asha Patel', 'Asha Designs', 'asha@example.com', '9876543210', 'Ahmedabad, India', 'active'),
        ('Ravi Kumar', 'Ravi Consulting', 'ravi@example.com', '9123456780', 'Surat, India', 'inactive');
    `);

    // Demo contacts
    db.run(`
      INSERT INTO contacts (client_id, name, email, phone, role, notes)
      VALUES
        (1, 'Asha Billing', 'billing@ashadesigns.com', '9811122233', 'Billing', 'Main billing contact'),
        (2, 'Ravi Admin', 'admin@raviconsult.com', '9900099000', 'Primary', 'Main contact for projects');
    `);

    // Demo tasks
    db.run(`
      INSERT INTO tasks (title, description, client_id, contact_id, status, priority, due_date)
      VALUES
        ('Design homepage', 'Create mockups for client homepage', 1, 1, 'in_progress', 2, '2025-12-20'),
        ('Prepare invoice Q4', 'Prepare and send invoice for Q4', 2, 2, 'todo', 1, '2025-12-15');
    `);

    // Demo invoices
    db.run(`
      INSERT INTO invoices (client_id, invoice_number, amount, currency, status, issue_date, due_date, notes)
      VALUES
        (1, 'INV-2025-001', 15000.00, 'INR', 'pending', '2025-11-01', '2025-11-30', 'Website design deposit'),
        (2, 'INV-2025-002', 9000.00, 'INR', 'paid', '2025-10-15', '2025-11-14', 'Consulting fee');
    `);
  });

  // Close DB
  setTimeout(() => {
    db.close((err) => {
      if (err) console.error('Error closing DB', err.message);
      else console.log('✅ Database seed finished and connection closed.');
    });
  }, 500);
}

seed();



