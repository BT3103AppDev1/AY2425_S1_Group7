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
      <p>Already have an account? <RouterLink to="/login">Login</RouterLink></p>
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
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f8f8;
  gap: 10px;
}

.welcome {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.logo {
  width: 95%;
  height: auto;
}

.register-form {
  background-color: rgb(228, 228, 228);
  padding: 45px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

h2 {
  font-size: 1.5em;
  color: #333;
  margin-bottom: 15px;
  text-align: center;
}

.input-group {
  position: relative;
  margin-bottom: 15px;
  width: 100%;
}

input {
  width: calc(100% - 40px);
  padding: 8px;
  padding-right: 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
}

.icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #333;
}

.register-button {
  width: 100%;
  padding: 8px;
  background-color: #f8e7bc;
  border: 0;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  color: #333;
}

a {
  color: #007bff;
}

a:hover {
  text-decoration: underline;
}

p {
  margin-top: 10px;
  font-size: 0.9em;
  color: #666;
  text-align: center;
}
</style>