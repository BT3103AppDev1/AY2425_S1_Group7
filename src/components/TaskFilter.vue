<script setup>
import { ref, watchEffect, onMounted, onBeforeUnmount } from 'vue';

const filterDuration = ref('');
const sortBy = ref('');
const filterStartDate = ref('');
const filterEndDate = ref('');
const radius = ref(''); // Store selected radius
const userLocation = ref(null);
const dropdownVisible = ref(false);

const emit = defineEmits(['filterTasks', 'locationUpdated']);

function filterTasks() {
    emit('filterTasks', {
        filterDuration: filterDuration.value,
        sortBy: sortBy.value,
        filterStartDate: filterStartDate.value,
        filterEndDate: filterEndDate.value,
        radius: radius.value,
        userLocation: userLocation.value,
    });
}

function toggleDropdown(event) {
    event.stopPropagation();
    dropdownVisible.value = !dropdownVisible.value;
}

function handleClickOutside(event) {
    if (!event.target.closest('#taskFilter') && !event.target.closest('#dropdownToggle')) {
        dropdownVisible.value = false;
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            userLocation.value = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            filterTasks();
        }, () => {
            alert("Unable to retrieve your location. Please enable location services.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

watchEffect(() => {
    filterTasks();
});

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
    <div style="position: relative;">
        <button id="dropdownToggle" @click.stop="toggleDropdown">Filter & Sort</button>
        
        <div v-if="dropdownVisible" id="taskFilter" class="dropdown" @click.stop>
            <div class="dropdownItem">
                <label for="sortBy">Sort by: </label>
                <select v-model="sortBy" id="sortBy">
                    <option value="">None</option>
                    <option value="name">Task Name</option>
                    <option value="startDate">Start Date</option>
                </select>
            </div>
            <div class="dropdownItem">
                <label for="filterDuration">Duration: </label>
                <select v-model="filterDuration" id="filterDuration">
                    <option value="">All</option>
                    <option value="short">< 1 day </option>
                    <option value="medium">1-7 days</option>
                    <option value="long">> 7 days</option>
                </select>
            </div>
            <div class="dropdownItem">
                <label for="filterStartDate">Start Date: </label>
                <input type="date" v-model="filterStartDate" id="filterStartDate" />
            </div>
            <div class="dropdownItem">
                <label for="filterEndDate">End Date: </label>
                <input type="date" v-model="filterEndDate" id="filterEndDate" />
            </div>
            <div class="dropdownItem">
                <label for="radius">Radius (km):</label>
                <select v-model="radius" id="radius">
                    <option value="">Select Distance</option>
                    <option value="5">5 km</option>
                    <option value="10">10 km</option>
                    <option value="15">15 km</option>
                    <option value="20">20 km</option>
                    <option value="25">25 km</option>
                </select>
                <button @click="getLocation" :disabled="!radius">Get My Location</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
#dropdownToggle {
    border: 1px solid #ccc;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;
    font-size: 1em;
}

.dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: #f8f8f8;
    border: 1px #ccc solid;
    border-radius: 5px;
    padding: 0.5rem;
    z-index: 1000;
}

.dropdownItem {
    margin: 0.5rem;
}

#taskFilter {
    display: flex;
    flex-direction: column;
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>