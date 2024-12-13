<template>
  <router-link
    v-if="customUrl"
    class="button"
    :class="[ `button--${customClass}` ]"
    :to="customUrl">
    <i
      v-if="customIcon"
      class="button__icon material-icons">
      {{ customIcon }}
    </i>
    <span
      v-if="customLabel"
      class="button__text">
      {{ customLabel }}
    </span>
  </router-link>
</template>

<script>
export default {
  name: 'normal-button',
  props: {
    button: {
      type: [Object, String],
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      default: '',
    },
  },
  computed: {
    customUrl() {
      return this.button.url || this.url;
    },
    customIcon() {
      return this.button.icon || this.icon;
    },
    customLabel() {
      return this.button.title || this.title;
    },
    customClass() {
      return this.button.class || this.theme || 'blue';
    },
  },
};
</script>
