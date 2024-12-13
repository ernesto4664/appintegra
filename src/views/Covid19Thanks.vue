<template>
  <div class="view view--covid">
    <section class="section">
      <div class="container">
        <figure class="mt-10 text-center">
          <img class="img-fluid" :src="data.image" :alt="img.alt">
        </figure>

        <div v-if="data.gratitude" class="text text-center mt-6">
          <div v-html="data.gratitude"></div>
        </div>

        <div class="covid_final mt-6 text-center">
          <router-link :to="{ name: 'home' }" class="button button--primary button--small button--white">
            <span class="button__text">Volver al inicio</span>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {
  getCovidData,
} from '@/services/covid';

import ImageThanks from '@/assets/images/covid19-gracias.png';

export default {
  name: 'Covid19Thanks',
  data() {
    return {
      loading: false,
      img: {
        src: ImageThanks,
        alt: 'Integra se mueve por Integra - Gracias',
      },
      data: null,
    };
  },
  mounted() {
    this.$store.commit('set_title', 'Aporte Covid-19');
    // this.$store.commit('set_covid_contribution');

    this.getCovidDataData()
      .then((data) => {
        this.$store.commit('set_title', data.generalInformation.title);
        this.data = data.generalInformation;
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
    async getCovidDataData() {
      const response = await getCovidData();

      return response.data.data;
    },
  },
};
</script>
