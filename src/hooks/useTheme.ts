// src/hooks/useTheme.ts
import { useThemeStore } from '../store/themeStore';
import { COLORS } from '../constants/theme';

// Custom hook to get theme colors and mode
export const useTheme = () => {
  const isDark = useThemeStore((state) => state.isDark);
  const colors = isDark ? COLORS.dark : COLORS.light;
  
  return { colors, isDark };
};