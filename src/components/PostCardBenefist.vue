<template>
  <div class="mb-5 last">
    <article class="post-card post-card--icon post-card--red benefist_card">
      <a
        :href="'#/beneficios/' + data.slug"
        >
        <!---->
        <div class="post-card__content ">
          <div>
            <p class="date post-card__date">
              <i class="date__icon material-icons">access_time</i
              ><span class="date__text">{{ dateFormated }}</span>
            </p>
            <!---->
            <h3 class="post-card__title">
              {{ data.title }}
            </h3>
            <div class="post-card__button">
              <a
                :href="'#/beneficios/' + data.slug"
                class="button button--icon button--red"
                ><i class="button__icon material-icons"> arrow_forward </i>
              </a>
            </div>
          </div>
        </div></a
      >
    </article>
  </div>
</template>

<script>
export default {
  name: 'post-card',
  props: {
    data: {
      type: [Boolean, Object],
      default: false,
    },
    icon: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dateFormated: null,
    };
  },
  mounted() {
    const date = new Date(this.data.datetime);

    const year = date.getFullYear();

    const month = `${date.getMonth() + 1}`.padStart(2, '0');

    const day = `${date.getDate()}`.padStart(2, '0');

    this.dateFormated = `${day} ${month} ${year}`;
  },
  computed: {
    customUrl() {
      return this.url || this.data.url || '';
    },
  },
};
</script>

<style>
</style>
