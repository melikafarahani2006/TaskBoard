<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios';

const title = ref('');
const description = ref('');
const tasks = ref<Array<{ title: string; description: string }>>([]);
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const router = useRouter();

const addTask = async () => {
  errorMessage.value = '';

  if (!title.value.trim()) {
    errorMessage.value = 'Task title is required';
    return;
  }

  tasks.value.push({
    title: title.value,
    description: description.value,
  });

  title.value = '';
  description.value = '';
};

const removeTask = (index: number) => {
  tasks.value.splice(index, 1);
};

const submitTasks = async () => {
  if (tasks.value.length === 0) {
    errorMessage.value = 'Please add at least one task';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    await api.post('/tasks/bulk', { tasks: tasks.value });
    successMessage.value = 'Tasks created successfully!';
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Failed to create tasks';
    console.error('Error creating tasks:', err);
  } finally {
    isLoading.value = false;
  }
};

const skipAndGoDashboard = () => {
  router.push('/dashboard');
};
</script>

<template>
  <div class="create-task-container">
    <div class="create-task-card card">
      <h2>Create Your First Tasks</h2>
      <p class="subtitle">Add tasks to your to-do list and start organizing</p>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <div class="task-input-section">
        <h3>Add a Task</h3>
        <div class="form-group">
          <label for="title">Task Title</label>
          <input
            id="title"
            v-model="title"
            type="text"
            placeholder="Enter task title"
            :disabled="isLoading"
            @keyup.enter="addTask"
          />
        </div>

        <div class="form-group">
          <label for="description">Description (Optional)</label>
          <textarea
            id="description"
            v-model="description"
            placeholder="Enter task description"
            rows="3"
            :disabled="isLoading"
          ></textarea>
        </div>

        <button type="button" class="add-btn" @click="addTask" :disabled="isLoading">
          + Add Task
        </button>
      </div>

      <div v-if="tasks.length > 0" class="tasks-list">
        <h3>Tasks ({{ tasks.length }})</h3>
        <div v-for="(task, index) in tasks" :key="index" class="task-item">
          <div class="task-content">
            <p class="task-title">{{ task.title }}</p>
            <p v-if="task.description" class="task-desc">
              {{ task.description }}
            </p>
          </div>
          <button type="button" class="remove-btn" @click="removeTask(index)" :disabled="isLoading">
            ✕
          </button>
        </div>
      </div>

      <div class="action-buttons">
        <button type="button" class="skip-btn" @click="skipAndGoDashboard" :disabled="isLoading">
          Skip for Now
        </button>
        <button
          type="button"
          class="submit-btn"
          @click="submitTasks"
          :disabled="isLoading || tasks.length === 0"
        >
          {{ isLoading ? 'Creating...' : 'Create Tasks' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.create-task-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.create-task-card {
  width: 100%;
  max-width: 600px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.create-task-card h2 {
  font-size: 1.8em;
  margin-bottom: 0.5rem;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 2rem 0;
  font-size: 0.95rem;
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

.success-message {
  background-color: rgba(76, 175, 80, 0.1);
  border: 1px solid #4caf50;
  border-radius: 6px;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  color: #81c784;
  font-size: 0.9rem;
}

.task-input-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #444;
}

.task-input-section h3 {
  font-size: 1.2em;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #444;
  background-color: #2a2a2a;
  color: inherit;
  font-family: inherit;
  transition: border-color 0.25s;
}

.form-group textarea {
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #646cff;
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.1);
}

.add-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #646cff;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-btn:hover:not(:disabled) {
  background-color: #535bf2;
}

.add-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.tasks-list {
  margin-bottom: 2rem;
}

.tasks-list h3 {
  font-size: 1.2em;
  margin-bottom: 1rem;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background-color: #2a2a2a;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 0.75rem;
  gap: 1rem;
}

.task-content {
  flex: 1;
}

.task-title {
  margin: 0;
  font-weight: 600;
  word-break: break-word;
}

.task-desc {
  margin: 0.5rem 0 0 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.remove-btn {
  background-color: #ff4336;
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 1.2em;
  cursor: pointer;
  transition: background-color 0.3s;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.remove-btn:hover:not(:disabled) {
  background-color: #d32f2f;
}

.remove-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.skip-btn {
  padding: 0.75rem 1.5rem;
  background-color: #504e4e;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.skip-btn:hover:not(:disabled) {
  background-color: #646cff;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #388e3c;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (prefers-color-scheme: light) {
  .subtitle {
    color: rgba(33, 53, 71, 0.6);
  }

  .task-input-section {
    border-bottom-color: #ddd;
  }

  .form-group input,
  .form-group textarea {
    background-color: #f5f5f5;
    border-color: #ddd;
    color: #213547;
  }

  .task-item {
    background-color: #f5f5f5;
  }

  .task-desc {
    color: rgba(33, 53, 71, 0.6);
  }
}

@media (max-width: 600px) {
  .create-task-card {
    padding: 1.5em;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons button {
    width: 100%;
  }
}
</style>
