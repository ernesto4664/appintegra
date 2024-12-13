<template>
  <div class="switch-button-control">
    <div
      class="switch-button"
      :class="{ enabled: isEnabled }"
      :style="{'--color': color}"
      @click="toggle">
      <div class="button"></div>
    </div>
    <div class="switch-button-label">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'isEnabled',
    event: 'toggle',
  },
  props: {
    isEnabled: Boolean,
    color: {
      type: String,
      required: false,
      default: '#4D4D4D',
    },
  },
  methods: {
    toggle() {
      this.$emit('toggle', !this.isEnabled);
    },
  },
};
</script>
