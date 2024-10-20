const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Cliente = require('../models/cliente');
const SalaoCliente = require('../models/relationship/salaoCliente');
const moment = require('moment');


router.post('/', async (req, res) => {
  const db = mongoose.connection;
  const session = await db.startSession();
  session.startTransaction();

  try {
    const { cliente, salaoId } = req.body;
    let newClient = null;

    // Verificar se o cliente já existe pelo e-mail ou telefone
    const existentClient = await Cliente.findOne({
      $or: [
        { email: cliente.email },
        { telefone: cliente.telefone },
        //{ cpf: cliente.cpf },
      ],
    });

    // Se o cliente não existir, criar um novo
    if (!existentClient) {
      const _id = new mongoose.Types.ObjectId();  // Gera um novo ID para o cliente
      const clienteData = req.body.cliente;
      console.log(clienteData);

      // Criação do cliente diretamente no banco de dados
      newClient = await new Cliente({
        _id,
        ...clienteData,
      }).save({ session });
    }

    // Obter o ID do cliente (se já existia, pegar o existente, caso contrário, o novo cliente)
    const clienteId = existentClient ? existentClient._id : newClient._id;

    // Verificar se já existe um relacionamento entre o salão e o cliente
    const existentRelationship = await SalaoCliente.findOne({
      salaoId,
      clienteId,
    });

    // Se não houver relacionamento, criar um novo
    if (!existentRelationship) {
      await new SalaoCliente({
        salaoId,
        clienteId,
      }).save({ session });
    }

    // Se o relacionamento existir, mas o status for "Inativo", atualizar para "Ativo"
    if (existentRelationship && existentRelationship.status === 'I') {
      await SalaoCliente.findOneAndUpdate(
        {
          salaoId,
          clienteId,
        },
        { status: 'A' },
        { session }
      );
    }

    // Commit da transação
    await session.commitTransaction();
    session.endSession();

    // Resposta para o cliente
    if (
      existentRelationship &&
      existentRelationship.status === 'A' &&
      existentClient
    ) {
      res.json({ error: true, message: 'Cliente já cadastrado!' });
    } else {
      res.json({ error: false });
    }
  } catch (err) {
    // Em caso de erro, abortar a transação e retornar o erro
    await session.abortTransaction();
    session.endSession();
    res.json({ error: true, message: err.message });
  }
});


router.post('/filter', async (req, res) => {
  try {
    const clientes = await Cliente.find(req.body.filters);
    res.json({ error: false, clientes });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

router.get('/salao/:salaoId', async (req, res) => {
  try {
    const clientes = await SalaoCliente.find({
      salaoId: req.params.salaoId,
      status: 'A',
    })
      .populate('clienteId')
      .select('clienteId');

    res.json({
      error: false,
      clientes: clientes.map((c) => ({
        ...c.clienteId._doc,
        vinculoId: c._id,
        dataCadastro: moment(c.dataCadastro).format('DD/MM/YYYY'),
      })),
    });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

router.delete('/vinculo/:id', async (req, res) => {
  try {
    await SalaoCliente.findByIdAndUpdate(req.params.id, { status: 'I' });
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

module.exports = router;