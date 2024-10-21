const Cliente = require('../models/cliente');
const Salao = require('../models/salao');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
    const { email, password, userType } = req.body;
    try {
      let user;
      if (userType === 'cliente') {
        user = await Cliente.findOne({ email });
      } else if (userType === 'salao') {
        user = await Salao.findOne({ email });
      }
      if (!user) {
        return res.status(401).json({ error: true, message: 'Usuário não encontrado' });
      }
      const isMatch = await bcrypt.compare(password, user.senha);
      if (!isMatch) {
        return res.status(401).json({ error: true, message: 'Senha incorreta' });
      }
      const token = jwt.sign({ id: user._id, userType }, 'seu_segredo', { expiresIn: '1h' });
      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: true, message: err.message });
    }
  };

  exports.register = async (req, res) => {
    const { email, password, userType } = req.body;
    try {
      let existingUser;
      if (userType === 'cliente') {
        existingUser = await Cliente.findOne({ email });
      } else if (userType === 'salao') {
        existingUser = await Salao.findOne({ email });
      }
      if (existingUser) {
        return res.status(400).json({ error: true, message: 'Usuário já existe' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      let newUser;
      if (userType === 'cliente') {
        newUser = new Cliente({ ...req.body, senha: hashedPassword });
      } else if (userType === 'salao') {
        newUser = new Salao({ ...req.body, senha: hashedPassword });
      }
      await newUser.save();
      const token = jwt.sign({ id: newUser._id, userType }, 'seu_segredo', { expiresIn: '1h' });
      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: true, message: err.message });
    }
  };