import { combineReducers } from 'redux';
import settings from './settings/reducer';
import menu from './menu/reducer';
import chatApp from './chat/reducer';
import todoApp from './todo/reducer';
import authUser from './auth/reducer';

const reducers = combineReducers({
  authUser,
  menu,
  settings,
  chatApp,
  todoApp,
});

export default reducers;