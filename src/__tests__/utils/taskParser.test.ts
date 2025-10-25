/// <reference types="jest" />
import { parseTasksLocally, validateTaskTitle, cleanTaskTitle } from "../../utils/taskParser";

describe('taskParser utilities', () => {
  describe('parseTasksLocally', () => {
    it('should split natural language into separate tasks', () => {
      const input = 'Buy groceries and clean the house, then walk the dog.';
      const result = parseTasksLocally(input);
      expect(result).toEqual([
        'Buy groceries',
        'Clean the house',
        'Walk the dog',
      ]);
    });

    it('should remove filler words at the start', () => {
      const input = 'Hey can you remind me to call mom and pay bills';
      const result = parseTasksLocally(input);
      expect(result).toEqual(['Remind me to call mom', 'Pay bills']);
    });

    it('should return original text if no valid tasks found', () => {
      const input = '';
      const result = parseTasksLocally(input);
      expect(result).toEqual([input]);
    });

    it('should capitalize each parsed task', () => {
      const input = 'buy milk and finish report';
      const result = parseTasksLocally(input);
      expect(result[0][0]).toBe(result[0][0].toUpperCase());
      expect(result[1][0]).toBe(result[1][0].toUpperCase());
    });

    it('should handle sentences with commas and periods', () => {
      const input = 'Go to gym, cook dinner. Study.';
      const result = parseTasksLocally(input);
      expect(result).toEqual(['Go to gym', 'Cook dinner', 'Study']);
    });
  });

  describe('validateTaskTitle', () => {
    it('should return true for valid titles', () => {
      expect(validateTaskTitle('Buy milk')).toBe(true);
    });

    it('should return false for empty titles', () => {
      expect(validateTaskTitle('')).toBe(false);
      expect(validateTaskTitle('   ')).toBe(false);
    });

    it('should return false for overly long titles', () => {
      const longTitle = 'a'.repeat(201);
      expect(validateTaskTitle(longTitle)).toBe(false);
    });
  });

  describe('cleanTaskTitle', () => {
    it('should trim extra spaces', () => {
      const input = '   Finish report   ';
      expect(cleanTaskTitle(input)).toBe('Finish report');
    });

    it('should replace multiple spaces with single spaces', () => {
      const input = 'Finish   the   report';
      expect(cleanTaskTitle(input)).toBe('Finish the report');
    });

    it('should remove invalid characters but keep punctuation', () => {
      const input = 'Finish report! @home #urgent (now)';
      const result = cleanTaskTitle(input);
      expect(result).toBe('Finish report! home urgent (now)');
    });
  });
});
