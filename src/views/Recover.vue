<template>
  <div class="recover">
    <auth-header></auth-header>

    <div class="pt-10 pb-8 container">
      <ValidationObserver
        v-if="showForm"
        v-slot="{ handleSubmit }"
        tag="div">
        <form class="form" @submit.prevent="handleSubmit(onSubmit)" ref="form" novalidate>
          <fieldset class="form__item">
            <div class="form__fields">
              <p class="forgot__indication text-white">
                Ingresa tu nueva contraseña 2 veces para cambiarla.
              </p>

              <ValidationProvider
                class="form-group form-group--auth"
                name="contraseña"
                rules="required|confirmed:confirmation|min:6"
                v-slot="{ classes, errors }"
                tag="div">
                <label class="form-label form-label--auth" for="password">
                  Nueva contraseña
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
                    data-vv-name="contraseña"
                    tabindex="1">
                  <input
                    v-else
                    type="text"
                    id="password"
                    :class="['form-control form-control--auth', classes]"
                    name="password"
                    v-model="data.password"
                    data-vv-name="contraseña"
                    tabindex="1">
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
              <ValidationProvider
                class="form-group form-group--auth"
                name="contraseña"
                rules="required|min:6"
                v-slot="{ classes, errors }"
                tag="div"
                vid="confirmation">
                <label
                  class="form-label form-label--auth"
                  for="confirm_password">
                  Confirmar nueva contraseña
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
                    tabindex="2">
                  <input
                    v-else
                    type="text"
                    id="password"
                    :class="['form-control form-control--auth', classes]"
                    name="confirm_password"
                    v-model="confirmation"
                    data-vv-name="contraseña"
                    tabindex="2">
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

            <div class="form__submit text-center">
              <!-- <vue-recaptcha
                ref="recaptcha"
                size="invisible"
                @verify="onVerify"
                @expired="onExpired"
                :sitekey="recaptchaKey" /> -->

              <infinite-button
                :disabled="loading"
                :label="!loading ? 'Cambiar contraseña' : 'Cambiando'"
                :loading="loading"
                :icon="null"
                theme="white"
                type="submit"
                tabindex="3" />

              <router-link
                class="login-forgot button button--link mt-6"
                to="/ingresar">
                <span class="button__text">Volver al inicio de sesión</span>
              </router-link>
            </div>
          </fieldset>
        </form>
      </ValidationObserver>

      <div
        v-else
        class="text-center">
        <p class="forgot__indication text-white">
          Tu contraseña ha sido cambiada. Ahora puedes ingresar con tu RUT y esta nueva contraseña.
        </p>

        <router-link
          class="login-forgot button button--link mt-6"
          to="/ingresar">
          <span class="button__text">Iniciar sesión</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
// import VueRecaptcha from 'vue-recaptcha';

import { recover } from '@/services/auth';

import AuthHeader from '@/components/AuthHeader.vue';
import InfiniteButton from '@/components/InfiniteButton.vue';

export default {
  name: 'recover',
  components: {
    AuthHeader,
    InfiniteButton,
    // VueRecaptcha,
  },
  data() {
    return {
      loading: false,
      showForm: true,
      // recaptchaKey: process.env.VUE_APP_RECAPTCHA_KEY,
      hidePassword: true,
      hideConfirmPassword: true,
      data: {
        id: '',
        password: '',
        // recaptchaResponse: '',
        _method: 'PUT',
      },
      confirmation: '',
    };
  },
  mounted() {
    this.data.id = this.$route.query.user_id;
  },
  methods: {
    submitForm() {
      this.loading = true;

      this.sendNewPassword(this.parseDataBeforeSend(this.data))
        .then(() => {
          this.showForm = false;
        })
        .catch(() => {
          this.$toasted.show('Ha ocurrido un error.', {
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
    onSubmit() {
      this.loading = true;
      return this.submitForm();
      // this.$refs.recaptcha.execute();
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
    async sendNewPassword(data) {
      const response = await recover(data);

      return response.data;
    },
  },
};
</script>

<style>

</style>
