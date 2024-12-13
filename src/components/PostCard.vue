<template>
  <article
    class="post-card"
    :class="[ !!data.icon || icon ? 'post-card--icon' : 'post-card--image', `post-card--${theme}` ]">
    <transition appear name="fade">
      <div
        v-if="loading"
        class="post-card post-card--loading">
      </div>
      <router-link
        v-if="data.id || data.icon"
        :to="customUrl"
        :disabled="!customUrl">
        <div
          v-if="data.icon || icon"
          class="post-card__icon">
          <i v-if="icon !== 'integrito'" class="material-icons">{{ data.icon ? data.icon : icon }}</i>
          <img v-else class="material-icons" src="../assets/images/integra-beneficios.svg"/>
        </div>

        <div
          v-if="data.img && !icon"
          class="post-card__image">
          <img :src="data.img.src" :alt="data.img.alt">
        </div>

        <div class="post-card__content">
          <div>
            <date
              v-if="data.date"
              class="post-card__date"
              :date="data.date">
            </date>
            <p
              v-if="data.label"
              class="post-card__date date">
              <span class="date__text">{{ data.label }}</span>
            </p>
            <h3 class="post-card__title">{{ data.title }}</h3>
            <div class="post-card__button">
              <normal-button
                class="button--icon"
                icon="arrow_forward"
                :theme="theme"
                :url="customUrl">
              </normal-button>
            </div>
          </div>
        </div>
      </router-link>
    </transition>
  </article>
</template>

<script>
import Date from '@/components/Date.vue';
import NormalButton from '@/components/NormalButton.vue';

export default {
  name: 'post-card',
  components: {
    Date,
    NormalButton,
  },
  props: {
    data: {
      type: [Boolean, Object],
      default: false,
    },
    icon: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      default: 'default',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    customUrl() {
      return (this.url || this.data.url) || '';
    },
  },

};
</script>

<style>
</style>
