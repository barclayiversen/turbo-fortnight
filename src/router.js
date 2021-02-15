// import CoachDetail from './pages/streams/CoachDetail.vue';
// import ContactCoach from './pages/requests/CoachContact.vue';
// import Register from './pages/streams/Register.vue';
// import Requests from './pages/requests/Requests.vue';
// import UserAuth from './pages/auth/UserAuth.vue';

import { createRouter, createWebHistory } from 'vue-router';
import StreamsList from './pages/streams/StreamsList.vue';
import NotFound from './pages/NotFound.vue';
import store from './store/index.js';

const StreamDetail = () => import('./pages/streams/StreamDetail.vue');

const Register = () => import('./pages/streams/Register.vue');

const Requests = () => import('./pages/requests/Requests.vue');

const UserAuth = () => import('./pages/auth/UserAuth.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/streams' },
    { path: '/streams', component: StreamsList },
    {
      path: '/streams/:id',
      component: StreamDetail,
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
    next('/streams');
  } else {
    next();
  }
});

export default router;
