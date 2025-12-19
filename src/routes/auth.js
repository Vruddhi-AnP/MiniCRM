// // backend/src/routes/auth.js
// const express = require('express');
// const bcrypt = require('bcrypt');
// const router = express.Router();
// const db = require('../db');  // db.js from src folder

// // GET /login --> display login page
// router.get('/login', (req, res) => {
//     if (req.session.user) return res.redirect('/dashboard');
//     res.render('login', { error: null, email: '' });
// });

// // POST /login --> check details
// router.post('/login', (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.render('login', { error: "Please enter both fields", email });
//     }

//     // Check user in DB
//     const sql = `SELECT * FROM users WHERE email = ?`;
//     db.get(sql, [email], async (err, user) => {
//         if (err) return res.render('login', { error: "DB error", email });
//         if (!user) return res.render('login', { error: "Invalid credentials", email });

//         const match = await bcrypt.compare(password, user.password);
//         if (!match) {
//             return res.render('login', { error: "Invalid credentials", email });
//         }

//         // Set session
//         req.session.user = {
//             id: user.id,
//             name: user.name,
//             email: user.email
//         };

//         req.session.save(() => {
//             res.redirect('/dashboard');
//         });
//     });
// });

// // Logout
// router.get('/logout', (req, res) => {
//     req.session.destroy(() => {
//         res.redirect('/login');
//     });
// });

// module.exports = router;    



// backend/src/routes/auth.js
// const express = require('express');
// const bcrypt = require('bcrypt');
// const router = express.Router();
// const db = require('../db');

// // GET /login
// router.get('/login', (req, res) => {
//     // Session working check
//     console.log("SESSION DATA:", req.session);

//     if (req.session.user) {
//         return res.redirect('/dashboard');
//     }

//     res.render('login', { error: null, email: '' });
// });

// // POST /login
// router.post('/login', (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.render('login', { error: "Please enter both fields", email });
//     }

//     const sql = `SELECT * FROM users WHERE email = ?`;

//     db.get(sql, [email], async (err, user) => {
//         if (err) {
//             console.error("DB ERROR:", err);
//             return res.render('login', { error: "Database error", email });
//         }

//         if (!user) {
//             return res.render('login', { error: "Invalid credentials", email });
//         }

//         const match = await bcrypt.compare(password, user.password);

//         if (!match) {
//             return res.render('login', { error: "Invalid credentials", email });
//         }

//         // SAVE SESSION
//         req.session.user = {
//             id: user.id,
//             name: user.name,
//             email: user.email
//         };

//         console.log("User session set:", req.session.user);

//         req.session.save(() => {
//             res.redirect('/dashboard');
//         });
//     });
// });

// // LOGOUT
// router.get('/logout', (req, res) => {
//     req.session.destroy(() => {
//         res.redirect('/login');
//     });
// });

// // DUMMY DASHBOARD (to test)
// router.get('/dashboard', (req, res) => {
//     if (!req.session.user) return res.redirect('/login');

//     res.send(`
//         <h1>Welcome ${req.session.user.name}!</h1>
//         <a href="/logout">Logout</a>
//     `);
// });

// module.exports = router;




const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db');

// GET /login
router.get('/login', (req, res) => {
    console.log("SESSION DATA:", req.session);

    if (req.session.user) {
        return res.redirect('/dashboard');
    }

    res.render('login', { error: null, email: '' });
});

// POST /login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render('login', { error: "Please enter both fields", email });
    }

    const sql = `SELECT * FROM users WHERE email = ?`;

    db.get(sql, [email], async (err, user) => {
        if (err) {
            console.error("DB ERROR:", err);
            return res.render('login', { error: "Database error", email });
        }

        if (!user) {
            return res.render('login', { error: "Invalid credentials", email });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.render('login', { error: "Invalid credentials", email });
        }

        // ⭐ FIXED — store only what exists in DB
        req.session.user = {
            id: user.id,
            email: user.email
        };

        console.log("User session set:", req.session.user);

        req.session.save(() => {
            res.redirect('/dashboard');
        });
    });
});

// LOGOUT
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;

