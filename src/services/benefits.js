import { APIHelper } from '@/services/axios';

export const getPaginatedBenefits = params => APIHelper.get('/benefits', { params });

export const getSingleBenefit = slug => APIHelper.get(`/benefit/${slug}`);

export const getOtherBenefits = params => APIHelper.get('/benefits?other=1', { params });
