/**
 * Authentication Routes
 * ---------------------
 * Handles user authentication flow:
 * - Login
 * - Session creation
 * - Logout
 *
 * Uses bcrypt for secure password verification
 * and express-session for session management.
 */

const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db');

// ==============================
// SHOW LOGIN PAGE
// GET /login
// ==============================
/**
 * Renders the login page.
 * If a user session already exists, redirects to dashboard.
 */
router.get('/login', (req, res) => {
    // Debugging aid: inspect session data during development
    console.log("SESSION DATA:", req.session);

    // If user is already logged in, redirect to dashboard
    if (req.session.user) {
        return res.redirect('/dashboard');
    }

    // Render login page with empty error state
    res.render('login', { error: null, email: '' });
});

// ==============================
// PROCESS LOGIN
// POST /login
// ==============================
/**
 * Authenticates user credentials.
 * Steps:
 * 1. Validate input
 * 2. Fetch user by email
 * 3. Compare password hash using bcrypt
 * 4. Create session on success
 */
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Validation: both fields are required
    if (!email || !password) {
        return res.render('login', {
            error: "Please enter both fields",
            email
        });
    }

    const sql = `SELECT * FROM users WHERE email = ?`;

    // Fetch user from database
    db.get(sql, [email], async (err, user) => {
        if (err) {
            console.error("DB ERROR:", err);
            return res.render('login', {
                error: "Database error",
                email
            });
        }

        // If user does not exist, deny access
        if (!user) {
            return res.render('login', {
                error: "Invalid credentials",
                email
            });
        }

        // Compare entered password with stored hashed password
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.render('login', {
                error: "Invalid credentials",
                email
            });
        }

        /**
         * Create session object after successful authentication.
         * Only essential user data is stored in session.
         */
        req.session.user = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        console.log("User session set:", req.session.user);

        // Save session and redirect to dashboard
        req.session.save(() => {
            res.redirect('/dashboard');
        });
    });
});

// ==============================
// LOGOUT USER
// GET /logout
// ==============================
/**
 * Destroys user session and logs out the user.
 * Redirects back to login page.
 */
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;
