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

  // Create one recorder instance per hook instance
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
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setIsProcessing(true);

      const audioUri = await recorder.stopRecording();
      if (!audioUri) throw new Error('No audio recorded');

      // Transcribe the audio file
      const transcript = await transcribeAudio(audioUri);

      // Generate task titles from the transcript
      const taskTitles = await splitTasksWithAI(transcript);

      // Add tasks to store
      taskTitles.forEach((title) => addTask({ title, completed: false }));

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', `Added ${taskTitles.length} task(s)`);
    } catch (error) {
      console.error('Failed to process voice input:', error);
      Alert.alert('Error', 'Failed to process voice input');
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
