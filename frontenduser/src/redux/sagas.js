import { all } from 'redux-saga/effects';
import authSagas from './auth/saga';
import chatSagas from './chat/saga';
import todoSagas from './todo/saga';

export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    chatSagas(),
    todoSagas(),
  ]);
}
