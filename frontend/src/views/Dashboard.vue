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

const showEditModal = ref(false);
const showDeleteModal = ref(false);
const editingTask = ref<Task | null>(null);
const editTitle = ref('');
const editDescription = ref('');
const editStatus = ref('');

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

const addTask = () => {
  router.push('/create-task');
};

const openEditModal = (task: Task) => {
  editingTask.value = task;
  editTitle.value = task.title;
  editDescription.value = task.description || '';
  editStatus.value = task.status || '';
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  editingTask.value = null;
  editTitle.value = '';
  editDescription.value = '';
};

const openDeleteModal = (task: Task) => {
  showDeleteModal.value = true;
  editingTask.value = task;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  editingTask.value = null;
};

const deleteTask = async () => {
  if (!editingTask.value) return;

  try {
    await api.delete(`/tasks/${editingTask.value._id}`);

    const index = tasks.value.findIndex((t) => t._id === editingTask.value!._id);
    if (index !== -1) {
      tasks.value.splice(index, 1);
    }
    closeDeleteModal();
  } catch (err: any) {
    console.error('Error deleting task:', err);
    alert('Failed to delete task. Please try again.');
  }
};

const updateTask = async () => {
  if (!editingTask.value) return;

  if (!editTitle.value.trim()) {
    alert('Task title is required');
    return;
  }

  try {
    const res = await api.patch(`/tasks/${editingTask.value._id}`, {
      title: editTitle.value,
      description: editDescription.value,
      status: editStatus.value,
    });

    const index = tasks.value.findIndex((t) => t._id === editingTask.value!._id);
    if (index !== -1) {
      tasks.value[index] = res.data.data;
    }

    closeEditModal();
  } catch (err: any) {
    console.error('Error updating task:', err);
    alert('Failed to update task');
  }
};
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1>My Tasks</h1>
      <button class="addTask-btn" @click="addTask">Add</button>
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
        <div class="task-header">
          <h3>{{ task.title }}</h3>
          <button @click="openEditModal(task)" class="edit-icon" title="Edit task">✏️</button>
          <button @click="openDeleteModal(task)" class="delete-icon" title="Delete task">D</button>
        </div>
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

    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Edit Task</h2>
          <button @click="closeEditModal" class="close-btn">×</button>
        </div>

        <form @submit="updateTask" class="edit-form">
          <div class="form-group">
            <label for="edit-status">Status</label>
            <select name="edit" id="edit-status" v-model="editStatus">
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div class="form-group">
            <label for="edit-title">Title</label>
            <input
              id="edit-title"
              v-model="editTitle"
              type="text"
              placeholder="Enter task title"
              required
            />
          </div>

          <div class="form-group">
            <label for="edit-description">Description</label>
            <textarea
              id="edit-description"
              v-model="editDescription"
              placeholder="Enter task description"
              rows="3"
            ></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeEditModal" class="cancel-btn">Cancel</button>
            <button type="submit" class="save-btn">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div v-if="showDeleteModal" @click="closeDeleteModal">
    <div class="modal-overlay" @click.stop>
      <div class="modal-content">
        <div class="modal-header">
          <h2>Confirm Delete</h2>
          <button @click="closeDeleteModal" class="close-btn">×</button>
        </div>

        <div class="edit-form">
          <p>Are you sure you want to delete this task?</p>
          <div class="modal-actions">
            <button type="button" @click="closeDeleteModal" class="cancel-btn">Cancel</button>
            <button type="button" @click="deleteTask" class="save-btn">Delete</button>
          </div>
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
  position: absolute;
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

.addTask-btn {
  position: relative;
  margin-left: 200px;
  padding: 0.6em 1.5em;
  background-color: #4caf50;
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

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.task-header h3 {
  margin: 0;
  flex: 1;
  margin-right: 0.5rem;
}

.edit-icon {
  background: none;
  border: none;
  font-size: 1em;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.3s;
  opacity: 0.7;
}

.edit-icon:hover {
  background-color: rgba(33, 150, 243, 0.1);
  opacity: 1;
}

.delete-icon {
  background: none;
  border: none;
  font-size: 1em;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s;
}

.delete-icon:hover {
  background-color: rgba(255, 67, 54, 0.1);
  color: #ff4336;
}

.task-description {
  color: rgba(255, 255, 255, 0.7);
  margin: 0.5rem 0 1rem 0;
  line-height: 1.5;
  max-height: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.753);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--color-background);
  border: 1px solid #444;
  border-radius: 12px;
  padding: 0;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #444;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5em;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s;
}

.close-btn:hover {
  background-color: rgba(255, 67, 54, 0.1);
  color: #ff4336;
}

.edit-form {
  padding: 1.5rem;
}

.edit-form .form-group {
  margin-bottom: 1.5rem;
}

.edit-form .form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
}

.edit-form .form-group input,
.edit-form .form-group textarea {
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

.edit-form .form-group textarea {
  resize: vertical;
}

.edit-form .form-group input:focus,
.edit-form .form-group textarea:focus {
  outline: none;
  border-color: #646cff;
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.1);
}

.edit-form .form-group input:disabled,
.edit-form .form-group textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  background-color: #504e4e;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-btn:hover:not(:disabled) {
  background-color: #646464;
}

.save-btn {
  padding: 0.75rem 1.5rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.save-btn:hover:not(:disabled) {
  background-color: #388e3c;
}

.save-btn:disabled,
.cancel-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (prefers-color-scheme: light) {
  .edit-icon:hover {
    background-color: rgba(33, 150, 243, 0.1);
  }

  .modal-content {
    background: #ffffff;
    border-color: #ddd;
  }

  .modal-header {
    border-bottom-color: #ddd;
  }

  .close-btn:hover {
    background-color: rgba(255, 67, 54, 0.1);
  }

  .edit-form .form-group input,
  .edit-form .form-group textarea {
    background-color: #f5f5f5;
    border-color: #ddd;
    color: #213547;
  }

  .edit-form .form-group input:focus,
  .edit-form .form-group textarea:focus {
    border-color: #646cff;
  }
}

@media (max-width: 600px) {
  .modal-content {
    width: 95%;
    margin: 1rem;
  }

  .modal-header {
    padding: 1rem;
  }

  .edit-form {
    padding: 1rem;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions button {
    width: 100%;
  }
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

.task-status.todo {
  background-color: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.task-status.in-progress {
  background-color: rgba(33, 150, 243, 0.2);
  color: #2196f3;
}

.task-status.done {
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
