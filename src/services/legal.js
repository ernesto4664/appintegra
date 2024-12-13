import { APIHelper } from '@/services/axios';

const checkUserLegal = () => APIHelper.get('/user/home/term');

const getUserLegal = () => APIHelper.get('/terms');

const acceptUserLegal = () => APIHelper.put('/user/home/term');

export {
  checkUserLegal,
  getUserLegal,
  acceptUserLegal,
};
