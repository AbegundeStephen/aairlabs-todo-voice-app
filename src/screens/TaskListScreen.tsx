//src/screens/TaskListScreen.tsx
import React, { useEffect, useMemo, useCallback, useLayoutEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTaskStore } from '../store/taskStore';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { useThemeStore } from '../store/themeStore';
import TaskItem from '../components/TaskItem';
import SearchBar from '../components/SearchBar';
import FilterChips from '../components/FilterChips';
import FAB from '../components/FAB';
import EmptyState from '../components/EmptyState';
import LoadingOverlay from '../components/LoadingOverlay';
import ThemeToggle from '../components/ThemeToggle';
import { COLORS } from '../constants/theme';

type RootStackParamList = {
  AddTask: { taskId: string } | undefined;
  TaskList: undefined;
};

export default function TaskListScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isDark = useThemeStore((state) => state.isDark);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
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

  const { isRecording, isProcessing, toggleRecording } = useVoiceInput();

  // Add theme toggle to header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      ),
    });
  }, [navigation, isDark, toggleTheme]);

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    const filtered = useTaskStore.getState().getFilteredTasks();

    // Sorting logic
    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (a.dueDate && b.dueDate)
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [tasks, searchQuery, filterStatus]);


  const taskCounts = useMemo(
    () => useTaskStore.getState().getTaskCounts(),
    [tasks]
  );

  const handleToggleTask = useCallback(
    (taskId: string) => toggleTask(taskId),
    [toggleTask]
  );

  const handleDeleteTask = useCallback(
    (taskId: string) => deleteTask(taskId),
    [deleteTask]
  );

  const handleTaskPress = useCallback(
    (taskId: string) => navigation.navigate('AddTask', { taskId }),
    [navigation]
  );

  const renderTask = useCallback(
    ({ item }: { item: typeof tasks[0] }) => (
      <TaskItem
        task={item}
        onToggle={() => handleToggleTask(item.id)}
        onDelete={() => handleDeleteTask(item.id)}
        onPress={() => handleTaskPress(item.id)}
      />
    ),
    [handleToggleTask, handleDeleteTask, handleTaskPress]
  );

  const keyExtractor = useCallback((item: typeof tasks[0]) => item.id, []);

  const loadingMessage = useMemo(() => {
    if (isRecording) return 'Recording...';
    if (isProcessing) return 'Processing voice input...';
    return 'Loading...';
  }, [isRecording, isProcessing]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Section */}
      <View style={[styles.headerSection, { backgroundColor: colors.background }]}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <FilterChips
          selectedFilter={filterStatus}
          onFilterChange={setFilterStatus}
          taskCounts={taskCounts}
        />
      </View>

      {/* Task List */}
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

      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <FAB onPress={toggleRecording} isRecording={isRecording} />
      </View>

      {/* Loading Overlay */}
      {isProcessing && <LoadingOverlay message={loadingMessage} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    paddingHorizontal: 0,
    paddingTop: 12,
    paddingBottom: 4,
    gap: 8,
  },
  listContent: {
    paddingBottom: 120,
    paddingHorizontal: 16,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
});