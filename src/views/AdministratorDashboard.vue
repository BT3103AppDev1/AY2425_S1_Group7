<script setup>
import AdministratorTaskbar from "../components/AdministratorTaskbar.vue"
import HomePageUsername from '@/components/HomePageUsername.vue'
import LastLoginDate from '@/components/LastLoginDate.vue';
import { db } from "@/firebase_setup.js";
import { query, collection, where, getCountFromServer, Timestamp } from 'firebase/firestore';
import { ref } from 'vue';

const requestsToManage = ref(0);
const tasksToTakeAttendance = ref(0);

const collOfRequests = collection(db, 'task_reservation');
const collOfAttendance = collection(db, 'task');
const queryOfRequests = query(collOfRequests)
const queryOfAttendance = query(collOfAttendance, where('start_date_time', '>=', Timestamp.fromDate(new Date(new Date().setHours(0,0,0,0)))), where('start_date_time', '<=', Timestamp.fromDate(new Date(new Date().setHours(23,59,59,999)))))

Promise.all([getCountFromServer(queryOfRequests),getCountFromServer(queryOfAttendance)]).then((values) => {
  requestsToManage.value = values[0].data().count;
  tasksToTakeAttendance.value = values[1].data().count;
}).catch((error) => {
  alert(error.message);
  requestsToManage.value = "XX";
  tasksToTakeAttendance.value = "XX";
})

</script>

<template>
    <AdministratorTaskbar></AdministratorTaskbar>
    
    <div class="admin-homepage">
        <HomePageUsername /> <!-- Renders the username -->
        <LastLoginDate /> <!-- Renders the last login date -->
    </div>

    <div class = "task-options">
        <h2>What would you like to do today?</h2>
        
        <div class="task-grid">
            <div class="task-card1">
              <RouterLink to="/Admin/ManageTasks">
                <h3>Manage Tasks</h3>
                <p>Add, manage and delete tasks for volunteers</p>
              </RouterLink>
            </div>
          

            <div class="task-card2">
              <RouterLink to="/Admin/ManageUsers"> <!-- This is a placeholder. For now this will go to a 'Page Not Found' page. Edit once the Manage Users page is complete. -->
                <h3>Manage Users</h3>
                <p>Add, manage and delete users here</p>
              </RouterLink>
            </div>

            <div class = "task-card3">
              <RouterLink to="/TakeAttendance">
                <h3>Take Attendance</h3>
                <p>Record and track attendance of volunteers at events</p>
              </RouterLink>
            </div>
        </div>

        <div class = "dashboard">
            <h2>Here’s what you missed out:</h2>

            <div class = "dashboard-cards">
                <div class = "requests">
                  <RouterLink to="/Admin/TaskAssignment">
                    <h3> {{ requestsToManage }}</h3>
                    <p>Requests</p>
                  </RouterLink>
                </div>              

                <div class = "attendance">
                    <h3>{{ tasksToTakeAttendance }}</h3>
                    <p>Attendance to submit</p>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
.admin-homepage {
    padding: 20px;
}

h1, h2 {
    margin-bottom: 20px;
}

.task-options {
  padding: 20px;
}

.task-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.task-card1, .task-card2, .task-card3 {
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    transition: box-shadow 0.3s ease;
}

.task-card1:hover, .task-card2:hover, .task-card3:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.task-card1 >>> a, .task-card2 >>> a, .task-card3 >>> a {
  text-decoration: none;
}

.dashboard {
  margin-top: 40px;
}

.dashboard-cards {
  display: flex;
  gap: 20px;
}

.requests, .attendance {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  flex: 1;
  text-align: center;
}

.requests h3 {
  font-size: 40px;
  margin: 0;
}

.attendance h3 {
  font-size: 40px;
  margin: 0;
}

.requests p {
  margin: 5px 0 0;
}

.attendance p {
  margin: 5px 0 0;
}

</style>    