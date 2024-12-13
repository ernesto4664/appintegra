<template>
  <div class="view view--notifications">
    <div v-if="notifications.length">
      <section class="section pt-header background-turquoise">
        <div
          v-for="(date, index) in notifications"
          :key="index">
          <header class="notifications__header background-turquoise">
            <div class="container">
              <p class="notifications__title">
                <i class="material-icons">date_range</i> {{ date.title }}
              </p>
            </div>
          </header>

          <div class="notifications__content container">
            <div class="notifications__list">
              <div
                class="notification mb-5 last"
                v-for="(notification, i) in date.notifications"
                :key="i">
                <div @click="markAsRead(notification)">
                  <div class="notification__header">
                    <div class="notification__icon">
                      <i class="material-icons">{{ notification.icon }}</i>
                    </div>

                    <h3 class="notification__title">{{ notification.title }}</h3>
                  </div>

                  <div class="notification__content text" v-html="notification.text"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div
      v-else
      class="empty text-center px-4 pb-6 pt-header">
      <div class="py-8 px-4">
        <i class="material-icons mb-4">notifications</i>
        <h3 class="title title--s">
          Todas las notificaciones han sido leídas
        </h3>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { readNotification } from '@/services/notifications';

export default {
  name: 'notifications',
  data() {
    return {
      loading: false,
      notifications: [],
    };
  },
  created() {
    this.$store.commit('set_title', 'Notificaciones');
  },
  mounted() {
    console.log('Notificaciones recibidas (mounted):', this.notifications);
    this.$store.dispatch('notifications', {})
      .then((data) => {
        // Transformar las notificaciones
        this.notifications = this.groupNotifications(data);
        console.log('Notificaciones agrupadas:', this.notifications);
      })
      .catch((error) => {
        console.error('Error al cargar notificaciones:', error);
      });
  },
  computed: {
    ...mapState(['user', 'notifications']),
    userFullname() {
      return `${this.user.name} ${this.user.surname}`;
    },
    checkNotifications() {
      console.log('Propiedad computada notifications:', this.notifications);
      return this.notifications;
    },
  },
  methods: {
    groupNotifications(notifications) {
      // Agrupar por fecha
      const grouped = notifications.reduce((acc, notification) => {
        const date = notification.datetime.split(' ')[0]; // Tomar solo la fecha

        if (!acc[date]) {
          acc[date] = {
            title: date,
            notifications: [],
          };
        }

        acc[date].notifications.push({
          notification_id: notification.notification_id,
          icon: notification.type === '1' ? 'info' : 'notification_important', // Define un icono basado en el tipo
          title: notification.post?.title || notification.release?.heading || 'Sin título',
          text: notification.post?.content || notification.release?.text || 'Sin contenido',
        });

        return acc;
      }, {});

      // Convertir el objeto agrupado en un array
      return Object.values(grouped);
    },
    async markAsRead(notification) {
      if (!notification || !notification.notification_id) {
        console.error('La notificación no tiene un ID válido:', notification.notification_id);
        return;
      }

      console.log('Marcando como leída la notificación con ID:', notification.notification_id);
      const userId = this.$store.state.user?.id || JSON.parse(localStorage.getItem('user'))?.id;
      const data = {
        user: userId,
        id: notification.notification_id, // Captura el ID de la notificación
      };
      console.log(data);
      try {
        const response = await this.readNotificationApi(data); // Llama al servicio con el ID

        if (response) {
          console.log('Notificación marcada como leída exitosamente:', response);
          this.$store.commit('set_notifications', response); // Actualiza las notificaciones en Vuex
        } else {
          console.error('La API no devolvió una respuesta válida al marcar como leída.');
        }
      } catch (error) {
        console.error('Error al intentar marcar la notificación como leída:', error);
      }
    },

    async readNotificationApi(data) {
      console.log(data);
      try {
        const response = await readNotification(data);
        return response; // Retorna la respuesta del servicio
      } catch (error) {
        console.error('Error al comunicarse con el servicio readNotification:', error);
        return null;
      }
    },
  },
};
</script>
