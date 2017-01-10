import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './modules/counter';
import shipOrder from './modules/shipOrder';
import toast from './modules/toast';
import error from './modules/errorHandler';
import user from './modules/user';

export default combineReducers({
  error,
  shipOrder,
  counter,
  toast,
  user,
  router,
});
