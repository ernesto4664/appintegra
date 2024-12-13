import { APIHelper } from '@/services/axios';

const getCovidData = () => APIHelper.get('/covid/ammounts');

const sendCovidAmount = data => APIHelper.post('/covid/user/ammounts', data);

export {
  getCovidData,
  sendCovidAmount,
};
