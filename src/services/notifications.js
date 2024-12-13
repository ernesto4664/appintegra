import { APIHelper } from '@/services/axios';


const getNotifications = async (params) => {
  try {
    // Verifica si el parámetro 'id' está presente
    if (!params || !params.id) {
      console.error('El parámetro "id" es requerido');
      return [];
    }

    // Realiza la solicitud GET con el ID como parámetro en la URL
    const response = await APIHelper.get('/user/notification', { params });

    // Verifica si la respuesta es exitosa
    if (response && response.status === 200) {
      console.log('Notificaciones obtenidas correctamente:', response.data);
      return response.data; // Devuelve los datos de la notificación
    }

    console.error('Error al obtener notificaciones, código:', response.status);
    return [];
  } catch (error) {
    console.error('Error en la solicitud de notificaciones:', error);
    return [];
  }
};


// Función para marcar una notificación como leída
const readNotification = async (data) => {
  console.log(data);
  try {
    // Realizamos la solicitud POST
    const response = await APIHelper.post('/user/read/notification', data);

    // Verificamos si la respuesta es exitosa
    if (response.status === 200) {
      console.log('Notificación marcada como leída:', response.data);
      return response.data; // Retorna los datos de la respuesta
    }
    console.error('Error al marcar la notificación como leída, código:', response.status);
    return null; // Devuelve null si la respuesta no es exitosa
  } catch (error) {
    // Manejo de errores en caso de que falle la solicitud
    console.error('Error al realizar la solicitud para marcar la notificación como leída:', error);
    return null; // Devuelve null en caso de error
  }
};

export {
  getNotifications,
  readNotification,
};


// import { APIHelper } from '@/services/axios';

// const getNotifications = params => APIHelper.get('/user/notification', { params });

// const readNotification = data => APIHelper.post('/user/read/notification', data);

// export {
//   getNotifications,
//   readNotification,
// };
