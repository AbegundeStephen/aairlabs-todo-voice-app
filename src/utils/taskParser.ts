//src/utils/taskParser.ts

/**
 
 * Splits natural language input into separate tasks
 */
export const parseTasksLocally = (text: string): string[] => {
  // Remove common filler words
  const cleaned = text
    .replace(/^(ok|okay|hey|hi|hello|please|could you|can you|i need to|i have to)\s+/i, '')
    .trim();
  
  // Split by common delimiters
  const delimiters = /\s+and\s+|,\s*(?:and\s+)?|;\s+|\.\s+|then\s+/gi;
  
  const tasks = cleaned
    .split(delimiters)
    .map(task => {
      // Capitalize first letter
      const trimmed = task.trim();
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    })
    .filter(task => {
      // Remove empty or very short tasks
      return task.length > 2 && task.split(' ').length > 0;
    });
  
  return tasks.length > 0 ? tasks : [text];
};

/**
 * Validates task title
 */
export const validateTaskTitle = (title: string): boolean => {
  return title.trim().length > 0 && title.trim().length <= 200;
};

/**
 * Cleans task title
 */
export const cleanTaskTitle = (title: string): string => {
  return title
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[^\w\s\-.,!?()]/g, ''); // Remove special chars except common punctuation
};