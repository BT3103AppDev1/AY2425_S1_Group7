<script setup>
import AdministratorTaskbar from '../components/AdministratorTaskbar.vue';
import { db } from "../firebase_setup.js";
import { addDoc, collection, Timestamp, getDoc, doc, setDoc } from "firebase/firestore";
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import loader from '../google_setup';

const router = useRouter();
const route = useRoute();
const taskID = route.params.taskID;

const taskName = ref('');
const startDateTime = ref('');
const endDateTime = ref('');
const location = ref('');
const location_lat = ref(null);
const location_lng = ref(null);
const requirements = ref('');
const description = ref('');
const sessions = ref([]);

function processData() {
    const fDateCheck = new Date(startDateTime.value);
    const tDateCheck = new Date(endDateTime.value);

    const invalidSessions = sessions.value.filter(session => !validateSessionTime(session));
    if (invalidSessions.length > 0) {
        alert('Some sessions have invalid times. Please ensure all sessions are within the main date range and end times are after start times.');
        return;
    }

    if (fDateCheck >= tDateCheck) {
        alert('Your start date and time must be before the end date and time!');
    } else {
        if (confirm(`You are about to edit ${taskName.value}, are you sure?`)) {
            const dataUpload = {
                task_name: taskName.value,
                start_date_time: Timestamp.fromDate(fDateCheck),
                end_date_time: Timestamp.fromDate(tDateCheck),
                location: location.value,
                location_lat: location_lat.value,
                location_lng: location_lng.value,
                requirements: requirements.value.split(",").map(req => req.trim()),
                description: description.value,
                sessions: sessions.value.map(session => ({
                    date: session.date,
                    start_time: session.startTime,
                    end_time: session.endTime
                }))
            };

            setDoc(doc(db, "task", taskID), dataUpload)
                .then(() => {
                    router.replace('/Admin/Dashboard');
                    resetForm();
                })
                .catch((error) => {
                    alert(error.message);
                });
        }
    }
}

async function populateData() {
    try {
        const document = await getDoc(doc(db, "task", taskID));
        if (document.exists()) {
            const data = document.data();
            taskName.value = data.task_name;
            startDateTime.value = data.start_date_time.toDate().toISOString().slice(0, 16);
            endDateTime.value = data.end_date_time.toDate().toISOString().slice(0, 16);
            location.value = data.location;
            requirements.value = data.requirements.join(', ');
            description.value = data.description;
            sessions.value = data.sessions;
        }
    } catch (error) {
        console.log(error.message);
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
    sessions.value = [];
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

function addSession() {
    sessions.value.push({
        date: '',
        startTime: '',
        endTime: ''
    });
}

function removeSession(index) {
    sessions.value.splice(index, 1);
}

function validateSessionTime(session) {
    if (!session.startTime || !session.endTime) return true;

    const startTime = new Date(`${session.date}T${session.startTime}`);
    const endTime = new Date(`${session.date}T${session.endTime}`);
    const mainStart = new Date(startDateTime.value);
    const mainEnd = new Date(endDateTime.value);

    return startTime >= mainStart && endTime <= mainEnd && startTime < endTime;
}

onMounted(() => {
    loader.load().then(() => {
        initAutocomplete();
        populateData();
    }).catch((e) => {
        console.log('Error loading Google Maps:', e);
    });
});
</script>

<template>
<AdministratorTaskbar></AdministratorTaskbar>
<h1>Edit Tasks here!</h1>
<form>
    <div class="form-grid">
        <label for="taskName">Task Name</label>
        <input v-model="taskName" id="taskName" required>
    </div>

    <div class="form-item">
        <label for="description">Task Description</label>
        <textarea v-model="description" id="description" required></textarea>
    </div>

    <div class="form-item">
        <label for="startDateTime">Start Date & Time</label>
        <input v-model="startDateTime" type="datetime-local" id="startDateTime" required>
    </div>

    <div class="form-item">
        <label for="endDateTime">End Date & Time</label>
        <input v-model="endDateTime" type="datetime-local" id="endDateTime" required>
    </div>

    <div class="form-item">
        <label for="location">Location</label>
        <input v-model="location" id="autocomplete" type="text" placeholder="Enter location" required>
    </div>

    <div class="form-item">
        <label for="requirements">Requirements</label>
        <input v-model="requirements" id="requirements" placeholder="Separate by commas">
    </div>

    <div v-for="(session, index) in sessions" :key="index" class="session-item">
        <div class="session-grid">
            <div class="session-date">
                <label :for="'session-date-' + index">Date</label>
                <input type="date" v-model="session.date" :id="'session-date-' + index" required>
            </div>

            <div class="session-time">
                <label :for="'session-start-' + index">Start Time</label>
                <input type="time" v-model="session.startTime" :id="'session-start-' + index" required>
            </div>

            <div class="session-time">
                <label :for="'session-end-' + index">End Time</label>
                <input type="time" v-model="session.endTime" :id="'session-end-' + index" required>
            </div>

            <button type="button" @click="removeSession(index)" class="remove-session-btn">Remove</button>
        </div>
    </div>

    <div class="submit-button">
        <input type="submit" @click.prevent="processData" value="Save task!">
    </div>
</form>
</template>

<style scoped>
.form-container {
    max-width: 700px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
}

.form-grid {
    display: grid;
    font-size: 16px;
    font-weight: bold;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 30px;
}

.form-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 30px; 
}

.form-item label {
    font-weight: bold; 
    margin-bottom: 8px;
}

.form-item input,
.form-item textarea {
    padding: 10px; 
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
}

.submit-button {
    margin-top: 20px;
    text-align: right;
}

.submit-button input {
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold; 
    color: black;
    background-color: #fadfa1;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.submit-button input:hover {
    background-color: #f1d186;
}
</style>