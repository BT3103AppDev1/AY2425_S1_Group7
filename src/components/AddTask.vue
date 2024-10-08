<script setup>
import { db } from "../firebase_setup.js";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const taskName = ref('');
const startDateTime = ref('');
const endDateTime = ref('');
const location = ref('');
const requirements = ref('');

function processData() {
    const fDateCheck = new Date(startDateTime.value);
    const tDateCheck = new Date(endDateTime.value);

    if (fDateCheck >= tDateCheck) {
        alert('Your start date and time must be before the end date and time!');
    } else {
        if (confirm(`You are about to add ${taskName.value}, are you sure?`) == true) {
            const dataUpload = {
            task_name: taskName.value,
            start_date_time: Timestamp.fromDate(fDateCheck),
            end_date_time: Timestamp.fromDate(tDateCheck),
            location: location.value,
            requirements: requirements.value.split(",").map(command => command.trim())
        };

        addDoc(collection(db, "task"), dataUpload)
            .then(() => {
                router.replace('/ViewTasks');
                taskName.value = '';
                startDateTime.value = '';
                endDateTime.value = '';
                location.value = '';
                requirements.value = '';
            })
            .catch((error) => {
                alert(error.message);
                taskName.value = '';
                startDateTime.value = '';
                endDateTime.value = '';
                location.value = '';
                requirements.value = '';
            });
    }
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
    <label for="location">Location</label>
    <textarea v-model="location" id="location" required></textarea>
    <label for="requirements">Requirements</label>
    <input v-model="requirements" id="requirements" placeholder="Separate by commas">
    <input type="submit" @click.prevent="processData" value = "Save task!">
</form>
</template>

<style scoped>
</style>