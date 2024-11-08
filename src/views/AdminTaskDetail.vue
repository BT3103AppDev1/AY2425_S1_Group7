<script setup>
import AdministratorTaskbar from '@/components/AdministratorTaskbar.vue';
import { db } from "../firebase_setup.js";
import { getDoc, doc } from "firebase/firestore";
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Map from '../components/Map.vue';

const route = useRoute();
const router = useRouter();
const taskID = route.params.taskID;

const taskName = ref('');
const startDateTime = ref('');
const endDateTime = ref('');
const location = ref('');
const description = ref('');
const location_lat = ref(null);
const location_lng = ref(null);
const requirements = ref([]);
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

function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}


const sortedSessions = computed(() => {
    return [...sessions.value].sort((a, b) => {
        // First compare dates
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        if (dateA.getTime() !== dateB.getTime()) {
            return dateA - dateB;
        }
        
        // If dates are equal, compare start times
        return timeToMinutes(a.start_time) - timeToMinutes(b.start_time);
    });
});

onMounted(() => {
    fetchTaskDetails();
});
</script>

<template>
<AdministratorTaskbar />

<div>
    <div class="task-detail-header">
        <h1>{{ taskName }}</h1>
        <div>
            <button class="task-detail-button" @click="router.push({ path: '/EditTask/' + taskID})">
                Edit Details
            </button>
        </div>
    </div>
    <div class="task-details">
        <p v-if="description">{{ description }}</p>
        
        <strong v-if="requirements[0] != ''">Requirements</strong>
        <p v-if="requirements[0] != ''">Requirements: {{ requirements.join(', ') }}</p>

        <strong>Task Details:</strong>
        <p>Start Date: {{ startDateTime }}</p>
        <p>End Date: {{ endDateTime }}</p>

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

        <p v-if="location">Location: {{ location }}</p>
        
        <Map v-if="location_lat && location_lng" :location="{ lat: location_lat, lng: location_lng }" />
    </div>
</div>
</template>

<style>
.session-detail-container {
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
}

.session-detail-container:last-child {
    border-bottom: none;
}
.sessions-container {
    display: grid;
    gap: 15px;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

.sessionCard {
    margin-top: 10px;
    border-radius: 6px;
    padding: 15px;
    border: 1px solid #ccc;
    /* transition: transform 0.2s ease;
    cursor: pointer; */
}

/* .sessionCard:hover {
    transform: translateY(-2px);
} */

.session-date {
    font-weight: bold;
    margin-bottom: 8px;
}

.session-time {
    display: flex;
    align-items: center;
    color: #6c757d;
    gap: 8px;
}

.time-separator {
    color: #adb5bd;
}
</style>