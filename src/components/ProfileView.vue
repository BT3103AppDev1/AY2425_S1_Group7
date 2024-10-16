<script setup>
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase_setup';
import { getAuth, updatePassword, updateEmail } from 'firebase/auth';
import { onMounted, ref } from 'vue';

const auth = getAuth();
const user = auth.currentUser;
const uid = user.uid;
const name = ref();
const email = ref();
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
        await updateEmail(user, email.value); //it may throw an error if you reuse the same email.
        await updatePassword(user, password1);
    } catch (error) {
        //do something to catch the error.
    }
}
</script>

<template>
<div id="profile">
    <form id="updateProfile" @submit.prevent="updateFields">
        <!--I advise you not to update login email here-->
        <input id= "name" v-model="name" value="data.name">
        <label for="name">Your username</label>
        <!--Fill in other attributes-->
    </form>
    <form id="updateLoginCredentials" @submit.prevent="updateLogin">
        <input id= "email" v-model="email" value="user.email" required>
        <label for= "email">Update e-mail</label>
        <input id= "password1" v-model="password1" required>
        <label for= "password1">Your new password</label>
        <input id= "password2" v-model="password2" required>
        <label for= "password2">Confirm your password</label>
    </form>
</div>
</template>

<style scoped>
</style>
