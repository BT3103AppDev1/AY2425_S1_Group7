import { createRouter, createWebHistory } from 'vue-router';
import TaskAdd from '@/views/TaskAdd.vue';
import LogIn from '@/components/LogIn.vue';
import RegisterUser from '@/components/RegisterUser.vue';
import TaskSearch from '@/views/TaskSearch.vue';
import VolunteerTaskDetail from '@/views/VolunteerTaskDetail.vue';
import VolunteerTaskView from '@/views/VolunteerTaskView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
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
      name: 'ViewTasks',
      component: VolunteerTaskView
    },
    {
      path: '/AddTasks',
      name: 'Add your tasks',
      component: TaskAdd
    },
    {
      path: '/SearchTasks',
      name: 'Search for tasks',
      component: TaskSearch
    },
    {
      path: '/ViewTask/:taskID',
      name: 'Task detail viewing for volunteers',
      component: VolunteerTaskDetail
    },
    {
      path: '/ViewMyTasks',
      name: 'Viewing my tasks for volunteers',
      component: VolunteerTaskView
    }
  ]
});

export default router;
