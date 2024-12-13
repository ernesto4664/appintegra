/* eslint-disable import/no-cycle */
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import CryptoJS from 'crypto-js';

import {
  signin,
  signup,
  complete,
  signout,
} from '@/services/auth';

import { getNotifications } from '@/services/notifications';

import { APIHelper } from '@/services/axios';

Vue.use(Vuex);

const key = '%)OcJo^l4s$3s&l+EVhyxP)x7x0+2wCw';

export default new Vuex.Store({
  state: {
    layout: 'auth-layout',
    title: '',
    status: '',
    token: localStorage.getItem('token') || '',
    user: {},
    session: {
      rut: null,
      password: null,
      rememberMe: false,
    },
    fontSize: 1,
    notifications: [],
    showCovidAlert: true,
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading';
    },
    auth_success(state, data) {
      state.status = 'success';
      state.token = data.token || 1;
      state.user = data.user;
    },
    auth_complete(state, data) {
      state.status = 'complete';
      state.user = data.user;
    },
    logout(state) {
      state.token = '';
      state.user = {};
    },
    auth_error(state) {
      state.status = 'error';
    },
    set_layout(state, layout) {
      state.layout = layout;
    },
    set_title(state, data) {
      state.title = data;
    },
    set_user(state, data) {
      state.user = data;
    },
    set_session(state, data) {
      state.session = data;
    },
    set_session_rut(state, data) {
      state.session.rut = data;
    },
    set_session_password(state, data) {
      state.session.password = data;
    },
    set_session_rememberMe(state, data) {
      state.session.rememberMe = data;
    },
    font_size(state, data) {
      if (data) {
        state.fontSize += data;
      }
    },
    set_notifications(state, data) {
      console.log('Datos guardados en Vuex (mutación set_notifications):', data); // Verifica los datos aquí
      state.notifications = Array.isArray(data) ? data : [];
    },
    show_covid_alert(state, value) {
      state.showCovidAlert = value;
    },
    set_covid_contribution(state) {
      state.user.is_contribution = 1;
    },
  },
  actions: {
    // eslint-disable-next-line no-unused-vars
    oneSignalInit({ commit, state }, payload) {
      if (window && window.plugins) {
        // window.plugins.OneSignal
        //   .sendTags({
        //     code_district: payload.tipest,
        //     position_code: payload.persk,
        //     region_code: payload.werks,
        //     is_notification_settlement: payload.is_notification_settlement,
        //     is_notification_new: payload.is_notification_new,
        //   });
      }
    },
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request');
        signin(user)
          .then((resp) => {
            const data = {
              token: resp.data.data.access_token,
              user: resp.data.data.user,
            };
            APIHelper.setToken(data.token);
            // dispatch('oneSignalInit', data.user);
            commit('auth_success', data);
            resolve(resp.data.data);
          })
          .catch((err) => {
            commit('auth_error');
            APIHelper.setToken(null);
            reject(err);
          });
      });
    },
    saveSession({ commit }, payload) {
      if (payload.rememberMe) {
        const rut = CryptoJS.AES.encrypt(payload.rut, key).toString();
        const password = CryptoJS.AES.encrypt(payload.password, key).toString();

        commit('set_session', {
          rut,
          password,
          rememberMe: true,
        });
      } else {
        commit('set_session', {
          rut: null,
          password: null,
          rememberMe: false,
        });
      }
    },
    saveSessionRut({ commit }, data) {
      commit('set_session_rut', data);
    },
    saveSessionPassword({ commit }, data) {
      commit('set_session_password', data);
    },
    saveSessionRememberMe({ commit }, data) {
      commit('set_session_rememberMe', data);
    },
    register({ commit, dispatch }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request');
        signup(user)
          .then((resp) => {
            const data = {
              token: resp.data.data.access_token,
              user: resp.data.data.user,
            };
            APIHelper.setToken(data.token);
            dispatch('oneSignalInit', data.user);
            commit('auth_success', data);
            resolve(resp.data.data);
          })
          .catch((err) => {
            commit('auth_error');
            APIHelper.setToken(null);
            reject(err);
          });
      });
    },
    complete({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request');
        complete(user)
          .then((resp) => {
            const data = {
              user: resp.data.user,
            };
            commit('auth_complete', data);
            resolve(resp);
          })
          .catch((err) => {
            commit('auth_error');
            reject(err);
          });
      });
    },
    public({ commit }) {
      return new Promise((resolve) => {
        commit('auth_request');

        const data = {
          user: {
            is_public: 1,
            skip_auth: true,
          },
        };

        commit('auth_success', data);
        resolve(data);
      });
    },
    parents({ commit }) {
      return new Promise((resolve) => {
        commit('auth_request');

        const data = {
          user: {
            is_public: 1,
            is_parent: 1,
            skip_auth: true,
          },
        };

        commit('auth_success', data);
        resolve(data);
      });
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('auth_request');
        signout()
          .then()
          .catch((error) => {
            if (error.response.status === 401) {
              resolve();
            }
          })
          .then(() => {
            const data = {
              token: '',
              user: {},
            };
            APIHelper.setToken(null);
            commit('auth_success', data);
            commit('set_layout', 'auth-layout');
            resolve();
          });
      });
    },
    notifications({ commit, state }, params) {
      return new Promise((resolve, reject) => {
        const userId = state.user?.id || JSON.parse(localStorage.getItem('user'))?.id;

        if (!userId) {
          console.error('ID de usuario no encontrado');
          reject(new Error('ID de usuario no encontrado'));
          return;
        }

        const updatedParams = { ...params, id: userId };

        getNotifications(updatedParams)
          .then((resp) => {
            console.log('Respuesta de getNotifications:', resp); // Verifica qué está d
            commit('set_notifications', resp);
            resolve(resp);
          })
          .catch((err) => {
            console.error('Error al obtener las notificaciones:', err);
            reject(err);
          });
      });
    },
  },
  getters: {
    rut: (state) => {
      if (state.session.rut) {
        const bytes = CryptoJS.AES.decrypt(state.session.rut, key);
        return bytes.toString(CryptoJS.enc.Utf8);
      }

      return null;
    },
    password: (state) => {
      if (state.session.password) {
        const bytes = CryptoJS.AES.decrypt(state.session.password, key);
        return bytes.toString(CryptoJS.enc.Utf8);
      }

      return null;
    },
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    alreadyContributeCovid: state => !!state.user.covid,
  },
  modules: {
  },
  plugins: [createPersistedState()],
});
