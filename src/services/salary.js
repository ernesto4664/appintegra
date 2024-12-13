import { APIHelper } from '@/services/axios';

const checkSalaryTerms = () => APIHelper.get('/user/service/term');

const getSalaryTerms = () => APIHelper.get('/service/terms');

const acceptSalaryTerms = () => APIHelper.put('/user/service/term');

const getSalaryMonths = () => APIHelper.get('/service/settlements');

const getSalarySettlementByPeriod = params => APIHelper.get('/service/current/settlement', { params });

export {
  checkSalaryTerms,
  getSalaryTerms,
  acceptSalaryTerms,
  getSalaryMonths,
  getSalarySettlementByPeriod,
};
