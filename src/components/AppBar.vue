<template>
  <div class="app-bar">
    <transition name="fadeUp">
      <div v-show="showMenu" class="menu">
        <header class="menu__user profile-header background-blue">
          <div class="container py-4">
            <div class="profile-header__content">
              <figure class="profile-header__avatar">
                <img
                  class="img-fluid"
                  :src="
                    user.avatar || require('../assets/images/integrito.svg')
                  "
                  :alt="userFullname"
                />
              </figure>

              <div class="profile-header__name" v-if="!user.is_public">
                <p class="title title--s mb-2 font-weight-normal text-white">
                  {{ userFullname }}
                </p>
                <router-link
                  @click.native="showMenu = false"
                  to="/perfil"
                  class="button"
                >
                  <span class="button__text">Ver perfil</span>
                  <i class="button__icon material-icons">arrow_forward</i>
                </router-link>
              </div>
            </div>
          </div>
        </header>

        <nav class="menu__navigation navigation">
          <ul class="navigation__list">
            <li
              class="navigation__item"
              v-for="(item, index) in menu"
              v-show="isPublic(item)"
              :key="index"
            >
              <router-link
                class="navigation__link"
                :to="item.url"
                @click.native="showMenu = false"
              >
                <i class="navigation__icon material-icons">{{ item.icon }}</i>
                <span class="navigation__text">{{ item.label }}</span>
              </router-link>
            </li>
            <li class="navigation__item">
              <a
                class="navigation__link"
                @click="logoutUser"
                v-if="!user.skip_auth"
              >
                <i class="navigation__icon material-icons">exit_to_app</i>
                <span class="navigation__text">Cerrar sesión</span>
              </a>
              <a
                class="navigation__link"
                @click="createAccount(user.is_parent)"
                v-else
              >
                <i
                  class="navigation__icon material-icons"
                  v-text="user.is_parent ? 'power_settings_new' : 'person'"
                ></i>
                <span
                  class="navigation__text"
                  v-text="user.is_parent ? 'Salir' : 'Crear una cuenta'"
                ></span>
              </a>
            </li>
          </ul>
        </nav>

        <div class="menu__logout bottom_menu" v-if="isLoggedIn()">
          <a class="link_menu" href="#" @click="deleteAccount">
            <span class="button__text">⚠ Eliminar esta Cuenta</span>
          </a>
        </div>

        <div class="menu__logout">
          <button class="button" type="button" @click="showMenu = false">
            <i class="button__icon material-icons">close</i>
            <span class="button__text">Cerrar menú</span>
          </button>
        </div>
      </div>
    </transition>

    <nav class="bar">
      <div class="bar__iphone">
        <ul class="bar__list">
          <li class="bar__item">
            <router-link class="bar__link" to="/">
              <span class="bar__group">
                <i class="bar__icon material-icons">home</i>
              </span>
              <span class="bar__text">Inicio</span>
            </router-link>
          </li>
          <li class="bar__item" v-if="!user.is_public">
            <router-link class="bar__link" to="/notificaciones">
              <span class="bar__group">
                <i class="bar__icon material-icons">notifications</i>
                <span v-if="countNotifications" class="bar__notifies">{{
                  countNotifications
                }}</span>
              </span>
              <span class="bar__text">Notificaciones</span>
            </router-link>
          </li>
          <li class="bar__item w-38" v-else>
            <router-link class="bar__link" to="/material-educativo">
              <span class="bar__group">
                <i class="bar__icon material-icons">format_list_bulleted</i>
              </span>
              <span class="bar__text">Material educativo</span>
            </router-link>
          </li>
          <li class="bar__item">
            <a class="bar__link" @click="showMenu = true">
              <span class="bar__group">
                <i class="bar__icon material-icons">menu</i>
              </span>
              <span class="bar__text">Menú</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<style>
.link_menu span {
  color: red;
}

.bottom_menu {
  position: absolute;
  bottom: 0px;
}
</style>

<script>
import { mapState } from 'vuex';
import swal from 'sweetalert';

import {
  deleteAccount,
} from '@/services/auth';

