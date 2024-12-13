<template>
  <div class="view view--salary-settlements">
    <section class="section pt-header">
      <div class="pdf-single pdf-single--certificate container position-relative pt-7">
        <div v-if="!loading">
          <div v-if="pdfFile">
            <div class="pdf-single__info mb-6">
              <i class="material-icons">info</i>
              <p>Acabamos de enviar tu certificado de sueldo a tu correo corporativo y personal</p>
            </div>

            <div class="pdf-single__bar mb-6">
              <button
                class="pdf-single__button button"
                @click="openPdf">
                <i class="button__icon material-icons">file_download</i>
                <span class="button__text">Descarga certificado</span>
              </button>
              <button
                class="pdf-single__button button"
                @click="openEmail = !openEmail">
                <i class="button__icon material-icons">email</i>
                <span class="button__text">Enviar por correo</span>
              </button>
            </div>

            <div
              v-show="openEmail"
              class="pdf-single__email mb-6">
              <ValidationObserver v-slot="{ handleSubmit }" tag="div">
                <form class="form" @submit.prevent="handleSubmit()" ref="form" novalidate>
                  <fieldset class="form__item">
                    <div class="form__fields">
                      <ValidationProvider
                        class="form-group"
                        name="correo"
                        rules="required|email|max:100"
                        v-slot="{ classes, errors }"
                        tag="div">
                        <label
                          class="form-label sr-only"
                          for="email">
                          <i class="material-icons">mail_outline</i>
                          Correo al que desea enviar:
                        </label>
                        <div :class="['form-editing', classes]">
                          <input
                            type="email"
                            id="email"
                            :class="['form-control', classes]"
                            name="email"
                            placeholder="Ingrese el correo"
                            v-model="email">
                          <div class="text-center">
                            <button
                              class="button button--icon button--circle button--blue m-0"
                              :class="{ 'button--loading' : loadingIcon }"
                              :disabled="loadingIcon || !!errors.length"
                              type="button"
                              @click="showCertificate(true)">
                              <i class="button__icon material-icons m-0">
                                {{ loadingIcon ? 'refresh' : 'send' }}
                              </i>
                            </button>
                            <span class="form-editing__label text-uppercase text-primary">
                              Enviar
                            </span>
                          </div>
                        </div>
                        <small
                          v-if="errors.length"
                          class="form-helper">
                          <i class="material-icons">info</i> {{ errors[0] }}
                        </small>
                      </ValidationProvider>
                    </div>
                  </fieldset>
                </form>
              </ValidationObserver>
            </div>

            <div class="pdf-single__viewer">
              <iframe
                :src="`https://docs.google.com/viewer?&embedded=true&url=${pdfFile}`"
                scrolling="no"
                frameborder="0">
              </iframe>
              <div
                style="
                  width: 80px;
                  height: 80px;
                  position: absolute;
                  opacity: 0;
                  right: 0px;
                  top: 0px;
                ">
                &nbsp;
              </div>
            </div>
          </div>
          <div
            v-else
            class="empty text-center px-4 py-6">
            <i class="material-icons text-danger mb-4">error</i>
            <h3 class="title title--s">
              Certificado no disponible
            </h3>
          </div>
        </div>
        <div v-else>
          <div class="integrito-loading">
            <img
              class="img-fluid"
              :src="require('../assets/images/integra-isotipo.svg')"
              alt="Integrito">
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { getCertificate } from '@/services/certificate';

export default {
  name: 'salary',
  data() {
    return {
      loading: false,
      loadingIcon: false,
      params: null,
      pdfFile: '',
      openEmail: false,
      email: '',
    };
  },
  created() {
    this.$store.commit('set_title', 'Certificado');
    this.params = this.$route.query;
  },
  mounted() {
    this.showCertificate();

    if (window.cordova) {
      window.open = window.cordova.InAppBrowser.open;
    }
  },
  methods: {
    showCertificate(email) {
      if (!email) {
        this.loading = true;
      } else {
        this.loadingIcon = true;
      }

      // eslint-disable-next-line prefer-destructuring
      const params = this.params;

      params.email = this.email;

      this.getCertificateData(params)
        .then((data) => {
          if (!email) {
            if (data.title) {
              this.$store.commit('set_title', `Certificado de ${data.title}`);
            }
            this.pdfFile = data.file;
          } else {
            this.$toasted.show(`Hemos enviado el certificado al correo: ${this.email}`, {
              theme: 'outline',
              position: 'bottom-center',
              duration: 7000,
              className: 'success',
            });
            this.email = '';
            this.openEmail = false;
          }
        })
        .catch(() => {
          if (email) {
            this.$toasted.show('Lo sentimos, no hemos podido mandar el certificado al correo.', {
              theme: 'outline',
              position: 'bottom-center',
              duration: 7000,
            });
          }
        })
        .then(() => {
          if (!email) {
            this.loading = false;
          } else {
            this.loadingIcon = false;
          }
        });
    },
    openPdf() {
      window.open(this.pdfFile, '_system');
      return false;
    },
    async getCertificateData(params) {
      const response = await getCertificate(params);

      return response.data;
    },
  },
};
</script>
