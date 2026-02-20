<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios';

const name = ref('');
const email = ref('');
const password = ref('');
const router = useRouter();

const register = async () => {
  try {
    const res = await api.post('/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value,
    });

    localStorage.setItem('token', res.data.access_token);
    router.push('/dashboard');
  } catch (err) {
    alert('Registration failed');
  }
};
</script>

<template>
  <div>
    <h2>Register</h2>
    <p>Already have an account? <router-link to="/login">Login here</router-link></p>
    <input v-model="name" placeholder="Name" />
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="register">Register</button>
  </div>
</template>
