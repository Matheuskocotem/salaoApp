import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './modules/rootReducer.js'
import rootSaga from './modules/rootSaga.js'

const SagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, 
    window.__REDUX_DEVTOOLS_EXTENSION__ && Window.__REDUX_DEVTOOLS_EXTENSION__()
    ? composeWithDevTools(applyMiddleware(SagaMiddleware))
    : applyMiddleware(SagaMiddleware)
);

SagaMiddleware.run(rootSaga);

export default store;