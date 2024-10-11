<script setup>
import { db } from "../firebase_setup.js";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import loader from '../google_setup';

const router = useRouter();

const taskName = ref('');
const startDateTime = ref('');
const endDateTime = ref('');
const location = ref('');
const location_lat = ref(null);
const location_lng = ref(null);
const requirements = ref('');
const description = ref('');

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
                location_lat: location_lat.value,
                location_lng: location_lng.value,
                requirements: requirements.value.split(",").map(command => command.trim()),
                description: description.value
            };

            addDoc(collection(db, "task"), dataUpload)
                .then(() => {
                    router.replace('/ViewTasks');
                    resetForm();
                })
                .catch((error) => {
                    alert(error.message);
                });
        }
    }
}

function resetForm() {
    taskName.value = '';
    startDateTime.value = '';
    endDateTime.value = '';
    location.value = '';
    location_lat.value = null;
    location_lng.value = null;
    requirements.value = '';
    description.value = '';
}

let autocomplete;
function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('autocomplete'),
        { componentRestrictions: { country: ['SG'] } }
    );
    autocomplete.addListener('place_changed', onPlaceChanged);
}

function onPlaceChanged() {
    const place = autocomplete.getPlace();
    if (place.geometry) {
        location.value = place.formatted_address || place.name;
        location_lat.value = place.geometry.location.lat();
        location_lng.value = place.geometry.location.lng();
    } else {
        alert("No details available for the selected location.");
    }
}

onMounted(() => {
    loader.load().then(() => {
        initAutocomplete();
    }).catch((e) => {
        console.log('Error loading Google Maps:', e);
    });
});
</script>

<template>
<form>
    <label for="taskName">Task Name</label>
    <input v-model="taskName" id="taskName" required>
    
    <label for="description">Task Description</label>
    <textarea v-model="description" id="description" required></textarea>
    
    <label for="startDateTime">Start Date & Time</label>
    <input v-model="startDateTime" type="datetime-local" id="startDateTime" required>
    
    <label for="endDateTime">End Date & Time</label>
    <input v-model="endDateTime" type="datetime-local" id="endDateTime" required>
    
    <label for="location">Location</label>
    <input v-model="location" id="autocomplete" type="text" placeholder="Enter location" required>
    
    <label for="requirements">Requirements</label>
    <input v-model="requirements" id="requirements" placeholder="Separate by commas">
    
    <input type="submit" @click.prevent="processData" value="Save task!">
</form>
</template>

<style scoped>
</style>