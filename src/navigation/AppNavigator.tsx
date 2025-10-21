// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, Platform } from 'react-native';
import TaskListScreen from '../screens/TaskListScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import { RootStackParamList } from '../types';
import { useThemeStore } from '../store/themeStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const isDark = useThemeStore((state) => state.isDark);

  // Modern light theme with softer colors and better contrast
  const AppLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#FAFBFC',
      card: '#FFFFFF',
      text: '#0F172A',
      border: '#E2E8F0',
      primary: '#3B82F6',
      notification: '#EF4444',
    },
  };

  // Modern dark theme with deeper blacks and vibrant accents
  const AppDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#0A0E1A',
      card: '#141B2D',
      text: '#F8FAFC',
      border: '#1E293B',
      primary: '#60A5FA',
      notification: '#F87171',
    },
  };

  return (
    <NavigationContainer theme={isDark ? AppDarkTheme : AppLightTheme}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#0A0E1A' : '#FFFFFF'}
        translucent={false}
      />
      <Stack.Navigator
        screenOptions={{
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 28,
            fontWeight: '700',
          },
          headerStyle: {
            backgroundColor: isDark ? '#141B2D' : '#FFFFFF',
          },
          headerTintColor: isDark ? '#F8FAFC' : '#0F172A',
          animation: 'slide_from_right',
          gestureEnabled: true,
          contentStyle: {
            backgroundColor: isDark ? '#0A0E1A' : '#FAFBFC',
          },
        }}
      >
        <Stack.Screen
          name="TaskList"
          component={TaskListScreen}
          options={{
            title: 'My Tasks',
            headerLargeTitle: Platform.OS === 'ios',
          }}
        />
        <Stack.Screen
          name="AddTask"
          component={AddTaskScreen}
          options={{
            title: 'New Task',
            presentation: 'modal',
            animation: 'slide_from_bottom',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 20,
              fontWeight: '600',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}