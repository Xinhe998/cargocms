import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import toast from './utils/toast';
import error from './utils/errorHandler';
import logs from './utils/logs';
import counter from './modules/counter';
import shipOrder from './modules/shipOrder';
import user from './modules/user';

export default combineReducers({
  shipOrder,
  counter,
  toast,
  error,
  logs,
  user,
  router,
});
