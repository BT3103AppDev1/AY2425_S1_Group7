<script setup>
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase_setup';
import { EmailAuthProvider, getAuth, reauthenticateWithCredential } from 'firebase/auth';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const profile = ref({
	fullName: '',
	dateOfBirth: '',
	residentialAddress: '',
	organisation: '',
	department: '',
});

const successMessage = ref('');
const emit = defineEmits(['save']);

const auth = getAuth();
const user = auth.currentUser;
const uid = user.uid;
const email = ref(user.email);
const password1 = ref();
const profileEditingEnabled = ref(false);
const showPasswordModal = ref(false);
const role = ref();
const router = useRouter();

const q = doc(db, 'users', uid);

async function getData() {
    let data = (await getDoc(q)).data();
    role.value = data?.role || '';
	profile.value = {
		name: data?.username,
		fullName: data?.fullName || '',
		dateOfBirth: data?.dob || '',
		residentialAddress: data?.residential_address || '',
		organisation: data?.organisation || '',
		department: data?.department || '',
	}
}

onMounted(() => {
    auth.onAuthStateChanged((currentUser) => {
        if (currentUser) {
            user.value = currentUser;
            email.value = currentUser.email;
            getData().then(() => {
				console.log("done getting data!")
            });
        } else {
            console.error('No user is currently signed in.');
            router.push('/login');
        }
    });
});

async function saveChanges() {
    try {
        const q = doc(db, 'users', user.value.uid);

        const docSnap = await getDoc(q);
        if (docSnap.exists()) {
            profile.value = { ...docSnap.data(), ...profile.value }; 
        } else {
            console.error("No such document!");
            return;
        }

        await setDoc(q, profile.value, { merge: true });
        console.log('Profile updated:', profile.value);
        successMessage.value = 'Profile has been updated successfully!';
        emit('save', profile.value);

        if (profile.value.role === 'volunteer') {
            router.push('/UserProfile');
        } else {
            router.push('/AdminProfile');
        }
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
<div v-if="!profileEditingEnabled" class="profile-container">
	<h1>About you, {{ profile.name }}.</h1>
	<p>Welcome to your profile page. You can update your information below.</p>

	<div class="update-button-container">
		<button @click="showPasswordModal = true" class="update-button">Update your profile</button>
	</div>
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
<div v-if="profileEditingEnabled" class="center-wrapper">
	<div class="edit-profile-container">
	<h1>Edit Your Profile</h1>
	<form @submit.prevent="saveChanges" class="profile-form">
		<table class="profile-table">
		<tr>
			<th><label for="fullName">Full Name:</label></th>
			<td><input type="text" id="fullName" v-model="profile.fullName" required></td>
		</tr>
		<tr>
			<th><label for="dob">Date of Birth:</label></th>
			<td><input type="date" id="dob" v-model="profile.dateOfBirth" required></td>
		</tr>
		<tr>
			<th><label for="residentialAddress">Residential Address:</label></th>
			<td><input type="text" id="residentialAddress" v-model="profile.residentialAddress" required></td>
		</tr>
		<tr>
			<th><label for="organisation">Your Organisation:</label></th>
			<td><input type="text" id="organisation" v-model="profile.organisation" required></td>
		</tr>
		<tr>
			<th><label for="department">Your Department:</label></th>
			<td><input type="text" id="department" v-model="profile.department" required></td>
		</tr>
		
		</table>
		<div class="submit-button-container">
		<button type="submit" class="save-button">Save Changes</button>
		</div>
	</form>
	<div class="go-back-container">
		<button @click="profileEditingEnabled = false" class="go-back-button">Go back!</button>
	</div>
	</div>
</div>

<!-- Display User Profile Information -->
<div v-if="!profileEditingEnabled">
	<div class="profile-table-container">
		<h2>Your Profile Information</h2>
		<table class = "profile-table">
			<tr>
				<td>Full Name:</td>
				<td>{{ profile.fullName }}</td>
			</tr>
			<tr>
				<td>Date of Birth:</td>
				<td>{{ profile.dateOfBirth }}</td>
			</tr>
			<tr>
				<td>Residential Address:</td>
				<td>{{ profile.residentialAddress }}</td>
			</tr>
			<tr>
				<td>Organisation:</td>
				<td>{{ profile.organisation }}</td>
			</tr>
			<tr>
				<td>Department:</td>
				<td>{{ profile.department }}</td>
			</tr>
		</table>
		<div class="go-back-container">
			<button @click="router.push('/Admin/Dashboard')" class="go-back-button">Go back!</button>
		</div> 
	</div>
</div> 
</template>

<style scoped>
.profile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-top: 20px;
}

.update-button-container {
    display: flex;
    justify-content: center;
    margin: 20px 0;
}

.update-button {
	margin-bottom: 20px;
	padding: 10px 20px;
	background-color: #ddd;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	font-weight: bold;
}

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
	box-sizing: border-box;
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

.profile-table-container {
	max-width: 700px;
	margin: 0 auto;
	padding: 20px;
	border: 1px solid #ddd;
	border-radius: 8px;
	background-color: #f9f9f9;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.profile-table {
	width: 100%;
	border-collapse: collapse;
}

.profile-table th {
	text-align: left;
	padding: 8px;
	background-color: #f2f2f2;
	font-weight: bold;
	width: 30%;
}

.profile-table td {
	padding: 8px;
	border-top: 1px solid #ddd;
}

.go-back-container {
	display: flex;
	justify-content: center;
	margin-top: 20px;
}

.go-back-button {
	padding: 10px 20px;
	font-size: 16px;
	font-weight: bold; 
	color: black;
	background-color: #fadfa1;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.go-back-button :hover {
  	background-color: #f0d78c;
}

.profile-table tr:nth-child(even) {
  	background-color: #f9f9f9;
} 

.submit-button-container {
	text-align: center;
	margin-top: 20px;
}

.save-button {
	padding: 10px 20px;
	font-size: 16px;
	font-weight: bold; 
	color: black;
	background-color: #fadfa1;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}

.save-button:hover {
  	background-color: #f0c975;
}

.center-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh; 
    width: 100%;
}

.edit-profile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    max-width: 600px;
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
