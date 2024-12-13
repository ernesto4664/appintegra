import { APIHelper } from '@/services/axios';

const signin = data => APIHelper.post('/auth/login', data);

const forgot = rut => APIHelper.put(`/user/recover/password/rut/${rut}`);

const recover = data => APIHelper.post('/user/recovery/password/id', data);

const signup = data => APIHelper.post('/auth/register', data);

const complete = data => APIHelper.post('/user/complete', data);

const signout = () => APIHelper.get('/logout');

const deleteAccount = () => APIHelper.get('/suspend/user');

const preferences = data => APIHelper.post('/user/notification', data);

export {
  signin,
  forgot,
  recover,
  signup,
  complete,
  signout,
  preferences,
  deleteAccount,
};
