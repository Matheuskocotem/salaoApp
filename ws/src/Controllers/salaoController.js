const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Salao = require('../models/salao');
const Servico = require('../models/servico');
const Horario = require('../models/horario');
const turf = require('@turf/turf');
const util = require('../util');
const jwt = require('jsonwebtoken'); 

// Função para criar um salão
exports.createSalao = async (req, res) => {
  try {
    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(req.body.senha, 10);

    const salaoData = {
      ...req.body,
      senha: hashedPassword 
    };

    const salao = await new Salao(salaoData).save();
    res.json({ error: false, salao });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

exports.loginSalao = async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Buscar o salão pelo email
    const salao = await Salao.findOne({ email });

    // Se o salão não for encontrado
    if (!salao) {
      return res.status(401).json({ error: true, message: 'Salão não encontrado' });
    }

    // Verificar se a senha é válida
    const isMatch = await bcrypt.compare(senha, salao.senha);
    if (!isMatch) {
      return res.status(401).json({ error: true, message: 'Senha incorreta' });
    }

    // Gerar um token JWT com o ID do salão
    const token = jwt.sign(
      { id: salao._id, userType: 'salao' },  // Payload do token (pode adicionar mais dados se necessário)
      process.env.JWT_SECRET || 'seu_segredo',  // Chave secreta para assinar o token
      { expiresIn: '1h' }  // Tempo de expiração do token (neste caso, 1 hora)
    );

    // Retornar o token e os dados do salão (sem a senha)
    res.json({
      error: false,
      token,
      salao: { ...salao._doc, senha: undefined }  // Remove a senha da resposta
    });
  } catch (err) {
    // Caso ocorra algum erro interno
    res.status(500).json({ error: true, message: err.message });
  }
};


// Função para obter serviços do salão
exports.getServicos = async (req, res) => {
  try {
    const { salaoId } = req.params;
    const servicos = await Servico.find({ salaoId, status: 'A' }).select('_id titulo');
    res.json({
      error: false,
      servicos: servicos.map((s) => ({ label: s.titulo, value: s._id })),
    });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

// Função para filtrar salão
exports.filterSalao = async (req, res) => {
  try {
    const salao = await Salao.findById(req.params.id).select(req.body.fields);
    const distance = turf.distance(turf.point(salao.geo.coordinates), turf.point([-30.043858, -51.103487])).toFixed(2);
    const horarios = await Horario.find({ salaoId: req.params.id }).select('dias inicio fim');
    const isOpened = await util.isOpened(horarios);
    res.json({ error: false, salao: { ...salao._doc, distance, isOpened } });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};
