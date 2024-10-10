import { createRouter, createWebHistory } from 'vue-router'
import TaskHomepage from '@/views/TaskHomepage.vue'
import TaskAdd from '@/views/TaskAdd.vue'
import TaskSearch from '@/views/TaskSearch.vue'
import VolunteerTaskView from '@/views/VolunteerTaskView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/ViewTasks',
      name: 'View your tasks',
      component: TaskHomepage
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
      path: `/ViewTask/:taskID`,
      name: 'Task viewing for volunteers',
      component: VolunteerTaskView
    }
  ]
})

export default router
