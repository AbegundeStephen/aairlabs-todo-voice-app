/// <reference types="jest" />
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TaskItem from '../../components/TaskItem';
import * as Haptics from 'expo-haptics';

// expo-haptics to prevent native calls
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light' },
  NotificationFeedbackType: { Success: 'success' },
}));

//Mock useThemeStore to control dark/light mode
jest.mock('../../src/store/themeStore', () => ({
  useThemeStore: jest.fn(() => ({ isDark: false })),
}));

// Declare 'mockIonicon' as a valid JSX element for test purposes
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mockIonicon: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}



const mockTask = {
  id: '1',
  title: 'Buy groceries',
  description: 'Get milk and bread',
  completed: false,
  priority: "high" as "high" | "medium" | "low",
  createdAt: new Date(),
  dueDate: new Date(Date.now() + 86400000), // tomorrow
};

describe('TaskItem Component', () => {
  const onToggle = jest.fn();
  const onDelete = jest.fn();
  const onPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task title and description', () => {
    const { getByText } = render(
      <TaskItem task={mockTask} onToggle={onToggle} onDelete={onDelete} onPress={onPress} />
    );

    expect(getByText('Buy groceries')).toBeTruthy();
    expect(getByText('Get milk and bread')).toBeTruthy();
  });

  it('triggers onPress when pressed', () => {
    const { getByText } = render(
      <TaskItem task={mockTask} onToggle={onToggle} onDelete={onDelete} onPress={onPress} />
    );

    fireEvent.press(getByText('Buy groceries'));
    expect(onPress).toHaveBeenCalled();
  });

  it('calls onToggle and triggers haptic feedback', async () => {
    const { getByRole } = render(
      <TaskItem task={mockTask} onToggle={onToggle} onDelete={onDelete} onPress={onPress} />
    );

    const toggleButton = getByRole('button', { name: '' }); // first pressable (checkbox)
    fireEvent.press(toggleButton);

    expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
    expect(onToggle).toHaveBeenCalled();
  });

  it('calls onDelete and triggers success haptic', async () => {
    const { getAllByRole } = render(
      <TaskItem task={mockTask} onToggle={onToggle} onDelete={onDelete} onPress={onPress} />
    );

    const deleteButton = getAllByRole('button')[2]; // last pressable (delete)
    fireEvent.press(deleteButton);

    expect(Haptics.notificationAsync).toHaveBeenCalledWith('success');
    expect(onDelete).toHaveBeenCalled();
  });

  it('displays "Tomorrow" for tomorrow’s due date', () => {
    const { getByText } = render(
      <TaskItem task={mockTask} onToggle={onToggle} onDelete={onDelete} onPress={onPress} />
    );
    expect(getByText('Tomorrow')).toBeTruthy();
  });

  it('shows a checkmark when task is completed', () => {
    const completedTask = { ...mockTask, completed: true };
    const { getByText, queryByTestId } = render(
      <TaskItem task={completedTask} onToggle={onToggle} onDelete={onDelete} onPress={onPress} />
    );

    expect(getByText('Buy groceries')).toBeTruthy();
    // The Ionicon mock ensures this renders
    expect(queryByTestId('checkmark')).toBeTruthy();
  });

  it('handles overdue task display', () => {
    const overdueTask = {
      ...mockTask,
      completed: false,
      dueDate: new Date(Date.now() - 86400000), // yesterday
    };

    const { getByText } = render(
      <TaskItem task={overdueTask} onToggle={onToggle} onDelete={onDelete} onPress={onPress} />
    );

    expect(getByText('Overdue')).toBeTruthy();
  });
});
