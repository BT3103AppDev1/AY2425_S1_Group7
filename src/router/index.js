import { createRouter, createWebHistory } from 'vue-router';
import TaskAdd from '@/views/TaskAdd.vue';
import LogIn from '@/views/LogIn.vue';
import RegisterUser from '@/views/RegisterUser.vue';
import RegisterAdmin from '@/views/RegisterAdmin.vue';
import TaskSearch from '@/views/VolunteerTaskSearch.vue';
import VolunteerTaskDetail from '@/views/VolunteerTaskDetail.vue';
import VolunteerHomePage from '@/views/VolunteerHomePage.vue';
import ForbiddenAccess from "@/views/ForbiddenAccess.vue";
import AdministratorDashboard from "@/views/AdministratorDashboard.vue";
import NotFound from "@/views/NotFound.vue";
import ProfileView from '@/components/ProfileView.vue';
import HomePageUsername from '@/components/HomePageUsername.vue';
import LastLoginDate from '@/components/LastLoginDate.vue';
import LoginChoice from '@/views/LoginChoice.vue';
import AdminLogin from '@/views/AdminLogin.vue';
import AdminTaskAssignment from '@/views/AdminTaskManagement.vue';
import AdminTaskManagement from '@/views/AdminTaskManagement.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/loginChoice'
    },
    {
      path: '/loginChoice',
      name: 'LoginChoice',
      component: LoginChoice
    },
    {
      path: '/volunteerLogin',
      name: 'VolunteerLogin',
      component: LogIn
    },
    {
      path: '/adminLogin',
      name: 'AdminLogin',
      component: AdminLogin
    },
    {
      path: '/registerUser',
      name: 'RegisterUser',
      component: RegisterUser
    },
    {
      path: '/registerAdmin',
      name: 'RegisterAdmin',
      component: RegisterAdmin
    },
    {
      path: '/ViewTasks',
      name: 'ViewTasks',
      component: VolunteerHomePage
    },
    {
      path: '/Admin/AddTasks',
      name: 'AddTasks',
      component: TaskAdd
    },
    {
      path: '/SearchTasks',
      name: 'SearchTasks',
      component: TaskSearch
    },
    {
      path: '/ViewTask/:taskID',
      name: 'VolunteerTaskDetail',
      component: VolunteerTaskDetail
    },
    {
      path: '/ViewMyTasks',
      name: 'ViewMyTasks',
      component: VolunteerHomePage
    },
    {
      path: '/ForbiddenAccess',
      name: 'ForbiddenAccess',
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
      name: 'HomePageUsername',
      component: HomePageUsername
    },
    {
      path: '/LastLoginDate',
      name: 'LastLoginDate',
      component: LastLoginDate
    }, 
    {
      path: '/Admin/ManageTasks',
      name: 'ManageTasks',
      component: AdminTaskManagement
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
