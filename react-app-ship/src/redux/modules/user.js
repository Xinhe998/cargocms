import {
  getData,
} from '../utils/fetchApi';
import { handleResponse } from '../utils/errorHandler';
// ------------------------------------
// Constants
// ------------------------------------
export const GET_CURRENT_USER = 'GET_CURRENT_USER';
const API_GET_CURRENT_USER = '/api/user/current';

export const REQUEST_LOGOUT = 'REQUEST_LOGOUT';
const API_REQUEST_LOGOUT = '/logout';

// ------------------------------------
// Actions
// ------------------------------------
export function deliverCurrentUserData(data) {
  return {
    type: GET_CURRENT_USER,
    data,
  };
}

export function fetchCurrentUserData() {
  return async(dispatch) => {
    const fetchResult = await getData(API_GET_CURRENT_USER);
    // success
    if (fetchResult.status) {
      if (fetchResult.data.success) {
        const rolesArray = fetchResult.data.data.currentUser.rolesArray;
        let isSupplier = false;
        for (const role of rolesArray) {
          if (role === 'supplier' || role === 'admin') {
            isSupplier = true;
          }
        }
        isSupplier = isSupplier && fetchResult.data.data.currentUser.SupplierId;
        if (isSupplier) {
          dispatch(deliverCurrentUserData(fetchResult.data.data.currentUser));
        } else {
          dispatch(handleResponse({
            response: { status: 401 },
            message: '只有供應商才能登入供應商後台！',
          }));
        }
      } else {
        dispatch(handleResponse({
          response: { status: 401 },
          message: '請先登入帳號！',
        }));
      }
    // error
    } else {
      dispatch(handleResponse(fetchResult));
    }
  };
}

export function requestLogout() {
  window.location.replace(`${API_REQUEST_LOGOUT}?url=/ship`);
}

export const actions = {
  deliverCurrentUserData,
  fetchCurrentUserData,
};

// ------------------------------------
// Action Handlers
// ------------------------------------
export const ACTION_HANDLERS = {
  [GET_CURRENT_USER]: (state = {}, action) => ({
    ...state,
    currentUser: action.data,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  currentUser: {},
};

export default function shipOrderReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
