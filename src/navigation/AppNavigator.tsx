// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TaskListScreen from '../screens/TaskListScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import { RootStackParamList } from '../types';
import { useThemeStore } from '../store/themeStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const isDark = useThemeStore((state) => state.isDark);
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
          },
          headerTintColor: isDark ? '#F9FAFB' : '#1F2937',
        }}
      >
        <Stack.Screen 
          name="TaskList" 
          component={TaskListScreen}
          options={{ title: 'My Tasks' }}
        />
        <Stack.Screen 
          name="AddTask" 
          component={AddTaskScreen}
          options={{ title: 'Add Task' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}