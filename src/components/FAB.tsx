// src/components/FAB.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useThemeStore } from '../store/themeStore';
import { COLORS } from '../constants/theme';
import * as Haptics from 'expo-haptics';

interface Props {
  onPress: () => void;
  isRecording?: boolean;
}

type RootStackParamList = {
  AddTask: { taskId: string } | undefined;
  TaskList: undefined;
};

export default function FAB({ onPress, isRecording = false }: Props) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isDark = useThemeStore((state) => state.isDark);
  const colors = isDark ? COLORS.dark : COLORS.light;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const addScaleAnim = React.useRef(new Animated.Value(1)).current;
  
  const handleVoicePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onPress();
  };
  
  const handleAddPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Animated.sequence([
      Animated.timing(addScaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(addScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    navigation.navigate('AddTask', undefined);
  };
  
  return (
    <View style={styles.container}>
      {/* Add Task Button (Plus Icon) */}
      <Animated.View style={{ transform: [{ scale: addScaleAnim }] }}>
        <TouchableOpacity
          style={[
            styles.addButton,
            { 
              backgroundColor: isDark ? colors.card : '#FFFFFF',
              borderColor: colors.border,
            }
          ]}
          onPress={handleAddPress}
          activeOpacity={0.8}
        >
          <Ionicons 
            name="add" 
            size={24} 
            color={colors.primary}
          />
        </TouchableOpacity>
      </Animated.View>
      
      {/* Voice Recording Button */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={[
            styles.voiceButton,
            { backgroundColor: isRecording ? colors.error : colors.primary }
          ]}
          onPress={handleVoicePress}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={isRecording ? 'stop' : 'mic'} 
            size={28} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 24,
    alignItems: 'center',
    gap: 16,
  },
  addButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    // Subtle shadow for add button
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  voiceButton: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // Prominent shadow for primary action
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
});