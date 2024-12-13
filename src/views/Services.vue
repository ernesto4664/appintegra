<template>
  <div class="view view--services">
    <section class="section pt-9">
      <div class="green-shape"></div>
      <div class="container position-relative pt-7">
        <heading :data="heading" color="light"></heading>

        <div class="mt-7">
          <div class="mb-5 last">
            <router-link
              class="button button--section button--big button--orange"
              :to="salaryUrl"
              :disabled="checkedTerms === 'default'">
              <i class="button__icon material-icons">
                monetization_on
              </i>
              <span
                class="button__text">
                Liquidaciones de sueldo
              </span>
            </router-link>
          </div>
          <div class="mb-5 last">
            <router-link
              class="button button--section button--big button--purple"
              :to="`/certificados`">
              <i class="button__icon material-icons">
                folder_open
              </i>
              <span
                class="button__text">
                Certificados
              </span>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { checkSalaryTerms } from '@/services/salary';

import Heading from '@/components/Heading.vue';

export default {
  name: 'services',
  components: {
    Heading,
  },
  data() {
    return {
      loading: false,
      heading: {
        label: 'Estás viendo',
        title: 'Servicios',
      },
      checkedTerms: 'default',
    };
  },
  created() {
    this.$store.commit('set_title', 'Servicios');
  },
  mounted() {
    this.checkIfUserAcceptSalaryTerms();
  },
  computed: {
    salaryUrl() {
      return this.checkedTerms ? '/liquidaciones-de-sueldo' : '/servicios/terminos-y-condiciones';
    },
  },
  methods: {
    checkIfUserAcceptSalaryTerms() {
      this.loading = true;

      this.checkTerms()
        .then((data) => {
          this.checkedTerms = data.is_termn;
        })
        .catch(() => {
          this.$toasted.show('No hemos podido verificar si aceptaste los términos y condiciones para ver tus liquidaciones online.', {
            theme: 'outline',
            position: 'bottom-center',
            duration: 7000,
          });
        })
        .then(() => {
          this.loading = false;
        });
    },
    async checkTerms() {
      const response = await checkSalaryTerms();

      return response.data;
    },
  },
};
</script>
