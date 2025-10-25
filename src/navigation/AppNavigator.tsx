import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, Platform, Image } from 'react-native';
import TaskListScreen from '../screens/TaskListScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import { RootStackParamList } from '../types';
import { useThemeStore } from '../store/themeStore';

// Create the stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

// Main App Navigator component
export default function AppNavigator() {
  const isDark = useThemeStore((state) => state.isDark);

  const AppLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#FFFFFF',
      card: '#F9FAFB',
      text: '#1F2937',
      border: '#E5E7EB',
      primary: '#6366F1',
      notification: '#EF4444',
    },
  };

  const AppDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#111827',
      card: '#1F2937',
      text: '#F9FAFB',
      border: '#374151',
      primary: '#818CF8',
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
            headerLeft: () => (
              <Image
                source={require('../../assets/todo_voice_app.png')}
                style={{ width: 32, height: 32, marginLeft: 10, borderRadius: 6 }}
                resizeMode="contain"
              />
            ),
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
