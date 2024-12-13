<template>
  <div id="app">
    <component :is="layout"></component>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AuthLayout from '@/layouts/Auth.vue';
import AppLayout from '@/layouts/App.vue';

export default {
  name: 'app',
  components: {
    AuthLayout,
    AppLayout,
  },
  computed: mapState(['layout']),
};
</script>

<style>
#app {
  overflow: hidden;
}
</style>
