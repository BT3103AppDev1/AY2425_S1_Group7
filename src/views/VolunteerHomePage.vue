<template>
  <div>
   
    <header class="header">
      <div class="logo-container">
        <img src="/app logo.png" alt="Voluntrac Logo" class="logo">
        <span class="voluntrac-text">VOLUNTRAC</span>
      </div>
      <nav class="navbar">
        <ul class="navbar-links">
          <li><router-link to="/view-tasks">VIEW MY TASKS</router-link></li>
          <li><router-link to="/search-opportunities">SEARCH OPPORTUNITIES</router-link></li>
          <li><router-link to="/profile">MY PROFILE</router-link></li>
        </ul>
      </nav>
    </header>

    <div class="volunteer-homepage">
        <HomePageUsername /> <!-- Renders the username -->
        <LastLoginDate /> <!-- Renders the last login date -->
    </div>

    <div class="task-table-container">
      <h2 class="page-title">Here's what you signed up for</h2>
      <table class="task-table">
        <thead>
          <tr>
            <th>Upcoming Tasks</th>
            <th>Start Date & Time</th>
            <th>Reporting Location</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            
            <td @click="viewTaskDetails(task.id)">{{ task.task_name }}</td>
            <td>{{ task.start_date_time.toDate() }}</td>
            <td>{{ task.location }}</td>
            <td>
              <button @click="cancelTask(task.id)" class="action-button">Cancel</button>
            </td>
          </tr>
          <tr v-if="tasks.length === 0">
            <td colspan="4">No tasks available</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="image-container">
      <img src="/img2.png" alt="Illustration">
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { db } from '../firebase_setup';
import { collection, query, where, getDocs, getDoc, deleteDoc, doc } from 'firebase/firestore';
import { auth } from '../firebase_setup';
import { useRouter } from "vue-router";
import VolunteerTaskbar from "../components/VolunteerTaskbar.vue"
import HomePageUsername from '@/components/HomePageUsername.vue';
import LastLoginDate from '@/components/LastLoginDate.vue';
const router = useRouter();

const tasks = ref([]);

async function fetchTasks() {
  const currentUser = auth.currentUser;
  if (currentUser) {
    try {
      const q = query(
        collection(db, 'task_reservations'),
        where('volunteer_id', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const allTaskIds = querySnapshot.docs;

     
      const tasksPromises = allTaskIds.map(async (tDoc) => {
        const taskDoc = await getDoc(doc(db, 'task', tDoc.data().task_id));
        return taskDoc.exists() ? { id: tDoc.id, ...taskDoc.data() } : null;
      });

    
      tasks.value = await Promise.all(tasksPromises);
      
    
      tasks.value = tasks.value.filter(task => task !== null);
      
      console.log(tasks.value);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }
}

async function cancelTask(taskID) {
  if (confirm('Are you sure you want to cancel this task?')) {
    try {
      await deleteDoc(doc(db, 'task_reservations', taskID));
      alert('Task successfully cancelled!');
      await fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("There was an error cancelling the task. Please try again.");
    }
  }
}

onMounted(fetchTasks);

function viewTaskDetails(taskID) {
  router.push(`/ViewTask/${taskID}`);
}
</script>

<style scoped>

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f0f0f0;
  border-bottom: 2px solid #e0e0e0;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  height: 50px;
  width: auto;
}

.voluntrac-text {
  font-size: 1.8em;
  font-weight: bold;
  margin-left: 10px;
}

.navbar {
  display: flex;
  align-items: center;
}

.navbar-links {
  display: flex;
  gap: 20px;
  list-style: none;
}

.navbar-links li a {
  text-decoration: none;
  color: #333;
  font-weight: bold;
}

.navbar-links li a:hover {
  color: #555;
}

.volunteer-homepage {
    padding: 20px;
}

.task-table-container {
  width: 80%;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.page-title {
  text-align: center;
  font-size: 2.4em;
  color: #333;
  margin-bottom: 20px;
}

.task-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1.1em;
  text-align: left;
}

.task-table thead th {
  background-color: #f8f8f8;
  padding: 15px;
  border-bottom: 2px solid #ccc;
  font-weight: bold;
}

.task-table tbody td {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.task-table tbody tr:last-child td {
  border-bottom: none;
}

.action-button {
  background-color: #f8e7bc;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 1em;
  color: #333;
}

.action-button:hover {
  background-color: #f4c9a1;
}

.image-container {
  width: 300px; 
  height: auto;
  float: right; 
  margin-top: 50px; 
  margin-right: 100px;
}

.image-container img {
  max-width: 100%; 
  height: auto;
}  

@media (max-width: 768px) {
  .task-table-container {
    width: 95%;
  }

  .task-table {
    font-size: 0.9em;
  }

  .navbar-links {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
  
