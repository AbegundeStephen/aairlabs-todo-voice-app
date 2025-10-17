// ==========================================
// FILE: src/components/EmptyState.tsx
// ==========================================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface EmptyStateProps {
  isDark?: boolean;
}

export default function EmptyState({ isDark = false }: EmptyStateProps) {
  const colors = {
    text: isDark ? '#F9FAFB' : '#1F2937',
    textSecondary: isDark ? '#9CA3AF' : '#6B7280',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📝</Text>
      <Text style={[styles.title, { color: colors.text }]}>
        No Tasks Yet
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Add your first task using the + button or the microphone
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});