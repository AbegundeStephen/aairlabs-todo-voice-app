// ==========================================
// FILE: src/components/EmptyState.tsx
// ==========================================
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  isDark?: boolean;
}

export default function EmptyState({ isDark = false }: EmptyStateProps) {
  const navigation = useNavigation<any>();

  const colors = {
    text: isDark ? '#F9FAFB' : '#1F2937',
    textSecondary: isDark ? '#9CA3AF' : '#6B7280',
    icon: isDark ? '#F9FAFB' : '#1F2937',
  };

  const handleAddTask = () => {
    navigation.navigate('AddTask'); // 👈 adjust this route name to match your navigator
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📝</Text>

      <Text style={[styles.title, { color: colors.text }]}>No Tasks Yet</Text>

      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Add your first task using the
      </Text>

      <TouchableOpacity
        style={[styles.iconButton, { borderColor: colors.icon }]}
        onPress={handleAddTask}
        accessibilityLabel="Add Task"
      >
        <Ionicons name="add" size={24} color={colors.icon} />
      </TouchableOpacity>

      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        or use the microphone
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
    marginTop: 4,
  },
  iconButton: {
    marginTop: 12,
    marginBottom: 4,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
