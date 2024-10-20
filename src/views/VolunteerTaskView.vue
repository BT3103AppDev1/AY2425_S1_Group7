<template>
    <div>
      <VolunteerTaskbar></VolunteerTaskbar>
  
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
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { db } from '../firebase_setup';
  import { collection, query, where, getDocs, getDoc, deleteDoc, doc } from 'firebase/firestore'; // Importing 'doc'
  import { auth } from '../firebase_setup';
  import { useRouter } from "vue-router";
  import VolunteerTaskbar from '../components/VolunteerTaskbar.vue';
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

      // Fetch task details for each task ID
      const tasksPromises = allTaskIds.map(async (tDoc) => {
        const taskDoc = await getDoc(doc(db, 'task', tDoc.data().task_id));
        return taskDoc.exists() ? { id: tDoc.id, ...taskDoc.data() } : null; // Return task data or null
      });

      // Wait for all task fetch promises to resolve
      tasks.value = await Promise.all(tasksPromises);
      
      // Filter out any null values (if a task wasn't found)
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
      await deleteDoc(doc(db, 'task_reservations', taskID)); // Using 'doc' here
      alert('Task successfully cancelled!');
      await fetchTasks(); // Refresh the task list after deletion
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
  
  <style>
  .task-table-container {
    width: 80%;
    margin: 0 auto;
    padding: 20px;

    h2 {
      text-align: center;
      font-size: 1.8em;
      color: #333;
      margin-bottom: 20px;
    }
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
  