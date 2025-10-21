// src/screens/TaskListScreen.tsx
import React, { useEffect, useMemo, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTaskStore } from '../store/taskStore';
import { useVoiceInput } from '../hooks/useVoiceInput';
import TaskItem from '../components/TaskItem';
import SearchBar from '../components/SearchBar';
import FilterChips from '../components/FilterChips';
import FAB from '../components/FAB';
import EmptyState from '../components/EmptyState';
import LoadingOverlay from '../components/LoadingOverlay';
import { useThemeStore } from '../store/themeStore';
import { COLORS } from '../constants/theme';

type RootStackParamList = {
  AddTask: { taskId: string } | undefined;
  TaskList: undefined;
};

export default function TaskListScreen() {
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
    setSearchQuery,
    filterStatus,
    setFilterStatus,
  } = useTaskStore();
  
  const { 
    isRecording, 
    isProcessing, 
    toggleRecording, 
    recordingDuration 
  } = useVoiceInput();
  
  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);
  
  // Filter tasks based on search and filter status
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];
    
    // Apply search filter
    if (searchQuery && searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    switch (filterStatus) {
      case 'active':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      case 'all':
      default:
        // Show all tasks
        break;
    }
    
    // Sort: incomplete tasks first, then by due date, then by creation date
    filtered.sort((a, b) => {
      // First, sort by completion status
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // For incomplete tasks, sort by due date (soonest first)
      if (!a.completed && !b.completed) {
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (a.dueDate) return -1; // Tasks with due dates come first
        if (b.dueDate) return 1;
      }
      
      // Finally, sort by creation date (newest first)
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
    
    return filtered;
  }, [tasks, searchQuery, filterStatus]);
  
  // Calculate task counts for filter chips
  const taskCounts = useMemo(() => ({
    all: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  }), [tasks]);
  
  // Handle task toggle with optimistic update
  const handleToggleTask = useCallback((taskId: string) => {
    toggleTask(taskId);
  }, [toggleTask]);
  
  // Handle task deletion
  const handleDeleteTask = useCallback((taskId: string) => {
    deleteTask(taskId);
  }, [deleteTask]);
  
  // Navigate to task detail
  const handleTaskPress = useCallback((taskId: string) => {
    navigation.navigate('AddTask', { taskId });
  }, [navigation]);
  
  // Render task item
  const renderTask = useCallback(({ item }: { item: typeof tasks[0] }) => (
    <TaskItem
      task={item}
      onToggle={() => handleToggleTask(item.id)}
      onDelete={() => handleDeleteTask(item.id)}
      onPress={() => handleTaskPress(item.id)}
    />
  ), [handleToggleTask, handleDeleteTask, handleTaskPress]);
  
  // Key extractor for FlatList
  const keyExtractor = useCallback((item: typeof tasks[0]) => item.id, []);
  
  // Get loading overlay message
  const loadingMessage = useMemo(() => {
    if (isRecording) {
      return 'Recording...';
    }
    if (isProcessing) {
      return 'Processing voice input...';
    }
    return 'Loading...';
  }, [isRecording, isProcessing]);
  
  return (
    <View style={styles.container}>
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SearchBar 
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      <FilterChips 
        selectedFilter={filterStatus}
        onFilterChange={setFilterStatus}
        taskCounts={taskCounts}
      />
      
      <FlatList
        data={filteredTasks}
        keyExtractor={keyExtractor}
        renderItem={renderTask}
        ListEmptyComponent={
          <EmptyState
            {...({
              message:
                searchQuery
                  ? 'No tasks match your search'
                  : filterStatus === 'completed'
                  ? 'No completed tasks yet'
                  : filterStatus === 'active'
                  ? 'No active tasks. Tap the mic to add one!'
                  : 'No tasks yet. Tap the mic to add your first task!'
            } as any)}
          />
        }
        refreshControl={
          <RefreshControl 
            refreshing={isLoading} 
            onRefresh={loadTasks}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          filteredTasks.length === 0 && styles.emptyListContent
        ]}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={15}
        windowSize={21}
      />
      
      <FAB 
        onPress={toggleRecording} 
        isRecording={isRecording}
      />
      
      {isProcessing && (
        <LoadingOverlay 
          message={loadingMessage}
        />
      )}
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 100, // Extra space for FAB
    paddingHorizontal: 20,
  },
  emptyListContent: {

    justifyContent: 'center',
    alignItems: 'center',
  },
});