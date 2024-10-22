const express = require('express');
const router = express.Router();
const salaoController = require('../Controllers/salaoController');
const authMiddleware = require('../middleware/authMiddleware');
const salaoMiddleware = require('../middleware/salaoMiddleware');

router.post('/', authMiddleware, salaoMiddleware, salaoController.createSalao);
router.post('/login', salaoController.loginSalao);
router.get('/servicos/:salaoId', authMiddleware, salaoMiddleware, salaoController.getServicos);
router.post('/filter/:id', authMiddleware, salaoMiddleware, salaoController.filterSalao);

module.exports = router;
