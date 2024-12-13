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

          <!--
          <div class="new__gallery mb-7" v-if="data.post_gallery.length">
            <carousel per-page="1">
              <slide v-for="(image, index) in data.post_gallery" :key="index">
                <img
                  class="img-fluid rounded shadow w-100"
                  :src="image.src"
                  :alt="image.alt">
              </slide>
            </carousel>
          </div>
          -->

          <!-- <div v-if="data.media && data.media.length" class="new__gallery mb-3">
            <carousel
              per-page="1"
              pagination-active-color="#73bb32"
            >
              <slide v-for="(image, index) in data.media" :key="index">
                <img
                  class="img-fluid rounded shadow w-100"
                  :src="image.original_url"
                  :alt="image.name"
                />
              </slide>
            </carousel>
          </div> -->

          <!--
          <div>
            <pre>{{ JSON.stringify(data, null, 2) }}</pre>
          </div>
          -->

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
                <span
                  class="button button--link button--blue"
                  @click="inTheSame(link)"
                   >
                  <i class="button__icon material-icons">{{ link.icon }}</i>
                  <span class="button__text">{{ link.label || 'Ver enlace' }}</span>
                </span>
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
        v-if="benefist.data.length"
        :class="[ documents.data.length ? 'section--light' : 'section--lighter' ]"
        class="section pb-7">
        <div class="container">
           <header class="heading"><!---->
            <h2 class="title title--s mx-auto">Beneficios</h2><!---->
          </header>
          <div class="mt-5">
            <div
              v-for="post in benefist.data"
              :key="post.id"
              class="mb-5 last">
              <post-card-benefist
                :data="post"
                :url="relatedUrl(post.slug)"
               >
              </post-card-benefist>
            </div>
          </div>
        </div>
      </section>

       <section
        v-if="related.data.length"
        :class="[ documents.data.length ? 'section--light' : 'section--lighter' ]"
        class="section pb-7">
        <div class="container">
          <heading :data="related.heading"></heading>

          <div class="mt-5">
            <div
              v-for="post in related.data"
              :key="post.id"
              class="mb-5 last">
              <post-card
                :data="post"
                :url="relatedUrl(post.slug)"
                :theme="$route.name === 'new' ? 'blue' : 'red'">
              </post-card>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import { getSingleNew } from '@/services/news';

import Heading from '@/components/Heading.vue';
import PostCard from '@/components/PostCard.vue';
import PostCardBenefist from '@/components/PostCardBenefist.vue';
import Date from '@/components/Date.vue';
// import { Carousel, Slide } from 'vue-carousel';

export default {
  name: 'new',
  components: {
    Heading,
    PostCard,
    Date,
    PostCardBenefist,
    // Carousel,
    // Slide,
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
        featured_img: null,
        post_intro: '',
        post_content: '',
        post_gallery: [],
        media: [],
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
      benefist: {
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
      const response = await getSingleNew(this.$route.meta.api, this.$route.params.slug);

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
        media: [],
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
    inTheSame(link) {
      if (link.target === '_self') {
        this.$router.push(link.url);
      } else {
        window.open(link.url, '_system');
      }
    },
    relatedUrl(slug) {
      return this.$route.name === 'new' ? `/noticias/${slug}` : `/comunicados/${slug}`;
    },

    populateData(data) {
      const post = data.data;
      const related = (data.related || data.releases) || '';

      this.data.date = post.date;
      this.data.heading.title = post.title;
      this.data.featured_img = post.featured_img;
      this.data.post_intro = post.post_intro || post.description;
      this.data.post_content = post.post_content;
      this.data.post_gallery = post.post_gallery;
      this.data.media = post.media;
      this.data.video = post.video;
      this.data.links = post.links;
      this.documents.data = post.documents ? post.documents : [];

      if (related) {
        this.related.data = related.data;
      }

      if (post.benefit_post) {
        this.benefist.data = post.benefit_post;
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
