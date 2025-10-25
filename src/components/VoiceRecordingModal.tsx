//src/components/VoiceRecordingModal.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VoiceRecordingModalProps {
  visible: boolean;
  onClose: () => void;
  isDark?: boolean;
}

export default function VoiceRecordingModal({ 
  visible, 
  onClose, 
  isDark = false 
}: VoiceRecordingModalProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
    return () => pulseAnim.setValue(1);
  }, [visible]);
  
  const colors = {
    background: isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    text: isDark ? '#F9FAFB' : '#1F2937',
    error: isDark ? '#F87171' : '#EF4444',
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Animated.View 
          style={[
            styles.micContainer,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <Ionicons name="mic" size={64} color={colors.error} />
        </Animated.View>
        
        <Text style={[styles.title, { color: colors.text }]}>
          Listening...
        </Text>
        
        <Text style={[styles.subtitle, { color: colors.text, opacity: 0.7 }]}>
          Speak your tasks naturally
        </Text>
        
        <TouchableOpacity 
          style={[styles.stopButton, { backgroundColor: colors.error }]}
          onPress={onClose}
        >
          <Ionicons name="stop" size={24} color="#FFFFFF" />
          <Text style={styles.stopText}>Stop Recording</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  micContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  stopText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
