import Lang from 'lodash';
import {
  // replace,
  push,
} from 'react-router-redux';
import {
  getData,
  postData,
  setHeader,
} from '../utils/fetchApi';
import log from '../utils/logs';
import { handleResponse } from '../utils/errorHandler';
// ------------------------------------
// Constants
// ------------------------------------
const API_GET_CURRENT_USER = '/api/user/current';
const API_REQUEST_LOGOUT = '/logout';
const API_REQUEST_LOGIN = '/auth/local?url=api';

export const REQUEST_CURRENT_USER = 'REQUEST_CURRENT_USER';
export const REQUEST_LOGOUT = 'REQUEST_LOGOUT';
export const REQUEST_LOGIN = 'REQUEST_LOGIN';
export const SET_IS_AUTHORIZED = 'SET_IS_AUTHORIZED';
export const SET_JWT_TOKEN = 'SET_JWT_TOKEN';

export const USER_ROLE_ADMIN = 'admin';
export const USER_ROLE_SUPPLIER = 'supplier';

// ------------------------------------
// Actions
// ------------------------------------
export function deliverCurrentUserData(data) {
  return {
    type: REQUEST_CURRENT_USER,
    data,
  };
}

export function deliverIsAuthorized(data) {
  return {
    type: SET_IS_AUTHORIZED,
    data,
  };
}

export function deliverJwtToken(data) {
  return {
    type: SET_JWT_TOKEN,
    data,
  };
}

export function checkIsAuthorized(currentUser) {
  const rolesArray = currentUser.rolesArray;
  let isAuthorized = false;
  const hasSupplierId = currentUser.SupplierId;
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
        const isAuthorized = checkIsAuthorized(fetchResult.data.data.currentUser);
        if (isAuthorized) {
          dispatch(deliverCurrentUserData(fetchResult.data.data));
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

export function requestLogIn(username: String, password: String) {
  return async (dispatch) => {
    const fetchResult = await postData(API_REQUEST_LOGIN, {
      identifier: username,
      password,
    });
    console.log('fetchResult=>', fetchResult);
    // success
    if (fetchResult.status) {
      if (fetchResult.data.success) {
        const hasJwtToken = !Lang.isUndefined(fetchResult.data.jwtToken);
        if (hasJwtToken) {
          const jwtToken = fetchResult.data.jwtToken;
          dispatch(deliverJwtToken(jwtToken));
          const jwtHeader = await setHeader('jwt-token', jwtToken);
          if (jwtHeader === jwtToken) {
            dispatch(push('/ship'));
          } else {
            log.error('[Error] set JWT Token failed!');
          }
        }
      }
    // error
    } else {
      dispatch(handleResponse(fetchResult));
    }
  };
}

export const actions = {
  deliverCurrentUserData,
  fetchCurrentUserData,
};

// ------------------------------------
// Action Handlers
// ------------------------------------
export const ACTION_HANDLERS = {
  [REQUEST_CURRENT_USER]: (state = {}, action) => ({
    ...state,
    currentUser: action.data.currentUser,
    jwtToken: action.data.jwtToken,
  }),
  [SET_IS_AUTHORIZED]: (state = {}, action) => ({
    ...state,
    isAuthorized: action.data,
  }),
  [SET_JWT_TOKEN]: (state = {}, action) => ({
    ...state,
    jwtToken: action.data,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  currentUser: {},
  isAuthorized: false,
  jwtToken: '',
};

export default function shipOrderReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
