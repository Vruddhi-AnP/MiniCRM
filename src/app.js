
const express = require("express");
const path = require("path");
const session = require("express-session");

// Routes
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const clientRoutes = require("./routes/clients");
const taskRoutes = require("./routes/tasks");
const invoiceRoutes = require("./routes/invoices");

// Middleware
const { ensureAuthenticated } = require("./middleware/authMiddleware");

const app = express();

// ---------------------
// 1) Body Parsers
// ---------------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ---------------------
// 2) Session Middleware
// ---------------------
app.use(
  session({
    secret: "supersecretkey123",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

// ⭐ MOVE THIS HERE (CRITICAL FIX)
// Makes `user` available in ALL EJS views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// ---------------------
// 3) View Engine
// ---------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// ---------------------
// 4) Static Folder
// ---------------------
app.use(express.static(path.join(__dirname, "../public")));

// ---------------------
// 5) Redirect root (/) -> /login
// ---------------------
app.get("/", (req, res) => {
  res.redirect("/login");
});

// ---------------------
// 6) Public Routes (NO AUTH)
// ---------------------
app.use("/", authRoutes);

// ---------------------
// 7) PROTECT EVERYTHING BELOW
// ---------------------
app.use(ensureAuthenticated);

// ---------------------
// 8) Protected Routes
// ---------------------
app.use("/", dashboardRoutes);
app.use("/", clientRoutes);
app.use("/", taskRoutes);
app.use("/", invoiceRoutes);

// ---------------------
// 9) Start Server
// ---------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

module.exports = app;



