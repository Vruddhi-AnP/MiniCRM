const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "../data/database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error connecting to DB:", err);
    } else {
        console.log("SQLite DB connected successfully!");
    }
});

module.exports = db;
