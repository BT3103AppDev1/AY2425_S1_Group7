<script setup>
import { db } from "../../firebase_setup.js";
import { getDoc, doc } from "firebase/firestore";
import { ref, onMounted, toRefs } from "vue";

const props = defineProps({
  taskID: {
    type: String,
    required: true
  }
});

const { taskID } = toRefs(props);
const taskName = ref('');
const startDateTime = ref('');
const endDateTime = ref('');
const location = ref('');
const requirements = ref([]);

// fetch data for each task and add it to an individual task card
async function fetchTaskData(taskID) {
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
        console.log(requirements)
    } catch (e) {
        alert(`Error fetching task: ${e.message}`);
    }
}

onMounted(() => {
    fetchTaskData(taskID.value);
});
</script>

<template>
    <div class="taskCard">
        <h3>{{ taskName }}</h3>
        <h4>Start Date: {{ startDateTime }}</h4>
        <h4>End Date: {{ endDateTime }}</h4>
        <h4 v-if="location">Location: {{ location }}</h4>
        <h4 v-if="requirements[0] != ''">Requirements: {{ requirements.join(', ') }}</h4>
    </div>
</template>

<style scoped>
.taskCard {
    border: black 1px solid;
    margin: 1rem;
    padding: 1rem .5rem;

    h3, h4 {
        width: fit-content;
    }
}

.taskCard h3:hover {
    text-decoration: underline;
    cursor: pointer;
}

.taskCard h4 {
    cursor: default;
}
</style>