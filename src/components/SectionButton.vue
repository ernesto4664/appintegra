<template>
  <transition appear name="fade">
    <div>
      <div
        v-if="loading"
        class="button button--section button--section-loading">
        <span class="button__text">
          Cargando...
        </span>
      </div>
      <router-link
        v-if="data.slug || data.title"
        class="button button--section"
        :class="!isHexColor ? `button--${data.class}` : null"
        :style="isHexColor ? { backgroundColor: data.class } : null"
        :to="`/${data.slug}`"
      >
        <i v-if="data.icon" class="button__icon material-icons">
          {{ data.icon }}
        </i>
        <span v-if="data.title" class="button__text">
          {{ data.title }}
        </span>
        <span v-if="data.label" class="button__label">
          {{ data.label }}
        </span>
      </router-link>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'section-button',
  props: {
    data: {
      type: [Boolean, Object],
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isHexColor() {
      // return /^#[0-9A-F]{6}$/i.test(this.data.class);
      return /^#([0-9A-F]{3}){1,2}$/i.test(this.data.class);
    },
  },
};
</script>

<style>

</style>
