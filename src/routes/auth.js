
// const express = require('express');
// const bcrypt = require('bcrypt');
// const router = express.Router();
// const db = require('../db');

// // GET /login
// router.get('/login', (req, res) => {
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

//         // ⭐ FIXED — store only what exists in DB
//         req.session.user = {
//             id: user.id,
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

        // ✅ ONLY CHANGE: role added (SAFE)
        req.session.user = {
            id: user.id,
            email: user.email,
            role: user.role
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
