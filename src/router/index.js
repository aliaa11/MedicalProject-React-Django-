import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Public/Home.vue'
import Register from '../views/Auth/Register.vue'
import Login from '../views/Auth/Login.vue'
import EmployerDashboard from '@/views/Employer/EmployerDashboard.vue'
import JobForm from '@/views/Employer/JobForm.vue'
import EmployerHome from '@/views/Employer/EmployerHome.vue'
import JobDetails from '../views/jobs/JopDetails.vue'

const routes = [
  { path: '/', name: 'register', component: Register },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  {
    path: '/',
    component: Home
  },
  {
    path: '/job-details',
    name: 'job-details',
    component: JobDetails
  },
  {
    path: '/employer',
    name: 'EmployerDashboard',
    component: EmployerDashboard,
    children: [
      {
        path: '',
        name: 'EmployerDashboardHome',
        component: EmployerHome
      },
      {
        path: 'jobform',
        name: 'JobForm',
        component: JobForm
      },
      {
        path: 'joblist',
        name: 'JobList',
        component: () => import('@/views/Employer/JobList.vue')
      },
      {
        path: 'applications',
        name: 'Applications',
        component: () => import('@/views/Employer/ApplicationList.vue')
      }
            
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
