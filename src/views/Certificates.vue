<template>
  <div class="view view--certificates">
    <section class="section pt-header">
      <div class="container position-relative pt-7">
        <div>
          <div v-if="data.length">
            <div
            v-for="button in data"
            :key="button.slug"
            class="mb-5 last">
              <section-button
                class="button--left"
                :data="button" />
            </div>
          </div>
          <div
          v-else-if="!data.data.length && !loading"
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
      </div>
    </section>
  </div>
</template>

<script>
import SectionButton from '@/components/SectionButton.vue';
import { getHome } from '@/services/home';
import PostCard from '@/components/PostCard.vue';

export default {
  name: 'certificates',
  components: {
    SectionButton,
    PostCard,
  },
  data() {
    return {
      defaultLoadingItems: 5,
      loading: false,
      data: [],
    };
  },
  created() {
    this.$store.commit('set_title', 'Certificados');
  },
  mounted() {
    this.loading = true;
    this.getCertificates()
      .then((data) => {
        this.data = data.data.button.data;
      })
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    async getCertificates() {
      const response = await getHome();

      return response.data;
    },
  },
};
</script>
