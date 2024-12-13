<template>
  <div class="view view--help section--lighter">
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
            v-for="(item, index) in tutorials"
            :key="item.id">
            <header class="tutorial__header">
              <h3 class="tutorial__title title title--s">
                <button
                  class="tutorial__collapse button w-100"
                  @click="changeAccordion(index)">
                  <i class="material-icons">{{ item.icon }}</i>
                  <span>{{ item.title }}</span>
                </button>
              </h3>
            </header>

            <div class="tutorial__content">
              <div
                class="onboarding__image">
                <div
                  v-if="currentCollapse === index"
                  class="embed-responsive">
                  <youtube
                    :video-id="item.video"
                    :player-vars="playerVars" />
                </div>
              </div>
              <div
                v-if="item.text"
                class="px-4 py-5"
                v-html="item.text" />
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { getTutorials } from '@/services/help';

import PageNav from '@/components/PageNav.vue';

export default {
  name: 'tutorials',
  components: {
    PageNav,
  },
  data() {
    return {
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
      tutorials: [],
      playerVars: {
        autoplay: 0,
        modestbranding: 1,
        rel: 0,
        enablejsapi: 1,
        playsinline: 1,
        fs: 0,
      },
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

      this.getTutorialsData()
        .then((data) => {
          this.tutorials = data.tutorial;
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
    async getTutorialsData() {
      const response = await getTutorials();

      return response.data;
    },
  },
};
</script>
