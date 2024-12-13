<template>
  <nav
    class="page-nav"
    :class="[ !!color ? `page-nav--${color}` : '' ]">
    <ul class="page-nav__list">
      <li class="page-nav__item" v-for="item in data" :key="item.url">
        <router-link class="page-nav__link title title--xs" :to="item.url">
          <span class="page-nav__label">{{ item.label }}</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'page-nav',
  props: {
    data: {
      type: Array,
      required: true,
    },
    color: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
};
</script>
