import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'

import Login from './views/Login.vue'
import Chat from './views/Chat.vue'

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
        path: '/',
        component: Index,
        children: [
          { path: '/', name: 'login', component: Login },
          { path: '/chat/:id', name: 'chat', component: Chat, props: true }
        ]
    },
],
});

export default router;