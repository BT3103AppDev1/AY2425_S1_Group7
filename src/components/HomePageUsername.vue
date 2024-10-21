<script setup>
import { ref, onMounted } from 'vue';
import firebaseApp from "../firebase.js";
import { getFirestore } from "firebase/firestore";
import { auth } from '../firebase_setup';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'

const db = getFirestore(firebaseApp);
const username = ref('Loading...');

const fetchUserData = async (user) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', user.uid)); 
            if (userDoc.exists()) {
                username.value = userDoc.data().username; 
            } else {
                console.log('No such document!');
            }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};

onMounted(() => {
    // Check if the user is authenticated
    onAuthStateChanged(auth, (user) => {
        if (user) {
            fetchUserData(user);
        }
    });
});
</script>

<template>
    <h1>Welcome, {{ username }}!</h1>
  </template>