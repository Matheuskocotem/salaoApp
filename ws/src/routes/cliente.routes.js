// routes/clienteRoutes.js

const express = require('express');
const router = express.Router();
const clienteController = require('../Controllers/clienteController');
const authMiddleware = require('../middleware/authMiddleware');
// Rotas para Cliente
router.post('/register', clienteController.register);
router.post('/login', clienteController.login);
router.post('/filter', authMiddleware, clienteController.filter);
router.get('/salao/:salaoId', authMiddleware, clienteController.getClientesFromSalao);
router.delete('/vinculo/:id', authMiddleware, clienteController.removeVinculo);

module.exports = router;
