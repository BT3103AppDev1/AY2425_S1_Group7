<script setup>
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase_setup';
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword, updateEmail } from 'firebase/auth';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const profile = ref({
  fullName: '',
  dateOfBirth: '',
  residentialAddress: '',
  organisation: '',
  skills: '',
});
const emit = defineEmits(['save']);

const auth = getAuth();
const user = auth.currentUser;
const uid = user.uid;
const name = ref();
const fullName = ref();
const dateOfBirth = ref();
const residentialAddress = ref();
const organisation = ref();
const skills = ref();
const contactEmail = ref();
const email = ref(user.email);
const password1 = ref();
const profileEditingEnabled = ref(false);
const showPasswordModal = ref(false);
const role = ref();
const router = useRouter();

const q = doc(db, 'users', uid);

async function getData() {
    let data = (await getDoc(q)).data();
    role.value = data.role;
    name.value = data.username;
    contactEmail.value = data.contact_email;
    fullName.value = data?.fullName || '',
    dateOfBirth.value = data?.dob || '';
    residentialAddress.value = data?.residential_address || '';
    organisation.value = data?.organisation || '';
    skills.value = data?.skills || '';
}

onMounted(() => {
    auth.onAuthStateChanged((currentUser) => {
        if (currentUser) {
            user.value = currentUser;
            email.value = currentUser.email;
            getData();  
        } else {
            console.error('No user is currently signed in.');
            alert('User not signed in. Please log in again.');
            router.push('/login');
        }
    });
});

async function updateFields() {
  await setDoc(q, {
    full_name: profile.value.fullName,
    dob: profile.value.dateOfBirth,
    residential_address: profile.value.residentialAddress,
    organisation: profile.value.organisation,
    skills: profile.value.skills,
  }, { merge: true });

  emit('save', profile.value);  
  profileEditingEnabled.value = false;  
}

async function saveChanges() {
  try {
    const q = doc(db, 'users', user.value.uid);
    await setDoc(q, profile.value, { merge: true });
    console.log('Profile updated:', profile.value);
    emit('save', profile.value);  
    router.push('/user-profile'); 
  } catch (error) {
    console.error('Error saving changes:', error);
  }
}

async function reAuth() {
    try {
      if (!user) {
        console.error('No user is logged in');
        alert('No user is logged in. Please sign in.');
        return;
      }
      const creds = EmailAuthProvider.credential(user.email, password1.value);
      await reauthenticateWithCredential(user, creds);
      console.log('Re-authentication successful!');

      showPasswordModal.value = false;
      profileEditingEnabled.value = true;
      password1.value = '';
    } catch (error) {
        console.error('Error re-authenticating:', error);
        alert('Invalid password, please try again.');
    }
}
</script>

<template>

<!-- Welcome page with UserID and update profile button -->
<div v-if="!profileEditingEnabled">
    <h1>About you, {{ name }}.</h1>
    <p>Welcome to your profile page. You can update your information below.</p>
    <button @click="showPasswordModal = true">Update your profile</button>
</div>

<!-- Modal for password entry -->
<div v-if="showPasswordModal" class="modal-overlay">
    <div class="modal-content">
      <h2>Please enter your password to continue</h2>
      <form @submit.prevent="reAuth">
        <label for="password1">Password:</label>
        <input type="password" id="password1" v-model="password1" required>
        <button type="submit">Submit</button>
      </form>
      <button @click="showPasswordModal = false">Cancel</button>
    </div>
</div>


<!-- Profile Editing Section (after re-authentication) -->
<div v-if="profileEditingEnabled">
  <h1>Edit Your Profile</h1>
  <form @submit.prevent="updateFields">
    <label for="fullName">Full Name:</label>
    <input type="text" id="fullName" v-model="profile.fullName" required>

    <label for="dob">Date of Birth:</label>
    <input type="date" id="dob" v-model="profile.dateOfBirth" required>

    <label for="residentialAddress">Residential Address:</label>
    <input type="text" id="residentialAddress" v-model="profile.residentialAddress" required>

    <label for="organisation">Your Organisation:</label>
    <input type="text" id="organisation" v-model="profile.organisation" required>

    <label for="skills">Your Skills:</label>
    <input type="text" id="skills" v-model="profile.skills" required>

    <button type="submit">Save Changes</button>
  </form>
</div>


  <!-- Display User Profile Information -->
  <div v-if="!profileEditingEnabled">
    <h2>Your Profile Information</h2>
    <table>
      <tr>
        <td>Full Name:</td>
        <td>{{ fullName }}</td>
      </tr>
      <tr>
        <td>Date of Birth:</td>
        <td>{{ dateOfBirth }}</td>
      </tr>
      <tr>
        <td>Residential Address:</td>
        <td>{{ residentialAddress }}</td>
      </tr>
      <tr>
        <td>Organisation:</td>
        <td>{{ organisation }}</td>
      </tr>
      <tr>
        <td>Skills:</td>
        <td>{{ skills }}</td>
      </tr>
    </table>
  </div>

<div id="goBack">
    <button @click="router.go(-1)">Go back!</button>
</div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); 
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-content h2 {
  margin-bottom: 20px;
}

.modal-content input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.modal-content button {
  padding: 10px 20px;
  margin: 10px 5px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal-content button:hover {
  background-color: #45a049;
}

.modal-content button[type="submit"] {
  background-color: #007bff;
}

.modal-content button[type="submit"]:hover {
  background-color: #0056b3;
}
</style>
