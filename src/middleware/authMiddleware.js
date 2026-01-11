/**
 * Authentication Middleware
 * -------------------------
 * Ensures that a user is authenticated before accessing
 * protected routes.
 *
 * How it works:
 * - Checks for the presence of `req.session.user`
 * - If present, allows the request to proceed
 * - If not present, redirects the user to the login page
 */

// backend/src/middleware/authMiddleware.js
function ensureAuthenticated(req, res, next) {

  /**
   * If a valid user session exists,
   * allow the request to continue to the next middleware
   * or route handler.
   */
  if (req.session && req.session.user) {
    return next();
  }

  /**
   * If no user session is found,
   * redirect the user to the login page.
   */
  res.redirect('/login');
}

module.exports = { ensureAuthenticated };
