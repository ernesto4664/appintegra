<template>
  <div class="onboarding">
    <div class="py-7 container">
      <div class="box box--sm-radius p-0 pb-4">
        <slick
          class="onboarding__slider"
          ref="slick"
          :options="slickOptions"
          @beforeChange="stopVideo">
          <div
            v-for="(step, index) in data"
            :key="step.id"
            class="onboarding__item text-center"
            >
            <div
              class="onboarding__image">
              <div
                v-if="step.video"
                class="embed-responsive">
                <youtube
                  ref="items"
                  :video-id="step.video"
                  :player-vars="playerVars" />
              </div>
              <img
                v-else
                class="img-fluid"
                :src="step.img.src"
                :alt="step.img.alt">
            </div>

            <div class="onboarding__content">
              <h2 class="title title--l">{{ step.title }}</h2>
              <div
                v-if="step.text"
                class="onboarding__text text mt-5"
                v-html="step.text"></div>
            </div>

            <div class="onboarding__action">
              <button
                v-if="index !== (data.length - 1)"
                class="button"
                type="button"
                @click="next">
                <span class="button__text">Continuar</span>
                <i class="button__icon material-icons text-primary">arrow_forward</i>
              </button>
              <button
                v-else
                class="button button--primary"
                type="button"
                @click="finishOnboarding">
                <span class="button__text">Comenzar</span>
              </button>
            </div>
          </div>
        </slick>
      </div>
    </div>
  </div>
</template>

<script>
import { getOnboarding } from '@/services/help';
import { APIHelper } from '@/services/axios';
import Slick from 'vue-slick';

export default {
  name: 'onboarding',
  components: {
    Slick,
  },
  data() {
    return {
      loading: false,
      currentStep: 0,
      data: [],
      playerVars: {
        autoplay: 0,
        modestbranding: 1,
        rel: 0,
        enablejsapi: 1,
        playsinline: 1,
        fs: 0,
      },
      slickOptions: {
        slidesToShow: 1,
        arrows: false,
        adaptiveHeight: true,
        dots: true,
        infinite: false,
      },
    };
  },
  mounted() {
    if (this.$store.state.user.full_register) {
      this.$router.push({ name: 'home' });
      return;
    }

    this.getData();
    this.$store.commit('set_layout', 'auth-layout');
  },
  beforeUpdate() {
    if (this.$refs.slick) {
      this.$refs.slick.destroy();
    }
  },
  methods: {
    getData() {
      this.loading = true;

      this.getOnboardingData()
        .then((data) => {
          this.data = data.data && data.data.length ? data.data : data;
        })
        .catch(() => {
          this.$toasted.show('No hemos podido obtener la información del onboarding.', {
            theme: 'outline',
            position: 'bottom-center',
            duration: 7000,
          });
        })
        .then(() => {
          setTimeout(() => {
            this.$refs.slick.create();
          }, 500);
          this.loading = false;
        });
    },
    finishOnboarding() {
      APIHelper.put('/user/register/full', { flag: 1 })
        .then((res) => {
          const data = {
            user: res.data.data,
          };
          this.$store.commit('auth_complete', data);
        })
        .catch()
        .then(() => {
          this.$store.commit('set_layout', 'app-layout');
          this.$router.push('/');
        });
    },
    next() {
      this.$refs.slick.next();
    },
    stopVideo() {
      if (!this.$refs.items) return;

      for (let i = 0; i < this.$refs.items.length; i += 1) {
        this.$refs.items[i].player.stopVideo();
      }
    },
    async getOnboardingData() {
      const response = await getOnboarding();

      return response.data;
    },
  },
};
</script>

<style lang="scss">
.onboarding__slider {
  max-height: 0;
  opacity: 0;
  visibility: hidden;
}
.onboarding__slider.slick-initialized {
  max-height: none;
  opacity: 1;
  visibility: visible;
}
</style>
