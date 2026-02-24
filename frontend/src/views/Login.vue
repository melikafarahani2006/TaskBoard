<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios';

const email = ref('');
const password = ref('');
const router = useRouter();
const isLoading = ref(false);
const errorMessage = ref('');

const login = async () => {
  errorMessage.value = '';

  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields';
    return;
  }

  isLoading.value = true;
  try {
    const res = await api.post('/auth/login', {
      email: email.value,
      password: password.value,
    });
    console.log('Login Success:', res.data);
    localStorage.setItem('token', res.data.access_token);
    router.push('/dashboard');
  } catch (err: any) {
    console.error('Full Error Object:', err);
    errorMessage.value = err.response?.data?.message || 'Login failed';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-card card">
      <h2>Welcome Back</h2>
      <p class="subtitle">Sign in to your account</p>

      <form @submit.prevent="login">
        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
            required
            :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            required
            :disabled="isLoading"
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button type="submit" class="login-btn" :disabled="isLoading">
          {{ isLoading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <div class="divider"></div>

      <p class="register-link">
        Don't have an account?
        <router-link to="/register">Create one now</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
}

.login-card {
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-card h2 {
  font-size: 1.8em;
  text-align: center;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 2rem 0;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.75rem;
  font-size: 1rem;
}

.error-message {
  background-color: rgba(255, 67, 54, 0.1);
  border: 1px solid #ff4336;
  border-radius: 6px;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  color: #ff9f9f;
  font-size: 0.9rem;
}

.login-btn {
  width: 100%;
  padding: 0.85rem;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.divider {
  height: 1px;
  background-color: #444;
  margin: 1rem 0;
}

.register-link {
  text-align: center;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.register-link a {
  color: #646cff;
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: underline;
}

@media (prefers-color-scheme: light) {
  .subtitle {
    color: rgba(33, 53, 71, 0.6);
  }

  .divider {
    background-color: #ddd;
  }

  .register-link {
    color: rgba(33, 53, 71, 0.7);
  }

  .error-message {
    background-color: rgba(255, 67, 54, 0.1);
    color: #d32f2f;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 1.5em;
  }

  .login-card h2 {
    font-size: 1.5em;
  }
}
</style>
