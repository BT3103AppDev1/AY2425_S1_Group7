<template>
    <div class="attendance-container">
        <AdministratorTaskbar />
        <div>
            <div id="task-management-header">
                <h1>Manage attendance here</h1>
                <p class="task-description">{{ taskDescription }} {{ activeTaskName }}</p>
                <p v-if="!canTakeAttendance" class="warning-text">
                    Attendance has been finalized for this task
                </p>
            </div>
        </div>

        <div class="main-content">
            <div class="content-container">
                <div class="action-buttons">
                    <button @click="markAll('present')" class="action-button present" :disabled="!canTakeAttendance">
                        Mark all as present
                    </button>
                    <button @click="markAll('absent')" class="action-button absent" :disabled="!canTakeAttendance">
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
                        <tbody v-if="taskResv.length > 0">
                            <tr v-for="(resv, index) in taskResv" :key="index">
                                <td>{{ resv.username }}</td>
                                <td class="attendance-cell">
                                    <div class="attendance-buttons">
                                        <button class="attendance-button" 
                                                :class="{ active: attendance.value[resv.volunteer_id]?.status === 'present' }"
                                                @click="confirmIndividual(resv.volunteer_id, 'present')"
                                                :disabled="!canTakeAttendance">
                                            Present
                                        </button>
                                        <button class="attendance-button"
                                                :class="{ active: attendance.value[resv.volunteer_id]?.status === 'absent' }"
                                                @click="confirmIndividual(resv.volunteer_id, 'absent')"
                                                :disabled="!canTakeAttendance">
                                            Absent
                                        </button>
                                    </div>
                                </td>
                                <td class="remarks-cell">
                                    <div class="remarks-container">
                                        <textarea 
                                            v-model="attendance.value[resv.volunteer_id].remark"
                                            placeholder="Add detailed remarks here..."
                                            class="remarks-textarea"
                                            rows="4"
                                            :disabled="!canTakeAttendance"
                                        ></textarea>
                                        <div class="character-count">
                                            {{ attendance.value[resv.volunteer_id]?.remark?.length || 0 }}/500
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="3" class="no-tasks">No approved volunteers found</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="footer-section">
                    <button @click="finalizeAttendance" class="finalize-button"
                            :disabled="!canTakeAttendance || Object.keys(attendance.value).length === 0">
                        Finalise ({{ Object.keys(attendance.value).length }} records)
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import AdministratorTaskbar from '@/components/AdministratorTaskbar.vue';
import { ref, onMounted } from 'vue';
import { db } from "../firebase_setup.js";
import { getDoc, getDocs, doc, collection, query, where, addDoc, updateDoc } from "firebase/firestore";

const props = defineProps(['taskID']);
const taskDescription = ref("You are currently taking attendance for");
const taskResv = ref([]);
const attendance = ref({});
const activeTaskName = ref("");
const canTakeAttendance = ref(true);

async function fetchActiveTaskName() {
    try {
        const taskRef = doc(db, "task", props.taskID);
        const taskSnapshot = await getDoc(taskRef);

        if (taskSnapshot.exists()) {
            const taskData = taskSnapshot.data();
            activeTaskName.value = taskData.task_name || "Unknown Task";
            canTakeAttendance.value = !taskData.attendance_finalised;
        } else {
            activeTaskName.value = "Unknown Task";
        }
    } catch (e) {
        console.error("Error fetching task name: ", e);
        activeTaskName.value = "Unknown Task";
    }
}

async function fetchApprovedVolunteers() {
    try {
        const approvedVolunteersQuery = query(
            collection(db, "task_assignment"),
            where("task_id", "==", props.taskID),
            where("status", "==", "accepted")
        );
        const volunteersSnapshot = await getDocs(approvedVolunteersQuery);

        const volunteers = [];
        for (const docSnap of volunteersSnapshot.docs) {
            const volunteerData = docSnap.data();
            const volunteerRef = doc(db, "users", volunteerData.volunteer_id);
            const volunteerSnap = await getDoc(volunteerRef);

            if (volunteerSnap.exists()) {
                const username = volunteerSnap.data().username || "Unknown Volunteer";
                volunteers.push({
                    volunteer_id: volunteerData.volunteer_id,
                    username: username
                });
            }
        }
        taskResv.value = volunteers;

        // Initialize attendance object with default values for status and remarks
        volunteers.forEach(volunteer => {
            if (!attendance.value[volunteer.volunteer_id]) {
                attendance.value[volunteer.volunteer_id] = { status: '', remark: '' };
            }
        });
    } catch (e) {
        console.error("Error fetching approved volunteers: ", e);
    }
}

