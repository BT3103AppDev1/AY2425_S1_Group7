<script setup>
import AdministratorTaskbar from '@/components/AdministratorTaskbar.vue';
import { ref } from 'vue';

const taskDescription = ref("Supervising children from Lakeside Family Services for field trip");
const taskResv = ref([
    { username: "Test User 1", volunteer_id: "user1" },
    { username: "ZHD1987E", volunteer_id: "user2" }
]);
const attendance = ref({});
const showConfirmationModal = ref(false);
const confirmationMessage = ref("");
const actionType = ref("");
const selectedVolunteerId = ref("");

function markAll(status) {
    confirmationMessage.value = `Are you sure you want to mark all volunteers as ${status}?`;
    actionType.value = status === "present" ? "markAllPresent" : "markAllAbsent";
    showConfirmationModal.value = true;
}

function confirmIndividual(volunteerId, status) {
    selectedVolunteerId.value = volunteerId;
    attendance.value[volunteerId] = status;
    confirmationMessage.value = `Are you sure you want to mark this volunteer as ${status}?`;
    actionType.value = status;
    showConfirmationModal.value = true;
}

function confirmSubmit() {
    showConfirmationModal.value = false;
}

function cancelSubmit() {
    showConfirmationModal.value = false;
}

function finalizeAttendance() {
    alert("Attendance has been finalized!");
}
</script>

<template>
    <div class="admin-container">
        <AdministratorTaskbar />

        <div class="content-container">
            <div class="header-section">
                <div class="header-left">
                    <h1>Manage attendance here</h1>
                    <p class="task-description">{{ taskDescription }}</p>
                </div>
                <div class="header-buttons">
                    <button @click="markAll('present')" class="control-button present">
                        Mark all as present
                    </button>
                    <button @click="markAll('absent')" class="control-button absent">
                        Mark all as absent
                    </button>
                </div>
            </div>

            <div class="table-container">
                <table class="attendance-table">
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
                                        class="attendance-btn"
                                        :class="{ active: attendance[resv.volunteer_id] === 'present' }"
                                        @click="confirmIndividual(resv.volunteer_id, 'present')">
                                        Present
                                    </button>
                                    <button 
                                        class="attendance-btn"
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
.admin-container {
    min-height: 100vh;
    background-color: #f5f5f5;
}

.content-container {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.header-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
}

.header-left h1 {
    font-size: 2.5rem;
    font-weight: bold;
    color: #000;
    margin-bottom: 0.5rem;
}

.task-description {
    font-size: 1.2rem;
    color: #333;
}

.header-buttons {
    display: flex;
    gap: 1rem;
}

.control-button {
    padding: 1rem 2rem;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
}

.control-button.present {
    background-color: #b3d9df;
    color: #000;
}

.control-button.absent {
    background-color: #f1b3b3;
    color: #000;
}

.table-container {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 2rem;
    overflow: hidden;
}

.attendance-table {
    width: 100%;
    border-collapse: collapse;
}

.attendance-table th,
.attendance-table td {
    padding: 1rem;
    text-align: left;
    border: 1px solid #e0e0e0;
}

.attendance-table th {
    font-size: 1.1rem;
    font-weight: bold;
    background-color: #fff;
}

.attendance-cell {
    width: 300px;
}

.attendance-buttons {
    display: flex;
    gap: 1rem;
}

.attendance-btn {
    padding: 0.5rem 2rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    background-color: #f5f5f5;
    transition: all 0.2s;
}

.attendance-btn.active {
    background-color: #4a90e2;
    color: white;
}

.footer-section {
    display: flex;
    justify-content: flex-end;
}

.finalize-button {
    padding: 1rem 3rem;
    border: none;
    border-radius: 25px;
    font-size: 1.1rem;
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
    .header-section {
        flex-direction: column;
        gap: 1rem;
    }

    .header-buttons {
        width: 100%;
    }

    .control-button {
        width: 100%;
    }

    .attendance-buttons {
        flex-direction: column;
    }

    .attendance-btn {
        width: 100%;
    }
}
</style>
