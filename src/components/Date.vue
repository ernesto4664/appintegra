<template>
  <p v-if="date" class="date">
    <i class="date__icon material-icons">access_time</i>
    <span class="date__text">{{ date }}</span>
  </p>
</template>

<script>
export default {
  name: 'date',
  props: {
    date: {
      type: String,
      required: true,
    },
  },
};
</script>
