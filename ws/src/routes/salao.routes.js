const express = require('express');
const router = express.Router();
const salaoController = require('../Controllers/salaoController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, salaoController.createSalao);
router.get('/servicos/:salaoId', authMiddleware, salaoController.getServicos);
router.post('/filter/:id', authMiddleware, salaoController.filterSalao);

module.exports = router;
