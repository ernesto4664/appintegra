<template>
  <div class="signup-data signup-data--complete">
    <div class="pt-8 pb-7 container">
      <div class="box">
        <div class="text-center">
          <p class="title title--xl my-2">{{ user.name }},</p>
          <p class="title title--s">Completa tus datos de contacto</p>
        </div>

        <div class="progress-line mt-7 mb-6">
          <div class="progress-line__item progress-line__item--active"></div>
          <div class="progress-line__item progress-line__item--active"></div>
        </div>

        <ValidationObserver v-slot="{ handleSubmit }" tag="div">
          <form class="form" @submit.prevent="handleSubmit(onSubmit)" ref="form" novalidate>
            <fieldset class="form__item">
              <div class="form__fields signup-data__separator">
                <ValidationProvider
                  class="form-group"
                  name="correo"
                  rules="required|email|max:100|integra"
                  v-slot="{ classes, errors }"
                  tag="div"
                  :vid="data.email">
                  <label
                    class="form-label"
                    for="email">
                    <i class="material-icons">mail_outline</i>
                    Correo personal:
                  </label>
                  <input
                    type="email"
                    id="email"
                    :class="['form-control', classes]"
                    name="email"
                    placeholder="mailejemplo@mail.com"
                    v-model="data.email"
                    data-vv-name="correo personal">
                  <small
                    v-if="errors.length"
                    class="form-helper">
                    <i class="material-icons">info</i> {{ errors[0] }}
                  </small>
                </ValidationProvider>
                <ValidationProvider
                  class="form-group"
                  name="correo"
                  :rules="`required|email|max:100|integra|confirmed:${data.email}`"
                  v-slot="{ classes, errors }"
                  tag="div">
                  <label
                    class="form-label"
                    for="confirm_email">
                    <i class="material-icons">mail_outline</i>
                    Confirmar correo personal:
                  </label>
                  <input
                    type="email"
                    id="confirm_email"
                    :class="['form-control', classes]"
                    name="confirm_email"
                    placeholder="mailejemplo@mail.com"
                    v-model="confirmation"
                    data-vv-name="correo personal">
                  <small
                    v-if="errors.length"
                    class="form-helper">
                    <i class="material-icons">info</i> {{ errors[0] }}
                  </small>
                </ValidationProvider>
                <ValidationProvider
                  class="form-group"
                  name="celular"
                  rules="required|numeric|max:8"
                  v-slot="{ classes, errors }"
                  tag="div">
                  <label
                    class="form-label"
                    for="phone">
                    <i class="material-icons">phone_iphone</i>
                    Celular:
                  </label>
                  <div :class="['form-wrapper', classes]">
                    <span class="form-prefix">+56 9</span>
                    <input
                      type="number"
                      id="phone"
                      :class="['form-control form-control--prefix', classes]"
                      name="phone"
                      placeholder="1234 5678"
                      v-model="data.phone"
                      data-vv-name="celular">
                  </div>
                  <small
                    v-if="errors.length"
                    class="form-helper">
                    <i class="material-icons">info</i> {{ errors[0] }}
                  </small>
                </ValidationProvider>
              </div>

              <div class="text">
                <p>{{ helpText }}</p>
              </div>

              <div class="form__submit">
                <infinite-button
                  :class="{ 'button--finish' : loading }"
                  :disabled="loading"
                  :label="!loading ? 'Comenzar' : 'Comenzando...'"
                  :loading="loading"
                  :icon="null"
                  type="submit" />
              </div>
            </fieldset>
          </form>
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import InfiniteButton from '@/components/InfiniteButton.vue';

export default {
  name: 'signup-data-complete',
  components: {
    InfiniteButton,
  },
  data() {
    return {
      loading: false,
      helpText: 'Para actualizar tus datos contáctate a Mesa de Ayuda teléfono 228 794 499 o al correo mayuda@integra.cl.',
      data: {
        email: '',
        phone: '',
      },
      confirmation: '',
    };
  },
  mounted() {
    if (this.$store.state.user.full_register) {
      this.$router.push({ name: 'home' });
    }
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    submitForm() {
      this.$store.dispatch('complete', this.parseDataBeforeSend(this.data))
        .then(() => this.$router.push({ name: 'onboarding' }))
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
    onSubmit() {
      this.loading = true;
      this.submitForm();
    },
  },
};
</script>

<style>

</style>
