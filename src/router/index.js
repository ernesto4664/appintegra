/* eslint-disable import/no-cycle */
import Vue from 'vue';
import VueRouter from 'vue-router';

import store from '@/store/index';

import Login from '@/views/Login.vue';
import Forgot from '@/views/Forgot.vue';
import Recover from '@/views/Recover.vue';

import Signup from '@/views/Signup.vue';
import SignupDataReview from '@/views/SignupDataReview.vue';
import SignupDataComplete from '@/views/SignupDataComplete.vue';
import Onboarding from '@/views/Onboarding.vue';

import GeneralTerms from '@/views/GeneralTerms.vue';

import Home from '@/views/Home.vue';

import News from '@/views/News.vue';

import Releases from '@/views/Releases.vue';

import Benefits from '@/views/Benefits.vue';
import OtherBenefits from '@/views/OtherBenefits.vue';
import SingleBenefit from '@/views/SingleBenefit.vue';

import Jobs from '@/views/Jobs.vue';

import Services from '@/views/Services.vue';
import SalaryTerms from '@/views/SalaryTerms.vue';
import SalarySettlements from '@/views/SalarySettlements.vue';
import SalarySettlementsLatest from '@/views/SalarySettlementsLatest.vue';
import Salary from '@/views/Salary.vue';
import Certificates from '@/views/Certificates.vue';
import ConfigureCertificate from '@/views/ConfigureCertificate.vue';
import Certificate from '@/views/Certificate.vue';
import Rent1887 from '@/views/Rent1887.vue';

import Single from '@/views/Single.vue';
import SurveyMonkey from '@/views/SurveyMonkey.vue';

import Profile from '@/views/Profile.vue';
import Preferences from '@/views/Preferences.vue';

import Tutorials from '@/views/Tutorials.vue';
import Faq from '@/views/Faq.vue';
import Contact from '@/views/Contact.vue';

import Notifications from '@/views/Notifications.vue';

import EducationalMaterial from '@/views/EducationalMaterial.vue';
import MaterialCategories from '@/views/MaterialCategories.vue';
import MaterialActivities from '@/views/MaterialActivities.vue';
import MaterialWorkshops from '@/views/MaterialWorkshops.vue';
import MaterialVideos from '@/views/MaterialVideos.vue';

