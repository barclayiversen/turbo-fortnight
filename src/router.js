// import CoachDetail from './pages/coaches/CoachDetail.vue';
// import ContactCoach from './pages/requests/CoachContact.vue';
// import Register from './pages/coaches/Register.vue';
// import Requests from './pages/requests/Requests.vue';
// import UserAuth from './pages/auth/UserAuth.vue';

import { createRouter, createWebHistory } from 'vue-router';
import CoachesList from './pages/coaches/CoachesList.vue';
import NotFound from './pages/NotFound.vue';
import store from './store/index.js';

const CoachDetail = () => import('./pages/coaches/CoachDetail.vue');

const Register = () => import('./pages/coaches/Register.vue');

const Requests = () => import('./pages/requests/Requests.vue');

const UserAuth = () => import('./pages/auth/UserAuth.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/coaches' },
    { path: '/coaches', component: CoachesList },
    {
      path: '/coaches/:id',
      component: CoachDetail,
      props: true
      // Not in use due to buggy contact button I couldn't make disapper.
      // children: [{ path: 'contact', component: ContactCoach }]
    },
    { path: '/register', component: Register, meta: { requiresAuth: true } },
    { path: '/requests', component: Requests, meta: { requiresAuth: true } },
    { path: '/auth', component: UserAuth, meta: { requiresUnauth: true } },
    { path: '/:notFound(.*)', component: NotFound }
  ]
});

router.beforeEach((to, _, next) => {
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    next('/auth');
  } else if (to.meta.requiresUnauth && store.getters.isAuthenticated) {
    next('/coaches');
  } else {
    next();
  }
});

export default router;
