<template>
  <div class="banner-alert">
    <button v-if="closable" class="banner-alert__close button button--icon" @click="$emit('close')">
      <i class="button__icon material-icons">close</i>
    </button>
    <p class="title title--m text-white">{{ text }}</p>
    <router-link
      v-if="button"
      :to="button.to"
      class="banner-alert__button button button--primary button--white button--small mt-4">
      <span class="button__text">{{ button.label }}</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'BannerAlert',
  props: {
    button: {
      type: Object,
      default: null,
    },
    closable: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: null,
    },
  },
};
</script>
