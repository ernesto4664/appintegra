<template>
  <div class="view view--terms">
    <section class="section pt-0">
      <header class="background-purple pt-header text-center">
        <div class="container pt-5 pb-6">
          <heading :data="heading" color="light"></heading>
        </div>
      </header>

      <div class="terms">
        <div class="container pt-6">
          <div class="text-center">
            <p>
              Para generar un certificado con otra razón, debes realizar el proceso por separado
            </p>
          </div>

          <hr class="mb-7 mt-6">

          <div class="mt-6">
            <div
              class="reason-bullet mb-5 last"
              :class="{ 'reason-bullet--selected' : selectedReason === reason.code }"
              v-for="reason in reasons"
              :key="reason.code"
              @click="selectedReason = reason.code">
              <span class="reason-bullet__circle" />
              <span class="reason-bullet__label">{{ reason.label }}</span>
            </div>
          </div>

          <div class="text-center mt-7">
            <button
              class="button button--primary button--purple"
              :disabled="!selectedReason"
              @click="setReason()">
              <span class="button__text">Generar certificado</span>
              <i class="button__icon material-icons">arrow_forward</i>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Heading from '@/components/Heading.vue';

export default {
  name: 'configure-certificate',
  components: {
    Heading,
  },
  data() {
    return {
      loading: false,
      heading: {
        title: 'Selecciona una razón para obtener tu certificado',
      },
      reasons: [
        {
          code: 1,
          label: 'Fines que Estime Conveniente',
        }, {
          code: 2,
          label: 'Caja de Compensación y Asignación Familiar',
        }, {
          code: 3,
          label: 'Sistema Financiero',
        }, {
          code: 4,
          label: 'Cobrar Asignación Familiar',
        }, {
          code: 5,
          label: 'Educación Superior',
        },
      ],
      selectedReason: '',
    };
  },
  created() {
    this.$store.commit('set_title', 'Configura tu Certificado');
  },
  methods: {
    setReason() {
      this.$router.push({
        path: '/certificados/certificado',
        query: {
          type: this.$route.query.type,
          action: this.selectedReason,
        },
      });
    },
  },
};
</script>
