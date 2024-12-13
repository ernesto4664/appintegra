<template>
  <div class="view view--releases">
    <section class="section pt-9">
      <div class="red-shape"></div>
      <div class="container position-relative pt-7">
        <page-nav
          class="mb-7"
          :data="menu"
          color="light">
        </page-nav>

        <div v-if="releases.data.length && !loading">
          <div class="mt-5">
            <div
              v-for="release in releases.data"
              :key="release.id"
              class="mb-5 last">
              <post-card
                :data="release"
                :url="`/ofertas/${release.slug}`"
                theme="red">
              </post-card>
            </div>
          </div>

          <div class="mt-7">
            <infinite-button
              :class="{ 'button--finish' : pagination.finish }"
              @handle-infinite="getMoreNews"
              :disabled="pagination.finish"
              :label="pagination.finish ? 'No hay más ofertas' : 'Cargar más'"
              :loading="loading"
              theme="red">
            </infinite-button>
          </div>
        </div>

        <div
          v-else-if="!releases.data.length && !loading"
          class="empty text-center px-4 pb-6 pt-10">
          <i class="material-icons text-danger mb-4 pt-5">error</i>
          <h3 class="title title--s text-danger">
            No hay ofertas publicadas
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
import { getPaginatedJobs } from '@/services/releases';

import PageNav from '@/components/PageNav.vue';
import PostCard from '@/components/PostCard.vue';
import InfiniteButton from '@/components/InfiniteButton.vue';

export default {
  name: 'home',
  components: {
    PageNav,
    PostCard,
    InfiniteButton,
  },
  data() {
    return {
      loading: false,
      defaultLoadingItems: 5,
      menu: [
        {
          label: 'Comunicados',
          url: '/comunicados',
        }, {
          label: 'Ofertas laborales',
          url: '/ofertas',
        },
      ],
      releases: {
        data: [],
      },
      pagination: {
        finish: false,
        page: 1,
      },
    };
  },
  created() {
    this.$store.commit('set_title', 'Ofertas Laborales');
  },
  mounted() {
    this.getItems();
  },
  methods: {
    getItems() {
      if (this.pagination.finish) return;

      this.loading = true;

      this.getApiData(this.pagination)
        .then(this.checkNextPage)
        .then(this.populateData)
        .then(() => {
          this.loading = false;
        });
    },

    checkNextPage(data) {
      this.pagination.finish = !data.posts.next_page_url;
      return data;
    },

    populateData(data) {
      const releases = data.posts.data;

      this.releases.data = this.pagination.page === 1 ? releases : this.releases.data.concat(releases);

      return data;
    },

    getMoreNews() {
      this.pagination.page += 1;
      this.getItems();
    },

    async getApiData(params = {}) {
      const response = await getPaginatedJobs(params);

      return response.data.data;
    },
  },
};
</script>
