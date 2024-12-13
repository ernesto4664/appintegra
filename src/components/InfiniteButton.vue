<template>
  <button
    class="button button--primary button--more w-100"
    :class="[ { 'button--loading' : loading }, `button--${theme || 'blue'}` ]"
    :disabled="disabled || loading"
    @click="$emit('handle-infinite')"
    :type="type">
    <span class="button__text">{{ label }}</span>
    <i class="button__icon material-icons" v-text="loading ? 'refresh' : icon"></i>
  </button>
</template>

<script>
export default {
  name: 'infinite-button',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: 'add',
    },
    label: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'button',
    },
  },
};
</script>
