const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
      const userType = req.user.userType;
      if (!allowedRoles.includes(userType)) {
        return res.status(403).json({ error: true, message: 'Forbidden' });
      }
      next();
    };
  };
  
  module.exports = roleMiddleware;
  