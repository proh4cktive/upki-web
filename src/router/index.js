import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Nodes from '@/components/Nodes';
import Profiles from '@/components/Profiles';
import Admins from '@/components/Admins';

Vue.use(Router);

export default new Router({
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
