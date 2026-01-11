const db = require('../src/db');
const bcrypt = require('bcrypt');

async function seed() {
  db.serialize(async () => {

    // ==============================
    // CREATE TABLES
    // ==============================

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

    // Clients table (DO NOT REMOVE EXISTING COLUMNS)
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

    // 🔥 SAFE ADDITIONS (IGNORE ERROR IF ALREADY EXISTS)
    db.run(`ALTER TABLE clients ADD COLUMN type TEXT`, () => {});
    db.run(`ALTER TABLE clients ADD COLUMN sector TEXT`, () => {});
    db.run(`ALTER TABLE clients ADD COLUMN city TEXT`, () => {});

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

    // ✅ SAFE ADD: assigned_to (NO DATA LOSS)
    db.run(`ALTER TABLE tasks ADD COLUMN assigned_to TEXT`, () => {});

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

    // ==============================
    // INSERT USERS
    // ==============================

    const hashedPassword = await bcrypt.hash("admin123", 10);

    db.run(
      `INSERT OR IGNORE INTO users (email, password, role) VALUES (?, ?, ?)`,
      ['superadmin@apw.local', hashedPassword, 'superadmin']
    );

    db.run(
      `INSERT OR IGNORE INTO users (email, password, role) VALUES (?, ?, ?)`,
      ['admin@apw.local', hashedPassword, 'admin']
    );

    db.run(
      `INSERT OR IGNORE INTO users (email, password, role) VALUES (?, ?, ?)`,
      ['user@apw.local', hashedPassword, 'user']
    );

    // ==============================
    // DEMO DATA
    // ==============================

    db.run(`
      INSERT OR IGNORE INTO clients 
      (id, name, company, email, phone, address, city, sector, type, status)
      VALUES
        (1, 'Asha Patel', 'Asha Designs', 'asha@example.com', '9876543210', 'Ahmedabad, India', 'Ahmedabad', 'Design', 'Agency', 'active'),
        (2, 'Ravi Kumar', 'Ravi Consulting', 'ravi@example.com', '9123456780', 'Surat, India', 'Surat', 'Consulting', 'Individual', 'inactive');
    `);

    db.run(`
      INSERT OR IGNORE INTO contacts (id, client_id, name, email, phone, role, notes)
      VALUES
        (1, 1, 'Asha Billing', 'billing@ashadesigns.com', '9811122233', 'Billing', 'Main billing contact'),
        (2, 2, 'Ravi Admin', 'admin@raviconsult.com', '9900099000', 'Primary', 'Main contact');
    `);

    db.run(`
      INSERT OR IGNORE INTO tasks
      (id, title, description, client_id, contact_id, status, priority, due_date, assigned_to)
      VALUES
        (1, 'Design homepage', 'Create mockups', 1, 1, 'in_progress', 2, '2025-12-20', 'Asha'),
        (2, 'Prepare invoice Q4', 'Prepare invoice', 2, 2, 'todo', 1, '2025-12-15', 'Ravi');
    `);

    db.run(`
      INSERT OR IGNORE INTO invoices
      (id, client_id, invoice_number, amount, currency, status, issue_date, due_date, notes)
      VALUES
        (1, 1, 'INV-2025-001', 15000, 'INR', 'pending', '2025-11-01', '2025-11-30', 'Website design'),
        (2, 2, 'INV-2025-002', 9000, 'INR', 'paid', '2025-10-15', '2025-11-14', 'Consulting fee');
    `);
  });

  setTimeout(() => {
    db.close(() => {
      console.log('✅ Database seeded successfully');
    });
  }, 500);
}

seed();
