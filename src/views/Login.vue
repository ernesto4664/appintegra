<template>
  <div class="login">
    <auth-header></auth-header>

    <div class="pt-6 pb-7 container">
      <div class="parents-login text-center mb-6">
        <p class="parents-login__title mb-1">Actividades educativas para que los niños/as aprendan en casa</p>
        <p class="parents-login__description mb-3">No se requiere una cuenta</p>
        <button
          class="parents-login__button button button--primary button--white"
          @click="handleParentsAccount">
          <span class="button__text">Ingresa aquí</span>
        </button>
      </div>

      <page-nav
        class="mb-3"
        :data="menu"
        color="auth" />

      <ValidationObserver v-slot="{ handleSubmit }" tag="div">
        <form class="form" @submit.prevent="handleSubmit(onSubmit)" ref="form" novalidate>
          <fieldset class="form__item">
            <div class="form__fields">
              <ValidationProvider
                class="form-group form-group--auth"
                name="usuario"
                rules="required"
                v-slot="{ classes, errors }"
                tag="div">
                <label
                  class="form-label form-label--auth"
                  for="rut">
                  Usuario
                </label>
                <div :class="['form-wrapper', classes]">
                  <i class="form-icon material-icons">account_circle</i>
                  <input
                    type="text"
                    id="rut"
                    :class="['form-control form-control--auth', classes]"
                    name="rut"
                    v-model="data.rut">
                </div>
                <small
                  v-if="errors.length"
                  class="form-helper">
                  <i class="material-icons">info</i> {{ errors[0] }}
                </small>
                <small
                  v-else
                  class="form-helper">
                  Ingresa tu rut sin puntos ni guion
                </small>
              </ValidationProvider>

              <ValidationProvider
                class="form-group form-group--auth"
                name="contraseña"
                rules="required|min:6"
                v-slot="{ classes, errors }"
                tag="div">
                <label
                  class="form-label form-label--auth"
                  for="password">
                  Contraseña
                </label>
                <div :class="['form-wrapper', classes]">
                  <i class="form-icon material-icons">lock_outline</i>
                  <input
                    v-if="hidePassword"
                    type="password"
                    id="password"
                    :class="['form-control form-control--auth', classes]"
                    name="password"
                    v-model="data.password"
                    data-vv-name="contraseña">
                  <input
                    v-else
                    type="text"
                    id="password"
                    :class="['form-control form-control--auth', classes]"
                    name="password"
                    v-model="data.password"
                    data-vv-name="contraseña">
                  <button
                    class="form-button button"
                    type="button"
                    @click="hidePassword = !hidePassword">
                    <i
                      class="button__icon material-icons"
                      v-text="hidePassword ? 'visibility' : 'visibility_off'" />
                  </button>
                </div>
                <small v-if="errors.length" class="form-helper">
                  <i class="material-icons">info</i> {{ errors[0] }}
                </small>
              </ValidationProvider>
            </div>

            <div class="checkbox checkbox--default">
              <input
                v-model="data.rememberMe"
                :disabled="loading"
                type="checkbox"
                id="checkbox-accept-terms"
                class="checkbox--default__input"
              />
              <label
                for="checkbox-accept-terms"
                :class="{
                  'checkbox--default__label--disabled': loading,
                }"
                class="checkbox--default__label"
              >
                <span class="checkbox--default__icon">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 18 13"
                    fill="none"
                    class="checkbox--default__svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M17.7243 0.310521C18.1051 0.710542 18.0895 1.34352 17.6895 1.72431L6.13394 12.7243C5.9366 12.9122 5.67116 13.0114 5.399 12.999C5.12683 12.9866 4.8715 12.8637 4.69204 12.6587L0.247594 7.58176C-0.116187 7.16621 -0.0742203 6.53444 0.34133 6.17066C0.75688 5.80688 1.38865 5.84884 1.75243 6.26439L5.51013 10.5568L16.3105 0.275698C16.7106 -0.105092 17.3435 -0.0895011 17.7243 0.310521Z"
                      fill="#36a747"
                    />
                  </svg>
                </span>
                <span class="checkbox--default__text">
                  Recordar mi sesión
                </span>
              </label>
            </div>

            <div class="form__submit mt-4">
              <router-link
                class="login-forgot button button--link font-weight-bold mb-5"
                to="/recuperar-contrasena">
                <span class="button__text">¿Olvidaste tu contraseña?</span>
              </router-link>

              <!-- <vue-recaptcha
                ref="recaptcha"
                size="invisible"
                @verify="onVerify"
                @expired="onExpired"
                :sitekey="recaptchaKey" /> -->

              <infinite-button
                class="button--submit"
                :disabled="loading"
                :label="!loading ? 'Iniciar sesión' : 'Ingresando'"
                :loading="loading"
                :icon="null"
                theme="white"
                type="submit" />
            </div>
          </fieldset>
        </form>
      </ValidationObserver>

      <!-- <div class="public-account-button mt-2">
        <button
          class="button"
          @click="handleParentsAccount">
          <span class="button__text">Continuar sin una cuenta</span>
        </button>
      </div> -->
    </div>
  </div>
