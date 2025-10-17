// src/hooks/useVoiceInput.ts
import { useState } from 'react';
import { Alert } from 'react-native';
import { VoiceRecorder } from '../services/voice.service';
import { transcribeAudio, splitTasksWithAI } from '../services/openai.service';
import { useTaskStore } from '../store/taskStore';
import * as Haptics from 'expo-haptics';

export const useVoiceInput = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const addTask = useTaskStore((state) => state.addTask);
  const recorder = new VoiceRecorder();
  
  const startRecording = async () => {
    try {
      const hasPermission = await recorder.requestPermissions();
      if (!hasPermission) {
        Alert.alert('Permission Required', 'Please enable microphone access');
        return;
      }
      
      await recorder.startRecording();
      setIsRecording(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      Alert.alert('Error', 'Failed to start recording');
      console.error(error);
    }
  };
  
  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setIsProcessing(true);
      
      const audioUri = await recorder.stopRecording();
      
      // Transcribe audio
      const transcript = await transcribeAudio(audioUri);
      
      // Split into tasks using AI
      const taskTitles = await splitTasksWithAI(transcript);
      
      // Add all tasks
      taskTitles.forEach(title => {
        addTask({ title, completed: false });
      });
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', `Added ${taskTitles.length} task(s)`);
    } catch (error) {
      Alert.alert('Error', 'Failed to process voice input');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const toggleRecording = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };
  
  return {
    isRecording,
    isProcessing,
    toggleRecording,
  };
};