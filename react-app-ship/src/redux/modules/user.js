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

export const USER_ROLE_ADMIN = 'admin';
export const USER_ROLE_SUPPLIER = 'supplier';
export const SET_IS_AUTHORIZED = 'SET_IS_AUTHORIZED';

// ------------------------------------
// Actions
// ------------------------------------
export function deliverCurrentUserData(data) {
  return {
    type: GET_CURRENT_USER,
    data,
  };
}

export function deliverIsAuthorized(data) {
  return {
    type: SET_IS_AUTHORIZED,
    data,
  };
}

export function checkIsAuthorized(data) {
  const rolesArray = data.currentUser.rolesArray;
  let isAuthorized = false;
  const hasSupplierId = data.currentUser.SupplierId;
  for (const role of rolesArray) {
    const isSupplier = role === USER_ROLE_SUPPLIER;
    const isAdmin = role === USER_ROLE_ADMIN;
    if (isSupplier || isAdmin) {
      isAuthorized = true;
    }
  }
  return isAuthorized && hasSupplierId;
}

export function fetchCurrentUserData() {
  return async(dispatch) => {
    const fetchResult = await getData(API_GET_CURRENT_USER);
    // success
    if (fetchResult.status) {
      if (fetchResult.data.success) {
        const isAuthorized = checkIsAuthorized(fetchResult.data.data);
        if (isAuthorized) {
          dispatch(deliverCurrentUserData(fetchResult.data.data.currentUser));
        } else {
          dispatch(handleResponse({
            response: { status: 401 },
            message: '只有供應商才能登入供應商後台！',
          }));
        }
        dispatch(deliverIsAuthorized(isAuthorized));
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
  [SET_IS_AUTHORIZED]: (state = {}, action) => ({
    ...state,
    isAuthorized: action.data,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  currentUser: {},
  isAuthorized: false,
};

export default function shipOrderReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
