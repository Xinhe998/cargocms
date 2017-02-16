// /* @flow */
// ------------------------------------
// Constants
// ------------------------------------
export const SHOW_TOAST = 'SHOW_TOAST';
export const CLOSE_TOAST = 'CLOSE_TOAST';
export const TOAST_DURATION = 7000;

// ------------------------------------
// Actions
// ------------------------------------
export function closeToast() {
  return {
    type: CLOSE_TOAST,
    open: false,
    msg: '',
  };
}
export function showToast(msg) {
  return {
    type: SHOW_TOAST,
    open: true,
    msg,
  };
}

export function handleShowToast(
  msg = '',
) {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(closeToast());
    }, TOAST_DURATION);

    dispatch(showToast(msg));
  };
}

export const actions = {
  showToast,
  closeToast,
};

// ------------------------------------
// Action Handlers
// ------------------------------------
export const ACTION_HANDLERS = {
  [SHOW_TOAST]: (state = {}, action) => ({
    ...state,
    open: action.open,
    msg: action.msg,
  }),
  [CLOSE_TOAST]: (state = {}, action) => ({
    ...state,
    open: action.open,
    msg: action.msg,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  msg: '',
  open: false,
};

export default function toastReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
