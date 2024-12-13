<template>
  <div class="signup">
    <auth-header></auth-header>

    <div class="pt-6 pb-5 container">
      <page-nav
        class="mb-5"
        :data="menu"
        color="auth" />

      <ValidationObserver v-slot="{ handleSubmit }">
        <form class="form" @submit.prevent="handleSubmit(onSubmit)" ref="form" novalidate>
          <fieldset class="form__item">
            <div class="form__fields">
              <ValidationProvider
                class="form-group form-group--auth"
                name="usuario"
                rules="required"
                v-slot="{ classes, errors }"
                tag="div">
                <label class="form-label form-label--auth" for="rut">Usuario</label>
                <div :class="['form-wrapper', classes]">
                  <i class="form-icon material-icons">account_circle</i>
                  <input
                    type="text"
                    id="rut"
                    :class="['form-control form-control--auth', classes]"
                    name="rut"
                    v-model="data.rut"
                    tabindex="1">
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
                rules="required|min:6|confirmed:confirmation"
                v-slot="{ classes, errors }"
                tag="div">
                <label class="form-label form-label--auth" for="password">Contraseña</label>
                <div :class="['form-wrapper', classes]">
                  <i class="form-icon material-icons">lock_outline</i>
                  <input
                    v-if="hidePassword"
                    type="password"
                    id="password"
                    :class="['form-control form-control--auth', classes]"
                    name="password"
                    v-model="data.password"
                    data-vv-name="contraseña"
                    tabindex="2">
                  <input
                    v-else
                    type="text"
                    id="password"
                    :class="['form-control form-control--auth', classes]"
                    name="password"
                    v-model="data.password"
                    data-vv-name="contraseña"
                    tabindex="2">
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
                <small v-else class="form-helper">
                  Tu contraseña debe tener mínimo 6 caracteres
                </small>
              </ValidationProvider>
              <ValidationProvider
                class="form-group form-group--auth"
                name="contraseña"
                rules="required"
                v-slot="{ classes, errors }"
                tag="div"
                vid="confirmation">
                <label
                  class="form-label form-label--auth"
                  for="confirm_password">
                  Repetir contraseña
                </label>
                <div :class="['form-wrapper', classes]">
                  <i class="form-icon material-icons">lock_outline</i>
                  <input
                    v-if="hideConfirmPassword"
                    type="password"
                    id="confirm_password"
                    :class="['form-control form-control--auth', classes]"
                    name="confirm_password"
                    v-model="confirmation"
                    data-vv-name="contraseña"
                    tabindex="3 ">
                  <input
                    v-else
                    type="text"
                    id="password"
                    :class="['form-control form-control--auth', classes]"
                    name="confirm_password"
                    v-model="confirmation"
                    data-vv-name="contraseña"
                    tabindex="3 ">
                  <button
                    class="form-button button"
                    type="button"
                    @click="hideConfirmPassword = !hideConfirmPassword">
                    <i
                      class="button__icon material-icons"
                      v-text="hideConfirmPassword ? 'visibility' : 'visibility_off'" />
                  </button>
                </div>
                <small v-if="errors.length" class="form-helper">
                  <i class="material-icons">info</i> {{ errors[0] }}
                </small>
              </ValidationProvider>
            </div>

            <div class="form__submit mt-4">
              <!-- <vue-recaptcha
                ref="recaptcha"
                size="invisible"
                @verify="onVerify"
                @expired="onExpired"
                :sitekey="recaptchaKey" /> -->

              <infinite-button
                class="button--submit"
                :disabled="loading"
                :label="!loading ? 'Comienza aquí' : 'Registrando'"
                :loading="loading"
                :icon="null"
                theme="white"
                type="submit"
                tabindex="4" />
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
  name: 'signup',
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
      hideConfirmPassword: true,
      // recaptchaKey: process.env.VUE_APP_RECAPTCHA_KEY,
      data: {
        rut: '',
        password: '',
        // recaptchaResponse: '',
      },
      confirmation: '',
    };
  },
  created() {
    this.$store.commit('set_layout', 'auth-layout');
    this.$store.commit('logout');
  },
  methods: {
    submitForm() {
      this.$store.dispatch('register', this.parseDataBeforeSend(this.data))
        .then((resp) => {
          if (resp.user.is_termn_home && !resp.user.is_public) {
            return this.$router.push({ name: 'signup-data-review' });
          }

          return this.$router.push({
            path: '/legal',
            query: {
              register: 1,
            },
          });
        })
        .catch((err) => {
          if (!err) {
            return;
          }

          const msg = err.response.data && err.response.data.message;
          this.data.password = '';
          this.confirmation = '';
          this.$toasted.show(msg, {
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
      this.submitForm();
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
