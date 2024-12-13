<template>
  <div class="app">
    <app-header />
    <div>
      <vue-page-transition name="fade-in-up">
        <router-view />
      </vue-page-transition>
    </div>
    <app-bar />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import AppHeader from '@/components/AppHeader.vue';
import AppBar from '@/components/AppBar.vue';

export default {
  name: 'app',
  components: {
    AppHeader,
    AppBar,
  },
  mounted() {
    this.getNotifies();
  },
  computed: {
    ...mapState(['user', 'notifications']),
  },
  methods: {
    getNotifies() {
      this.loading = true;

      if (this.user.is_public) return;

      this.$store.dispatch('notifications', {})
        .then(() => {
          this.loading = false;
        });
    },
    updateNotifies() {
      this.getNotifies();
    },
  },
};
</script>
