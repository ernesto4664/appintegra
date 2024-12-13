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
                :url="`/comunicados/${release.slug}`"
                theme="red">
              </post-card>
            </div>
          </div>

          <div class="mt-7">
            <infinite-button
              :class="{ 'button--finish' : pagination.finish }"
              @handle-infinite="getMoreNews"
              :disabled="pagination.finish"
              :label="pagination.finish ? 'No hay más comunicados' : 'Cargar más'"
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
            No hay comunicados publicados
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
import { getPaginatedReleases } from '@/services/releases';

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
      defaultLoadingItems: 50,
      menu: [
        {
          label: 'Comunicados',
          url: '/comunicados',
        },
        {
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
    this.$store.commit('set_title', 'Comunicados');
  },
  mounted() {
    this.getItems();
    this.getAllReleases();
  },
  methods: {
    getItems() {
      if (this.pagination.finish) return;

      this.loading = true;

      this.getApiData(this.pagination)
        .then(this.checkNextPage)
        .then(this.populateData)
        .finally(() => {
          this.loading = false;
        });
    },

    checkNextPage(data) {
      this.pagination.finish = !data.posts.next_page_url;
      return data;
    },

    populateData(data) {
      const releases = data.posts.data;

      // Actualizar los datos dependiendo de la página actual
      this.releases.data = this.pagination.page === 1
        ? releases
        : this.releases.data.concat(releases);

      // Ordenar por fecha (datetime) de más reciente a más antigua
      this.releases.data.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

      return data;
    },

    getMoreNews() {
      this.pagination.page += 1;
      this.getItems();
    },

    async getApiData(params = { finish: false, page: 1 }) {
      const response = await getPaginatedReleases(params);
      console.log('API response:', response);
      return response.data.data;
    },

    async getAllReleases() {
      const allReleases = []; // Array para almacenar todos los registros
      const currentPage = 1; // Página inicial
      let totalPages = null; // Total de páginas, inicializado como null

      this.loading = true; // Muestra el estado de carga

      try {
        // Obtén la primera página para determinar el total de páginas
        const firstResponse = await getPaginatedReleases({ page: currentPage });
        const { posts: initialPosts } = firstResponse.data.data;

        allReleases.push(...initialPosts.data);
        totalPages = initialPosts.last_page;

        // Crea un array de promesas para las páginas restantes
        const requests = [];
        for (let page = 2; page <= totalPages; page += 1) {
          requests.push(getPaginatedReleases({ page }));
        }

        // Ejecuta todas las solicitudes en paralelo
        const responses = await Promise.all(requests);

        // Combina los datos de las respuestas
        responses.forEach((response) => {
          const { posts: pagePosts } = response.data.data;
          allReleases.push(...pagePosts.data);
        });

        // Asigna los registros a la lista final de comunicados
        this.releases.data = allReleases;

        console.log('Todos los registros cargados:', allReleases);
      } catch (error) {
        console.error('Error al cargar los registros:', error);
      } finally {
        this.loading = false; // Oculta el estado de carga
      }
    },
  },
};
</script>
