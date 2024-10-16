<script setup>
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase_setup';
import { getAuth, updatePassword, verifyBeforeUpdateEmail } from 'firebase/auth';
import { onMounted, ref } from 'vue';

const auth = getAuth();
const user = auth.currentUser;
const uid = user.uid;
const name = ref();
const email = ref(user.email);
const password1 = ref();
const password2 = ref();

const q = doc(db, 'users', uid);

async function getData() {
    let data = getDoc(q);
    data.map((doc) => ({id: doc.id, ...doc.data()}));
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
        await verifyBeforeUpdateEmail(user, email.value); //Due to enumeration protection this mechanism has been changed
        await updatePassword(user, password1);
        password1.value = '';
        password2.value = '';
    } catch (error) {
        //do something to catch the error.
        password1.value = '';
        password2.value = '';
    }
}
</script>

<template>
<div id="profile">
    <form id="updateProfile" @submit.prevent="updateFields">
        <!--I advise you not to update login email here-->
        <input id= "name" v-model="name" value="data.name">
        <label for="name">Your username</label>
        <!--Fill in other attributes according to what you did for registration-->
    </form>
    <form id="updateLoginCredentials" @submit.prevent="updateLogin">
        <input type = "email" id= "email" v-model="email" required>
        <label for= "email">Update e-mail</label>
        <input type = "password" id= "password1" v-model="password1" required>
        <label for = "password1">Your new password</label>
        <input type = "password" id= "password2" v-model="password2" required>
        <label for= "password2">Confirm your password</label>
        <input type="submit">
    </form>
</div>
</template>

<style scoped>
</style>
