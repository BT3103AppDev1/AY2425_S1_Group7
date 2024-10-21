import { createRouter, createWebHistory } from 'vue-router';
//import { getAuth } from 'firebase/auth';
import TaskAdd from '@/views/TaskAdd.vue';
import LogIn from '@/views/LogIn.vue';
import RegisterUser from '@/views/RegisterUser.vue';
import TaskSearch from '@/views/VolunteerTaskSearch.vue';
import VolunteerTaskDetail from '@/views/VolunteerTaskDetail.vue';
import VolunteerHomePage from '@/views/VolunteerHomePage.vue';
import ForbiddenAccess from "@/views/ForbiddenAccess.vue";
import AdministratorDashboard from "@/views/AdministratorDashboard.vue";
import NotFound from "@/views/NotFound.vue";
import ProfileView from '@/components/ProfileView.vue';
import HomePageUsername from '@/components/HomePageUsername.vue'
import LastLoginDate from '@/components/LastLoginDate.vue';

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
      component: VolunteerHomePage
    },
    {
      path: '/Admin/AddTasks',
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
      component: VolunteerHomePage
    },
    {
      path: '/ForbiddenAccess',
      name: "You are a trespasser!",
      component: ForbiddenAccess
    },
    {
      path: '/Admin/Dashboard',
      component: AdministratorDashboard
    },
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: NotFound
    },
    {
      path: '/Profile',
      component: ProfileView
    },
    {
      path: '/HomepageUsername',
      name: 'Username',
      component: HomePageUsername
    },
    {
      path: '/LastLoginDate',
      name: 'Last Login Date',
      component: LastLoginDate
    }
  ]
});
/*
router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const publicLinks = ['/login','/register']
  if (!user && !publicLinks.includes(to.path)) {
    next({path: "/login"});
  } else {
    next();
  }
})
*/

export default router;
