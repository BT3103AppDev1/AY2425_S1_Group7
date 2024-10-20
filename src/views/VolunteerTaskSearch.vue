<script setup>
import { ref, onMounted } from 'vue';
import TaskFilter from "../components/TaskFilter.vue";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase_setup.js";
import router from '@/router';
import VolunteerTaskbar from "../components/VolunteerTaskbar.vue";
import loader from '../google_setup';

const tasksList = ref([]);
const filteredTasks = ref([]);
const geocoder = ref(null);

async function fetchAllTasks() {
    const tasksSnapshot = await getDocs(collection(db, "task"));
    tasksList.value = tasksSnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
    }));
    filteredTasks.value = [...tasksList.value];
}

async function getCoordinatesFromAddress(address) {
    if (!address) return null;

    return new Promise((resolve) => {
        geocoder.value.geocode({ address }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const location = results[0].geometry.location;
                resolve({
                    lat: location.lat(),
                    lng: location.lng()
                });
            } else {
                console.warn(`Geocoding failed for address: ${address}`, status);
                resolve(null);
            }
        });
    });
}

async function applyFilter({ filterDuration, sortBy, filterStartDate, filterEndDate, radius, userLocation }) {
    console.log('Filtering with:', { radius, userLocation });

    let tasks = [...tasksList.value];

     // filter by task duration
    if (filterDuration) {
        tasks = tasks.filter(task => {
            const duration = (task.data.end_date_time.toDate() - task.data.start_date_time.toDate()) / (1000 * 60 * 60 * 24);
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

    // filter by distance to current location
    if (userLocation && radius) {
        console.log('Applying radius filter:', radius, 'km');

        const filteredTasksWithLocation = [];

        for (const task of tasks) {
            const taskLocation = await getCoordinatesFromAddress(task.data.location);

            if (taskLocation) {
                console.log('Task coordinates:', taskLocation);
                const distance = calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    taskLocation.lat,
                    taskLocation.lng
                );
                console.log('Distance:', distance, 'km');

                if (distance <= radius) {
                    filteredTasksWithLocation.push(task);
                }
            }
        }

        tasks = filteredTasksWithLocation;
    }

    // sort by name or start date
    if (sortBy === 'name') {
        tasks.sort((a, b) => a.data.task_name.localeCompare(b.data.task_name));
    } else if (sortBy === 'startDate') {
        tasks.sort((a, b) => a.data.start_date_time.toDate() - b.data.start_date_time.toDate());
    }

    filteredTasks.value = tasks;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

onMounted(async () => {
    await loader.load();
    geocoder.value = new google.maps.Geocoder();
    fetchAllTasks();
});

function viewTaskDetails(taskID) {
    router.push(`/ViewTask/${taskID}`);
}
</script>

<template>
    <VolunteerTaskbar />
    <div>
        <div id="taskSearchFilter">
            <h1>Available Tasks</h1>
            <TaskFilter @filterTasks="applyFilter" />
        </div>
    </div>
    <div class="task-table-container">
        <table class="task-table">
            <thead>
                <tr>
                    <th>Tasks</th>
                    <th>Start Date & Time</th>
                    <th>End Date & Time</th>
                    <th>Location</th>
                    <th></th>
                </tr>
            </thead>
            <tbody v-if="filteredTasks.length > 0">
                <tr v-for="task in filteredTasks" :key="task.id">
                    <td>{{ task.data.task_name }}</td>
                    <td>{{ task.data.start_date_time.toDate().toLocaleString() }}</td>
                    <td>{{ task.data.end_date_time.toDate().toLocaleString() }}</td>
                    <td>{{ task.data.location }}</td>
                    <td><button class="action-button" @click="viewTaskDetails(task.id)">View More</button></td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr>
                    <td colspan="5">No Tasks Available</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style>
#taskSearchFilter {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
}

#taskSearchFilter h1 {
    margin: 0;
}
</style>