</template>

<script>
// import VueRecaptcha from 'vue-recaptcha';

import AuthHeader from '@/components/AuthHeader.vue';
import PageNav from '@/components/PageNav.vue';
import InfiniteButton from '@/components/InfiniteButton.vue';

export default {
  name: 'login',
  components: {
    AuthHeader,
    PageNav,
    InfiniteButton,
    // VueRecaptcha,
  },
  data() {
    return {
      menu: [
        {
          label: 'Regístrate',
          url: '/registrarse',
        }, {
          label: 'Inicia Sesión',
          url: '/ingresar',
        },
      ],
      loading: false,
      hidePassword: true,
      // recaptchaKey: process.env.VUE_APP_RECAPTCHA_KEY,
      data: {
        rut: this.$store.getters.rut || null,
        password: this.$store.getters.password || null,
        rememberMe: this.$store.state.session.rememberMe || false,
        // recaptchaResponse: '',
      },
    };
  },
  created() {
    this.$store.commit('set_layout', 'auth-layout');
    this.$store.commit('logout');
  },
  methods: {
    submitForm() {
      this.$store.dispatch('login', this.parseDataBeforeSend(this.data))
        .then((resp) => {
          this.$store.dispatch('saveSession', this.data);

          if (resp.user.is_termn_home) {
            this.$store.commit('set_layout', 'app-layout');
            return this.$router.push('/');
          }

          return this.$router.push('/legal');
        })
        .catch((error) => {
          let message = 'Lo sentimos, no has podido ingresar, intentalo nuevamente';
          const respondMsg = error.response && error.response.data && error.response.data.message;

          if (respondMsg) message = respondMsg;

          this.data.password = '';
          this.$store.commit('set_session_password', null);
          this.$toasted.show(message, {
            theme: 'outline',
            position: 'bottom-center',
            duration: 7000,
          });
        })
        .then(() => {
          this.loading = false;
          // this.resetRecaptcha();
        });
    },
    parseDataBeforeSend(data) {
      const formData = new FormData();
      Object.keys(data).forEach(key => formData.append(key, data[key]));
      return formData;
    },
    onSubmit() {
      this.loading = true;
      return this.submitForm();
      // this.$refs.recaptcha.execute();
    },
    // handlePublicAccount() {
    //   this.$store.dispatch('public')
    //     .then(() => {
    //       this.$store.commit('set_layout', 'app-layout');
    //       return this.$router.push('/');
    //     });
    // },
    handleParentsAccount() {
      this.$store.dispatch('parents')
        .then(() => {
          this.$store.commit('set_layout', 'app-layout');
          return this.$router.push('/');
        });
    },
    // onVerify(response) {
    //   this.data.recaptchaResponse = response;
    //   this.submitForm();
    // },
    // onExpired() {
    //   this.resetRecaptcha();
    // },
    // resetRecaptcha() {
    //   this.data.recaptchaResponse = '';
    //   this.$refs.recaptcha.reset();
    // },
  },
};
</script>

<style>

</style>
