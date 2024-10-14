import { auth } from "@/firebase_setup"
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
      component: VolunteerTaskView,
      meta: {
        auth: true,
        userType: "volunteer"
      }
    },
    {
      path: '/AddTasks',
      name: 'Add your tasks',
      component: TaskAdd,
      meta: {
        auth: true,
        userType: "admin"
      }
    },
    {
      path: '/SearchTasks',
      name: 'Search for tasks',
      component: TaskSearch,
      meta: {
        auth: true,
        userType: "volunteer"
      }
    },
    {
      path: '/ViewTask/:taskID',
      name: 'Task detail viewing for volunteers',
      component: VolunteerTaskDetail,
      meta: {
        auth: true,
        userType: "volunteer"
      }
    },
    {
      path: '/ViewMyTasks',
      name: 'Viewing my tasks for volunteers',
      component: VolunteerTaskView,
      meta: {
        auth: true,
        userType: "volunteer"
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.auth);
  if (requiresAuth && !auth.currentUser) {
    next({path: "/login"});
  } else {
    next(); //todo: Implement access control based on user privileges
  }
})

export default router;
