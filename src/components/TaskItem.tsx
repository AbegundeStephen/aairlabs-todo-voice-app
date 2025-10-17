// src/components/TaskItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../types';
import { useThemeStore } from '../store/themeStore';
import { COLORS, SPACING } from '../constants/theme';
import * as Haptics from 'expo-haptics';

interface Props {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onPress: () => void;
}

export default function TaskItem({ task, onToggle, onDelete, onPress }: Props) {
  const isDark = useThemeStore((state) => state.isDark);
  const colors = isDark ? COLORS.dark : COLORS.light;
  
  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle();
  };
  
  const handleDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onDelete();
  };
  
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <TouchableOpacity onPress={handleToggle} style={styles.checkbox}>
        <Ionicons
          name={task.completed ? 'checkbox' : 'square-outline'}
          size={24}
          color={task.completed ? colors.success : colors.textSecondary}
        />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text 
          style={[
            styles.title,
            { color: colors.text },
            task.completed && styles.completedText
          ]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        {task.description && (
          <Text 
            style={[styles.description, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {task.description}
          </Text>
        )}
      </View>
      
      <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={20} color={colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.xs,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  checkbox: {
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  description: {
    fontSize: 14,
    marginTop: 4,
  },
  deleteButton: {
    padding: SPACING.sm,
  },
});