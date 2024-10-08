<script setup>
import { db } from "../firebase_setup.js";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const taskName = ref('');
const startDateTime = ref(''); // Initialize as empty string
const endDateTime = ref(''); // Initialize as empty string

function processData() {
    const fDateCheck = new Date(startDateTime.value);
    const tDateCheck = new Date(endDateTime.value);

    if (fDateCheck >= tDateCheck) {
        alert('Your start date and time must be before the end date and time!');
    } else {
        const dataUpload = {
            task_name: taskName.value,
            start_date_time: Timestamp.fromDate(fDateCheck),
            end_date_time: Timestamp.fromDate(tDateCheck)
        };

        addDoc(collection(db, "task"), dataUpload)
            .then(() => {
                router.replace('/ViewTasks');
                // Reset values correctly
                taskName.value = '';
                startDateTime.value = '';
                endDateTime.value = '';
            })
            .catch((error) => {
                alert(error.message);
                taskName.value = '';
                startDateTime.value = '';
                endDateTime.value = '';
            });
    }
}
</script>

<template>
<form>
    <label for="taskName">Task Name</label>
    <input v-model="taskName" id="taskName" required>
    <label for="startDateTime">Start Date & Time</label>
    <input v-model="startDateTime" type="datetime-local" id="startDateTime" required>
    <label for="endDateTime">End Date & Time</label>
    <input v-model="endDateTime" type="datetime-local" id="endDateTime" required>
    <input type="submit" @click.prevent="processData">
</form>
</template>

<style scoped>
</style>