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

 const AppLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF',  // matches COLORS.light.background
    card: '#F9FAFB',        // matches COLORS.light.card
    text: '#1F2937',        // matches COLORS.light.text
    border: '#E5E7EB',      // matches COLORS.light.border
    primary: '#6366F1',     // matches COLORS.light.primary
    notification: '#EF4444', // matches COLORS.light.error
  },
};

const AppDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#111827',  // matches COLORS.dark.background
    card: '#1F2937',        // matches COLORS.dark.card
    text: '#F9FAFB',        // matches COLORS.dark.text
    border: '#374151',      // matches COLORS.dark.border
    primary: '#818CF8',     // matches COLORS.dark.primary
    notification: '#F87171', // matches COLORS.dark.error
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