// src/components/ThemeToggle.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onToggle}>
      <Ionicons 
        name={isDark ? 'sunny' : 'moon'} 
        size={24} 
        color={isDark ? '#F59E0B' : '#6366F1'} 
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 16,
  },
});
