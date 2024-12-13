import { APIHelper } from '@/services/axios';

const getTutorials = () => APIHelper.get('/work/table/tutorial');
const getFaq = () => APIHelper.get('/work/table/faq');
const getContact = () => APIHelper.get('/work/table/contact');
const getOnboarding = () => APIHelper.get('/onboarding');

export {
  getTutorials,
  getFaq,
  getContact,
  getOnboarding,
};
