<template>
  <div class="view view--salary-settlements">
    <section class="section pt-header">
      <div class="container position-relative pt-7">
        <div v-if="data.length">
          <div
            v-for="item in data"
            :key="item.id"
            class="mb-5 last">
            <post-card
              class="post-card--salary"
              :data="item"
              theme="orange"
              @click.native="goToSalarySettlement(item.period, 2)">
            </post-card>
          </div>
        </div>
        <div v-else>
          <div>
            <div
              v-for="(item, index) in defaultLoadingItems"
              :key="index"
              class="mb-5 last">
              <post-card
                :loading="true">
              </post-card>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { getSalarySettlementByPeriod } from '@/services/salary';

import PostCard from '@/components/PostCard.vue';

export default {
  name: 'salary-settlements',
  components: {
    PostCard,
  },
  data() {
    return {
      data: [],
      defaultLoadingItems: 3,
      loading: false,
      params: {
        type: 3,
      },
    };
  },
  created() {
    this.$store.commit('set_title', '3 Últimas Liquidaciones');
  },
  mounted() {
    if (!this.$store.state.user.is_termn_service) {
      this.$router.push({ name: 'salary-terms' });
    }

    this.getSalarySettlements();
  },
  methods: {
    getSalarySettlements() {
      this.loading = true;

      this.getSalarySettlementsData(this.params)
        .then((data) => {
          this.data = this.data.concat(data);
        })
        .catch(() => {
          this.$toasted.show('No hemos podido obtener tus últimas liquidaciones.', {
            theme: 'outline',
            position: 'bottom-center',
            duration: 7000,
          });
        })
        .then(() => {
          this.loading = false;
        });
    },
    goToSalarySettlement(period, type) {
      this.$router.push({
        path: '/liquidaciones-de-sueldo/liquidacion',
        query: {
          period,
          type,
        },
      });
    },
    async getSalarySettlementsData(params) {
      const response = await getSalarySettlementByPeriod(params);

      return response.data.data;
    },
  },
};
</script>
