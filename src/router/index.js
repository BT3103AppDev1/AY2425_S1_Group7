import { createRouter, createWebHistory } from 'vue-router'
import TaskHomepage from '@/views/TaskHomepage.vue'
import TaskAdd from '@/views/TaskAdd.vue'
import LogIn from '../components/LogIn.vue';
import RegisterUser from '../components/RegisterUser.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LogIn
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterUser
    },
    {
      path: '/ViewTasks',
      name: 'View your tasks',
      component: TaskHomepage
    },
    {
      path: '/AddTasks',
      name: 'Add your tasks',
      component: TaskAdd
    }
  ]
})

export default router
