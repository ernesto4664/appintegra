import { APIHelper } from '@/services/axios';

const getCertificate = params => APIHelper.get('/certificate', { params });

const getRent1887 = () => APIHelper.get('/certificados/renta-1887');

export {
  getCertificate,
  getRent1887,
};
