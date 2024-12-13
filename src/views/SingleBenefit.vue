<template>
  <div class="view view--single view--new">
    <article class="new section pt-9" :key="data.slug">
      <div class="container pt-7">
        <div v-if="!loading">
          <date class="new__date mb-5" :date="data.date"></date>

          <heading :data="data.heading"></heading>

          <figure class="mt-6 mb-7" v-if="data.featured_img">
            <img
              class="img-fluid rounded shadow w-100"
              :src="data.featured_img.src"
              :alt="data.featured_img.alt">
          </figure>

          <div :style="{ fontSize: fontSize + 'rem' }">
            <div
              v-if="data.post_intro"
              v-html="data.post_intro"
              class="new__intro text text--font-inherit mb-4">
            </div>

            <div
              v-if="data.post_content"
              v-html="data.post_content"
              class="new__text text text--font-inherit mb-7">
            </div>

            <div v-if="data.video" class="embed-responsive">
              <youtube
                ref="items"
                :video-id="data.video"
                :player-vars="playerVars" />
            </div>

            <div class="new__links" v-if="data.links && data.links.length">
              <div v-for="(link, index) in data.links" :key="index">
                <button
                  class="button button--link button--blue"
                  @click="openLink(link)">
                  <i class="button__icon material-icons">{{ link.icon }}</i>
                  <span class="button__text">{{ link.label || 'Ver enlace' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="integrito-loading">
            <img
              class="img-fluid"
              :src="require('../assets/images/integra-isotipo.svg')"
              alt="Integrito">
          </div>
        </div>
      </div>
    </article>

    <div v-if="!loading">
      <section
        v-if="documents.data.length"
        class="section section--lighter">
        <div class="container">
          <heading :data="documents.heading"></heading>

          <div class="mt-5">
            <div
              class="tutorial mb-5 last"
              v-for="(item, index) in documents.data"
              :class="{ 'tutorial--active' : (currentCollapse === index && !item.url) }"
              :key="item.id">
              <header class="tutorial__header">
                <h3 class="tutorial__title title title--s">
                  <button
                    class="tutorial__collapse button w-100"
                    @click="changeAccordion(index, item)">
                    <i class="material-icons">{{ item.icon }}</i>
                    <span>{{ item.title }}</span>
                  </button>
                </h3>
              </header>

              <div class="tutorial__content">
                <div
                  v-if="item.video"
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
            </div>
          </div>
        </div>
      </section>

      <section
        v-if="related.data.length"
        :class="[ documents.data.length ? 'section--light' : 'section--lighter' ]"
        class="section pb-7">
        <div class="container">
          <heading class="mb-3" :data="related.heading"></heading>
        </div>
      </section>

      <section
        v-if="data.files"
        class="section pb-7">
         <div class="container">
          <aditional-material v-for="(file,index) in data.files" :key="index" :item="file">
          </aditional-material>
         </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import { getSingleBenefit } from '@/services/benefits';

import Heading from '@/components/Heading.vue';
// import PostCard from '@/components/PostCard.vue';
import Date from '@/components/Date.vue';
import AditionalMaterial from '@/components/AditionalMaterial.vue';

export default {
  name: 'new',
  components: {
    Heading,
    // PostCard,
    AditionalMaterial,
    Date,
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
      loading: false,
      data: {
        date: '',
        heading: {
          level: 'h1',
          title: '',
        },
        file: 'hola.mp4',
        files: [],
        featured_img: null,
        post_intro: '',
        post_content: '',
        post_gallery: [],
        links: [],
      },
      documents: {
        heading: {
          title: 'Material adicional',
        },
        data: [],
      },
      related: {
        heading: {
          title: this.$route.meta.related,
        },
        data: [],
      },
    };
  },
  created() {
    this.$store.commit('set_title', this.$route.meta.label);
  },
  mounted() {
    this.loading = true;

    this.getNewData()
      .then((data) => {
        this.populateData(data);
      })
      .then(() => {
        this.loading = false;
      });

    if (window.cordova) {
      window.open = window.cordova.InAppBrowser.open;
    }
  },
  watch: {
    $route() {
      this.loading = true;
      this.resetNewData();
      this.getNewData()
        .then((data) => {
          this.populateData(data);
        })
        .then(() => {
          this.loading = false;
        });
    },
  },
  computed: {
    ...mapState(['fontSize']),
  },
  methods: {
    async getNewData() {
      const response = await getSingleBenefit(this.$route.params.slug);

      return response.data;
    },

    resetNewData() {
      this.data = {
        date: '',
        heading: {
          level: 'h1',
          title: '',
        },
        featured_img: null,
        post_intro: '',
        post_content: '',
        post_gallery: [],
        links: [],
      };

      this.related = {
        heading: {
          title: this.$route.meta.related,
        },
        data: [],
      };
    },

    openLink(link) {
      window.open(link.url, '_system');
      return false;
    },

    relatedUrl(slug) {
      // return this.$route.name === 'new' ? `/noticias/${slug}` : `/comunicados/${slug}`;
      return `/beneficios/${slug}`;
    },

    populateData(data) {
      const post = data.data;
      const related = (data.related || data.releases) || '';

      this.data.date = post.date;
      this.data.heading.title = post.title;
      this.data.featured_img = post.featured_img;
      this.data.post_intro = post.post_intro || post.description;
      this.data.post_content = post.post_content;
      this.data.video = post.video;
      this.data.links = post.links;
      this.data.file = post.file;
      this.data.files = post.files ? post.files : [];

      this.documents.data = post.documents ? post.documents : [];

      if (related) {
        this.related.data = related.data;
      }

      this.$nextTick(() => {
        setTimeout(() => {
          const allLinks = document.querySelectorAll('.new a');

          allLinks.forEach((link) => {
            const href = link.getAttribute('href');
            link.addEventListener('click', (e) => {
              e.preventDefault();
              window.open(href, '_system');
              return false;
            });
          });
        }, 100);
      });
    },

    changeAccordion(index, item) {
      if (typeof item.url !== 'undefined') {
        return this.openLink(item);
      }

      if (this.currentCollapse === index) {
        this.currentCollapse = 1000;
        return index;
      }

      this.currentCollapse = index;
      return index;
    },
  },
};
</script>
