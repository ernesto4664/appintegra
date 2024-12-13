<template>
  <header
    class="heading"
    :class="[ !!color ? `heading--${color}` : '' ]">
    <p class="heading__label" v-if="data.label">{{ data.label }}</p>

    <h1
      v-if="data.level === 'h1'"
      class="title title--l">
      {{ data.title }}
    </h1>
    <h2
      v-else
      class="title title--s"
      :class="{ 'mx-auto' : !data.url && !data.label }">
      {{ data.title }}
    </h2>

    <div v-if="data.url">
      <normal-button
        class="button--icon button--circle"
        icon="arrow_forward"
        :theme="theme"
        :url="data.url">
      </normal-button>
    </div>
  </header>
</template>

<script>
import NormalButton from '@/components/NormalButton.vue';

export default {
  name: 'heading',
  components: {
    NormalButton,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    theme: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
  },
};
</script>