import Covid19 from '@/views/Covid19.vue';
import Covid19Thanks from '@/views/Covid19Thanks.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/legal',
    name: 'terms',
    component: GeneralTerms,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/ingresar',
    name: 'login',
    component: Login,
    meta: {
      redirectIfAuthenticated: true,
    },
  },
  {
    path: '/recuperar-contrasena',
    name: 'forgot',
    component: Forgot,
    meta: {
      redirectIfAuthenticated: true,
    },
  },
  {
    path: '/cambiar-contrasena',
    name: 'recover',
    component: Recover,
    meta: {
      redirectIfAuthenticated: true,
    },
  },
  {
    path: '/registrarse',
    name: 'signup',
    component: Signup,
    meta: {
      redirectIfAuthenticated: true,
    },
  },
  {
    path: '/registrarse/datos-personales',
    name: 'signup-data-review',
    component: SignupDataReview,
  },
  {
    path: '/registrarse/completar-datos',
    name: 'signup-data-complete',
    component: SignupDataComplete,
  },
  {
    path: '/registrarse/onboarding',
    name: 'onboarding',
    component: Onboarding,
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/noticias',
    name: 'news',
    component: News,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/noticias/:slug',
    name: 'new',
    component: Single,
    meta: {
      api: 'post',
      label: 'Noticias',
      related: 'Noticias Relacionadas',
      requiresAuth: true,
    },
  },
  {
    path: '/comunicados',
    name: 'releases',
    component: Releases,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/beneficios',
    name: 'benefits',
    component: Benefits,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/beneficios/:slug',
    name: 'single-benefits',
    component: SingleBenefit,
    meta: {
      api: 'release',
      label: 'Beneficios',
      related: 'Material Adicional',
      requiresAuth: true,
    },
  },
  {
    path: '/otros-beneficios',
    name: 'other-benefits',
    component: OtherBenefits,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/comunicados/:slug',
    name: 'release',
    component: Single,
    meta: {
      api: 'release',
      label: 'Comunicados',
      related: 'Comunicados Relacionados',
      requiresAuth: true,
    },
  },
  {
    path: '/ofertas',
    name: 'jobs',
    component: Jobs,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/ofertas/:slug',
    name: 'job',
    component: Single,
    meta: {
      api: 'release',
      label: 'Ofertas Laborales',
      related: 'Ofertas Relacionadas',
      requiresAuth: true,
    },
  },
  {
    path: '/encuestas/:id',
    name: 'survey',
    component: SurveyMonkey,
    meta: {
      api: 'survey',
      label: 'Encuestas',
      requiresAuth: true,
    },
  },
  {
    path: '/servicios',
    name: 'services',
    component: Services,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/servicios/terminos-y-condiciones',
    name: 'salary-terms',
    component: SalaryTerms,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/liquidaciones-de-sueldo',
    name: 'salary-settlements',
    component: SalarySettlements,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/liquidaciones-de-sueldo/ultimas',
    name: 'salary-latest',
    component: SalarySettlementsLatest,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/liquidaciones-de-sueldo/liquidacion',
    name: 'salary',
    component: Salary,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/certificados',
    name: 'certificates',
    component: Certificates,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/certificados/configurar',
    name: 'configurate-certificate',
    component: ConfigureCertificate,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/certificados/certificado',
    name: 'certificate',
    component: Certificate,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/certificados/renta-1887',
    name: 'rent1887',
    component: Rent1887,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/perfil',
    name: 'profile',
    component: Profile,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/perfil/preferencias',
    name: 'preferences',
    component: Preferences,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/mesa-de-ayuda',
    redirect: '/mesa-de-ayuda/tutoriales',
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/mesa-de-ayuda/tutoriales',
    name: 'tutorials',
    component: Tutorials,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/mesa-de-ayuda/preguntas',
    name: 'faq',
    component: Faq,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/mesa-de-ayuda/contacto',
    name: 'contact',
    component: Contact,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/notificaciones',
    name: 'notifications',
    component: Notifications,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/material-educativo',
    name: 'educational-material',
    component: EducationalMaterial,
    meta: {
      requiresAuth: true,
      requireProfile: 'parent',
    },
  },
  {
    path: '/material-educativo/categorias',
    name: 'material-categories-home',
    redirect: '/material-educativo',
  },
  {
    path: '/material-educativo/entradas',
    name: 'material-entradas-home',
    redirect: '/material-educativo',
  },
  {
    path: '/material-educativo/categorias/:slug',
    name: 'material-categories',
    component: MaterialCategories,
    meta: {
      api: 'educational/materials/categories',
      label: '',
      related: '',
      requiresAuth: true,
      requireProfile: 'parent',
    },
  },
  {
    path: '/material-educativo/entradas/:slug',
    name: 'material-entradas',
    component: Single,
    meta: {
      api: 'educational/materials',
      label: 'Material Educativo',
      related: 'Material Relacionado',
      requiresAuth: true,
      requireProfile: 'parent',
    },
  },
  {
    path: '/material-educativo/actividades',
    name: 'material-activities',
    component: MaterialActivities,
    meta: {
      requiresAuth: true,
      requireProfile: 'parent',
    },
  },
  {
    path: '/material-educativo/actividades/:slug',
    name: 'material-activity',
    component: Single,
    meta: {
      api: 'educational/materials/activity',
      label: 'Actividades',
      related: 'Actividades Relacionadas',
      requiresAuth: true,
      requireProfile: 'parent',
    },
  },
  {
    path: '/material-educativo/talleres',
    name: 'material-workshops',
    component: MaterialWorkshops,
    meta: {
      requiresAuth: true,
      requireProfile: 'parent',
    },
  },
  {
    path: '/material-educativo/talleres/:slug',
    name: 'material-workshop',
    component: Single,
    meta: {
      api: 'educational/materials/workshop',
      label: 'Talleres',
      related: 'Talleres Relacionados',
      requiresAuth: true,
      requireProfile: 'parent',
    },
  },
  {
    path: '/material-educativo/videos',
    name: 'material-videos',
    component: MaterialVideos,
    meta: {
      requiresAuth: true,
      requireProfile: 'parent',
    },
  },
  {
    path: '/material-educativo/videos/:slug',
    name: 'material-video',
    component: Single,
    meta: {
      api: 'post',
      label: 'Videos',
      related: 'Videos Relacionados',
      requiresAuth: true,
      requireProfile: 'parent',
    },
  },
  {
    path: '/aporte-covid19',
    name: 'covid19',
    component: Covid19,
    meta: {
      requiresAuth: true,
      requireProfile: 'parent',
    },
    beforeEnter: (to, from, next) => {
      if (!store.state.user.is_parent) {
        return next();
      }

      return next({ name: 'home' });
    },
    // beforeEnter: (to, from, next) => {
    //   if (store.state.user ? !store.state.user.is_contribution : false) {
    //     return next();
    //   }

    //   return next({ name: 'home' });
    // },
  },
  {
    path: '/aporte-covid19/gracias',
    name: 'covid19-thanks',
    component: Covid19Thanks,
    meta: {
      requiresAuth: true,
      requireProfile: 'parent',
    },
    beforeEnter: (to, from, next) => {
      if (!store.state.user.is_parent) {
        return next();
      }

      return next({ name: 'home' });
    },
    // beforeEnter: (to, from, next) => {
    //   if (store.state.user ? !store.state.user.is_contribution : false) {
    //     return next();
    //   }

    //   return next({ name: 'home' });
    // },
  },
  {
    path: '/about',
    name: 'about',
    meta: {},
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '*',
    name: '404',
    meta: {},
    redirect: { name: 'home' },
  },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta && record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next();
      return;
    }
    next('/ingresar');
    return;
  }

  if (to.matched.some(record => record.meta && record.meta.redirectIfAuthenticated)) {
    if (store.getters.isLoggedIn && store.state.user.is_termn_home) {
      next('/');
      return;
    }
    next();
    return;
  }

  next();
});

export default router;
