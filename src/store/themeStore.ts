// src/store/themeStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeStore {
  isDark: boolean;
  toggleTheme: () => void;
  loadTheme: () => Promise<void>;
}

// Key for AsyncStorage
const THEME_KEY = '@todo_theme';

// Create the theme store that would be used globally
export const useThemeStore = create<ThemeStore>((set) => ({
  isDark: false,
  
  toggleTheme: async () => {
    set((state) => {
      const newValue = !state.isDark;
      AsyncStorage.setItem(THEME_KEY, JSON.stringify(newValue));
      return { isDark: newValue };
    });
  },
  
  loadTheme: async () => {
    try {
      const data = await AsyncStorage.getItem(THEME_KEY);
      if (data) {
        set({ isDark: JSON.parse(data) });
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  },
}));
