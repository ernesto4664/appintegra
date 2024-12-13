<template>
  <div class="signup-data signup-data--review">
    <div class="pt-8 pb-7 container">
      <div class="box">
        <div class="text-center">
          <p class="title title--xl my-2">¡Hola {{ user.name }}!</p>
          <p class="title title--s">Datos de trabajo registrados</p>
        </div>

        <div class="progress-line mt-7 mb-6">
          <div class="progress-line__item progress-line__item--active"></div>
          <div class="progress-line__item"></div>
        </div>

        <div class="signup-data__separator mb-5">
          <ul class="m-0 p-0">
            <li
              v-for="data in reviewData"
              class="user-data"
              :key="data.key">
              <i class="user-data__icon material-icons">{{ data.icon }}</i>
              <p class="user-data__label">
                <span class="d-block text-primary">{{ data.label }}:</span>
                <span class="text-uppercase">{{ userDataValue(data) }}</span>
              </p>
            </li>
          </ul>
        </div>

        <div class="text">
          <p>{{ helpText }}</p>
        </div>

        <div class="mt-7">
          <infinite-button
            :class="{ 'button--finish' : loading }"
            :disabled="loading"
            :label="!loading ? 'Continuar' : 'Cargando...'"
            :loading="loading"
            icon="arrow_forward"
            @handle-infinite="nextStep" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import InfiniteButton from '@/components/InfiniteButton.vue';

export default {
  name: 'signup-data-review',
  components: {
    InfiniteButton,
  },
  data() {
    return {
      loading: false,
      helpText: 'Para actualizar tus datos contáctate a Mesa de Ayuda teléfono 228 794 499 o al correo mayuda@integra.cl.',
      reviewData: [
        {
          key: 'address',
          icon: 'place',
          label: 'Ubicación',
        }, {
          key: 'position',
          icon: 'card_travel',
          label: 'Cargo',
        }, {
          key: 'tipest',
          icon: 'business',
          label: 'Dependencia',
        }, {
          key: 'email',
          icon: 'mail_outline',
          label: 'Correo institucional',
        },
      ],
    };
  },
  mounted() {
    if (this.$store.state.user.full_register) {
      this.$router.push({ name: 'home' });
    }
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    nextStep() {
      this.$router.push('/registrarse/completar-datos');
    },

    userDataValue(data) {
      if (data.key === 'tipest') {
        switch (this.user[data.key]) {
          case 'C':
            return 'Casa Central';
          case 'R':
            return 'Oficina Regional';
          case 'E':
            return 'Establecimientos';
          default:
            return '';
        }
      }

      return this.user[data.key];
    },
  },
};
</script>

<style>

</style>
