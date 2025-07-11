import axios from "axios";
// import { endpoint } from "../constants";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { endpoint, newEndpoint } from "../services/ConstantServies";

export const authAxios = async (url, data) => {
    let token = await AsyncStorage.getItem('userToken');
    console.log('authaxios', token, data)
    return axios.create({
        baseURL: endpoint,
        params: data,
        headers: {
            Authorization: `Token ${token}`
        }
    }).get(url)
};

export const authAxiosPost = async (url, data) => {
  let token = await AsyncStorage.getItem('userToken');
  const headers = {
    Authorization: `Token ${token}`
  };
  // console.log('authAxiosPost', { url, data, token, headers });
  return axios.create({
      baseURL: newEndpoint,
      headers
  }).post(url, data)
};

export const authAxiosGET = async (url, data) => {
  return axios.create({
      baseURL: endpoint,
      params: data,
  }).get(url)
};



export const authAxiosFilePost = async (url, data) => {
  let token = await AsyncStorage.getItem('userToken');
  // console.log("Data to be sent:", data);

  // Check if the data is FormData
  if (!(data instanceof FormData)) {
    console.error('Data is not FormData!');
    return;
  }


  return axios.create({
          baseURL: endpoint,
          headers: {
              Authorization: `Token ${token}`,
              'Content-Type': 'multipart/form-data',
          }
      }).post(url, data)

};


export const publicAxiosRequest = axios.create({
  baseURL: endpoint,
});


export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,  
};
