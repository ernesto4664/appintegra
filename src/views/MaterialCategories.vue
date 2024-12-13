<template>
  <div class="view view--categories">
    <section class="section pt-9">
      <background-shape :color="shapeColor || '#EE7C00'" />
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
                :url="`/material-educativo/entradas/${post.slug}`"
                theme="orange">
              </post-card>
            </div>
          </div>

          <div class="mt-7">
            <infinite-button
              :class="{ 'button--finish' : this.pagination.finish }"
              @handle-infinite="getMoreItems"
              :disabled="this.pagination.finish"
              :label="this.pagination.finish ? 'No hay más entradas' : 'Cargar más'"
              :loading="loading"
              :theme="this.$route.query.color || 'orange'">
            </infinite-button>
          </div>
        </div>

        <div
          v-else
          class="empty text-center px-4 pb-6 pt-10">
          <i class="material-icons text-white mb-4">error</i>
          <h3 class="title title--s text-white">
            No hay entradas publicadas
          </h3>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { getMaterialsPostsByCategories } from '@/services/material';

import Heading from '@/components/Heading.vue';
import PostCard from '@/components/PostCard.vue';
import InfiniteButton from '@/components/InfiniteButton.vue';
import BackgroundShape from '@/components/BackgroundShape.vue';

export default {
  name: 'material-categories',
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
          title: this.$route.query ? this.$route.query.name : 'Material Educativo',
        },
        data: [],
      },
      pagination: {
        slug: this.$route.params ? this.$route.params.slug : '',
        finish: false,
        page: 1,
      },
    };
  },
  mounted() {
    this.$store.commit('set_title', 'Material Educativo');
    this.getItems();
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
    getItems() {
      if (this.pagination.finish) return;

      this.loading = true;

      this.getMaterialsPostsByCategoriesFromApi(this.pagination)
        .then(this.checkNextPage)
        .then(this.populateData)
        .catch(() => {
          this.$toasted.show('No hemos podido obtener las entradas.', {
            theme: 'outline',
            position: 'bottom-center',
            duration: 7000,
          });
        })
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

    async getMaterialsPostsByCategoriesFromApi(params = {}) {
      const response = await getMaterialsPostsByCategories(params);

      return response.data.data;
    },
  },
};
</script>
