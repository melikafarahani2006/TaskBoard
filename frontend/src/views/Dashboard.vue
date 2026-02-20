<script setup lang="ts">
import { onMounted, ref } from 'vue';
import api from '../api/axios';
import { useRouter } from 'vue-router';

interface Task {
  _id: string;
  title: string;
}

const tasks = ref<Task[]>([]);

const fetchTasks = async () => {
  const res = await api.get('/tasks');
  tasks.value = res.data;
};

onMounted(fetchTasks);

const router = useRouter();
const logout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};
</script>

<template>
  <div>
    <h2>Dashboard</h2>
    <button @click="logout">Logout</button>
    <ul>
      <li v-for="task in tasks" :key="task._id">
        {{ task.title }}
      </li>
    </ul>
  </div>
</template>
