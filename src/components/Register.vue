<template>
    <div>
      <h2>Register</h2>
      <form @submit.prevent="register">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
      <p>{{ message }}</p>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { createUserWithEmailAndPassword } from 'firebase/auth';
  import { auth } from '../firebase_setup';
  
  export default {
    name: 'Register',
    setup() {
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
  
      return {
        email,
        password,
        message,
        register,
      };
    },
  };
  </script>
  