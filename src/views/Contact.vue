<template>
  <div class="view view--help section--light">
    <section class="section pt-header">
      <div class="container">
        <div class="py-7">
          <page-nav
            :data="menu"
            color="primary">
          </page-nav>
        </div>

        <div>
          <p class="text-primary text-uppercase">{{ data.intro }}</p>

          <div class="mt-7">
            <div
              class="contact-item mb-5 last"
              v-for="(item, index) in data.contact"
              :key="index">
              <a
                class="contact-item__link"
                :href="item.value">
                <div class="contact-item__content">
                  <i class="contact-item__icon material-icons">{{ item.icon }}</i>
                  <div class="contact-item__info">
                    <p class="contact-item__title m-0">{{ item.title }}</p>
                    <p class="contact-item__value m-0">{{ item.label }}</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { getContact } from '@/services/help';

import PageNav from '@/components/PageNav.vue';

export default {
  name: 'contact',
  components: {
    PageNav,
  },
  data() {
    return {
      menu: [
        {
          label: 'Tutoriales APP',
          url: '/mesa-de-ayuda/tutoriales',
        }, {
          label: 'Preguntas Frecuentes',
          url: '/mesa-de-ayuda/preguntas',
        }, {
          label: 'Contacto Directo',
          url: '/mesa-de-ayuda/contacto',
        },
      ],
      data: {
        intro: '',
        contact: [],
      },
    };
  },
  created() {
    this.$store.commit('set_title', 'Ayuda');
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;

      this.getContactData()
        .then((data) => {
          this.data.intro = data.intro;
          this.data.contact = data.contact;
        })
        .then(() => {
          this.loading = false;
        });
    },
    async getContactData() {
      const response = await getContact();

      return response.data;
    },
  },
};
</script>
