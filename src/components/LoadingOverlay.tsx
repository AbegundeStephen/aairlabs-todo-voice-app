//src/components/LoadingOverlay.tsx

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Modal } from 'react-native';

interface LoadingOverlayProps {
  message?: string;
  isDark?: boolean;
}

export default function LoadingOverlay({ 
  message = 'Loading...', 
  isDark = false 
}: LoadingOverlayProps) {
  const colors = {
    background: isDark ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    text: isDark ? '#F9FAFB' : '#1F2937',
    primary: isDark ? '#818CF8' : '#6366F1',
  };

  return (
    <Modal transparent visible animationType="fade">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.message, { color: colors.text }]}>
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
});