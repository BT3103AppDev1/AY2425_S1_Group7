<script setup>
import { ref } from 'vue';
import TaskCards from "../components/TaskSearch/TaskCards.vue";
import TaskFilter from "../components/TaskSearch/TaskFilter.vue";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase_setup.js";

const tasksList = ref([]);
const filteredTasks = ref([]);

async function fetchAllTasks() {
    const tasksSnapshot = await getDocs(collection(db, "task"));
    tasksList.value = tasksSnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
    }));
    filteredTasks.value = [...tasksList.value];
}

// function for filter
function applyFilter({ filterDuration, sortBy }) {
    let tasks = [...tasksList.value];

    // filters by task duration only for now
    if (filterDuration) {
        tasks = tasks.filter(task => {
            // converrt the duration to in days
            const duration = (task.data.end_date_time.toDate() - task.data.start_date_time.toDate()) / (1000 * 60 * 60 * 24);
            if (filterDuration === 'short') return duration < 1;
            if (filterDuration === 'medium') return duration >= 1 && duration <= 7;
            if (filterDuration === 'long') return duration > 7;
        });
    }

    if (sortBy === 'name') {
        tasks.sort((a, b) => a.data.task_name.localeCompare(b.data.task_name));
    } else if (sortBy === 'startDate') {
        tasks.sort((a, b) => a.data.start_date_time.toDate() - b.data.start_date_time.toDate());
    }

    filteredTasks.value = tasks;
}

fetchAllTasks();
</script>

<template>
    <div>
        <TaskFilter @filterTasks="applyFilter" />

        <h1>Available Tasks</h1>
        <div v-for="task in filteredTasks" :key="task.id">
            <TaskCards :taskID="task.id" />
        </div>
    </div>
</template>