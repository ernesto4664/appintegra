<template>
  <div class="view view--terms">
    <section class="section pt-0">
      <header class="background-green pt-header text-center">
        <div class="container pt-5 pb-6">
          <heading :data="heading" color="light"></heading>
        </div>
      </header>

      <div class="terms">
        <div class="container pt-6">
          <h3 class="title">
            <i class="material-icons">{{ data.heading.icon }}</i>
            {{ data.heading.title }}
          </h3>

          <div class="text mt-6">
            <ol class="terms__list">
              <li
                class="terms__item"
                v-for="(item, index) in data.terms"
                :key="index">
                <p>{{ item.name }}</p>
              </li>
            </ol>
          </div>

          <hr class="mb-7 mt-6">

          <div class="text-center">
            <button
              class="button button--primary button--orange button--columns w-100"
              @click="handleAcceptTerms()">
              <span class="button__text">Sí, acepto los términos y condiciones</span>
              <i class="button__icon material-icons">arrow_forward</i>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import swal from 'sweetalert';

import {
  getSalaryTerms,
  acceptSalaryTerms,
} from '@/services/salary';

import Heading from '@/components/Heading.vue';

export default {
  name: 'salaty-terms',
  components: {
    Heading,
  },
  data() {
    return {
      loading: false,
      heading: {
        title: '¿Quieres recibir tu liquidación en tu celular?',
      },
      data: {
        heading: {
          icon: 'format_list_bulleted',
          title: 'Términos y condiciones',
        },
        terms: [],
      },
    };
  },
  created() {
    this.$store.commit('set_title', 'Términos y condiciones');
  },
  mounted() {
    if (this.$store.state.user.is_termn_service) {
      this.$router.go(-1);
    }

    this.getTerms();
  },
  methods: {
    getTerms() {
      this.loading = true;

      this.getTermsData()
        .then((data) => {
          this.data.terms = data.name;
        })
        .catch(error => error)
        .then(() => {
          this.loading = false;
        });
    },
    handleAcceptTerms() {
      this.loading = true;

      this.acceptTerms()
        .then((resp) => {
          const data = {
            user: resp,
          };

          this.$store.commit('auth_complete', data);

          swal({
            icon: 'success',
            title: 'Cambio de modalidad de entrega de liquidaciones exitoso',
            button: 'Revisar liquidaciones',
          })
            .then(() => {
              this.$router.push('/liquidaciones-de-sueldo');
            });
        })
        .catch(() => {
          this.$toasted.show('Ha ocurrido un problema mientras intentabamos procesar tu solicitud, por favor intentalo nuevamente.', {
            theme: 'outline',
            position: 'bottom-center',
            duration: 7000,
          });
        })
        .then(() => {
          this.loading = false;
        });
    },
    async getTermsData() {
      const response = await getSalaryTerms();

      return response.data.data;
    },
    async acceptTerms() {
      const response = await acceptSalaryTerms();

      return response.data.data;
    },
  },
};
</script>
