<template>
  <article class="aditional-material aditional-material--icon mb-5">
    <transition appear name="fade">
      <div v-if="loading" class="aditional-material aditional-material--loading">
      </div>
      <button @click="handleReviewBrowser(item.src)" class="aditional-material__button">
        <div class="aditional-material__icon">
          <i class="material-icons">{{ icon }}</i>
        </div>
        <div class="aditional-material__content">
          <div>
            <h3 class="aditional-material__title">{{ item.alt }}</h3>
            <div class="aditional-material__action">
              <i class="material-icons">add</i>
            </div>
          </div>
        </div>
      </button>
    </transition>
  </article>
</template>

<script>

export default {
  name: 'aditional-material',
  components: {
  },
  data() {
    return {
      icon: '',
      fileType: '',
    };
  },
  props: {
    item: {
      type: [Boolean, Object],
      default: false,
    },
    theme: {
      type: String,
      default: 'default',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    handleReviewBrowser(url) {
      window.open(url, '_system', 'location=no,footer=yes,toolbarposition=top,closebuttoncaption=Volver,toolbarcolor=#FFFFFF');
    },

    fileName() {
      const MAX_LENGTH = 15;
      const localFile = this.file;
      const fileUrl = localFile.split('/');
      const extension = localFile.slice(-4);

      return `${fileUrl[fileUrl.length - 1].slice(0, MAX_LENGTH)}(...)${extension}`;
    },
  },

  mounted() {
    this.icon = 'insert_drive_file';
    this.fileType = 'Document';
    this.file = this.fileName();
  },


  computed: {
    customUrl() {
      return this.url;
    },
  },

};
</script>

<style>

</style>
