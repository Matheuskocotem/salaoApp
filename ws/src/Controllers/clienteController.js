const mongoose = require('mongoose');
const Cliente = require('../models/cliente');
const SalaoCliente = require('../models/relationship/salaoCliente');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const moment = require('moment');

// Função para registro de cliente
exports.register = async (req, res) => {
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
      ],
    });

    // Se o cliente não existir, criar um novo
    if (!existentClient) {
      const _id = new mongoose.Types.ObjectId();  // Gera um novo ID para o cliente
      const hashedPassword = await bcrypt.hash(cliente.senha, 10); // Hash da senha

      // Criação do cliente diretamente no banco de dados
      newClient = await new Cliente({
        _id,
        ...cliente,
        senha: hashedPassword, // Salvar senha hash
      }).save({ session });
    } else {
      return res.json({ error: true, message: 'Cliente já cadastrado!' });
    }

    // Obter o ID do cliente
    const clienteId = newClient._id;

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

    // Commit da transação
    await session.commitTransaction();
    session.endSession();

    // Resposta para o cliente
    res.json({ error: false, message: 'Cliente registrado com sucesso!' });
  } catch (err) {
    // Em caso de erro, abortar a transação e retornar o erro
    await session.abortTransaction();
    session.endSession();
    res.json({ error: true, message: err.message });
  }
};

// Função para login de cliente
exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Verificar se o cliente existe pelo e-mail ou telefone
    const cliente = await Cliente.findOne({
      $or: [{ email }, { telefone: email }],
    });

    if (!cliente) {
      return res.status(401).json({ error: true, message: 'Cliente não encontrado' });
    }

    // Comparar a senha
    const isMatch = await bcrypt.compare(senha, cliente.senha);
    if (!isMatch) {
      return res.status(401).json({ error: true, message: 'Senha incorreta' });
    }

    // Gerar um token JWT
    const token = jwt.sign({ id: cliente._id, userType: 'cliente' }, process.env.JWT_SECRET || 'seu_segredo', { expiresIn: '1h' });

    res.json({ token, message: 'Login bem-sucedido!' });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

// Função para Filtrar Clientes
exports.filter = async (req, res) => {
  try {
    const clientes = await Cliente.find(req.body.filters);
    res.json({ error: false, clientes });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

// Função para obter Clientes de um Salão
exports.getClientesFromSalao = async (req, res) => {
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
};

exports.removeVinculo = async (req, res) => {
  try {
    await SalaoCliente.findByIdAndUpdate(req.params.id, { status: 'I' });
    res.json({ error: false, message: 'Vínculo removido com sucesso' });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};
