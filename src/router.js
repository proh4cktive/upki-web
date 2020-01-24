import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Nodes from '@/components/Nodes';
import Profiles from '@/components/Profiles';
import Admins from '@/components/Admins';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/nodes',
      name: 'Nodes',
      component: Nodes,
    },
    {
      path: '/profiles',
      name: 'Profiles',
      component: Profiles,
    },
    {
      path: '/admins',
      name: 'Admins',
      component: Admins,
    },
  ],
  mode: 'history',
});

// eslint-disable-next-line
router.beforeEach((to, from, next) => {
  // reset alert message if it was enabled
  if(router.app.resetAlert && router.app.showMessage) {
    router.app.resetAlert()
  }
  next()
})

export default router
