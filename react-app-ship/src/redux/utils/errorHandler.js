/* @flow */
import { replace } from 'react-router-redux';
import { handleShowToast } from './toast';

// ------------------------------------
// Constants
// ------------------------------------
export const ERROR_HANDLER = 'ERROR_HANDLER';
export const FORBIDDEN = 'FORBIDDEN';

// ------------------------------------
// Actions
// ------------------------------------
export function deliverErrorStatus(response, message) {
  return {
    type: ERROR_HANDLER,
    response: response.statusText,
    status: response.status,
    message,
  };
}

export function handleResponse(
  result: Object = {
    response: {},
    message: '',
  },
) {
  const con = console;
  const response = result.response;
  let message = result.message;
  return (dispatch) => {
    con.error('[errorHandler] origin error message: ', message);
    switch (response.status) {
      case 401:
        dispatch(replace('/ship/login'));
        message = '您嘗試登入的帳號沒有權限查看此頁面！';
        break;
      case 403:
        dispatch(replace('/ship/login'));
        message = '請登入後使用！';
        break;
      case 404:
        break;
      case 500:
        break;
      default:
        break;
    }
    dispatch(deliverErrorStatus(response, message));
    dispatch(handleShowToast(message));
  };
}

export const actions = {
  handleResponse,
  deliverErrorStatus,
};

// ------------------------------------
// Action Handlers
// ------------------------------------
export const ACTION_HANDLERS = {
  [ERROR_HANDLER]: (state = {}, action) => ({
    ...state,
    response: action.response,
    status: action.status,
    message: action.message,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  response: '',
  status: 0,
  message: '',
};

export default function errorReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
