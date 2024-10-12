<template>
    <div>
      <!-- Navigation Bar -->
      <nav class="navbar">
        <div class="navbar-logo">
 
          <span>VOLUNTRAC</span>
        </div>
        <div class="navbar-links">
          <RouterLink to="/ViewTasks">VIEW MY TASKS</RouterLink>
          <RouterLink to="/SearchTasks">SEARCH OPPORTUNITIES</RouterLink>
          <RouterLink to="/Profile">MY PROFILE ▼</RouterLink>
        </div>
      </nav>
  
      <div class="task-table-container">
        <h2>Here's what you signed up for</h2>
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
              <!-- added redirect to the full task details -->
              <td @click="viewTaskDetails(task.id)">{{ task.task_name }}</td> 
              <td>{{ task.start_date_time }}</td>
              <td>{{ task.location }}</td>
              <td>
                <button @click="cancelTask(task.id)" class="cancel-button">Cancel</button>
              </td>
            </tr>
            <tr v-if="tasks.length === 0">
              <td colspan="4">No tasks available</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { db } from '../firebase_setup';
  import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'; // Importing 'doc'
  import { auth } from '../firebase_setup';
  import { useRouter } from "vue-router";
  const router = useRouter();
  
  const tasks = ref([]);
  
  async function fetchTasks() {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const q = query(
        collection(db, 'task_reservations'),
        where('volunteer_id', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      tasks.value = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));
    }
  }
  
  async function cancelTask(taskID) {
    if (confirm('Are you sure you want to cancel this task?')) {
      await deleteDoc(doc(db, 'task_reservations', taskID)); // Using 'doc' here
      alert('Task successfully cancelled!');
      fetchTasks(); // Refresh the task list
    }
  }
  
  onMounted(fetchTasks);

  function viewTaskDetails(taskID) {
    router.push(`/ViewTask/${taskID}`);
  }
  </script>
  
  <style scoped>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #f8f8f8;
    border-bottom: 1px solid #ccc;
  }
  
  .navbar-logo {
    display: flex;
    align-items: center;
  }
  
  .navbar-logo img {
    height: 40px;
    margin-right: 10px;
  }
  
  .navbar-logo span {
    font-size: 1.5em;
    font-weight: bold;
  }
  
  .navbar-links {
    display: flex;
    gap: 20px;
  }
  
  .navbar-links a {
    text-decoration: none;
    color: #333;
    font-size: 1.1em;
    font-weight: 500;
  }
  
  .navbar-links a:hover {
    text-decoration: underline;
  }
  
  .task-table-container {
    width: 80%;
    margin: 0 auto;
    padding: 20px;
  }
  
  h2 {
    text-align: center;
    font-size: 1.8em;
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
  
  .cancel-button {
    background-color: #f8e7bc;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;
    font-size: 1em;
    color: #333;
  }
  
  .cancel-button:hover {
    background-color: #f4c9a1;
  }
  
  @media (max-width: 768px) {
    .task-table {
      font-size: 0.9em;
    }
  
    .navbar-links {
      flex-direction: column;
      gap: 10px;
    }
  }
  </style>
  