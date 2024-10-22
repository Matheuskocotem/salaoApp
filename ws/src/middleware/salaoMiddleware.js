const salaoMiddleware = (req, res, next) => {
    if (req.user.userType !== 'salao') {
      return res.status(403).json({ error: true, message: 'Acesso negado. Permissão insuficiente.' });
    }
    next();
  };
  
  module.exports = salaoMiddleware;
  