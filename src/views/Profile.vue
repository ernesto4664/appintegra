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
          <ul class="m-0 p-0">
            <li
              v-for="data in reviewData"
              class="user-data"
              :key="data.key">
              <i class="user-data__icon material-icons">{{ data.icon }}</i>
              <p class="user-data__label">
                <span class="d-block text-primary">{{ data.label }}:</span>
                <span class="text-uppercase">{{ userDataValue(data) }}</span>
              </p>
            </li>
          </ul>
        </div>

        <hr>

        <div>
          <ValidationObserver v-slot="{ handleSubmit }" tag="div">
            <form class="form" @submit.prevent="handleSubmit(onSubmit)" ref="form" novalidate>
              <fieldset class="form__item">
                <div class="form__fields">
                  <ul class="m-0 p-0">
                    <li
                      class="user-data user-data--editable"
                      :class="{ 'user-data--editing' : editPersonalEmail }">
                      <div v-if="!editPersonalEmail">
                        <i class="user-data__icon material-icons">mail_outline</i>
                        <p class="user-data__label">
                          <span class="d-block text-primary">Correo personal:</span>
                          {{ user.personal_mail }}
                        </p>
                        <button
                          class="user-data__edit button button--icon button--circle button--blue"
                          type="button"
                          @click="editPersonalEmail = true">
                          <i class="button__icon material-icons">edit</i>
                        </button>
                      </div>
                      <ValidationProvider
                        v-else
                        class="form-group"
                        name="correo"
                        rules="required|email|max:100|integra"
                        v-slot="{ classes, errors }"
                        tag="div">
                        <label
                          class="form-label"
                          for="email">
                          <i class="material-icons">mail_outline</i>
                          Correo personal:
                        </label>
                        <div :class="['form-editing', classes]">
                          <input
                            type="email"
                            id="email"
                            :class="['form-control', classes]"
                            name="email"
                            placeholder="mailejemplo@mail.com"
                            v-model="email">
                          <div class="text-center">
                            <button
                              class="button button--icon button--circle button--blue m-0"
                              :class="{ 'button--loading' : loading }"
                              :disabled="loading || !!errors.length"
                              type="button"
                              @click="handleChangePersonalData">
                              <i class="button__icon material-icons m-0">
                                {{ loading ? 'refresh' : 'save' }}
                              </i>
                            </button>
                            <span class="form-editing__label text-uppercase text-primary">
                              Guardar
                            </span>
                          </div>
                        </div>
                        <small
                          v-if="errors.length"
                          class="form-helper">
                          <i class="material-icons">info</i> {{ errors[0] }}
                        </small>
                      </ValidationProvider>
                    </li>
                    <li
                      class="user-data user-data--editable"
                      :class="{ 'user-data--editing' : editPersonalPhone }">
                      <div v-if="!editPersonalPhone">
                        <i class="user-data__icon material-icons">phone_iphone</i>
                        <p class="user-data__label">
                          <span class="d-block text-primary">Teléfono:</span>
                          +569 {{ user.phone }}
                        </p>
                        <button
                          class="user-data__edit button button--icon button--circle button--blue"
                          type="button"
                          @click="editPersonalPhone = true">
                          <i class="button__icon material-icons">edit</i>
                        </button>
                      </div>
                      <ValidationProvider
                        v-else
                        class="form-group"
                        name="correo"
                        rules="required|numeric|max:8"
                        v-slot="{ classes, errors }"
                        tag="div">
                        <label
                          class="form-label"
                          for="email">
                          <i class="material-icons">phone_iphone</i>
                          Teléfono:
                        </label>
                        <div class="form-wrapper form-editing">
                          <span class="form-prefix">+56 9</span>
                          <input
                            type="number"
                            id="phone"
                            :class="['form-control form-control--prefix', classes]"
                            name="phone"
                            placeholder="1234 5678"
                            v-model="phone">
                          <div class="text-center">
                            <button
                              class="button button--icon button--circle button--blue m-0"
                              :class="{ 'button--loading' : loading }"
                              :disabled="loading"
                              type="button"
                              @click="handleChangePersonalData">
                              <i class="button__icon material-icons m-0">
                                {{ loading ? 'refresh' : 'save' }}
                              </i>
                            </button>
                            <span class="form-editing__label text-uppercase text-primary">
                              Guardar
                            </span>
                          </div>
                        </div>
                        <small
                          v-if="errors.length"
                          class="form-helper">
                          <i class="material-icons">info</i> {{ errors[0] }}
                        </small>
                      </ValidationProvider>
                    </li>
                  </ul>
                </div>
              </fieldset>
            </form>
          </ValidationObserver>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {
  complete,
} from '@/services/auth';

import { mapState } from 'vuex';

import PageNav from '@/components/PageNav.vue';

export default {
  name: 'profile',
  components: {
    PageNav,
  },
  data() {
    return {
      loading: false,
      editPersonalEmail: false,
      editPersonalPhone: false,
      email: '',
      phone: '',
      menu: [
        {
          label: 'Datos personales',
          url: '/perfil',
        }, {
          label: 'Preferencias',
          url: '/perfil/preferencias',
        },
      ],
      reviewData: [
      ],
    };
  },
  created() {
    this.$store.commit('set_title', 'Perfil');

    if (this.$store.state.user.rut !== '186645863') {
      this.reviewData = [
        {
          key: 'address',
          icon: 'place',
          label: 'Ubicación',
        },
        {
          key: 'tipest',
          icon: 'business',
          label: 'Dependencia',
        },
        {
          key: 'position',
          icon: 'card_travel',
          label: 'Cargo',
        },
        {
          key: 'email',
          icon: 'mail_outline',
          label: 'Correo institucional',
        },
      ];
    }
  },
  computed: {
    ...mapState(['user']),

    userFullname() {
      return `${this.user.name} ${this.user.surname}`;
    },
  },
  methods: {
    handleChangePersonalData() {
      this.loading = true;

      const data = {
        email: this.email || this.user.personal_mail,
        phone: this.phone || this.user.phone,
      };

      this.$store.dispatch('complete', this.parseDataBeforeSend(data))
        .then(() => {
          this.editPersonalEmail = false;
          this.editPersonalPhone = false;
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
    userDataValue(data) {
      if (data.key === 'tipest') {
        switch (this.user[data.key]) {
          case 'C':
            return 'Casa Central';
          case 'R':
            return 'Oficina Regional';
          case 'E':
            return 'Establecimientos';
          default:
            return '';
        }
      }

      return this.user[data.key];
    },
    async updatePersonalData(data) {
      const response = await complete(data);

      return response.data.data;
    },
  },
};
</script>

<style>

</style>
