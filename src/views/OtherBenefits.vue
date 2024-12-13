<template>
  <div class="view view--releases">
    <section class="section pt-9">
      <div class="dark-orange-shape"></div>
      <div class="container position-relative pt-7">
        <page-nav
          class="mb-7"
          :data="menu"
          color="light">
        </page-nav>

        <div v-if="benefits.data.length && !loading">
          <div class="mt-5">
            <div
              v-for="benefit in benefits.data"
              :key="benefit.id"
              class="mb-5 last">
              <post-card
                :data="benefit"
                icon="volunteer_activism"
                :url="`/beneficios/${benefit.slug}`"
                theme="dark-orange">
              </post-card>
            </div>
          </div>

          <div class="mt-7">
            <infinite-button
              :class="{ 'button--finish' : pagination.finish }"
              @handle-infinite="getMoreNews"
              :disabled="pagination.finish"
              :label="pagination.finish ? 'No hay más beneficios' : 'Cargar más'"
              :loading="loading"
              theme="dark-orange">
            </infinite-button>
          </div>
        </div>

        <div
          v-else-if="!benefits.data.length && !loading"
          class="empty text-center px-4 pb-6 pt-10">
          <i class="material-icons text-danger mb-4 pt-5">error</i>
          <h3 class="title title--s text-danger">
            No hay beneficios publicados
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
import { getOtherBenefits } from '@/services/benefits';

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
          label: 'Beneficios institucionales',
          url: '/beneficios',
        }, {
          label: 'Otros beneficios',
          url: '/otros-beneficios',
        },
      ],
      benefits: {
        data: [],
      },
      pagination: {
        finish: false,
        page: 1,
      },
    };
  },
  created() {
    this.$store.commit('set_title', 'Otros beneficios');
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
      this.pagination.finish = !data.benefits.next_page_url;
      return data;
    },

    populateData(data) {
      const benefits = data.benefits.data;

      this.benefits.data = this.pagination.page === 1 ? benefits : this.benefits.data.concat(benefits);

      return data;
    },

    getMoreNews() {
      this.pagination.page += 1;
      this.getItems();
    },

    async getApiData(params = {}) {
      const response = await getOtherBenefits(params);

      return response.data.data;
    },
  },
};
</script>
