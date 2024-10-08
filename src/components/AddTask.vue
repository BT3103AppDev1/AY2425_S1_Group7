<script setup>
    import {db} from "../firebase_setup.js";
    import {addDoc, collection, Timestamp} from "firebase/firestore";
    import {ref} from "vue";
    import { useRouter } from "vue-router";

    const router = useRouter();

    const taskName = ref('');
    const startDateTime = ref(new Date());
    const endDateTime = ref(new Date());
    const errorMsg = ref('');
    function processData() {
        const dataUpload = {
            task_name : taskName.value,
            start_date_time : Timestamp.fromDate(new Date(startDateTime.value)),
            end_date_time : Timestamp.fromDate(new Date(endDateTime.value))
        }
        addDoc(collection(db, "task"), dataUpload).then(() => {
            router.replace('/ViewTasks');
            taskName.value = ref('');
            startDateTime.value = ref(new Date());
            endDateTime.value = ref(new Date());
            errorMsg.value = ref('');
        }).catch(() => {
            errorMsg.value = 'There was a problem uploading the task. Try again later.';
            taskName.value = ref('');
            startDateTime.value = ref(new Date());
            endDateTime.value = ref(new Date());
        })
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