<template>
    <h1>Take your attendance here!</h1>
</template>

<script setup>
import { ref } from 'vue'
import { db } from "../firebase_setup.js";
import { getDocs, collection, query, where } from 'firebase/firestore';
import { useRoute } from "vue-router";
const attendance = ref({})

const route = useRoute();
const taskID = route.params.taskID; //CHANGE IF REQUIRED
const q = query(collection(db, 'reservation'), where('task_reservation', '==', taskID))
let listOfVolunteers = getDocs(q);
listOfVolunteers.map((doc) => doc.data().volunteer_id) //CHANGE IF REQUIRED
attendance.value = listOfVolunteers.reduce((acc, key) => {
    acc[key] = false;
    return acc;
}, {});
</script>

<style scoped>
</style>