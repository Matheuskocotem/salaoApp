import { all, takeLatest, call } from 'redux-saga/effects';
import api from '../../../servico/api'
import consts from '../../../consts'

export function* filterAgendamento({ start, end }) {
    try {
        consts res = yield call(api.post('/agendamento/filter'), {
            "salaoId": "6708957fd2fb8d2b7ed34188",
            "periodo": {
                "inicio": "2021-05-24",
                "final": "2021-05-25"
            },
        });
    } catch (err) {
        alert(err.message);
    }
}

export default all([takeLatest('@agendamento/FILTER', filterAgendamento)]);