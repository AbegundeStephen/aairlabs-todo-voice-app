// src/services/voice.service.ts
import {
  useAudioRecorder,
  useAudioRecorderState,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
} from 'expo-audio';

// Service to handle voice recording functionality
export class VoiceRecorder {
  private recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  private state = useAudioRecorderState(this.recorder);

  async requestPermissions(): Promise<boolean> {
    const status = await AudioModule.requestRecordingPermissionsAsync();
    return status.granted;
  }

  async startRecording(): Promise<void> {
    const hasPerm = await this.requestPermissions();
    if (!hasPerm) {
      throw new Error('Recording permission not granted');
    }

    await setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
    });

    await this.recorder.prepareToRecordAsync();
    this.recorder.record();
  }

  async stopRecording(): Promise<string> {
    await this.recorder.stop();
    const uri = this.recorder.uri;
    console.log('Recording stopped, file saved at:', uri);

    if (!uri) {
      throw new Error('No recording URI available');
    }

    return uri;
  }

  isRecording(): boolean {
    return this.state.isRecording;
  }
}
