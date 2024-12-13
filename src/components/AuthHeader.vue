<template>
  <header class="auth-header">
    <div class="container">
      <p class="auth-header__label">{{ label }}</p>

      <figure class="auth-header__logo">
        <img
          class="img-fluid"
          :src="logo.src"
          :alt="logo.alt">
      </figure>

      <div class="auth-header__flag"></div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'auth-header',
  data() {
    return {
      label: 'Bienvenido a',
      logo: {
        src: require('../assets/images/integra-logo-gris.svg'), // eslint-disable-line global-require
        alt: 'Integra - Red de Salas Cuna y Jardines Infantiles',
      },
    };
  },
};
</script>
