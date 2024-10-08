<script setup>
    import {db} from "../firebase_setup.js";
    import {getDocs, collection, query, doc, deleteDoc} from "firebase/firestore";
    import {ref, onMounted} from "vue"

    const dataList = ref({});

    onMounted(async () => {
    const q = query(collection(db, "task"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const startDateTime = data.start_date_time.toDate(); // Convert to Date

        // Format the date and time without timezone
        const options = { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true // Use 24-hour format, set to true for 12-hour format
        };

        const formattedDateTime = startDateTime.toLocaleString('en-US', options).replace(',', ''); // Remove timezone info

        dataList.value[doc.id] = {
            taskName: data.task_name,
            startDateTime: formattedDateTime
        };
    });


});

const removeTask = (key) => {
        alert('You are about to remove this task. Are you sure?')
        deleteDoc(doc(db, "task", key)).then(() => {
            delete dataList.value[key]
        })
    }
</script>

<template>
    <table>
        <thead>
            <td>Upcoming Tasks</td>
            <td>Start Date & Time</td>
            <td>Actions</td>
        </thead>
        <tbody v-for="(entry, key) in dataList" :key="key">
            <td>{{entry.taskName}}</td>
            <td>{{entry.startDateTime}}</td>
            <td><button @click="removeTask(key)">Delete?</button></td>
        </tbody>
    </table>
</template>

<style scoped>
</style>