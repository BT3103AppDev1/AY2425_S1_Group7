<script setup>

import AdministratorTaskbar from '../components/AdministratorTaskbar.vue'
import { db } from "../firebase_setup.js";
import { addDoc, collection, Timestamp, getDoc, doc, setDoc } from "firebase/firestore";
import { ref, onMounted } from "vue";
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

function processData() {
    const fDateCheck = new Date(startDateTime.value);
    const tDateCheck = new Date(endDateTime.value);

    if (fDateCheck >= tDateCheck) {
        alert('Your start date and time must be before the end date and time!');
    } else {
        if (confirm(`You are about to edit ${taskName.value}, are you sure?`) == true) {
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

            setDoc(doc(db, "task", taskID), dataUpload)
                .then(() => {
                    router.replace('/Admin/Dashboard'); // Should we also have a ViewTasks for admin too?
                    resetForm();
                })
                .catch((error) => {
                    alert(error.message);
                });
        }
    }
}

async function populateData() {
    const document = await getDoc(doc(db, "task", taskID)).then((doc) => doc.data()).catch((error) => console.log(error.message));
    console.log(document);
    taskName.value = document.task_name;
    startDateTime.value = document.start_date_time.toDate().toISOString().slice(0, 16);
    endDateTime.value = document.end_date_time.toDate().toISOString().slice(0, 16);
    location.value = document.location;
    requirements.value = document.requirements.toString();
    description.value = document.description;
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
    loader.load().then(async () => {
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