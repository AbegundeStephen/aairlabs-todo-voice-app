// src/services/storage.service.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types';

// Key for AsyncStorage
const TASKS_KEY = '@todo_tasks';

// Function to get all tasks from storage
export const getTasks = async (): Promise<Task[]> => {
  try {
    const data = await AsyncStorage.getItem(TASKS_KEY);
    if (!data) return [];
    
    const tasks = JSON.parse(data);
    // Convert date strings back to Date objects
    return tasks.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    }));
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

export const saveTasks = async (tasks: Task[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

export const clearTasks = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TASKS_KEY);
  } catch (error) {
    console.error('Error clearing tasks:', error);
  }
};