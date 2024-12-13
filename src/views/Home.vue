<template>
  <div class="view view--home">
    <section class="section section--light pt-9">
      <div class="container pt-7">
        <div v-if="showAlert" class="mb-6">
          <transition appear name="fade">
            <banner-alert
              :button="{
                label: 'Aportar',
                to: { name: 'covid19' }
              }"
              :closable="false"
              :text="alert_message"
              @close="hideAlert"
            />
          </transition>
        </div>

        <heading :data="today.heading"></heading>

        <div v-if="today.data.length">
          <div class="mt-5">
            <div
              v-for="button in today.data"
              :key="button.title"
              v-show="isPublic(button)"
              class="mb-5 last"
            >
              <section-button :data="button"></section-button>
            </div>
            <div v-if="showSurveys">
              <div
                v-for="button in surveys"
                :key="button.title"
                v-show="isPublic(button)"
                class="mb-5 last"
              >
                <section-button
                  :data="{
                    class: button.class,
                    icon: button.icon,
                    slug: `encuestas/${button.slug}?color=${button.class}`,
                    title: button.title_button
                  }"
                />
              </div>
            </div>
            <div class="mb-5 last" v-if="user.is_parent">
              <section-button :data="material" />
            </div>
          </div>
        </div>
        <div v-else>
          <div class="mt-5">
            <div v-for="(item, index) in 3" :key="index" class="mb-5 last">
              <section-button :loading="true"></section-button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="posts.data.length" class="section section--lighter">
      <div class="container">
        <heading :data="releases.heading" theme="red"> </heading>

        <div v-if="posts.data.length">
          <div class="mt-5">
            <div v-for="release in releases.data" :key="release.id" class="mb-5 last">
              <post-card :data="release" :url="`/comunicados/${release.slug}`" theme="red">
              </post-card>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="mt-5">
            <div v-for="(item, index) in defaultLoadingItems" :key="index" class="mb-5 last">
              <post-card :loading="true"> </post-card>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="posts.data.length" class="section section--white pb-7">
      <div class="container">
        <heading :data="posts.heading" theme="blue"> </heading>

        <div v-if="posts.data.length">
          <div class="mt-5">
            <div v-for="post in posts.data" :key="post.id" class="mb-5 last">
              <post-card :data="post" :url="`/noticias/${post.slug}`" theme="blue"> </post-card>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="mt-5">
            <div v-for="(item, index) in defaultLoadingItems" :key="index" class="mb-5 last">
              <post-card :loading="true"> </post-card>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import { getHome } from '@/services/home';

import Heading from '@/components/Heading.vue';
import SectionButton from '@/components/SectionButton.vue';
import PostCard from '@/components/PostCard.vue';
import BannerAlert from '@/components/BannerAlert.vue';

export default {
  name: 'home',
  components: {
    Heading,
    SectionButton,
    PostCard,
    BannerAlert,
  },
  data() {
    return {
      defaultLoadingItems: 2,
      alert: false,
      alert_message: '',
      today: {
        heading: {
          title: '¿Qué quieres revisar hoy?',
        },
        data: [],
      },
      surveys: [],
      releases: {
        heading: {
          title: 'Últimos comunicados',
          url: '/comunicados',
        },
        data: [],
      },
      posts: {
        heading: {
          title: 'Últimas noticias',
          url: '/noticias',
        },
        data: [],
      },
      // material: {
      //   class: 'yellow',
      //   icon: 'format_list_bulleted',
      //   title: 'Material educativo',
      //   slug: 'material-educativo',
      // },
    };
  },
  created() {
    this.$store.commit('set_layout', 'app-layout');
    this.$store.commit('set_title', '');
  },
  mounted() {
    this.getHomeData().then((data) => {
      this.populateData(data);
    });
  },
  computed: {
    ...mapState(['user', 'showCovidAlert']),

    showAlert() {
      // return this.alert && !this.user.is_contribution && this.showCovidAlert;
      return this.alert && !this.user.is_parent && !this.user.is_public;
    },

    showSurveys() {
      return !this.user.is_parent && this.surveys.length && !this.user.is_public;
    },
  },
  methods: {
    isEnabled(item) {
      if (item.slug !== 'servicios') return true;

      return this.user.rut !== '186645863';
    },
    isPublic(item) {
      if (this.user.is_public && item.slug === 'servicios') return false;
      if (this.user.is_public && item.slug === 'certificados/renta-1887') return false;
      return true;
    },
    async getHomeData() {
      const response = await getHome();

      return response.data;
    },
    hideAlert() {
      this.alert = false;
      this.$store.commit('show_covid_alert', false);
    },
    populateData(data) {
      const homeData = data.data;

      this.today.data = homeData.today.data.filter(button => button.slug !== 'material-educativo');
      this.material = homeData.today.data.find(button => button.slug === 'material-educativo');

      this.surveys = homeData.survey ? homeData.survey.data : [];
      this.releases.data = homeData.releases.data;
      this.posts.data = homeData.posts.data;
      this.alert = !!data.alert || false;
      this.alert_message = data.alert_message || '';
    },
  },
};
</script>
