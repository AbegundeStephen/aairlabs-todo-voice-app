
// ==========================================
// FILE: src/screens/AddTaskScreen.tsx
// ==========================================
import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useTaskStore } from '../store/taskStore';
import { useThemeStore } from '../store/themeStore';
import { COLORS, SPACING } from '../constants/theme';
import * as Haptics from 'expo-haptics';

export default function AddTaskScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<Record<string, { taskId?: string }>, string>>();
  const taskId = route.params?.taskId;
  
  const isDark = useThemeStore((state) => state.isDark);
  const colors = isDark ? COLORS.dark : COLORS.light;
  
  const { tasks, addTask, updateTask } = useTaskStore();
  const existingTask = taskId ? tasks.find(t => t.id === taskId) : null;
  
  const [title, setTitle] = useState(existingTask?.title || '');
  const [description, setDescription] = useState(existingTask?.description || '');
  
  useLayoutEffect(() => {
    navigation.setOptions({
      title: taskId ? 'Edit Task' : 'Add Task',
    });
  }, [taskId]);
  
  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    if (taskId) {
      updateTask(taskId, { title: title.trim(), description: description.trim() });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        completed: false,
      });
    }
    
    navigation.goBack();
  };
  
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.text }]}>
            Title *
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: colors.card, 
                color: colors.text,
                borderColor: colors.border,
              }
            ]}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter task title"
            placeholderTextColor={colors.textSecondary}
            autoFocus
          />
          
          <Text style={[styles.label, { color: colors.text }]}>
            Description
          </Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              { 
                backgroundColor: colors.card, 
                color: colors.text,
                borderColor: colors.border,
              }
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter task description (optional)"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>
              {taskId ? 'Update Task' : 'Add Task'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  form: {
    padding: SPACING.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    paddingTop: SPACING.md,
  },
  saveButton: {
    marginTop: SPACING.xl,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
