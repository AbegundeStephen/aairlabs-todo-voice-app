export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high'; // bonus
}

export interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  loadTasks: () => Promise<void>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: 'all' | 'active' | 'completed';
  setFilterStatus: (status: 'all' | 'active' | 'completed') => void;
}

export type RootStackParamList = {
  TaskList: undefined;
  AddTask: { taskId?: string }; // For editing
};