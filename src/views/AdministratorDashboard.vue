<script setup>
import AdministratorTaskbar from "../components/AdministratorTaskbar.vue"
import HomePageUsername from '@/components/HomePageUsername.vue'
import LastLoginDate from '@/components/LastLoginDate.vue';

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
                <h3>Add Tasks</h3>
                <p>Create new tasks for volunteers to sign up</p>
            </div>

            <div class="task-card2">
                <h3>Manage Users</h3>
                <p>Add, manage and delete users here</p>
            </div>

            <div class = "task-card3">
                <h3>Take Attendance</h3>
                <p>Record and track attendance of volunteers at events</p>
            </div>
        </div>

        <div class = "dashboard">
            <h2>Here’s what you missed out:</h2>

            <div class = "dashboard-cards">
                <div class = "requests">
                    <h3>XX</h3>
                    <p>Requests</p>
                </div>

                <div class = "attendance">
                    <h3>XX</h3>
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

.task-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.task-card1, .task-card2, .taskcard3 {
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