/* @flow */
import axios from 'axios';

export async function postData(api: String, data: Object = {}) {
  return await axios.post(api, data)
    .then(response => response)
    .catch(error => error);
}

export async function getData(api: String, params: Object = {}) {
  return await axios.get(api, { params })
    .then(response => response)
    .catch(error => error);
}

export async function putData(api: string, data: Object = {}) {
  return await axios.put(api, data)
    .then(response => response)
    .catch(error => error);
}

const fetchApi = {
  postData,
  getData,
  putData,
};

export default fetchApi;
