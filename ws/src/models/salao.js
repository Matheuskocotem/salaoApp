const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const salao = new Schema({
  nome: String,
  foto: String,
  capa: String,
  email: { type: String, required: true, unique: true }, 
  senha: { type: String, required: true },
  telefone: String,
  recipientId: String,
  endereco: {
    cidade: String,
    uf: String,
    cep: String,
    logradouro: String,
    numero: String,
    pais: String,
  },
  geo: {
    type: String,
    coordinates: [],
  },
  dataCadastro: {
    type: Date,
    default: Date.now,
  },
  token: { type: String } 
});

salao.index({ coordenadas: '2dsphere' });

module.exports = mongoose.model('Salao', salao);