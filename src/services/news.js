import { APIHelper } from '@/services/axios';

const getPaginatedNews = params => APIHelper.get('/posts/', { params });

const getSingleNew = (api, slug) => APIHelper.get(`/${api}/${slug}`);

export {
  getPaginatedNews,
  getSingleNew,
};
