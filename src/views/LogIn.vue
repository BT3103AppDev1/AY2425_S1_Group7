<template>
    <div class="login-container">
      <div class="welcome">
        <img class="logo" src="/image.png" alt="Logo" />
      </div>
      <div class="login-form">
        <h2>Login</h2>
        <form @submit.prevent="login">
          <div class="input-group">
            <input v-model="email" type="email" placeholder="Email" required />
            <span class="icon">👤</span>
          </div>
          <div class="input-group">
            <input v-model="password" type="password" placeholder="Password" required />
            <span class="icon">🔒</span>
          </div>
          <a href="#" class="forgot-password">Forgot username/password?</a>
          <RouterLink to="/ViewTasks"><button type="submit" class="login-button">Login</button></RouterLink><!-- Change path to homepage -->
        </form>
        <p>Don’t have an account? <RouterLink to="/registerUser">Register</RouterLink></p>
      </div>
      <div id="Error Message">
        {{ message }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { signInWithEmailAndPassword } from 'firebase/auth';
  import { db, auth } from '../firebase_setup';
  import { getDoc, doc } from 'firebase/firestore';
  import { useRouter } from 'vue-router';
  
  const email = ref('');
  const password = ref('');
  const message = ref('');
  const loading = ref(false);
  const router = useRouter();
  
  const displayMessage = (msg) => {
    console.log(msg);
  };
  
  const validateInputs = () => {
    if (!email.value || !password.value) {
      displayMessage('Please enter both email and password.');
      return false;
    }
    return true;
  };
  
  const login = async () => {
    if (!validateInputs()) return;
  
    loading.value = true;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );
      displayMessage(`User Logged In: ${userCredential.user.email}`);
      const userDoc = doc(db, "users", userCredential.user.uid);
      await getDoc(userDoc).then((doc) => {
        const permission = doc.data().role;
        switch (permission) {
          case "volunteer":
            router.push({path: "/ViewTasks"});
            break;
          case "admin":
            router.push({path: "/Admin/Dashboard"})
        }
      }).catch((error) => console.log(error.message));
    } catch (error) {
      displayMessage(`Error: ${error.message}`);
    } finally {
      loading.value = false;
    }
  };
  </script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f8f8;
  gap: 10px;
}

.welcome {
  background-color: white;
  padding: 30px;
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

h1 {
  font-size: 1.2em;
  margin: 10px 0;
  text-align: center;
}

.login-form {
  background-color: rgb(228, 228, 228);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 400px; /* Ensure both sections have equal width */
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

h2 {
  font-size: 1.5em;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.input-group {
  position: relative;
  margin-bottom: 20px;
  width: 100%;
}

input {
  width: calc(100% - 40px);
  padding: 10px;
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

.login-button {
  width: 100%;
  padding: 10px;
  background-color: #f8e7bc;
  border: 0;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  color: #333;
}

.login-button:hover {
    background-color: #fbce5b;
  }
  
.forgot-password {
  text-align: center;
  margin-bottom: 10px;
  font-size: 0.9em;
}

a {
  color: #007bff;
}

a:hover {
  text-decoration: underline;
}

p {
  margin-top: 20px;
  font-size: 0.9em;
  color: #666;
  text-align: center;
}
</style>