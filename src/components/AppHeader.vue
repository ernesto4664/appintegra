<template>
  <header class="header">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-3">
          <button
            v-if="(user.is_parent) || title"
            class="header__back button"
            @click="handleBackButton">
            <i class="button__icon material-icons">arrow_back</i>
            <span class="button__text">Volver</span>
          </button>
          <figure v-else class="header__hello">
            <img
              class="header__logo img-fluid"
              :src="logo.src"
              :alt="logo.alt">
            <figcaption
              v-if="user.is_parent && $route.name === 'home'"
              class="header__title title">
              ¡Hola!
            </figcaption>
          </figure>
        </div>
        <div class="col-6">
          <p class="header__title title font-weight-bold" v-if="title">{{ title }}</p>
          <p class="header__title title" v-else>¡Hola<span v-if="user.name">, {{ user.name }}</span>!</p>
        </div>
        <div
          v-if="title && $route.meta.api && $route.meta.api !== 'survey'"
          :class="[ title ? 'col-3' : 'col-2' ]">
          <div class="header__font-size">
            <button
              class="button button--font button--font-big"
              @click="changeFontSize(fontSize > 2.49 ? null : 0.25)">
              <span class="button__text">+A</span>
            </button>
            <button
              class="button button--font button--font-small ml-2"
              @click="changeFontSize(fontSize < 0.51 ? null : -0.25)">
              <span class="button__text">-A</span>
            </button>
          </div>
        </div>
        <!-- <div
          v-if="user.is_parent && $route.name === 'home'"
          class="col-3">
          <router-link
            class="header__logout button"
            to="/ingresar"
          >
            <i class="button__icon material-icons">arrow_back</i>
            <span class="button__text">Volver</span>
          </router-link>
        </div>

        <div :class="[
          user.is_parent && $route.name === 'home' ? 'col-6 d-flex justify-content-center' : title ? 'col-3' : 'col-2'
        ]">
          <button
            v-if="title"
            class="header__back button"
            @click="$router.go(-1)">
            <i class="button__icon material-icons">arrow_back</i>
            <span class="button__text">Volver</span>
          </button>
          <figure v-else class="header__hello">
            <img
              class="header__logo img-fluid"
              :src="logo.src"
              :alt="logo.alt">
            <figcaption
              v-if="user.is_parent && $route.name === 'home'"
              class="header__title title">
              ¡Hola!
            </figcaption>
          </figure>
        </div>

        <div v-if="!user.is_parent || $route.name !== 'home'" :class="[ title ? 'col-6' : 'col-8' ]">
          <p class="header__title title font-weight-bold" v-if="title">{{ title }}</p>
          <p class="header__title title" v-else>¡Hola<span v-if="user.name">, {{ user.name }}</span>!</p>
        </div>

        <div
          v-if="title && $route.meta.api"
          :class="[ title ? 'col-3' : 'col-2' ]">
          <div class="header__font-size">
            <button
              class="button button--font button--font-big"
              @click="changeFontSize(fontSize > 2.49 ? null : 0.25)">
              <span class="button__text">+A</span>
            </button>
            <button
              class="button button--font button--font-small ml-2"
              @click="changeFontSize(fontSize < 0.51 ? null : -0.25)">
              <span class="button__text">-A</span>
            </button>
          </div>
        </div> -->
      </div>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'app-header',
  data() {
    return {
      logo: {
        src: require('../assets/images/integra-isotipo.svg'), // eslint-disable-line global-require
        alt: '',
      },
    };
  },
  computed: {
    ...mapState(['title', 'user', 'fontSize']),
  },
  methods: {
    changeFontSize(size) {
      this.$store.commit('font_size', size);
    },
    handleBackButton() {
      if (this.user.is_parent && this.$route.name === 'home') {
        return this.$router.push({ name: 'login' });
      }

      if (this.$route.name === 'survey') {
        return this.$router.push({ name: 'home' });
      }

      return this.$router.go(-1);
    },
  },
};
</script>
