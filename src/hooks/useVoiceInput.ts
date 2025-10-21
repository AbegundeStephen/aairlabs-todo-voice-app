// src/hooks/useVoiceInput.ts - Simplified Version (Use this one first)
import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import {
  useAudioRecorder,
  useAudioRecorderState,
  RecordingPresets,
  setAudioModeAsync,
  AudioModule,
} from 'expo-audio';
import * as FileSystem from 'expo-file-system/legacy';
import * as Haptics from 'expo-haptics';
import { transcribeAudio, splitTasksWithAI } from '../services/openai.service';
import { useTaskStore } from '../store/taskStore';

export const useVoiceInput = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addTask = useTaskStore((state) => state.addTask);

  // Initialize recorder
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);

  const toggleRecording = useCallback(async () => {
    // Prevent action while processing
    if (isProcessing) {
      console.log('Already processing, ignoring toggle');
      return;
    }

    // If currently recording, stop it
    if (recorderState.isRecording) {
      console.log('Stopping recording...');
      let audioUri: string | null = null;
      
      try {
        setIsProcessing(true);
        setError(null);

        // Stop the recorder
        await recorder.stop();
        
        // Get the URI
        audioUri = recorder.uri;
        console.log('Stopped. URI:', audioUri);

        if (!audioUri) {
          throw new Error('No recording URI');
        }

        // Verify file (request size explicitly and guard its presence)
                const fileInfo = await FileSystem.getInfoAsync(audioUri);
                const fileSize = fileInfo && typeof (fileInfo as any).size === 'number' ? (fileInfo as any).size : 0;
                console.log('File size:', fileSize);

        if (!fileInfo.exists || fileSize === 0) {
          throw new Error('Invalid recording file');
        }

        // Process the recording
        console.log('Transcribing...');
        const transcript = await transcribeAudio(audioUri);
        console.log('Transcript:', transcript);

        if (!transcript || transcript.trim().length === 0) {
          throw new Error('No speech detected');
        }

        console.log('Splitting tasks...');
        const taskTitles = await splitTasksWithAI(transcript);
        console.log('Tasks:', taskTitles);

        if (taskTitles.length === 0) {
          throw new Error('No tasks extracted');
        }

        // Add tasks
        taskTitles.forEach((title) => {
          addTask({ title, completed: false });
        });

        // Success
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Success', `Added ${taskTitles.length} task(s)`);

      } catch (err) {
        console.error('Error processing:', err);
        const msg = err instanceof Error ? err.message : 'Failed to process recording';
        setError(msg);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Error', msg);
      } finally {
        setIsProcessing(false);
        
        // Cleanup
        if (audioUri) {
          try {
            await FileSystem.deleteAsync(audioUri, { idempotent: true });
          } catch (e) {
            console.error('Cleanup failed:', e);
          }
        }
      }
      
    } else {
      // Start recording
      console.log('Starting recording...');
      
      try {
        setError(null);
        
        // Request permission
        const { granted } = await AudioModule.requestRecordingPermissionsAsync();
        
        if (!granted) {
          Alert.alert('Permission Denied', 'Please enable microphone access');
          return;
        }

        // Configure audio
        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });

        // Prepare and start
        await recorder.prepareToRecordAsync();
        recorder.record();
        
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        console.log('Recording started');

      } catch (err) {
        console.error('Error starting:', err);
        setError('Failed to start recording');
        Alert.alert('Error', 'Failed to start recording');
      }
    }
  }, [recorder, recorderState.isRecording, isProcessing, addTask]);

  return {
    isRecording: recorderState.isRecording,
    isProcessing,
    error,
    recordingDuration: recorderState.durationMillis,
    toggleRecording,
  };
};