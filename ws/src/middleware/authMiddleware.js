const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: true, message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, 'seu_segredo');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: true, message: 'Invalid token' });
  }
};
