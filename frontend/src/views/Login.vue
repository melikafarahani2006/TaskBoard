<template>
  <div class="login">
    <h1>Login Page</h1>
    <button @click="goToDashboard">Go to Dashboard</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();

const goToDashboard = () => {
  router.push('/dashboard');
};
</script>

<style scoped>
.login { text-align: center; margin-top: 100px; }
</style>
