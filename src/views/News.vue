<template>
  <div class="view view--news">
    <section class="section pt-9">
      <div class="blue-shape"></div>
      <div class="container position-relative pt-7">
        <heading :data="posts.heading" color="light"></heading>

        <div v-if="posts.data.length && !loading">
          <div class="mt-5">
            <div
              v-for="post in posts.data"
              :key="post.id"
              class="mb-5 last">
              <post-card
                :data="post"
                :url="`/noticias/${post.slug}`">
              </post-card>
            </div>
          </div>

          <div class="mt-7">
            <infinite-button
              :class="{ 'button--finish' : this.pagination.finish }"
              @handle-infinite="getMoreNews"
              :disabled="this.pagination.finish"
              :label="this.pagination.finish ? 'No hay más noticias' : 'Cargar más'"
              :loading="loading"
              theme="blue">
            </infinite-button>
          </div>
        </div>

        <div
          v-else-if="!posts.data.length && !loading"
          class="empty text-center px-4 pb-6 pt-10">
          <i class="material-icons text-white mb-4">error</i>
          <h3 class="title title--s text-white">
            No hay noticias publicadas
          </h3>
        </div>

        <div v-else>
          <div class="mt-5">
            <div
              v-for="(item, index) in defaultLoadingItems"
              :key="index"
              class="mb-5 last">
              <post-card
                :loading="true">
              </post-card>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { getPaginatedNews } from '@/services/news';

import Heading from '@/components/Heading.vue';
import PostCard from '@/components/PostCard.vue';
import InfiniteButton from '@/components/InfiniteButton.vue';

export default {
  name: 'news',
  components: {
    Heading,
    PostCard,
    InfiniteButton,
  },
  data() {
    return {
      loading: false,
      defaultLoadingItems: 5,
      posts: {
        heading: {
          label: 'Estás viendo',
          title: 'Últimas noticias',
        },
        data: [],
      },
      pagination: {
        finish: false,
        page: 1,
      },
    };
  },
  created() {
    this.$store.commit('set_title', 'Noticias');
  },
  mounted() {
    this.getNews();
  },
  methods: {
    getNews() {
      if (this.pagination.finish) return;

      this.loading = true;

      this.getNewsData(this.pagination)
        .then(this.checkNextPage)
        .then(this.populateNews)
        .then(() => {
          this.loading = false;
        });
    },

    checkNextPage(data) {
      this.pagination.finish = !data.posts.next_page_url;
      return data;
    },

    populateNews(data) {
      const posts = data.posts.data;

      this.posts.data = this.pagination.page === 1 ? posts : this.posts.data.concat(posts);

      return data;
    },

    getMoreNews() {
      this.pagination.page += 1;
      this.getNews();
    },

    async getNewsData(params = {}) {
      const response = await getPaginatedNews(params);

      return response.data.data;
    },
  },
};
</script>
