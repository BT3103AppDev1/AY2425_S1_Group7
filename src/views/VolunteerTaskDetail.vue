<script setup>
import { db } from "../firebase_setup.js";
import { getDoc, doc, query, where, getDocs, collection, addDoc, Timestamp } from "firebase/firestore";
import { auth } from '../firebase_setup';
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import Map from '../components/Map.vue';
import VolunteerTaskbar from '../components/VolunteerTaskbar.vue';
import SessionSelection from "@/components/SessionSelection.vue";

const route = useRoute();
const taskID = route.params.taskID;

const taskName = ref('');
const startDateTime = ref('');
const endDateTime = ref('');
const location = ref('');
const description = ref('');
const location_lat = ref(null);
const location_lng = ref(null);
const requirements = ref([]);
const signedUpStatus = ref('');
const sessions = ref([]);

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
            description.value = taskData.description;
            requirements.value = taskData.requirements || [];
            sessions.value = taskData.sessions || [];
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
        console.log(querySnapshot)
        if (!querySnapshot.empty) {
            const assignmentQuery = query(
            collection(db, 'task_assignment'),
            where('task_id', '==', taskID),
            where('volunteer_id', '==', currentUser.uid)
            );

            const assignmentSnapshot = await getDocs(assignmentQuery);
            if (!assignmentSnapshot.empty) {
                const assignmentDoc = assignmentSnapshot.docs[0];
                signedUpStatus.value = assignmentDoc.data().status;
            } else {
                signedUpStatus.value = 'pending';
            }
        }
    }
}

async function joinTask() {
    const currentUser = auth.currentUser;

    if (currentUser && !signedUpStatus.value) {  
        const userId = currentUser.uid;

        try {
            const taskRef = collection(db, "task_reservations");
            await addDoc(taskRef, {
                task_id: taskID,
                volunteer_id: userId,
                reservation_date: Timestamp.now()
            });
            signedUpStatus.value = true;
            alert('Successfully signed up for the task!');
        } catch (error) {
            alert(`Error joining task: ${error.message}`);
        }
    } else if (!currentUser) {
        alert("You need to be logged in to sign up for the task.");
    }
}

function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}


const sortedSessions = computed(() => {
    return [...sessions.value].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        if (dateA.getTime() !== dateB.getTime()) {
            return dateA - dateB;
        }
        
        return timeToMinutes(a.start_time) - timeToMinutes(b.start_time);
    });
});

onMounted(() => {
    fetchTaskDetails();
    checkIfSignedUp();
});
</script>

<template>
<VolunteerTaskbar></VolunteerTaskbar>
<div>
    <div class="task-detail-header">
        <h1>{{ taskName }}</h1>
        <div>
            <button class="task-detail-button" v-if="!signedUpStatus" @click="joinTask">
                Sign Up
            </button>
            <button class="task-detail-button pending" v-else-if="signedUpStatus === 'pending'" disabled>
                Pending
            </button>
            <button class="task-detail-button status" v-else disabled>
                {{ signedUpStatus }}
            </button>
        </div>
    </div>
</div>
<div class="task-details">
    <p v-if="description">{{ description }}</p>
    
    <strong v-if="requirements[0] != ''">Requirements</strong>
    <p v-if="requirements[0] != ''">{{ requirements.join(', ') }}</p>

    <strong>Task Details:</strong>
    <p>Start Date: {{ startDateTime }}</p>
    <p>End Date: {{ endDateTime }}</p>

    <div v-if="signedUpStatus !== 'accepted'">
        <div v-if="sortedSessions.length > 0" class="session-detail-container">
            <strong>Session Schedule</strong>
            <div class="sessions-container">
                <div v-for="(session, index) in sortedSessions" :key="index" class="sessionCard">
                    <div class="session-date">{{ session.date }}</div>
                    <div class="session-time">
                        <span>{{ session.start_time }}</span>
                        <span class="time-separator">to</span>
                        <span>{{ session.end_time }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <SessionSelection
        v-else
        :sessions="sortedSessions"
        :taskId="taskID"
        :volunteerId="auth.currentUser?.uid"
    />

    <p v-if="location">Location: {{ location }}</p>
    
    <Map v-if="location_lat && location_lng" :location="{ lat: location_lat, lng: location_lng }" />
</div>
</template>

<style>
.task-detail-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;

    h1 {
        margin: 0;
    }
}

.task-details {
    padding: 0.5rem 1rem;
}

.task-detail-button {
    border: 1px solid #ccc;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;
    font-size: 1em;
}

.pending, .status {
    cursor: not-allowed;
}

#map {
    height: 400px;
    width: 80%;
}
</style>