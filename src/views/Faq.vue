<template>
  <div class="view view--help section--light">
    <section class="section pt-header">
      <div class="container">
        <div class="py-7">
          <page-nav
            :data="menu"
            color="primary">
          </page-nav>
        </div>

        <div>
          <article
            class="tutorial mb-5 last"
            :class="{ 'tutorial--active' : currentCollapse === index }"
            v-for="(item, index) in questions"
            :key="item.id">
            <header class="tutorial__header">
              <h3 class="tutorial__title title title--s">
                <button
                  class="tutorial__collapse button w-100"
                  @click="changeAccordion(index)">
                  <i class="material-icons">{{ item.icon }}</i>
                  <span>
                    <span
                      v-if="item.category"
                      class="tutorial__label d-block mb-2">
                      {{ item.category }}
                    </span>
                    {{ item.title }}
                  </span>
                </button>
              </h3>
            </header>

            <div class="tutorial__content">
              <div class="text px-4 pb-5">
                <hr class="mt-0">
                <div v-if="item.video" class="embed-responsive">
                  <youtube
                    ref="items"
                    :video-id="item.video"
                    :player-vars="playerVars" />
                </div>

                <div v-html="item.description"></div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
  .embed-responsive {
    margin-bottom: 15px;
  }
</style>

<script>
import { getFaq } from '@/services/help';

import PageNav from '@/components/PageNav.vue';

export default {
  name: 'faq',
  components: {
    PageNav,
  },
  data() {
    return {
      playerVars: {
        autoplay: 0,
        modestbranding: 1,
        rel: 0,
        enablejsapi: 1,
        playsinline: 1,
        fs: 0,
      },
      currentCollapse: 0,
      menu: [
        {
          label: 'Tutoriales APP',
          url: '/mesa-de-ayuda/tutoriales',
        }, {
          label: 'Preguntas Frecuentes',
          url: '/mesa-de-ayuda/preguntas',
        }, {
          label: 'Contacto Directo',
          url: '/mesa-de-ayuda/contacto',
        },
      ],
      questions: [],
    };
  },
  created() {
    this.$store.commit('set_title', 'Ayuda');
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;

      this.getFaqData()
        .then((data) => {
          this.questions = data.questions;
        })
        .then(() => {
          this.loading = false;
        });
    },
    changeAccordion(index) {
      if (this.currentCollapse === index) {
        this.currentCollapse = 1000;
        return index;
      }

      this.currentCollapse = index;
      return index;
    },
    async getFaqData() {
      const response = await getFaq();

      return response.data;
    },
  },
};
</script>
