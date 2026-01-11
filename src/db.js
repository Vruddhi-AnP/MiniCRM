/**
 * Database Connection
 * -------------------
 * Establishes a connection to the SQLite database.
 * This file exports a single shared database instance
 * used across the entire application.
 */

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

/**
 * Resolve absolute path to the SQLite database file.
 * Keeping the database inside the /data directory
 * helps separate application logic from data storage.
 */
const dbPath = path.join(__dirname, "../data/database.sqlite");

/**
 * Create and open a connection to the SQLite database.
 * The same connection instance is reused across controllers.
 */
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        // Log database connection errors clearly
        console.error("Error connecting to DB:", err);
    } else {
        // Confirmation message for successful connection
        console.log("SQLite DB connected successfully!");
    }
});

module.exports = db;
