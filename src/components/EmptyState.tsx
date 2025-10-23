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
        Add your first task using the "+" button below
      </Text>



      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        or use the microphone
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 32,
 
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
  
});
