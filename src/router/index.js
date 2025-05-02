import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Public/Home.vue'

const routes = [
  { path: '/', name: 'Home', component: Home }
  // { path: '/login', name: 'Login', component: () => import('../views/Auth/Login.vue') },
  // { path: '/register', name: 'Register', component: () => import('../views/Auth/Register.vue') },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
