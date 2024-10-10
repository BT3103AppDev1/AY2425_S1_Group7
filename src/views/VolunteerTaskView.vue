<script setup>
import { db } from "../firebase_setup.js";
import { getDoc, doc } from "firebase/firestore";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const taskID = route.params.taskID;

const taskName = ref('');
const startDateTime = ref('');
const endDateTime = ref('');
const location = ref('');
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
            requirements.value = taskData.requirements || [];
        }
    } catch (e) {
        alert(`Error fetching task details: ${e.message}`);
    }
}

async function joinTask() {
    // will add in the function later when we create the volunteers
}

onMounted(() => {
    fetchTaskDetails();
});
</script>

<template>
    <div>
        <div class="volunteerViewTaskHeader">
            <h1>{{ taskName }}</h1>
            <div class="joinTaskButton">
                <button @click="joinTask">
                    Sign Up
                </button>
            </div>
        </div>
        
        <h2>Start Date: {{ startDateTime }}</h2>
        <h2>End Date: {{ endDateTime }}</h2>
        <h3 v-if="location">Location: {{ location }}</h3>
        <h4 v-if="requirements[0] != ''">Requirements: {{ requirements.join(', ') }}</h4>
    </div>
</template>

<style>
</style>