const jwt = require('jsonwebtoken');


const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];  

  if (!token) {
    return res.status(401).json({ error: true, message: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seu_segredo');  
    req.user = decoded;  
    next();
  } catch (err) {
    res.status(401).json({ error: true, message: 'Token inválido ou expirado.' });
  }
};

module.exports = authMiddleware;
