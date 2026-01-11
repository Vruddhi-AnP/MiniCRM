/**
 * Application Entry Point
 * -----------------------
 * Initializes the Express application.
 * Responsibilities include:
 * - Middleware configuration
 * - Session setup
 * - View engine setup
 * - Route registration
 * - Server startup
 */

const express = require("express");
const path = require("path");
const session = require("express-session");

// ==============================
// ROUTE IMPORTS
// ==============================

const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const clientRoutes = require("./routes/clients");
const taskRoutes = require("./routes/tasks");
const invoiceRoutes = require("./routes/invoices");

// ==============================
// MIDDLEWARE IMPORTS
// ==============================

const { ensureAuthenticated } = require("./middleware/authMiddleware");

const app = express();

// ==============================
// 1) BODY PARSERS
// ==============================
/**
 * Parses incoming request bodies.
 * - urlencoded: for form submissions
 * - json: for JSON payloads (future-proofing APIs)
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ==============================
// 2) SESSION CONFIGURATION
// ==============================
/**
 * Configures session management using express-session.
 * Sessions are stored in memory (suitable for development).
 */
app.use(
  session({
    secret: "supersecretkey123", // Secret key used to sign session ID cookie
    resave: false,               // Prevents session from being saved unnecessarily
    saveUninitialized: false,    // Prevents empty sessions from being stored
    cookie: {
      maxAge: 1000 * 60 * 60,    // Session expires after 1 hour
    },
  })
);

// ==============================
// GLOBAL VIEW VARIABLES
// ==============================
/**
 * Makes the logged-in user available in all EJS views.
 * This allows role-based UI rendering without passing user manually.
 */
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// ==============================
// 3) VIEW ENGINE SETUP
// ==============================
/**
 * Configures EJS as the templating engine.
 * Sets the views directory explicitly.
 */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// ==============================
// 4) STATIC FILES
// ==============================
/**
 * Serves static assets such as CSS, JS, and images.
 */
app.use(express.static(path.join(__dirname, "../public")));

// ==============================
// 5) ROOT REDIRECT
// ==============================
/**
 * Redirects root URL to login page.
 */
app.get("/", (req, res) => {
  res.redirect("/login");
});

// ==============================
// 6) PUBLIC ROUTES (NO AUTH)
// ==============================
/**
 * Authentication routes are accessible without login.
 */
app.use("/", authRoutes);

// ==============================
// 7) GLOBAL AUTH PROTECTION
// ==============================
/**
 * All routes defined after this middleware
 * require the user to be authenticated.
 */
app.use(ensureAuthenticated);

// ==============================
// 8) PROTECTED ROUTES
// ==============================
/**
 * Routes below this point are accessible
 * only to authenticated users.
 */
app.use("/", dashboardRoutes);
app.use("/", clientRoutes);
app.use("/", taskRoutes);
app.use("/", invoiceRoutes);

// ==============================
// 9) START SERVER
// ==============================
/**
 * Starts the Express server on the configured port.
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

module.exports = app;
