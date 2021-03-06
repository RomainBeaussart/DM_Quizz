import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'

import store from './store/store'

import Login from './views/Login.vue'
import Chat from './views/Chat.vue'
import Chats from './views/Chats.vue'
import SignUp from './views/Signup.vue'

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
          { path: '/signup', name: 'signup', component: SignUp },
          { path: '/chats', name: 'chats', component: Chats },
          { path: '/chat/:id', name: 'chat', component: Chat, props: true }
        ]
    }
  ]
});

export default router;