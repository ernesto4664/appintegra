<template>
  <div class="view view--single view--new">
    <div v-if="loading" class="py-7">
      <div class="integrito-loading py-10">
        <img
          class="img-fluid"
          :src="require('../assets/images/integra-isotipo.svg')"
          alt="Integrito">
      </div>
    </div>
    <div v-else>
      <div v-if="!iframe_url">
        <div class="empty text-center px-4 pb-6 pt-10">
          <i class="material-icons mb-4 mt-8">error</i>
          <h3 class="title title--s">
            No hay encuestas disponibles
          </h3>
        </div>
      </div>
      <div v-else>
        <header class="background-green-dark pt-header text-center" :style="`backgroundColor: ${shapeColor}`">
          <div class="container py-5">
            <heading :data="heading" color="light"></heading>
          </div>
        </header>

        <article class="new section">
          <div class="container">
            <div class="embed-survey">
              <iframe :src="iframe_url" frameborder="0"></iframe>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import getSingleSurvey from '@/services/surveys';

import Heading from '@/components/Heading.vue';

export default {
  name: 'SurveyMonkey',
  components: {
    Heading,
  },
  data() {
    return {
      loading: false,
      heading: {
        title: '',
      },
      iframe_url: '',
    };
  },
  mounted() {
    this.$store.commit('set_title', this.$route.meta.label);

    this.loading = true;

    this.getSurveyData()
      .then((data) => {
        this.heading.title = data.data.title;
        this.iframe_url = data.data.url_survey;
      })
      .catch(() => {
        this.$toasted.show('No hemos podido obtener la encuesta', {
          theme: 'outline',
          position: 'bottom-center',
          duration: 7000,
        });
      })
      .then(() => {
        this.loading = false;
      });
  },
  computed: {
    shapeColor() {
      let color = '';
      const queryColor = this.$route.query.color;
      if (queryColor === 'blue') color = '#3066B1';
      if (queryColor === 'red') color = '#E2432A';
      if (queryColor === 'green') color = '#73BB32';
      if (queryColor === 'orange') color = '#EE7C00';
      if (queryColor === 'purple') color = '#782D85';
      if (queryColor === 'yellow') color = '#F5D445';
      if (queryColor === 'skyblue') color = '#5DACDF';
      return color;
    },
  },
  methods: {
    async getSurveyData() {
      const response = await getSingleSurvey(this.$route.meta.api, this.$route.params.id);

      return response.data;
    },
  },
};
</script>
