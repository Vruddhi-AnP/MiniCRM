// Explanation: middleware check karta hai req.session.user — agar present ho to next() call karke request ko agey bhej deta hai (route handler execute hota hai). 
// Nahi ho to user ko /login pe redirect kar deta hai.

// backend/src/middleware/authMiddleware.js
function ensureAuthenticated(req, res, next) {
  // agar session me user hai to aage badho
  if (req.session && req.session.user) {
    return next();
  }

  // nahi to login pe bhejo
  res.redirect('/login');
}

module.exports = { ensureAuthenticated };

