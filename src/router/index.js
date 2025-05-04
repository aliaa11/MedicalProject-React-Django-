import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Public/Home.vue'
import Register from '../views/Auth/Register.vue'
import Login from '../views/Auth/Login.vue'

const routes = [
  { path: '/', name: 'register', component: Register },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  // { path: '/login', name: 'Login', component: () => import('../views/Auth/Login.vue') },
  // { path: '/register', name: 'Register', component: () => import('../views/Auth/Register.vue') },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
