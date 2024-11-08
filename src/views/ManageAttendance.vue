<script setup>
import AdministratorTaskbar from '@/components/AdministratorTaskbar.vue';
import { ref, onMounted } from 'vue';
import { db } from "../firebase_setup.js";
import router from '@/router';
import { getDoc, doc } from "firebase/firestore";


const taskDescription = ref("You are currently taking attendance for");
const taskResv = ref([]);
const attendance = ref({});
const activeTaskName = ref("");

async function fetchActiveTaskName(taskID) {
    try {
        const taskRef = doc(db, "task", taskID);
        const taskSnapshot = await getDoc(taskRef);
        if (taskSnapshot.exists()) {
            activeTaskName.value = taskSnapshot.data().task_name || "Unknown Task";
        } else {
            activeTaskName.value = "Unknown Task";
        }
    } catch (e) {
        console.error("Error fetching task name: ", e);
        activeTaskName.value = "Unknown Task";
    }
}


function markAll(status) {
    taskResv.value.forEach((volunteer) => {
        attendance.value[volunteer.volunteer_id] = status;
    });
}

function confirmIndividual(volunteerId, status) {
    attendance.value[volunteerId] = status;
}

function finalizeAttendance() {
    alert("Attendance has been finalized!");
}

onMounted(async () => {
    const taskID = router.currentRoute.value.params.taskID;
    await fetchActiveTaskName(taskID);
});
</script>

<template>
<AdministratorTaskbar />
<div>
    <!-- 제목 및 설명 위치를 조정하여 Manage attendance here 아래에 나타나도록 함 -->
    <div id="task-management-header">
        <h1>Manage attendance here</h1>
        <p class="task-description">{{ taskDescription }} {{ activeTaskName }}</p>
    </div>
</div>

<div class="main-content">
    <div class="content-container">
        <div class="action-buttons">
            <button @click="markAll('present')" class="action-button present">
                Mark all as present
            </button>
            <button @click="markAll('absent')" class="action-button absent">
                Mark all as absent
            </button>
        </div>

        <div class="task-table-container">
            <table class="task-table">
                <thead>
                    <tr>
                        <th>User Name</th>
                        <th>Attendance</th>
                        <th>Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(resv, index) in taskResv" :key="index">
                        <td>{{ resv.username }}</td>
                        <td class="attendance-cell">
                            <div class="attendance-buttons">
                                <button 
                                    class="attendance-button"
                                    :class="{ active: attendance[resv.volunteer_id] === 'present' }"
                                    @click="confirmIndividual(resv.volunteer_id, 'present')">
                                    Present
                                </button>
                                <button 
                                    class="attendance-button"
                                    :class="{ active: attendance[resv.volunteer_id] === 'absent' }"
                                    @click="confirmIndividual(resv.volunteer_id, 'absent')">
                                    Absent
                                </button>
                            </div>
                        </td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="footer-section">
            <button @click="finalizeAttendance" class="finalize-button">
                Finalise
            </button>
        </div>
    </div>
</div>
</template>

<style scoped>
#task-management-header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
    margin-bottom: 0.2rem;
}

.admin-container {
    min-height: 100vh;
    background-color: #ffffff;
}

.main-content {
    padding: 0 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.page-title {
    font-size: 2rem;
    font-weight: bold;
    color: #000;
    display: flex;
    justify-content: flex-start;
    padding: 1rem;
}

.task-description {
    font-size: 1.2rem;
    color: #333;
    margin-top: 0.1rem;
}

.content-container {
    margin-top: 0.5rem;
}

.action-buttons {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-bottom: 1rem;
}

.action-button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.action-button.present {
    background-color: #b3d9df;
    color: #000;
}

.action-button.absent {
    background-color: #f1b3b3;
    color: #000;
}

.task-table-container {
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    margin-bottom: 2rem;
}

.task-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed; /* 각 열의 너비를 동일하게 설정 */
}

.task-table th,
.task-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
}

.task-table th {
    background-color: #f8f9fa;
    font-weight: bold;
    font-size: 1rem;
    width: 33.33%; /* 각 열의 너비를 동일하게 설정 */
}

.attendance-cell {
    width: auto;
}

.attendance-buttons {
    display: flex;
    gap: 0.5rem;
}

.attendance-button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    font-size: 0.9rem;
    cursor: pointer;
    background-color: #f5f5f5;
    transition: all 0.2s;
}

.attendance-button.active {
    background-color: #97bdc4;
    color: white;
}

.footer-section {
    display: flex;
    justify-content: flex-end;
}

.finalize-button {
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 25px;
    font-size: 1rem;
    font-weight: 500;
    background-color: #fdd835;
    color: #000;
    cursor: pointer;
    transition: background-color 0.2s;
}

.finalize-button:hover {
    background-color: #fbc02d;
}

@media (max-width: 768px) {
    .main-content {
        padding: 1rem;
    }

    .action-buttons {
        flex-direction: column;
    }

    .action-button {
        width: 100%;
    }

    .task-table-container {
        padding: 1rem;
    }

    .task-table th,
    .task-table td {
        padding: 0.75rem;
    }

    .attendance-buttons {
        flex-direction: column;
    }

    .attendance-button {
        width: 100%;
    }

    .finalize-button {
        width: 100%;
    }
}
</style>
