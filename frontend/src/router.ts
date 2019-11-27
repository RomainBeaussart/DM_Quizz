import Vue from 'vue';
import Router from 'vue-router';
import Index from './views/Index.vue'
import Login from './views/Login.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
        path: '/',
        component: Index,
        children: [
          { path: '/', name: 'login', component: Login }
        ]
    },
],
});

export default router;