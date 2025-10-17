// src/store/taskStore.ts
import { create } from 'zustand';
import { Task, TaskStore } from '../types';
import * as StorageService from '../services/storage.service';

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  searchQuery: '',
  filterStatus: 'all',
  
  loadTasks: async () => {
    set({ isLoading: true });
    const tasks = await StorageService.getTasks();
    set({ tasks, isLoading: false });
  },
  
  addTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    const tasks = [...get().tasks, newTask];
    set({ tasks });
    StorageService.saveTasks(tasks);
  },
  
  toggleTask: (id) => {
    const tasks = get().tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    set({ tasks });
    StorageService.saveTasks(tasks);
  },
  
  deleteTask: (id) => {
    const tasks = get().tasks.filter(task => task.id !== id);
    set({ tasks });
    StorageService.saveTasks(tasks);
  },
  
  updateTask: (id, updates) => {
    const tasks = get().tasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    );
    set({ tasks });
    StorageService.saveTasks(tasks);
  },
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterStatus: (status) => set({ filterStatus: status }),
}));