/* @flow */
import axios from 'axios';
import log from '../utils/logs';

const defaultAxios = axios.create();

export function setHeader(key: String, value: String) {
  log.info('set header [', key, '] by value \'', value, '\'.');
  defaultAxios.defaults.headers.common[key] = value;
  return defaultAxios.defaults.headers.common[key];
}

export function setPostHeader(key: String, value: String) {
  log.info('set header [', key, '] by value \'', value, '\'.');
  defaultAxios.defaults.headers.post[key] = value;
  return defaultAxios.defaults.headers.post[key];
}

export async function postData(api: String, data: Object = {}) {
  log.info('fetch api \'', api, '\' with data=>', { ...data });
  return await defaultAxios.post(api, { ...data })
    .then(response => response)
    .catch(error => error);
}

export async function getData(api: String, params: Object = {}) {
  return await defaultAxios.get(api, { params })
    .then(response => response)
    .catch(error => error);
}

export async function putData(api: string, data: Object = {}) {
  return await defaultAxios.put(api, data)
    .then(response => response)
    .catch(error => error);
}

const fetchApi = {
  setPostHeader,
  setHeader,
  postData,
  getData,
  putData,
};

export default fetchApi;
