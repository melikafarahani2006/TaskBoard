<script setup lang="ts">
import { onMounted, ref } from 'vue';
import api from '../api/axios';
import { useRouter } from 'vue-router';

interface Task {
  _id: string;
  title: string;
  description?: string;
  status?: string;
  createdAt?: string;
}

const tasks = ref<Task[]>([]);
const isLoading = ref(true);
const errorMessage = ref('');
const router = useRouter();

const fetchTasks = async () => {
  try {
    isLoading.value = true;
    const res = await api.get('/tasks');
    tasks.value = res.data;
    console.log('Fetched Tasks:', res.data);
  } catch (err: any) {
    errorMessage.value = 'Failed to load tasks';
    console.error('Error fetching tasks:', err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchTasks);

const logout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1>My Tasks</h1>
      <button class="logout-btn" @click="logout">Logout</button>
    </div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div v-if="isLoading" class="loading">
      <p>Loading tasks...</p>
    </div>

    <div v-else-if="tasks.length === 0" class="empty-state">
      <p>No tasks yet. Create one to get started!</p>
    </div>

    <div v-else class="tasks-grid">
      <div v-for="task in tasks" :key="task._id" class="task-card card">
        <h3>{{ task.title }}</h3>
        <p v-if="task.description" class="task-description">
          {{ task.description }}
        </p>
        <div class="task-footer">
          <span v-if="task.status" class="task-status" :class="task.status">
            {{ task.status }}
          </span>
          <span v-if="task.createdAt" class="task-date">
            {{ new Date(task.createdAt).toLocaleDateString() }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  padding: 2rem 1rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 2.5em;
}

.logout-btn {
  padding: 0.6em 1.5em;
  background-color: #ff4336;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #d32f2f;
}

.error-message {
  background-color: rgba(255, 67, 54, 0.1);
  border: 1px solid #ff4336;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  color: #ff9f9f;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.6);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.task-card {
  padding: 1.5rem;
  border-radius: 12px;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  cursor: pointer;
}

.task-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
}

.task-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.3em;
  word-break: break-word;
}

.task-description {
  color: rgba(255, 255, 255, 0.7);
  margin: 0.5rem 0 1rem 0;
  line-height: 1.5;
  max-height: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #444;
}

.task-status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
}

.task-status.pending {
  background-color: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.task-status.in-progress {
  background-color: rgba(33, 150, 243, 0.2);
  color: #2196f3;
}

.task-status.completed {
  background-color: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.task-date {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
}

@media (prefers-color-scheme: light) {
  .task-card {
    background-color: #ffffff;
  }

  .task-card:hover {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }

  .task-description {
    color: rgba(33, 53, 71, 0.7);
  }

  .task-footer {
    border-top-color: #ddd;
  }

  .logout-btn {
    background-color: #ff4336;
  }

  .logout-btn:hover {
    background-color: #d32f2f;
  }

  .empty-state,
  .loading {
    color: rgba(33, 53, 71, 0.6);
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .dashboard-header h1 {
    font-size: 1.8em;
  }

  .tasks-grid {
    grid-template-columns: 1fr;
  }
}
</style>
