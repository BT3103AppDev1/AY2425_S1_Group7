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
import LoginChoice from '@/views/LoginChoice.vue';
import AdminLogin from '@/views/AdminLogin.vue';
import AdminTaskManagement from '@/views/AdminTaskManagement.vue';
import AdminTaskDetail from '@/views/AdminTaskDetail.vue';
import AdminTaskAssignment from '@/views/AdminTaskAssignment.vue';
import AdminTaskEdit from '@/views/AdminTaskEdit.vue';
import TakeAttendance from '@/views/TakeAttendance.vue'; 
import ManageAttendance from '@/views/ManageAttendance.vue'; 

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
      path: '/ForbiddenAccess',
      name: 'ForbiddenAccess',
      component: ForbiddenAccess
    },
    {
      path: '/Admin/Dashboard',
      name: 'AdminDashboard',
      component: AdministratorDashboard
    },
    {
      path: '/Admin/ManageTasks',
      name: 'ManageTasks',
      component: AdminTaskManagement
    },
    {
      path: '/Admin/ViewTask/:taskID',
      name: 'AdminViewTasks',
      component: AdminTaskDetail
    },
    {
      path: '/Admin/TaskAssignment/:taskID',
      name: 'AdminViewAssignment',
      component: AdminTaskAssignment
    },
    {
      path: '/Admin/TakeAttendance',
      name: 'TakeAttendance',
      component: TakeAttendance
    },
    {
      path: '/Admin/ManageAttendance/:taskID',
      name: 'ManageAttendance',
      component: ManageAttendance,
      props: true
    },
    {
      path: '/Profile',
      name: 'Profile',
      component: ProfileView
    },
    {
      path: '/:catchAll(.*)', 
      name: 'NotFound',
      component: NotFound
    },
    {
      path: '/EditTask/:taskID',
      name: 'Edit Task',
      component: AdminTaskEdit
    }
  ]
});

/*
router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const publicLinks = ['LoginChoice', 'VolunteerLogin', 'AdminLogin', 'RegisterUser', 'RegisterAdmin'];
  if (!user && !publicLinks.includes(to.name)) {
    next({ name: 'LoginChoice' });
  } else {
    next();
  }
});
*/

export default router;

