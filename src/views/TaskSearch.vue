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

function applyFilter({ filterDuration, sortBy, filterStartDate, filterEndDate }) {
    let tasks = [...tasksList.value];

    // filter by task duration
    if (filterDuration) {
        tasks = tasks.filter(task => {
            const duration = (task.data.end_date_time.toDate() - task.data.start_date_time.toDate()) / (1000 * 60 * 60 * 24); // Convert duration to days
            if (filterDuration === 'short') return duration < 1;
            if (filterDuration === 'medium') return duration >= 1 && duration <= 7;
            if (filterDuration === 'long') return duration > 7;
        });
    }

    // filter by start date
    if (filterStartDate) {
        tasks = tasks.filter(task => {
            const startDate = task.data.start_date_time.toDate();
            return startDate >= new Date(filterStartDate);
        });
    }

    // filter by end date
    if (filterEndDate) {
        tasks = tasks.filter(task => {
            const endDate = task.data.end_date_time.toDate();
            return endDate <= new Date(filterEndDate);
        });
    }

    // sort by name or start date
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
        <div id="taskSearchFilter">
            <h1>Available Tasks</h1>
            <TaskFilter @filterTasks="applyFilter" />
        </div>

        <div v-for="task in filteredTasks" :key="task.id">
            <TaskCards :taskID="task.id" />
        </div>
    </div>
</template>

<style>
#taskSearchFilter {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;

    h1 {
        margin: 0;
    }
}
</style>