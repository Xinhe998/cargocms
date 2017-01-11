import {
  postData,
} from '../utils/fetchApi';
import { showToast } from './toast';
// ------------------------------------
// Constants
// ------------------------------------
export const GET_SHIP_LIST = 'GET_SHIP_LIST';
export const FIND_SHIP_ITEM = 'FIND_SHIP_ITEM';

// ------------------------------------
// Actions
// ------------------------------------
export function deliverShipListData(data) {
  return {
    type: GET_SHIP_LIST,
    list: data,
  };
}

export function fetchShipListData(status) {
  return async(dispatch) => {
    const api = '/api/admin/suppliershiporder/all';

    let query = {
      serverSidePaging: true,
      startDate: '1900/01/01',
      endDate: '3000/01/01',
      columns: [{
        data: 'status',
        searchable: true,
        search: {
          custom: {
            where: status ? status : { $not: ''}
          }
        }
      }],
      order: [{ column: '0', dir: 'asc' }],
      start: 0,
      length: 999999,
      search: { value: '', regex: 'false' },
      _: new Date().getTime(),
    }


    const fetchResult = await postData(api, query);
    let result = '';
    // success
    console.log("fetchResult ==>", fetchResult);
    if (fetchResult.status) {
      dispatch(deliverShipListData({ items: fetchResult.data.data }));
      if (fetchResult.data.data.length > 0) {
        dispatch(showToast('載入完成'));
      } else {
        dispatch(showToast('沒有資料'));
      }
    } else {
      // error
      if (fetchResult.response) {
        result = fetchResult.response.statusText;
      } else {
        result = fetchResult.message;
      }
      dispatch(showToast(result));
    }
  };
}

export function deliverFindShipItem(searchText, data) {
  // console.log('deliverFindShipItem=>', data);
  return {
    type: FIND_SHIP_ITEM,
    list: data,
    searchText,
  };
}

export function fetchFindShipItem(value, status) {
  return async(dispatch, getState) => {
    const api = '/api/admin/suppliershiporder/all';
    const query = {
      serverSidePaging: true,
      startDate: '1900/01/01',
      endDate: '3000/01/01',
      columns: [{
        data: 'id',
        searchable: true,
      },
      {
        data: 'invoiceNo',
        searchable: 'true',
        findInclude: 'true',
        search: {
          concat: ['invoicePrefix', 'invoiceNo'],
        },
      },
      {
        data: 'lastname',
        searchable: 'true',
        findInclude: 'true',
        search: {
          concat: ['lastname', 'firstname'],
        },
      },
        { data: 'email', searchable: 'true' },
        { data: 'telephone', searchable: 'true' },
        { data: 'paymentAddress1', searchable: 'true' },
        { data: 'paymentCity', searchable: 'true' },
      {
        data: 'status',
        searchable: true,
        search: {
          custom: {
            where: status ? status : { $not: ''}
          }
        }
      }
      ],
      order: [{ column: '0', dir: 'asc' }],
      start: 0,
      length: 999999,
      search: { value, regex: 'false' },
      _: new Date().getTime(),
    };
    const fetchResult = await postData(api, query);
    let result = '';
    // success
    if (fetchResult.status) {
      dispatch(deliverFindShipItem(value, { items: fetchResult.data.data }));
      if (fetchResult.data.data.length > 0) {
        dispatch(showToast('載入完成'));
      } else {
        dispatch(showToast('沒有資料'));
      }
    } else {
      // error
      if (fetchResult.response) {
        result = fetchResult.response.statusText;
      } else {
        result = fetchResult.message;
      }
      dispatch(showToast(result));
    }
  };
}

export const actions = {
  deliverShipListData,
  fetchShipListData,
};

// ------------------------------------
// Action Handlers
// ------------------------------------
export const ACTION_HANDLERS = {
  [GET_SHIP_LIST]: (state = {}, action) => ({
    ...state,
    list: action.list,
  }),
  [FIND_SHIP_ITEM]: (state = {}, action) => ({
    ...state,
    list: action.list,
    searchText: action.searchText,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  list: {},
};

export default function shipOrderReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
