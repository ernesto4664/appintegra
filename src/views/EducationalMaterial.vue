<template>
  <div class="view view--material">
    <section class="section pt-9">
      <background-shape color="#F5D445" />
      <div class="container position-relative pt-7">
        <heading :data="heading" color="light"></heading>

        <div class="parents-sections mt-7">
          <div v-if="loading">
            <div
              v-for="(item, index) in defaultLoadingItems"
              :key="index"
              class="mb-5 last">
              <section-button :loading="true" />
            </div>
          </div>
          <div v-else>
            <div v-if="categories.length">
              <div v-for="category in categories" :key="category.id" class="mb-5 last">
                <section-button :data="{
                  class: `button--big button--${category.color}`,
                  slug: `material-educativo/categorias/${category.slug}?name=${category.name}&color=${category.color}`,
                  icon: category.icon,
                  title: category.name,
                }" />
              </div>
            </div>
            <div
              v-else
              class="empty text-center px-5">
              <i class="material-icons text-white mb-3">error</i>
              <h3 class="title title--s text-white">
                No hay material educativo publicado
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { getMaterialsCategories } from '@/services/material';

import Heading from '@/components/Heading.vue';
import SectionButton from '@/components/SectionButton.vue';
import BackgroundShape from '@/components/BackgroundShape.vue';

export default {
  name: 'educational-material',
  components: {
    Heading,
    SectionButton,
    BackgroundShape,
  },
  data() {
    return {
      defaultLoadingItems: 3,
      loading: false,
      heading: {
        label: 'Estás viendo',
        title: 'Material Educativo',
      },
      categories: [],
      params: {},
    };
  },
  created() {
    this.$store.commit('set_title', 'Material Educativo');
  },
  mounted() {
    this.getMaterialCategories();
  },
  computed: {},
  methods: {
    getMaterialCategories() {
      this.loading = true;

      this.getMaterialCategoriesFromApi(this.params)
        .then((categories) => {
          this.categories = categories;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async getMaterialCategoriesFromApi(params) {
      const response = await getMaterialsCategories(params);

      return response.data.data.categories;
    },
  },
};
</script>
