// src/screens/AddTaskScreen.tsx
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
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTaskStore } from '../store/taskStore';
import { useThemeStore } from '../store/themeStore';
import { COLORS, SPACING } from '../constants/theme';
import * as Haptics from 'expo-haptics';

type Priority = 'low' | 'medium' | 'high';

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
  const [dueDate, setDueDate] = useState<Date | undefined>(
    existingTask?.dueDate ? new Date(existingTask.dueDate) : undefined
  );
  const [priority, setPriority] = useState<Priority | undefined>(existingTask?.priority);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  useLayoutEffect(() => {
    navigation.setOptions({
      title: taskId ? 'Edit Task' : 'New Task',
    });
  }, [taskId]);
  
  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Required Field', 'Please enter a task title');
      return;
    }
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    if (taskId) {
      updateTask(taskId, { 
        title: title.trim(), 
        description: description.trim(),
        dueDate,
        priority,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        completed: false,
        dueDate,
        priority,
      });
    }
    
    navigation.goBack();
  };
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };
  
  const clearDueDate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDueDate(undefined);
  };
  
  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
    }
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Title
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
              placeholder="What needs to be done?"
              placeholderTextColor={colors.textSecondary}
              autoFocus
            />
          </View>
          
          {/* Description Input */}
          <View style={styles.inputGroup}>
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
              placeholder="Add more details..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          {/* Due Date Section */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Due Date
            </Text>
            <View style={styles.dateContainer}>
              <Pressable
                style={[
                  styles.dateButton,
                  { 
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  }
                ]}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons 
                  name="calendar-outline" 
                  size={20} 
                  color={dueDate ? colors.primary : colors.textSecondary} 
                />
                <Text style={[
                  styles.dateButtonText,
                  { color: dueDate ? colors.text : colors.textSecondary }
                ]}>
                  {dueDate ? formatDate(dueDate) : 'Select date'}
                </Text>
              </Pressable>
              
              {dueDate && (
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={clearDueDate}
                >
                  <Ionicons name="close-circle" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          
          {/* Priority Section */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Priority
            </Text>
            <View style={styles.priorityContainer}>
              {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                <Pressable
                  key={p}
                  style={[
                    styles.priorityChip,
                    {
                      backgroundColor: priority === p 
                        ? getPriorityColor(p) + '20'
                        : colors.card,
                      borderColor: priority === p 
                        ? getPriorityColor(p)
                        : colors.border,
                      borderWidth: priority === p ? 2 : 1,
                    }
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setPriority(priority === p ? undefined : p);
                  }}
                >
                  <View style={[
                    styles.priorityDot,
                    { backgroundColor: getPriorityColor(p) }
                  ]} />
                  <Text style={[
                    styles.priorityText,
                    { 
                      color: priority === p ? getPriorityColor(p) : colors.text,
                      fontWeight: priority === p ? '600' : '500',
                    }
                  ]}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          
          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>
              {taskId ? 'Update Task' : 'Create Task'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  form: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    lineHeight: 22,
  },
  textArea: {
    height: 120,
    paddingTop: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 16,
  },
  dateButtonText: {
    fontSize: 16,
    flex: 1,
  },
  clearButton: {
    padding: 4,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 15,
    letterSpacing: -0.2,
  },
  saveButton: {
    marginTop: 16,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
});