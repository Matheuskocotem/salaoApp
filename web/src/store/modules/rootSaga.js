import { all } from 'redux-saga/effects'

import agendamento from './agendamento/reducer'

export default function*  rootSaga() {
    return yield all([agendamento]);
}