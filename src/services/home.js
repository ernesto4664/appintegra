import { APIHelper } from '@/services/axios';

const getHome = () => APIHelper.get('/home');

export {
  // eslint-disable-next-line import/prefer-default-export
  getHome,
};
