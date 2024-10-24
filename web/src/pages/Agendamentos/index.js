import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterAgendamentos } from '../../store/modules/agendamento/actions';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import axios from 'axios';
import util from '../../util';

const localizer = momentLocalizer(moment);

const Agendamentos = () => {
  const dispatch = useDispatch();
  const { agendamentos } = useSelector((state) => state.agendamento);

  // Função para buscar agendamentos da API
  const fetchAgendamentos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/agendamentos/filter');
      dispatch(filterAgendamentos(response.data));
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error.message);
      // Adicionando log da resposta de erro para depuração
      if (error.response) {
        console.error('Resposta do erro:', error.response.data);
      }
    }
  };

  // Formata os eventos para serem compatíveis com o calendário
  const formatEventos = () => {
    return agendamentos.map((agendamento) => {
      const duracao = util.hourToMinutes(moment(agendamento.servicoId.duracao).format('HH:mm'));
      return {
        resource: { agendamento },
        title: `${agendamento.servicoId.titulo} - ${agendamento.clienteId.nome} - ${agendamento.colaboradorId.nome}`,
        start: moment(agendamento.data).toDate(),
        end: moment(agendamento.data).add(duracao, 'minutes').toDate(),
      };
    });
  };

  // Chama a função para buscar agendamentos na montagem do componente
  useEffect(() => {
    fetchAgendamentos();
  }, [dispatch]);

  // Formata o intervalo para a visualização do calendário
  const formatRange = (range) => {
    return {
      start: Array.isArray(range) ? moment(range[0]).format('YYYY-MM-DD') : moment(range.start).format('YYYY-MM-DD'),
      end: Array.isArray(range) ? moment(range[range.length - 1]).format('YYYY-MM-DD') : moment(range.end).format('YYYY-MM-DD'),
    };
  };

  return (
    <div className="col p-5 overflow-auto h-100">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4 mt-0">Agendamentos</h2>
          <Calendar
            localizer={localizer}
            onRangeChange={(range) => dispatch(filterAgendamentos(formatRange(range)))}
            onSelectEvent={() => {}}
            events={formatEventos()}
            defaultView="week"
            selectable={true}
            popup={true}
            style={{ height: 600 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Agendamentos;
