<script setup>
import AdministratorTaskbar from '@/components/AdministratorTaskbar.vue';
import { ref, onMounted } from 'vue';
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase_setup.js";
import { RouterLink } from 'vue-router';
import router from '@/router';

const tasksList = ref([]);
const filteredTasks = ref([]);

async function fetchAllTasks() {
    const tasksSnapshot = await getDocs(collection(db, "task"));
    tasksList.value = tasksSnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
    }));
    filteredTasks.value = [...tasksList.value];
}

function viewTaskDetails(taskID) {
    router.push(`/Admin/ViewTask/${taskID}`);
}

onMounted(async () => {
    fetchAllTasks();
});
</script>

<template>
    <AdministratorTaskbar />
    
    <div>
        <div id="taskManagementHeader">
            <h1>Manage Tasks</h1>
            <div id="taskManagementHeaderButtons">
                <RouterLink to="/Admin/AddTasks"><button class="headerButton">+ Add Task</button></RouterLink>
                <RouterLink><button class="headerButton">View Past Tasks</button></RouterLink>
            </div>            
        </div>
    </div>
    <div class="task-table-container">
        <table class="task-table">
            <thead>
                <tr>
                    <th>Active Tasks</th>
                    <th></th>
                    <th>Actions</th>
                    <th></th>
                </tr>
            </thead>
            <tbody v-if="filteredTasks.length > 0">
                <tr v-for="task in filteredTasks" :key="task.id">
                    <td>{{ task.data.task_name }}</td>
                    <td><button class="action-button view" @click="viewTaskDetails(task.id)">View Details</button></td>
                    <td><RouterLink><button class="action-button edit">Edit Details</button></RouterLink></td>
                    <td><RouterLink><button class="action-button manage">Manage Volunteers</button></RouterLink></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style>
.headerButton {
    border: 1px solid #ccc;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;
    font-size: 1em;
}

#taskManagementHeader {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
}
#taskManagementHeaderButtons {
    display: flex;
    gap: 10px;
}
.view {
    background-color:#dda9a9;
}
.view:hover {
    background-color:#cc6c6c;
}

.manage {
    background-color: #97bdc4;
}
.manage:hover {
    background-color: #84acbc;
}
</style>