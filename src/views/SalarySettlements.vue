<template>
  <div class="view view--salary-settlements">
    <section class="section pt-header">
      <div class="container position-relative pt-7">
        <div>
          <div class="mb-5 last">
            <button
              class="button button--section button--orange button--left"
              @click="getLastSettlement">
              <i class="button__icon material-icons">monetization_on</i>
              <span class="button__text">Liquidación vigente</span>
              <span v-if="data" class="button__label text-capitalize">
                {{ data.current_date }}
              </span>
            </button>
          </div>

          <div class="mb-5 last">
            <button
              class="button button--section button--orange button--left"
              @click="getLatestSettlements">
              <i class="button__icon material-icons">monetization_on</i>
              <span class="button__text">3 últimas liquidaciones</span>
              <span v-if="data" class="button__label text-capitalize">
                {{ data.latest_settlements.from }} - {{ data.latest_settlements.up }}
              </span>
            </button>
          </div>

          <div class="mb-5 last">
            <button
              class="button button--section button--orange button--left"
              @click="$bvModal.show('bv-modal-example')">
              <i class="button__icon material-icons">monetization_on</i>
              <span class="button__text">Selecciona otras liquidaciones</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <b-modal id="bv-modal-example" centered hide-footer>
      <template v-slot:modal-title>
        ¿Qué liquidación estás buscando?
      </template>
      <div>
        <p>Seleccionar el mes y año que estás buscando:</p>
        <hr>
        <ValidationObserver v-slot="{ handleSubmit }" tag="div">
          <form
            class="form"
            @submit.prevent="handleSubmit(getSpecificSettlement)"
            ref="form"
            novalidate>
            <fieldset class="form__item">
              <div class="form__fields">
                <ValidationProvider
                  class="form-group"
                  name="mes"
                  rules="required"
                  v-slot="{ classes, errors }"
                  tag="div">
                  <label
                    class="form-label"
                    for="month">
                    Mes
                  </label>
                  <div :class="['form-wrapper', classes]">
                    <i class="form-icon material-icons text-primary">date_range</i>
                    <div class="form-select">
                      <select
                        id="month"
                        :class="['form-control', classes]"
                        name="month"
                        v-model="month">
                        <option value="">Selecciona mes</option>
                        <option value="01">Enero</option>
                        <option value="02">Febrero</option>
                        <option value="03">Marzo</option>
                        <option value="04">Abril</option>
                        <option value="05">Mayo</option>
                        <option value="06">Junio</option>
                        <option value="07">Julio</option>
                        <option value="08">Agosto</option>
                        <option value="09">Septiembre</option>
                        <option value="10">Octubre</option>
                        <option value="11">Noviembre</option>
                        <option value="12">Diciembre</option>
                      </select>
                    </div>
                  </div>
                  <small
                    v-if="errors.length"
                    class="form-helper">
                    <i class="material-icons">info</i> {{ errors[0] }}
                  </small>
                </ValidationProvider>
                <ValidationProvider
                  class="form-group"
                  name="año"
                  rules="required"
                  v-slot="{ classes, errors }"
                  tag="div">
                  <label
                    class="form-label"
                    for="year">
                    Año
                  </label>
                  <div :class="['form-wrapper', classes]">
                    <i class="form-icon material-icons text-primary">date_range</i>
                    <div class="form-select">
                      <select
                        id="year"
                        :class="['form-control', classes]"
                        name="year"
                        v-model="year">
                        <option value="">Selecciona año</option>
                        <option
                          v-for="year in yearsSelect"
                          :key="year"
                          :value="year">{{ year }}</option>
                      </select>
                    </div>
                  </div>
                  <small
                    v-if="errors.length"
                    class="form-helper">
                    <i class="material-icons">info</i> {{ errors[0] }}
                  </small>
                </ValidationProvider>
              </div>

              <div class="form__submit">
                <infinite-button
                  :class="{ 'button--finish' : loading }"
                  :disabled="loading"
                  :label="!loading ? 'Ver liquidación' : 'Generando liquidación...'"
                  :loading="loading"
                  icon="arrow_forward"
                  type="submit" />
              </div>
            </fieldset>
          </form>
        </ValidationObserver>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { getSalaryMonths } from '@/services/salary';

import InfiniteButton from '@/components/InfiniteButton.vue';

export default {
  name: 'salary-settlements',
  components: {
    InfiniteButton,
  },
  data() {
    return {
      loading: false,
      data: null,
      month: '',
      year: '',
    };
  },
  created() {
    this.$store.commit('set_title', 'Liquidaciones de Sueldo');
  },
  mounted() {
    if (!this.$store.state.user.is_termn_service) {
      this.$router.push({ name: 'salary-terms' });
    }

    this.getMonths();
  },
  computed: {
    yearsSelect() {
      const years = [];
      const startYear = 2018;
      const currentYear = new Date().getFullYear();

      for (let i = currentYear; i >= startYear; i -= 1) {
        years.push(i);
      }

      return years;
    },
  },
  methods: {
    getMonths() {
      this.loading = true;

      this.getSalaryMonthsData()
        .then((data) => {
          this.data = data;
        })
        .catch(() => {
          this.$toasted.show('Ha ocurrido un problema mientras intentabamos obtener la información.', {
            theme: 'outline',
            position: 'bottom-center',
            duration: 7000,
          });
        })
        .then(() => {
          this.loading = false;
        });
    },
    getLastSettlement() {
      this.$router.push({
        path: 'liquidaciones-de-sueldo/liquidacion',
        query: {
          type: 1,
        },
      });
    },
    getLatestSettlements() {
      this.$router.push({
        path: 'liquidaciones-de-sueldo/ultimas',
      });
    },
    getSpecificSettlement() {
      this.$router.push({
        path: 'liquidaciones-de-sueldo/liquidacion',
        query: {
          period: this.year + this.month,
          type: 2,
        },
      });
    },
    async getSalaryMonthsData(params) {
      const response = await getSalaryMonths(params);

      return response.data;
    },
  },
};
</script>
