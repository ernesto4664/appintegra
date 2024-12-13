<template>
  <div class="forgot">
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
                Ingresa tu RUT y te enviaremos un correo para establecer tu contraseña
              </p>

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
                :label="!loading ? 'Solicitar contraseña' : 'Solicitando'"
                :loading="loading"
                :icon="null"
                theme="white"
                type="submit" />

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
          Revisa tu correo y sigue los pasos indicados para cambiar tu contraseña.
        </p>

        <router-link
          class="login-forgot button button--link mt-6"
          to="/ingresar">
          <span class="button__text">Volver al inicio de sesión</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
// import VueRecaptcha from 'vue-recaptcha';

import { forgot } from '@/services/auth';

import AuthHeader from '@/components/AuthHeader.vue';
import InfiniteButton from '@/components/InfiniteButton.vue';

export default {
  name: 'forgot',
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
      data: {
        rut: '',
        // recaptchaResponse: '',
      },
    };
  },
  methods: {
    submitForm() {
      this.loading = true;

      this.sendForgot(this.data.rut)
        .then(() => {
          this.showForm = false;
          this.data.rut = '';
        })
        .catch((error) => {
          let message = 'Lo sentimos, ha ocurrido un error con nuestro servicio';
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
      return data.replace(/[.-]/g, '');
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
    async sendForgot(data) {
      const response = await forgot(data);

      return response.data;
    },
  },
};
</script>

<style>

</style>
