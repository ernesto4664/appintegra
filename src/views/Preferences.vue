<template>
  <div class="view view--profile">
    <section class="section pt-0">
      <header class="profile-header background-blue pt-header">
        <div class="container py-3">
          <div class="profile-header__content">
            <figure class="profile-header__avatar">
              <img
                class="img-fluid"
                :src="user.avatar || require('../assets/images/integrito.svg')"
                :alt="userFullname">
            </figure>

            <p class="profile-header__name title title--s">{{ userFullname }}</p>
          </div>
        </div>
      </header>

      <div class="container pt-6">
        <page-nav
          class="mb-7"
          :data="menu"
          color="primary">
        </page-nav>

        <div>
          <div class="d-flex flex-nowrap align-items-center justify-content-between">
            <p class="m-0 mr-8 text-primary">Notificaciones de nueva liquidación.</p>
            <div class="ml-4">
              <switch-button
                v-model="data.is_notification_settlement"
                @toggle="setPreferences" />
            </div>
          </div>
          <hr>
          <div class="d-flex flex-nowrap align-items-center justify-content-between">
            <p class="m-0 mr-8 text-primary">Notificaciones de nuevas noticias.</p>
            <div class="ml-4">
              <switch-button
                v-model="data.is_notification_new"
                @toggle="setPreferences" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {
  preferences,
} from '@/services/auth';

import { mapState } from 'vuex';

import PageNav from '@/components/PageNav.vue';
import SwitchButton from '@/components/SwitchButton.vue';

import store from '../store';

export default {
  name: 'preferences',
  components: {
    PageNav,
    SwitchButton,
  },
  data: () => ({
    loading: false,
    data: {
      is_notification_settlement: store.state.user.is_notification_settlement,
      is_notification_new: store.state.user.is_notification_new,
      _method: 'PUT',
    },
    menu: [
      {
        label: 'Datos personales',
        url: '/perfil',
      }, {
        label: 'Preferencias',
        url: '/perfil/preferencias',
      },
    ],
  }),
  created() {
    this.$store.commit('set_title', 'Perfil');
  },
  computed: {
    ...mapState(['user']),

    userFullname() {
      return `${this.user.name} ${this.user.surname}`;
    },
  },
  methods: {
    setPreferences() {
      this.loading = true;

      this.updatePersonalPreferences(this.parseDataBeforeSend(this.data))
        .then((resp) => {
          this.$store.dispatch('oneSignalInit', resp);
          this.$store.commit('set_user', resp);
        })
        .catch((error) => {
          let message = 'Lo sentimos, no hemos podido actualizar tus datos personales';
          const respondMsg = error.response && error.response.data && error.response.data.data;

          if (respondMsg) message = respondMsg;

          this.$toasted.show(message, {
            theme: 'outline',
            position: 'bottom-center',
            duration: 7000,
          });
        })
        .then(() => {
          this.loading = false;
        });
    },
    parseDataBeforeSend(data) {
      const formData = new FormData();
      Object.keys(data).forEach(key => formData.append(key, data[key]));
      return formData;
    },
    async updatePersonalPreferences(data) {
      const response = await preferences(data);

      return response.data.data;
    },
  },
};
</script>
