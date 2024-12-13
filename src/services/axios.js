/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import axios from 'axios';
import router from '@/router';
import store from '@/store';

export const $http = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

$http.interceptors.response.use((response) => {
  const isPublicUser = store.state.user.is_public || 0;
  const isLoggedUser = response.data.is_logged || 0;

  if (Array.isArray(response.data)) {
    return response;
  }

  if (!isLoggedUser && !isPublicUser) {
    store.commit('logout');
    router.push('ingresar');
  }

  return response;
}, (error) => {
  if (!store.state.user.is_public && error.response.status === 401) {
    store.commit('logout');
    router.push('ingresar');
  }

  return Promise.reject(error);
});

class API {
  setToken(token) {
    if (token) {
      $http.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  }

  get(url, params) {
    params = params || {};
    return $http.get(url, params);
  }

  post(url, params) {
    params = params || {};
    return $http.post(url, params);
  }

  put(url, params) {
    params = params || {};
    return $http.put(url, params);
  }

  patch(url, params) {
    params = params || {};
    return $http.patch(url, params);
  }
}

export const APIHelper = new API();
