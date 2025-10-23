
//App.tsx
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { useThemeStore } from './src/store/themeStore';

export default function App() {
  const loadTheme = useThemeStore((state) => state.loadTheme);
  const isDark = useThemeStore((state) => state.isDark);
  
  useEffect(() => {
    loadTheme();
  }, []);
  
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
}