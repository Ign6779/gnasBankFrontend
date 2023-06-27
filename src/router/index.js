import { createRouter, createWebHistory } from 'vue-router'

import Home from '../components/Home.vue';
import CreateTransaction from '../components/CreateTransaction.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/createtransaction', component: CreateTransaction },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
