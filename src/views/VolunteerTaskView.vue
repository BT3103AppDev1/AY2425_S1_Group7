<script setup>
import { db } from "../firebase_setup.js";
import { getDoc, doc, query, where, getDocs, collection, addDoc, Timestamp } from "firebase/firestore";
import { auth } from '../firebase_setup';
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Map from '../components/Map.vue';

const route = useRoute();
const taskID = route.params.taskID;

const taskName = ref('');
const startDateTime = ref('');
const endDateTime = ref('');
const location = ref('');
const location_lat = ref(null);
const location_lng = ref(null);
const requirements = ref([]);
const alreadySignedUp = ref(false);

async function fetchTaskDetails() {
    try {
        const taskRef = doc(db, "task", taskID);
        const taskSnap = await getDoc(taskRef);

        if (taskSnap.exists()) {
            const taskData = taskSnap.data();
            taskName.value = taskData.task_name;
            startDateTime.value = taskData.start_date_time.toDate().toLocaleString();
            endDateTime.value = taskData.end_date_time.toDate().toLocaleString();
            location.value = taskData.location;
            location_lat.value = taskData.location_lat;
            location_lng.value = taskData.location_lng;
            requirements.value = taskData.requirements || [];
        }
    } catch (e) {
        alert(`Error fetching task details: ${e.message}`);
    }
}

// check if the user has already signed up for the task
async function checkIfSignedUp() {
    const currentUser = auth.currentUser;

    if (currentUser) {
        const userId = currentUser.uid;
        const taskReservationsRef = collection(db, "task_reservations");
        const q = query(taskReservationsRef, where("task_id", "==", taskID), where("volunteer_id", "==", userId));

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            alreadySignedUp.value = true;
        }
    }
}

async function joinTask() {
    const currentUser = auth.currentUser;

    if (currentUser && !alreadySignedUp.value) {  
        const userId = currentUser.uid;

        try {
            const taskRef = collection(db, "task_reservations");
            await addDoc(taskRef, {
                task_id: taskID,
                volunteer_id: userId,
                reservation_date: Timestamp.now()
            });
            alreadySignedUp.value = true;
            alert('Successfully signed up for the task!');
        } catch (error) {
            alert(`Error joining task: ${error.message}`);
        }
    } else if (!currentUser) {
        alert("You need to be logged in to sign up for the task.");
    }
}

onMounted(() => {
    fetchTaskDetails();
    checkIfSignedUp();
});
</script>

<template>
    <div>
        <div class="volunteerViewTaskHeader">
            <h1>{{ taskName }}</h1>
            <div class="joinTaskButton">
                <button v-if="!alreadySignedUp" @click="joinTask">
                    Sign Up
                </button>
                <button v-else disabled>
                    Pending
                </button>
            </div>
        </div>
        
        <div class="taskDetails">
            <h2>Start Date: {{ startDateTime }}</h2>
            <h2>End Date: {{ endDateTime }}</h2>
            <h3 v-if="location">Location: {{ location }}</h3>
            <h4 v-if="requirements[0] != ''">Requirements: {{ requirements.join(', ') }}</h4>

            <Map v-if="location_lat && location_lng" :location="{ lat: location_lat, lng: location_lng }" />
        </div>
    </div>
</template>

<style scoped>
.volunteerViewTaskHeader {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;

    h1 {
        margin: 0;
    }
}

.taskDetails {
    padding: 1rem;
}

#map {
    height: 400px;
    width: 100%;
}
</style>