<script setup>
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase_setup';
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword, updateEmail } from 'firebase/auth';
import { onMounted, ref } from 'vue';

const auth = getAuth();
const user = auth.currentUser;
const uid = user.uid;
const name = ref();
const email = ref(user.email);
const password1 = ref();
const password2 = ref();
const dangerZoneEnabled = ref(false);
const role = ref();

const q = doc(db, 'users', uid);

async function getData() {
    let data = (await getDoc(q)).data();
    role.value = data.role;
}

onMounted(() => getData());

async function updateFields() {
    // get the attributes there, and then...
    setDoc(q, {}); //again, you need to upload the data there as-is.
}

async function updateLogin() {
    try {
        if (password1.value !== password2.value) {
            throw new Error("The passwords must be the same!");
        }
        await updatePassword(user, password1);
        password1.value = '';
        password2.value = '';
    } catch (error) {
        //do something to catch the error.
        password1.value = '';
        password2.value = '';
    }
}

async function updateEmailCreds() {
    try {
        await updateEmail(user, email.value);
        email.value = '';
    } catch (error) {
        //do something to catch the error
        email.value = '';
    }
}

async function reAuth() {
    try {
        const creds = EmailAuthProvider.credential(user.email, password1.value);
        await reauthenticateWithCredential(user, creds);
        password1.value = '';
        dangerZoneEnabled.value = true;
        console.log('Sensitive settings enabled!')
    } catch (error) {
        password1.value = '';
        console.log(error.message);
    }
}
</script>

<template>
<div id="profile">
    <h1>You are an: {{ role }}</h1>
    <form id="updateProfile" @submit.prevent="updateFields">
        <!--I advise you not to update login email here-->
        <label for="name">Your username</label>
        <input id= "name" v-model="name">
        <!--Fill in other attributes according to what you did for registration-->
    </form>
    <h1>The Danger Zone</h1>
    <p>If you have the balls, go change stuff there!</p>
    <div id="dangerZone" v-if="dangerZoneEnabled">
        <form id="updatePassword" @submit.prevent="updateLogin">
            <label for = "password1">Your new password</label>
            <input type = "password" id= "password1" v-model="password1" required>
            <label for= "password2">Confirm your password</label>
            <input type = "password" id= "password2" v-model="password2" required>
            <input type="submit">
        </form>
        <form id="updateEmail" @submit.prevent="updateEmailCreds">
            <label for= "email">Update e-mail</label>
            <input type = "email" id= "email" v-model="email" required>
            <input type="submit">
        </form>
        <button @click="dangerZoneEnabled = false">I don't want to change them!</button>
    </div>
    <div id="verify" v-if="!dangerZoneEnabled">
        <form id="doubleCheck" @submit.prevent="reAuth">
            <label for = "password1">Key in your password.</label>
            <input type = "password" id= "password1" v-model="password1" required>
            <input type="submit">
        </form>
    </div>
</div>
</template>

<style scoped>
</style>
