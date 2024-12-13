<template>
  <div class="view view--general-terms">
    <section class="section py-6">
      <div class="container">
        <div class="terms terms--general">
          <div class="pl-5 pr-6 py-7">
            <h3 class="title">
              <i class="material-icons">{{ data.heading.icon }}</i>
              {{ data.heading.title }}
            </h3>

            <div class="text mt-6">
              <ol class="terms__list">
                <li
                  class="terms__item"
                  v-for="(item, index) in data.terms"
                  :key="index">
                  <p>{{ item.name }}</p>
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div class="text-center mt-6">
          <button
            class="button button--primary button--white button--columns w-100"
            @click="handleAcceptTerms()">
            <span class="button__text">Sí, acepto los términos y condiciones</span>
            <i class="button__icon material-icons text-primary">arrow_forward</i>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import swal from 'sweetalert';

import {
  getUserLegal,
  acceptUserLegal,
} from '@/services/legal';

export default {
  name: 'salaty-terms',
  data() {
    return {
      loading: false,
      data: {
        heading: {
          icon: 'format_list_bulleted',
          title: 'Términos y condiciones',
        },
        terms: [],
      },
    };
  },
  created() {
    this.$store.commit('set_layout', 'auth-layout');
  },
  mounted() {
    this.getTerms();

    if (this.$store.state.user.is_termn_home && this.$store.state.user.full_register) {
      this.$router.push({ name: 'home' });
    }

    if (this.$store.state.user.rut === '186645863') { // Si usuario tiene este RUT, se salta los términos legales.
      this.handleSuccess();
    }
  },
  methods: {
    getTerms() {
      this.loading = true;

      this.getTermsData()
        .then((data) => {
          this.data.terms = data.name;
        })
        .catch(error => error)
        .then(() => {
          this.loading = false;
        });
    },
    handleAcceptTerms() {
      this.loading = true;

      this.acceptTerms()
        .then((resp) => {
          const data = {
            user: resp,
          };

          this.$store.commit('auth_complete', data);

          swal({
            icon: 'success',
            title: 'Has aceptado los términos y condiciones y políticas de privacidad',
            button: 'Ir a la aplicación',
          })
            .then(() => {
              this.handleSuccess();
            });
        })
        .catch(() => {
          this.$toasted.show('Ha ocurrido un problema mientras intentabamos procesar tu solicitud, por favor intentalo nuevamente.', {
            theme: 'outline',
            position: 'bottom-center',
            duration: 7000,
          });
        })
        .then(() => {
          this.loading = false;
        });
    },
    handleSuccess() {
      if (this.$store.state.user.is_public) {
        this.$router.push({ name: 'onboarding' });
        return;
      }

      if (this.$route.query.register) {
        this.$router.push({ name: 'signup-data-review' });
        return;
      }

      this.$store.commit('set_layout', 'app-layout');
      this.$router.push('/');
    },
    async getTermsData() {
      const response = await getUserLegal();

      return response.data.data;
    },
    async acceptTerms() {
      const response = await acceptUserLegal();

      return response.data.data;
    },
  },
};
</script>
