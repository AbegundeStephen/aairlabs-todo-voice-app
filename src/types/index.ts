export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high'; // bonus
}

// src/types.ts (or wherever your types are defined)

export type FilterStatus = 'all' | 'active' | 'completed' | 'overdue' | 'upcoming';


export interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  searchQuery: string;
  filterStatus: FilterStatus; // Updated type
  loadTasks: () => Promise<void>;
  addTask: (taskData: Omit<Task, 'id' | 'createdAt'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: FilterStatus) => void;
  getFilteredTasks: () => Task[];
  getTaskCounts: () => {
    all: number;
    active: number;
    completed: number;
    overdue: number;
    upcoming: number;
  };
}

export type RootStackParamList = {
  TaskList: undefined;
  AddTask: { taskId?: string }; // For editing
};