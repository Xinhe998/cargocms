import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './modules/counter';
import shipOrder from './modules/shipOrder';
import toast from './modules/toast';
import error from './modules/errorHandler';

export default combineReducers({
  error,
  shipOrder,
  counter,
  toast,
  router,
});