export default {
  name: 'app-bar',
  data() {
    return {
      showMenu: false,
      menu: [
        {
          icon: 'home',
          label: 'Inicio',
          url: '/',
          public: true,
        },
        {
          icon: 'library_books',
          label: 'Noticias',
          url: '/noticias',
          public: true,
        },
        {
          icon: 'chat',
          label: 'Comunicados',
          url: '/comunicados',
          public: true,
        },
        {
          icon: 'format_list_bulleted',
          label: 'Material Educativo',
          url: '/material-educativo',
          public: true,
          parent: true,
        },
        {
          icon: 'volunteer_activism',
          label: 'Beneficios',
          url: '/beneficios',
          public: false,
          parent: true,
        },
        {
          icon: 'notifications',
          label: 'Notificaciones',
          url: '/notificaciones',
          public: false,
        },
        {
          icon: 'apps',
          label: 'Servicios',
          url: '/servicios',
          disabled: true,
          public: false,
        },
        {
          icon: 'help',
          label: 'Ayuda',
          url: '/mesa-de-ayuda',
          public: false,
        },
        {
          icon: 'settings',
          label: 'Preferencias',
          url: '/perfil/preferencias',
          public: false,
        },
      ],
    };
  },
  mounted() {
  // Simulación: cargar notificaciones desde Vuex
    const { notifications } = this.$store.state;

    // Almacenar las notificaciones en localStorage
    localStorage.setItem('notifications', JSON.stringify(notifications));
  },
  computed: {
    ...mapState(['user', 'notifications']),

    userFullname() {
      return `${this.user.name} ${this.user.surname}`;
    },
    countNotifications() {
      console.log('this.notifications antes de la conversión:', this.notifications);

      const notificationsArray = Array.isArray(this.notifications)
        ? this.notifications
        : Array.from(this.notifications);

      console.log('Tipo de notificationsArray:', typeof notificationsArray);
      console.log('notificationsArray:', notificationsArray);

      if (!Array.isArray(notificationsArray)) {
        console.error('notificationsArray no es un array válido.');
        return 0;
      }

      const totalCount = notificationsArray.reduce((count, group) => {
        if (Array.isArray(group.notifications)) {
          return count + group.notifications.length;
        }
        return count;
      }, 0);

      console.log('Total de notificaciones calculado:', totalCount);
      return this.notifications.length;
    },
  },
  methods: {
    isEnabled(item) {
      if (!item.disabled) return true;

      return this.user.rut !== '186645863';
    },
    isLoggedIn() {
      return this.user.rut;
    },
    isPublic(item) {
      if (!this.user.is_parent && item.parent) return false;
      if (!this.user.is_public) return true;

      return item.public;
    },

    logoutUser() {
      this.loading = true;

      this.$store
        .dispatch('logout')
        .then(() => this.$router.push({ name: 'login' }));
    },

    createAccount(parent) {
      if (parent) {
        this.$router.push({
          name: 'login',
        });

        return;
      }

      this.$router.push({
        name: 'signup',
      });
    },

    async deleteAccount() {
      swal({
        title: '¿Estás seguro de que quieres eliminar tu cuenta?',
        text: 'No podrás volver a iniciar sesión luego de realizar esta acción',
        icon: 'error',
        buttons: ['No', 'Si'],

        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          deleteAccount()
            .then(() => {
              this.loading = true;

              swal({
                title: '',
                text: 'Cuenta eliminada correctamente',
                icon: 'success',
                button: 'Aceptar',
              });

              this.$store
                .dispatch('logout')
                .then(() => this.$router.push({ name: 'login' }));
            })
            .catch(() => {
              swal({
                title: '',
                text: 'No se ha eliminado tu cuenta, intenta más adelante',
                icon: 'error',
                button: 'Aceptar',
              });
            });
        }
      });
    },
  },
};
</script>

<style lang="scss">
.fadeUp-enter-active,
.fadeUp-leave-active {
  transition: opacity 500ms ease, transform 400ms ease;
}

.fadeUp-enter,
.fadeUp-leave-to {
  opacity: 0;
  transform: translateY(30%);
  visibility: hidden;
  transition: 300ms ease;
}

.swal-button--cancel {
  color: #3e3e3e !important;
}
</style>
