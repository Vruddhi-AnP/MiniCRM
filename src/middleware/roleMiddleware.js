// Role-based access control middleware
// This middleware checks whether the logged-in user
// has the required role to access a route

module.exports = function allowRoles(...allowedRoles) {
  return function (req, res, next) {

    // 1. Check if user is logged in
    if (!req.session || !req.session.user) {
      return res.redirect('/login');
    }

    const userRole = req.session.user.role;

    // 2. Check if user's role is allowed
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).send("❌ Access Denied");
    }

    // 3. User is allowed → continue
    next();
  };
};

