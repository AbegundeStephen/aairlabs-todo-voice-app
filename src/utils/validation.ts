
//src/utils/validation.ts


//Validation utilities
export const validate = {
  taskTitle: (title: string): { valid: boolean; error?: string } => {
    const trimmed = title.trim();

    if (trimmed.length === 0) {
      return { valid: false, error: 'Title cannot be empty' };
    }

    if (trimmed.length > 200) {
      return { valid: false, error: 'Title must be less than 200 characters' };
    }

    return { valid: true };
  },

  taskDescription: (description: string): { valid: boolean; error?: string } => {
    if (description.trim().length > 500) {
      return { valid: false, error: 'Description must be less than 500 characters' };
    }

    return { valid: true };
  },

  dueDate: (date: Date): { valid: boolean; error?: string } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      return { valid: false, error: 'Due date cannot be in the past' };
    }

    return { valid: true };
  },
};
