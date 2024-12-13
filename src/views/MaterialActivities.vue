<template>
  <div class="view view--activities">
    <section class="section pt-9">
      <background-shape color="#EE7C00" />
      <div class="container position-relative pt-7">
        <heading :data="posts.heading" color="light"></heading>

        <div v-if="loading && !posts.data.length">
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

        <div v-if="posts.data.length">
          <div class="mt-5">
            <div
              v-for="post in posts.data"
              :key="post.id"
              class="mb-5 last">
              <post-card
                :data="post"
                :url="`/material-educativo/actividades/${post.slug}`"
                theme="orange">
              </post-card>
            </div>
          </div>

          <div class="mt-7">
            <infinite-button
              :class="{ 'button--finish' : this.pagination.finish }"
              @handle-infinite="getMoreItems"
              :disabled="this.pagination.finish"
              :label="this.pagination.finish ? 'No hay más actividades' : 'Cargar más'"
              :loading="loading"
              theme="orange">
            </infinite-button>
          </div>
        </div>

        <div
          v-else
          class="empty text-center px-4 pb-6 pt-10">
          <i class="material-icons text-white mb-4">error</i>
          <h3 class="title title--s text-white">
            No hay actividades publicadas
          </h3>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { getPaginatedActivities } from '@/services/material';

import Heading from '@/components/Heading.vue';
import PostCard from '@/components/PostCard.vue';
import InfiniteButton from '@/components/InfiniteButton.vue';
import BackgroundShape from '@/components/BackgroundShape.vue';

export default {
  name: 'material-activities',
  components: {
    Heading,
    PostCard,
    InfiniteButton,
    BackgroundShape,
  },
  data() {
    return {
      loading: false,
      defaultLoadingItems: 5,
      posts: {
        heading: {
          label: 'Estás viendo',
          title: 'Actividades',
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
    this.$store.commit('set_title', 'Material Educativo');
    this.getItems();
  },
  methods: {
    getItems() {
      if (this.pagination.finish) return;

      this.loading = true;

      this.getItemsData(this.pagination)
        .then(this.checkNextPage)
        .then(this.populateData)
        .then(() => {
          this.loading = false;
        });
    },

    checkNextPage(data) {
      this.pagination.finish = !data.educational_material.next_page_url;
      return data;
    },

    populateData(data) {
      const posts = data.educational_material.data;

      this.posts.data = this.pagination.page === 1 ? posts : this.posts.data.concat(posts);

      return data;
    },

    getMoreItems() {
      this.pagination.page += 1;
      this.getItems();
    },

    async getItemsData(params = {}) {
      const response = await getPaginatedActivities(params);

      return response.data.data;
    },
  },
};
</script>
