import { APIHelper } from '@/services/axios';

const getPaginatedActivities = params => APIHelper.get('/educational/materials/activity/', { params });
// const getPaginatedActivities = params => APIHelper.get('/educational/materials/activity/', { params });
const getPaginatedWorkshops = params => APIHelper.get('/educational/materials/workshop/', { params });
const getPaginatedVideos = params => APIHelper.get('/educational/materials/video/', { params });

const getMaterialsCategories = params => APIHelper.get('/materials/categories/', { params });
const getMaterialsPostsByCategories = params => APIHelper.get(`/educational/materials/categories/${params.slug}/items`, { params });

const getSingleNew = (api, slug) => APIHelper.get(`/${api}/${slug}`);

export {
  getPaginatedActivities,
  getPaginatedWorkshops,
  getPaginatedVideos,
  getMaterialsCategories,
  getMaterialsPostsByCategories,
  getSingleNew,
};
