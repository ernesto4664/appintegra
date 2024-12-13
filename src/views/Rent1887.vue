<template>
  <div class="view view--salary-settlements">
    <section class="section pt-header">
      <div class="pdf-single pdf-single--certificate container position-relative pt-7">
        <div v-if="!loading">
          <div v-if="data" class="certificate-box">
            <h3 v-if="data.title" class="certificate-box__title title text-center">{{ data.title }}</h3>

            <hr class="my-7">

            <div v-if="data.text" class="certificate-box__text text-center" v-html="data.text"></div>

            <div v-if="data.button" class="certificate-box__button mt-8">
              <a
                class="button button--primary button--purple button--stext w-100"
                :href="data.button.url"
                download
              >
                <span class="button__text">{{ data.button.label }}</span>
              </a>
            </div>
            <div class="pdf-single__viewer mt-6">
              <iframe
                :src="`https://docs.google.com/viewer?&embedded=true&url=${data.button.url}`"
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
              Certificado de renta 1887 no disponible
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
import { getRent1887 } from '@/services/certificate';

export default {
  name: 'rent1887',
  data() {
    return {
      loading: false,
      data: null,
    };
  },
  created() {
    this.$store.commit('set_title', 'Certificado');
  },
  mounted() {
    this.getRentData();

    if (window.cordova) {
      window.open = window.cordova.InAppBrowser.open;
    }
  },
  methods: {
    getRentData() {
      this.loading = true;

      this.getRent1887Data()
        .then((data) => {
          if (data) {
            this.data = {
              title: data.data.title_certificate,
              text: data.data.description_certificate,
              button: {
                label: data.data.label_button,
                url: data.file,
              },
            };
          } else {
            this.data = null;
          }
        })
        .then(() => {
          this.loading = false;
        });
    },
    openPdf(pdf) {
      if (typeof pdf === 'undefined') return;
      window.location = pdf;
    },
    async getRent1887Data() {
      let response;
      try {
        response = await getRent1887();
        response = response.data;
      } catch (err) {
        response = null;
      }
      return response;
    },
  },
};
</script>
