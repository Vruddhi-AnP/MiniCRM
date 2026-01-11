/**
 * Role-Based Access Control Middleware
 * -----------------------------------
 * Restricts access to routes based on the user's role.
 *
 * Usage:
 *   allowRoles("admin", "superadmin")
 *
 * This middleware is typically used after authentication
 * to ensure that only authorized roles can access certain routes.
 */

module.exports = function allowRoles(...allowedRoles) {

  /**
   * Returns an Express middleware function
   * that checks the logged-in user's role.
   */
  return function (req, res, next) {

    /**
     * Step 1:
     * Ensure the user is logged in.
     * If no session exists, redirect to login page.
     */
    if (!req.session || !req.session.user) {
      return res.redirect('/login');
    }

    // Extract user role from session
    const userRole = req.session.user.role;

    /**
     * Step 2:
     * Check whether the user's role is included
     * in the list of allowed roles for this route.
     */
    if (!allowedRoles.includes(userRole)) {
      // User is authenticated but not authorized
      return res.status(403).send("❌ Access Denied");
    }

    /**
     * Step 3:
     * User is authorized → allow request to proceed.
     */
    next();
  };
};
