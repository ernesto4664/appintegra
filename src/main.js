/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */

import OneSignal from 'onesignal-cordova-plugin'; // Importa OneSignal antes de archivos locales
import Vue from 'vue';
import VuePageTransition from 'vue-page-transition';
import BootstrapVue from 'bootstrap-vue';
import {
  ValidationProvider, ValidationObserver, extend, localize,
} from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import vRut from 'v-rut';
import { validate as rutValidation } from 'v-rut/dist/VeeRutValidator';
import es from 'vee-validate/dist/locale/es.json';
import Toasted from 'vue-toasted';
import VueYoutube from 'vue-youtube';
import { APIHelper } from '@/services/axios'; // Mantenemos esta importación antes de las locales
import App from './App.vue'; // Archivos locales importados después de los módulos externos
import router from './router';
import store from './store';
import '@/assets/scss/app.scss';

localize('es', es);
Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(VueYoutube);
Vue.use(vRut);
Vue.use(Toasted, {});
Vue.use(VuePageTransition);
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

// eslint-disable-next-line import/no-unresolved
extend('rut', {
  validate: rutValidation,
  message: 'El RUT es inválido',
});

extend('integra', {
  validate: value => !value.includes('integra.cl'),
  message: 'El campo {_field_} no puede ser un correo institucional',
});

for (const rule in rules) {
  extend(rule, {
    ...rules[rule],
    message: es.messages[rule],
  });
}

window.vueComponents = {};

// Inicialización de la aplicación Vue
new Vue({
  router,
  store,
  beforeCreate() {
    OneSignal.initialize('31b7f490-b6c7-471c-a1eb-29b261d8721e');
    OneSignal.Notifications.requestPermission();
    OneSignal.Notifications.addEventListener('click', (jsonData) => {
      const { additionalData } = jsonData.notification.payload;

      const { template } = additionalData;
      const { slug } = additionalData;
      const vueRouter = router;
      let path = '';

      // posts
      if (['noticias', 'comunicados', 'ofertas'].includes(template) && slug) {
        path = `/${template}/${slug}`;
      }

      // salary
      if (template === 'liquidaciones-de-sueldo') {
        path = '/liquidaciones-de-sueldo/liquidacion?type=1';
      }

      // default
      if (!path) {
        return;
      }

      // push
      vueRouter.push({ path });
    });

    OneSignal.Notifications.addEventListener('received', (event) => {
      console.log(event);
      store.dispatch('notifications', {});
    });

    if (this.$store.state.token) {
      APIHelper.setToken(this.$store.state.token);
    }
  },
  render: h => h(App),
}).$mount('#app');
