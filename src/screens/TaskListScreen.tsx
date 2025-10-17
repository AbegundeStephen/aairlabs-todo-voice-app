// src/screens/TaskListScreen.tsx
import React, { useEffect, useMemo } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTaskStore } from '../store/taskStore';
import { useVoiceInput } from '../hooks/useVoiceInput';
import TaskItem from '../components/TaskItem';
import FAB from '../components/FAB';
import EmptyState from '../components/EmptyState';
import LoadingOverlay from '../components/LoadingOverlay';
import { useThemeStore } from '../store/themeStore';
import { COLORS } from '../constants/theme';

export default function TaskListScreen() {
  type RootStackParamList = {
    AddTask: { taskId: string } | undefined;
    // add other routes here if needed
  };

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isDark = useThemeStore((state) => state.isDark);
  const colors = isDark ? COLORS.dark : COLORS.light;
  
  const {
    tasks,
    isLoading,
    loadTasks,
    toggleTask,
    deleteTask,
    searchQuery,
    filterStatus,
  } = useTaskStore();
  
  const { isRecording, isProcessing, toggleRecording } = useVoiceInput();
  
  useEffect(() => {
    loadTasks();
  }, []);
  
  // Filter tasks
  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Status filter
    if (filterStatus === 'active') {
      filtered = filtered.filter(task => !task.completed);
    } else if (filterStatus === 'completed') {
      filtered = filtered.filter(task => task.completed);
    }
    
    return filtered;
  }, [tasks, searchQuery, filterStatus]);
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={() => toggleTask(item.id)}
            onDelete={() => deleteTask(item.id)}
            onPress={() => navigation.navigate('AddTask', { taskId: item.id })}
          />
        )}
        ListEmptyComponent={<EmptyState />}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadTasks} />
        }
        contentContainerStyle={styles.listContent}
      />
      
      <FAB onPress={toggleRecording} isRecording={isRecording} />
      
      {isProcessing && <LoadingOverlay message="Processing voice input..." />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
});