/* @flow */
import { replace } from 'react-router-redux';
import { showToast } from './toast';

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
  const response = result.response;
  const message = result.message;
  return (dispatch) => {
    switch (response.status) {
      case 403:
        dispatch(replace('/ship/login'));
        break;
      case 404:
        break;
      case 500:
        break;
      default:
        break;
    }
    console.error(message);
    dispatch(deliverErrorStatus(response, message));
    dispatch(showToast(message));
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
