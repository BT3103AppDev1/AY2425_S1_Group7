import { auth, db } from "@/firebase_setup";
import { getDoc, doc } from "firebase/firestore";
import { createRouter, createWebHistory } from 'vue-router';
import TaskAdd from '@/views/TaskAdd.vue';
import LogIn from '@/views/LogIn.vue';
import RegisterUser from '@/views/RegisterUser.vue';
import TaskSearch from '@/views/TaskSearch.vue';
import VolunteerTaskDetail from '@/views/VolunteerTaskDetail.vue';
import VolunteerTaskView from '@/views/VolunteerTaskView.vue';
import ForbiddenAccess from "@/views/ForbiddenAccess.vue";
import AdministratorDashboard from "@/views/AdministratorDashboard.vue";

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
    },
    {
      path: '/ForbiddenAccess',
      name: "You are a trespasser!",
      component: ForbiddenAccess
    },
    {
      path: '/Admin/Dashboard',
      component: AdministratorDashboard,
      meta: {
        auth: true,
        userType: "admin"
      }
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.auth);
  
  if (requiresAuth && !auth.currentUser) {
    console.log(auth.currentUser)
    next({ path: "/login" });
    return; // Exit the guard
  }

  if (auth.currentUser) {
    console.log(auth.currentUser)
    const uDoc = doc(db, "users", auth.currentUser.uid);

    try {
      const docSnap = await getDoc(uDoc);
      if (docSnap.exists()) {
        const userRole = docSnap.data().role;
        const requiredUserType = to.meta.userType;
        if (userRole !== requiredUserType && requiredUserType) {
          next({ path: "/login" });
          console.log("Forbidden Access Detected!")
        } else {
          next(); // Proceed to the route
        }
      } else {
        next({ path: "/login" }); // Redirect if the user document does not exist
      }
    } catch (error) {
      console.error("Error fetching user document:", error);
      next({ path: "/login" }); // Handle errors by redirecting
    }
  } else {
    next(); // Proceed if user is not authenticated
  }
});

export default router;