function markAll(status) {
    if (!canTakeAttendance.value) return;

    const newAttendance = {};
    taskResv.value.forEach((volunteer) => {
        newAttendance[volunteer.volunteer_id] = {
            status: status,
            remark: attendance.value[volunteer.volunteer_id]?.remark || ""  // Preserve existing remarks
        };
    });
    attendance.value = newAttendance;
}

function confirmIndividual(volunteerId, status) {
    if (!canTakeAttendance.value) return;

    if (!attendance.value[volunteerId]) {
        attendance.value[volunteerId] = {
            status: status,
            remark: ""
        };
    } else {
        attendance.value[volunteerId].status = status;
        // Preserve existing remark
        if (!attendance.value[volunteerId].remark) {
            attendance.value[volunteerId].remark = "";
        }
    }
}

async function finalizeAttendance() {
    if (Object.keys(attendance.value).length === 0) {
        alert("No attendance records to save!");
        return;
    }

    // Validate remarks length
    for (const volunteerId in attendance.value) {
        if (attendance.value[volunteerId].remark?.length > 500) {
            alert("Remarks must not exceed 500 characters!");
            return;
        }
    }

    try {
        for (const volunteerId in attendance.value) {
            const attendanceData = {
                task_id: props.taskID,
                user_id: volunteerId,
                attendance_status: attendance.value[volunteerId].status,
                remark: attendance.value[volunteerId].remark || "",
                timestamp: new Date().toISOString()
            };

            await addDoc(collection(db, "user_attendance"), attendanceData);
        }

        const taskRef = doc(db, "task", props.taskID);
        await updateDoc(taskRef, { 
            attendance_finalised: true,
            attendance_finalised_at: new Date().toISOString()
        });
        
        canTakeAttendance.value = false;
        attendance.value = {};
        alert("All attendance records have been saved successfully!");
    } catch (error) {
        console.error("Error finalizing attendance:", error);
        alert(`Failed to save attendance records: ${error.message}`);
    }
}

onMounted(async () => {
    await fetchActiveTaskName();
    await fetchApprovedVolunteers();
});
</script>

<style scoped>
.attendance-container {
    width: 100%;
}

#task-management-header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
    margin-bottom: 0.2rem;
}

.warning-text {
    color: #ff4444;
    font-weight: bold;
    margin-top: 0.5rem;
}

.main-content {
    padding: 0 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.task-description {
    font-size: 1.2rem;
    color: #333;
    margin-top: 0.1rem;
}

.content-container {
    margin-top: 0.5rem;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-buttons {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-bottom: 1rem;
    padding: 1rem;
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

.action-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.task-table-container {
    padding: 1.5rem;
}

.task-table {
    width: 100%;
    border-collapse: collapse;
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

.attendance-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.remarks-cell {
    min-width: 300px;
    max-width: 400px;
    padding: 0.5rem;
}

.remarks-container {
    position: relative;
    width: 100%;
}

.remarks-textarea {
    width: 100%;
    min-height: 100px;
    padding: 0.75rem;
    border: 2px solid #000;  /* 검정색 테두리 */
    border-radius: 4px;
    resize: vertical;
    font-family: inherit;
    font-size: 0.9rem;
    line-height: 1.5;
    background-color: #fff;
    transition: border-color 0.2s;
}

.remarks-textarea:focus {
    outline: none;
    border-color: #000;  /* 포커스 시에도 검정색 유지 */
    box-shadow: none;
}

.remarks-textarea:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.7;
}

.remarks-textarea::placeholder {
    color: #999;
}

.character-count {
    position: absolute;
    bottom: 5px;
    right: 10px;
    font-size: 0.8rem;
    color: #666;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 2px 5px;
    border-radius: 4px;
}

.footer-section {
    display: flex;
    justify-content: flex-end;
    padding: 1rem 1.5rem;
    border-top: 1px solid #eee;
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

.finalize-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.no-tasks {
    text-align: center;
    color: #666;
    padding: 2rem;
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

    .attendance-buttons {
        flex-direction: column;
    }

    .attendance-button {
        width: 100%;
    }

    .remarks-cell {
        min-width: 200px;
    }
    
    .remarks-textarea {
        min-height: 80px;
    }
}
</style>