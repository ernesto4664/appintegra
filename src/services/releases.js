import { APIHelper } from '@/services/axios';

const getPaginatedReleases = params => APIHelper.get('/releases/', { params });

const getSingleRelease = slug => APIHelper.get(`/releases/${slug}`);

const getPaginatedJobs = params => APIHelper.get('/job/offers', { params });

export {
  getPaginatedReleases,
  getSingleRelease,
  getPaginatedJobs,
};
