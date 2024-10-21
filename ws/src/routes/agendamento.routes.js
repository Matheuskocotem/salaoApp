const express = require('express');
const router = express.Router();
const agendamentoController = require('../Controllers/agendamentoController');

// Filtro de agendamentos
router.post('/filter', agendamentoController.filterAgendamentos);

// Criação de agendamento
router.post('/', agendamentoController.createAgendamento);

// Dias disponíveis
router.post('/dias-disponiveis', agendamentoController.diasDisponiveis);

module.exports = router;
