<script setup>
import { ref, onMounted } from 'vue';
import AdminProfileView from '@/components/AdminProfileView.vue';
import { useRouter } from 'vue-router';
import { getAuth } from 'firebase/auth';
import AdministratorTaskbar from '@/components/AdminTaskbar.vue';

const auth = getAuth();
const router = useRouter();
const showConfirmation = ref(false);
const profile = ref({
    fullName: '',
    dateOfBirth: '',
    residentialAddress: '',
    organisation: '',
    department: '',
});

function editProfile() {
    showConfirmation.value = false;
}

function handleSave(updatedData) {
    console.log("Received save event with updated data:", updatedData);
    profile.value = updatedData;
    showConfirmation.value = true;
}

onMounted(() => {
    auth.onAuthStateChanged((currentUser) => {
        if (currentUser) {
            // Fetch user data here or call getData if needed
        } else {
            console.error('No user is currently signed in.');
            alert('User not signed in. Please log in again.');
            router.push('/login');  // Redirect to login page if not signed in
        }
    });
});
</script>

<template>
<div>
    <AdministratorTaskbar>
    </AdministratorTaskbar>

    <AdminProfileView v-if="!showConfirmation" @save="handleSave" />
    
    <!-- Confirmation Page -->
    <div v-if="showConfirmation">
        <h2>Profile Saved</h2>
        <table>
            <tr><td>Full Name:</td><td>{{ profile.fullName }}</td></tr>
            <tr><td>Date of Birth:</td><td>{{ profile.dateOfBirth }}</td></tr>
            <tr><td>Residential Address:</td><td>{{ profile.residentialAddress }}</td></tr>
            <tr><td>Organisation:</td><td>{{ profile.organisation }}</td></tr>
            <tr><td>Department:</td><td>{{ profile.department }}</td></tr>
        </table>
        <button @click="editProfile">Edit Again</button>
    </div>
</div>
</template>

<style scoped>
</style>