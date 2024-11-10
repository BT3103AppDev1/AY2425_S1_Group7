<script setup>
import { ref, onMounted } from 'vue';
import ProfileDetails from '@/components/ProfileDetails.vue';
import { useRouter } from 'vue-router';
import { getAuth } from 'firebase/auth';
import VolunteerTaskbar from '@/components/VolunteerTaskbar.vue';

const auth = getAuth();
const router = useRouter();
const showConfirmation = ref(false);
const profile = ref({
    fullName: '',
    dateOfBirth: '',
    residentialAddress: '',
    organisation: '',
    skills: null,
});

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
            router.push('/login');  
        }
    });
});
</script>

<template>
<div>
    <VolunteerTaskbar></VolunteerTaskbar>
    <h1>Your Profile</h1>
    <ProfileDetails @save="handleSave" />
</div>
</template>

<style scoped>
</style>