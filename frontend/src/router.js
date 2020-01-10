import Vue from 'vue';
import Router from 'vue-router';

import Login from './components/Login';
import Main from './components/Main';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '/dev/:id',
      component: Main
    }
  ]
});
