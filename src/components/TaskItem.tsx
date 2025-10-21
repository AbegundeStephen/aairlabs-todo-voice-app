// src/components/TaskItem.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
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
  
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return null;
    }
  };
  
  const formatDueDate = (date: Date) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `${diffDays} days`;
    
    return dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  const priorityColor = getPriorityColor();
  
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        { 
          backgroundColor: colors.card,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          opacity: pressed ? 0.95 : 1,
        }
      ]}
      onPress={onPress}
      android_ripple={{ color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
    >
      {/* Checkbox with modern styling */}
      <Pressable 
        onPress={handleToggle} 
        style={styles.checkboxContainer}
        hitSlop={8}
      >
        <View style={[
          styles.checkbox,
          {
            backgroundColor: task.completed ? colors.primary : 'transparent',
            borderColor: task.completed ? colors.primary : colors.border,
          }
        ]}>
          {task.completed && (
            <Ionicons
              name="checkmark"
              size={18}
              color="#FFFFFF"
            />
          )}
        </View>
      </Pressable>
      
      {/* Task content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          {priorityColor && (
            <View style={[styles.priorityIndicator, { backgroundColor: priorityColor }]} />
          )}
          <Text 
            style={[
              styles.title,
              { color: colors.text },
              task.completed && styles.completedText
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Text>
        </View>
        
        {task.description && (
          <Text 
            style={[styles.description, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {task.description}
          </Text>
        )}
        
        {/* Due date and priority tags */}
        {task.dueDate && (
          <View style={styles.metaRow}>
            <View style={[
              styles.dueDateTag,
              { 
                backgroundColor: isOverdue 
                  ? 'rgba(239, 68, 68, 0.1)' 
                  : isDark ? 'rgba(96, 165, 250, 0.15)' : 'rgba(59, 130, 246, 0.1)'
              }
            ]}>
              <Ionicons 
                name="calendar-outline" 
                size={12} 
                color={isOverdue ? '#EF4444' : colors.primary} 
              />
              <Text style={[
                styles.dueDateText,
                { color: isOverdue ? '#EF4444' : colors.primary }
              ]}>
                {formatDueDate(task.dueDate)}
              </Text>
            </View>
          </View>
        )}
      </View>
      
      {/* Delete button with better touch target */}
      <Pressable 
        onPress={handleDelete} 
        style={({ pressed }) => [
          styles.deleteButton,
          {
            backgroundColor: pressed 
              ? (isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)')
              : 'transparent'
          }
        ]}
        hitSlop={8}
      >
        <Ionicons name="trash-outline" size={20} color={colors.error} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    // Modern shadow - softer and more elevated
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  checkboxContainer: {
    marginRight: 16,
    padding: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityIndicator: {
    width: 3,
    height: 16,
    borderRadius: 2,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
    opacity: 0.7,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  dueDateTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dueDateText: {
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});