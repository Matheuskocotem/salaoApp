const Agendamento = require('../models/agendamento');
const Cliente = require('../models/cliente');
const Salao = require('../models/salao');
const Servico = require('../models/servico');
const Colaborador = require('../models/colaborador');
const Horario = require('../models/horario');
const moment = require('moment');
const mongoose = require('mongoose');
const _ = require('lodash');
const util = require('../util');

// Filtro de agendamentos
exports.filterAgendamentos = async (req, res) => {
  try {
    const { range, salaoId } = req.body;
    const agendamentos = await Agendamento.find({
      status: 'A',
      salaoId,
      data: {
        $gte: moment(range.start).startOf('day'),
        $lte: moment(range.end).endOf('day'),
      },
    }).populate([
      { path: 'servicoId', select: 'titulo duracao' },
      { path: 'colaboradorId', select: 'nome' },
      { path: 'clienteId', select: 'nome' },
    ]);
    res.json({ error: false, agendamentos });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

// Criação de agendamento
exports.createAgendamento = async (req, res) => {
  const db = mongoose.connection;
  const session = await db.startSession();
  session.startTransaction();
  try {
    const { clienteId, salaoId, servicoId, colaboradorId } = req.body;
    const cliente = await Cliente.findById(clienteId).select('nome endereco');
    const salao = await Salao.findById(salaoId);
    const servico = await Servico.findById(servicoId).select('preco titulo comissao');
    const colaborador = await Colaborador.findById(colaboradorId);

    let agendamento = req.body;
    agendamento = {
      ...agendamento,
      comissao: servico.comissao,
      valor: servico.preco,
    };
    await new Agendamento(agendamento).save();
    await session.commitTransaction();
    session.endSession();
    res.json({ error: false, agendamento });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.json({ error: true, message: err.message });
  }
};

// Dias disponíveis
exports.diasDisponiveis = async (req, res) => {
  try {
    const { data, salaoId, servicoId } = req.body;
    const horarios = await Horario.find({ salaoId });
    const servico = await Servico.findById(servicoId).select('duracao');
    let colaboradores = [];
    let agenda = [];
    let lastDay = moment(data);

    const servicoDuracao = util.hourToMinutes(moment(servico.duracao).format('HH:mm'));
    const servicoDuracaoSlots = util.sliceMinutes(
      moment(servico.duracao),
      moment(servico.duracao).add(servicoDuracao, 'minutes'),
      util.SLOT_DURATION,
      false
    ).length;

    for (let i = 0; i <= 365 && agenda.length <= 7; i++) {
      const espacosValidos = horarios.filter((h) => {
        const diaSemanaDisponivel = h.dias.includes(moment(lastDay).day());
        const servicosDisponiveis = h.especialidades.includes(servicoId);
        return diaSemanaDisponivel && servicosDisponiveis;
      });

      if (espacosValidos.length > 0) {
        let todosHorariosDia = {};
        for (let espaco of espacosValidos) {
          for (let colaborador of espaco.colaboradores) {
            if (!todosHorariosDia[colaborador._id]) {
              todosHorariosDia[colaborador._id] = [];
            }
            todosHorariosDia[colaborador._id] = [
              ...todosHorariosDia[colaborador._id],
              ...util.sliceMinutes(
                util.mergeDateTime(lastDay, espaco.inicio),
                util.mergeDateTime(lastDay, espaco.fim),
                util.SLOT_DURATION
              ),
            ];
          }
        }

        for (let colaboradorKey of Object.keys(todosHorariosDia)) {
          const agendamentos = await Agendamento.find({
            colaboradorId: colaboradorKey,
            data: {
              $gte: moment(lastDay).startOf('day'),
              $lte: moment(lastDay).endOf('day'),
            },
          }).select('data -_id');

          let horariosOcupado = agendamentos.map((a) => ({
            inicio: moment(a.data),
            fim: moment(a.data).add(servicoDuracao, 'minutes'),
          }));
          horariosOcupado = horariosOcupado
            .map((h) => util.sliceMinutes(h.inicio, h.fim, util.SLOT_DURATION, false))
            .flat();
          let horariosLivres = util.splitByValue(
            _.uniq(
              todosHorariosDia[colaboradorKey].map((h) => {
                return horariosOcupado.includes(h) ? '-' : h;
              })
            ),
            '-'
          );

          horariosLivres = horariosLivres
            .filter((h) => h.length >= servicoDuracaoSlots)
            .flat();
          horariosLivres = horariosLivres.map((slot) =>
            slot.filter((horario, index) => slot.length - index >= servicoDuracaoSlots)
          );
          horariosLivres = _.chunk(horariosLivres, 2);
          if (horariosLivres.length === 0) {
            todosHorariosDia = _.omit(todosHorariosDia, colaboradorKey);
          } else {
            todosHorariosDia[colaboradorKey] = horariosLivres;
          }
        }

        const totalColaboradores = Object.keys(todosHorariosDia).length;
        if (totalColaboradores > 0) {
          colaboradores.push(Object.keys(todosHorariosDia));
          console.log(todosHorariosDia);
          agenda.push({
            [moment(lastDay).format('YYYY-MM-DD')]: todosHorariosDia,
          });
        }
      }
      lastDay = moment(lastDay).add(1, 'day');
    }

    colaboradores = await Colaborador.find({
      _id: { $in: _.uniq(colaboradores.flat()) },
    }).select('nome foto');
    colaboradores = colaboradores.map((c) => ({
      ...c._doc,
      nome: c.nome.split(' ')[0],
    }));

    res.json({ error: false, colaboradores, agenda });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};
