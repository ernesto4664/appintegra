<template>
  <div class="view view--videos">
    <section class="section pt-9">
      <background-shape color="#70ABDA" />
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
              class="tutorial mb-5 last"
              v-for="(item, index) in posts.data"
              :class="{ 'tutorial--active' : currentCollapse === index }"
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

          <div class="mt-7">
            <infinite-button
              :class="{ 'button--finish' : this.pagination.finish }"
              @handle-infinite="getMoreItems"
              :disabled="this.pagination.finish"
              :label="this.pagination.finish ? 'No hay más videos' : 'Cargar más'"
              :loading="loading"
              theme="skyblue">
            </infinite-button>
          </div>
        </div>

        <div
          v-else
          class="empty text-center px-4 pb-6 pt-10">
          <i class="material-icons text-white mb-4">error</i>
          <h3 class="title title--s text-white">
            No hay videos publicados
          </h3>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { getPaginatedVideos } from '@/services/material';

import Heading from '@/components/Heading.vue';
import PostCard from '@/components/PostCard.vue';
import InfiniteButton from '@/components/InfiniteButton.vue';
import BackgroundShape from '@/components/BackgroundShape.vue';

export default {
  name: 'material-videos',
  components: {
    Heading,
    PostCard,
    InfiniteButton,
    BackgroundShape,
  },
  data() {
    return {
      loading: false,
      currentCollapse: 0,
      defaultLoadingItems: 5,
      playerVars: {
        autoplay: 0,
        modestbranding: 1,
        rel: 0,
        enablejsapi: 1,
        playsinline: 1,
        fs: 0,
      },
      posts: {
        heading: {
          label: 'Estás viendo',
          title: 'Videos',
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
      this.pagination.finish = !data.videos.next_page_url;
      return data;
    },

    populateData(data) {
      const posts = data.videos.data;

      this.posts.data = this.pagination.page === 1 ? posts : this.posts.data.concat(posts);

      return data;
    },

    getMoreItems() {
      this.pagination.page += 1;
      this.getItems();
    },

    changeAccordion(index) {
      if (this.currentCollapse === index) {
        this.currentCollapse = 1000;
        return index;
      }

      this.currentCollapse = index;
      return index;
    },

    async getItemsData(params = {}) {
      const response = await getPaginatedVideos(params);

      return response.data.data;
    },
  },
};
</script>
