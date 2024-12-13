import { APIHelper } from '@/services/axios';

const getSingleSurvey = (api, slug) => APIHelper.get(`/${api}/${slug}`);

export default getSingleSurvey;
