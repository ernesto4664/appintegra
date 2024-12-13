<template>
  <div class="view view--covid section--light">
    <section v-if="data" class="section py-0">
      <header class="background-green-dark pt-header text-center">
        <div class="container pt-6 pb-7">
          <heading :data="{ 'title' : data.subtitle }" color="light"></heading>
        </div>
      </header>

      <div class="covid19">
        <div class="container pt-4 pb-3">
          <p v-if="data.description" class="text text-center text--smaller" v-html="data.description"></p>
          <div>
            <p class="d-flex align-items-center mb-1"><span class="covid19__label">Nombre:</span> <span class="form-control-plaintext">{{ data.full_name }}</span></p>
            <p class="d-flex align-items-center"><span class="covid19__label">RUT:</span> <input class="form-control-plaintext" type="text" v-model="data.rut" v-rut></p>
          </div>
        </div>

        <div class="section section--light">
          <div class="container">
            <heading :data="{ title: 'Mi aporte' }"></heading>

            <ValidationObserver v-slot="{ handleSubmit }" tag="div">
              <form class="form" @submit.prevent="handleSubmit(onSubmit)" ref="form" novalidate>
                <fieldset class="form__item">
                  <div class="form__fields">
                    <div class="covid19__options form-row">
                      <div
                        v-for="item in amounts"
                        :key="item.value"
                        class="col-6 mt-3">
                        <button
                          class="button button--section"
                          type="button"
                          :class="`button--${item.color}`"
                          @click="setAmount(item.value)">
                          <span class="button__text">{{ formatPrice(item.value) }}</span>
                          <transition name="fade">
                            <span class="button__icon material-icons" v-show="item.value === amount">check_circle</span>
                          </transition>
                        </button>
                      </div>
                      <div class="col-6 mt-3">
                        <div class="form-price">
                          <input
                            type="number"
                            id="amount"
                            class="form-control"
                            name="amount"
                            placeholder="Otro"
                            v-model="customAmount"
                            @input="formatNumber">
                        </div>
                      </div>
                    </div>

                    <ValidationProvider
                      name="monto"
                      rules="required"
                      v-slot="{ classes, errors }"
                      tag="div">
                      <input type="hidden" v-model="amount">
                      <small
                        v-if="errors.length"
                        class="form-helper form-helper--error mt-3">
                        <i class="material-icons">info</i> {{ errors[0] }}
                      </small>
                    </ValidationProvider>

                    <div class="custom-control custom-checkbox mt-4">
                      <input class="custom-control-input" type="checkbox" v-model="legal" id="covidLegal">
                      <label class="custom-control-label" for="covidLegal">
                        {{ data.text_check }}
                      </label>
                    </div>
                  </div>

                  <div class="form__submit covid19__actions mt-4 mx-auto">
                    <infinite-button
                      class="button--submit button--green button--small"
                      :disabled="loading"
                      :label="!loading ? 'Aportar' : 'Enviando...'"
                      :loading="loading"
                      :icon="null"
                      type="submit" />

                    <router-link :to="{ name: 'home' }" class="button button--primary button--white button--small w-100">
                      <span class="button__text">Volver al inicio</span>
                    </router-link>
                  </div>
                </fieldset>
              </form>
            </ValidationObserver>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {
  getCovidData,
  sendCovidAmount,
} from '@/services/covid';

import { formatPrice } from '@/helpers';

import swal from 'sweetalert';

import Heading from '@/components/Heading.vue';
import InfiniteButton from '@/components/InfiniteButton.vue';

export default {
  name: 'Covid19',
  components: {
    Heading,
    InfiniteButton,
  },
  data() {
    return {
      loading: false,
      data: null,
      amounts: [],
      customAmount: '',
      amount: '',
      legal: false,
    };
  },
  mounted() {
    this.getCovidDataData()
      .then((data) => {
        this.$store.commit('set_title', data.generalInformation.title);
        this.data = data.generalInformation;
        this.amounts = data.amounts;
      })
      .catch(() => {
        this.$toasted.show('No hemos podido obtener los datos', {
          theme: 'outline',
          position: 'bottom-center',
          duration: 7000,
        });
      });
  },
  methods: {
    setAmount(value) {
      this.amount = '';

      if (value.target) {
        this.amount = value.target.value;
        return;
      }

      this.customAmount = '';
      this.amount = value;
    },
    onSubmit() {
      if (!this.legal) {
        return swal({
          icon: 'error',
          title: 'Debes marcar la casilla de autorización para enviar el aporte.',
          button: 'Entendido',
        });
      }
      this.loading = true;
      return this.submitForm();
    },
    submitForm() {
      const data = {
        amount: this.removethousandSeparator(this.amount),
        user_rut: this.data.rut,
      };

      this.sendCovidMoney(this.parseDataBeforeSend(data))
        .then(() => {
          this.$router.push({ name: 'covid19-thanks' });
        })
        .catch(() => {
          this.$router.push({ name: 'covid19-thanks' });
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
    formatNumber(e) {
      this.setAmount(e);
      this.customAmount = this.thousandSeparator(this.customAmount);
    },
    thousandSeparator(amount) {
      if (amount !== '' || amount !== undefined || amount !== 0 || amount !== '0' || amount !== null) {
        const tempAmount = this.removethousandSeparator(amount);
        return tempAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      }

      return amount;
    },
    removethousandSeparator(amount) {
      if (amount !== '' || amount !== undefined || amount !== 0 || amount !== '0' || amount !== null) {
        return amount.toString().replace(/\./g, '');
      }

      return amount;
    },
    formatPrice,
    async getCovidDataData() {
      const response = await getCovidData();

      return response.data.data;
    },
    async sendCovidMoney(data) {
      const response = await sendCovidAmount(data);

      return response.data.data;
    },
  },
};
</script>
