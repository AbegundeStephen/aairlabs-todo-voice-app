// src/store/taskStore.ts
import { create } from 'zustand';
import { Task, TaskStore } from '../types';
import * as StorageService from '../services/storage.service';

// Helper functions for filtering
const isOverdue = (task: Task) => {
  if (!task.dueDate || task.completed) return false;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dueDate = new Date(task.dueDate);
  dueDate.setHours(0, 0, 0, 0);
  return dueDate < now;
};

const isUpcoming = (task: Task) => {
  if (!task.dueDate || task.completed) return false;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dueDate = new Date(task.dueDate);
  dueDate.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 7; // Next 7 days
};

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
  
  // Helper methods to get filtered tasks
  getFilteredTasks: () => {
    const { tasks, filterStatus, searchQuery } = get();
    let filtered = [...tasks];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
      );
    }

    // Apply status filters
    switch (filterStatus) {
      case 'active':
        filtered = filtered.filter((t) => !t.completed);
        break;
      case 'completed':
        filtered = filtered.filter((t) => t.completed);
        break;
      case 'overdue':
        filtered = filtered.filter(isOverdue);
        break;
      case 'upcoming':
        filtered = filtered.filter(isUpcoming);
        break;
      case 'all':
      default:
        // No filtering
        break;
    }

    return filtered;
  },

  // Get task counts for all filter types
  getTaskCounts: () => {
    const { tasks } = get();
    return {
      all: tasks.length,
      active: tasks.filter((t) => !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
      overdue: tasks.filter(isOverdue).length,
      upcoming: tasks.filter(isUpcoming).length,
    };
  },
}));