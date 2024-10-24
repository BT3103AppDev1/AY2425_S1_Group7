<script setup>
import AdministratorTaskbar from '@/components/AdministratorTaskbar.vue';
import { db } from "../firebase_setup.js";
import { getDoc, doc } from "firebase/firestore";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Map from '../components/Map.vue';

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
        }
    } catch (e) {
        alert(`Error fetching task details: ${e.message}`);
    }
}

onMounted(() => {
    fetchTaskDetails();
});
</script>

<template>
    <AdministratorTaskbar />
    
    <div>
        <div class="taskDetailHeader">
            <h1>{{ taskName }}</h1>
            <div>
                <button class="taskDetailButton">
                    Edit Details
                </button>
            </div>
        </div>
        <div class="taskDetails">
            <p v-if="description">{{ description }}</p>
            
            <strong v-if="requirements[0] != ''">Requirements</strong>
            <p v-if="requirements[0] != ''">Requirements: {{ requirements.join(', ') }}</p>

            <strong>Task Details:</strong>
            <p>Start Date: {{ startDateTime }}</p>
            <p>End Date: {{ endDateTime }}</p>

            <p v-if="location">Location: {{ location }}</p>
            
            <Map v-if="location_lat && location_lng" :location="{ lat: location_lat, lng: location_lng }" />
        </div>
    </div>
</template>

<style>
</style>