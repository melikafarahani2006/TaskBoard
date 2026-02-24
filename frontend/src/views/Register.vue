<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios';

const name = ref('');
const email = ref('');
const password = ref('');
const router = useRouter();
const isLoading = ref(false);
const errorMessage = ref('');

const register = async () => {
  errorMessage.value = '';

  if (!name.value || !email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields';
    return;
  }

  if (password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters';
    return;
  }

  isLoading.value = true;
  try {
    const res = await api.post('/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value,
    });

    localStorage.setItem('token', res.data.access_token);
    router.push('/create-task');
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || 'Registration failed';
    console.error('Registration Error:', err.response?.data);
    errorMessage.value = Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg;
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="register-container">
    <div class="register-card card">
      <h2>Create Account</h2>
      <p class="subtitle">Join us today</p>

      <form @submit.prevent="register">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="Enter your full name"
            required
            :disabled="isLoading"
          />
        </div>

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
            placeholder="Enter your password (min 6 characters)"
            required
            :disabled="isLoading"
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button type="submit" class="register-btn" :disabled="isLoading">
          {{ isLoading ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>

      <div class="divider"></div>

      <p class="login-link">
        Already have an account?
        <router-link to="/login">Sign in here</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
}

.register-card {
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.register-card h2 {
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

.register-btn {
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

.login-link {
  text-align: center;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.login-link a {
  color: #646cff;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}

@media (prefers-color-scheme: light) {
  .subtitle {
    color: rgba(33, 53, 71, 0.6);
  }

  .divider {
    background-color: #ddd;
  }

  .login-link {
    color: rgba(33, 53, 71, 0.7);
  }

  .error-message {
    background-color: rgba(255, 67, 54, 0.1);
    color: #d32f2f;
  }
}

@media (max-width: 480px) {
  .register-card {
    padding: 1.5em;
  }

  .register-card h2 {
    font-size: 1.5em;
  }
}
</style>
