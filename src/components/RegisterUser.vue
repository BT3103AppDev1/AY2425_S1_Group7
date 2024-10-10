<template>
  <div class="register-container">
    <div class="welcome">
      <img class="logo" src="/image.png" alt="Logo" />
    </div>
    <div class="register-form">
      <h2>Register</h2>
      <form @submit.prevent="register">
        <div class="input-group">
          <input v-model="email" type="email" placeholder="Email" required />
          <span class="icon">✉️</span>
        </div>
        <div class="input-group">
          <input v-model="password" type="password" placeholder="Password" required />
          <span class="icon">🔒</span>
        </div>
        <button type="submit" class="register-button">Register</button>
      </form>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase_setup';

const email = ref('');
const password = ref('');
const message = ref('');

const register = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    message.value = `User Registered: ${userCredential.user.email}`;
  } catch (error) {
    message.value = `Error: ${error.message}`;
  }
};

