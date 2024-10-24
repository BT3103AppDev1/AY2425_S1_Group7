<script setup>
import AdministratorTaskbar from '@/components/AdministratorTaskbar.vue';
import { useRoute } from "vue-router";
import { db } from "../firebase_setup.js";
import { query, where, getDocs, collection, doc, getDoc } from "firebase/firestore";
import { ref, onMounted } from "vue";

const route = useRoute();
const taskID = route.params.taskID;
const taskResv = ref([]);

async function fetchTaskReservationDetails() {
    try {
        const resvCol = collection(db, "task_reservations");
        const resvQuery = query(resvCol, where("task_id", "==", taskID));
        const taskSnap = await getDocs(resvQuery);

        if (!taskSnap.empty) {
            const reservations = [];
            for (const docSnap of taskSnap.docs) {
                const resvData = docSnap.data();
                const volunteerRef = doc(db, "users", resvData.volunteer_id);
                const volunteerSnap = await getDoc(volunteerRef);

                if (volunteerSnap.exists()) {
                    const volunteerData = volunteerSnap.data();
                    reservations.push({
                        ...resvData,
                        username: volunteerData.username
                    });
                } else {
                    reservations.push({
                        ...resvData,
                        username: "Unknown Volunteer"
                    });
                }
            }

            taskResv.value = reservations;
        } 
    } catch (e) {
        alert(`Error fetching task reservation details: ${e.message}`);
    }
}

onMounted(() => {
    fetchTaskReservationDetails();
});
</script>

<template>
    <AdministratorTaskbar />
        
    <div class="task-table-container">
        <h2>Task Reservations</h2>
        <table class="task-table">
            <thead>
                <tr>
                    <th>Volunteer Name</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody v-if="taskResv.length > 0">
                <tr v-for="(resv, index) in taskResv" :key="index">
                    <td>{{ resv.username }}</td>
                    <td>{{ resv.reservation_date ? resv.reservation_date.toDate().toLocaleString() : 'No Date' }}</td>
                    <td id="approve-reject-buttons">
                        <button class="action-button edit">Approve</button> 
                        <button class="action-button view">Reject</button>
                    </td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr>
                    <td colspan="3" class="text-center">No Requests Yet</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style>
#approve-reject-buttons {
    display: flex;
    justify-content: space-around;
    flex: 1 0 10px;
}
</style>