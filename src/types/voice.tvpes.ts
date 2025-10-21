// src/types/voice.types.ts

/**
 * Voice recording state
 */
export interface VoiceRecordingState {
  isRecording: boolean;
  isProcessing: boolean;
  recordingDuration: number;
  error: string | null;
}

/**
 * Voice input result
 */
export interface VoiceInputResult {
  transcript: string;
  tasks: string[];
  processingTime: number;
}

/**
 * OpenAI Transcription response
 */
export interface TranscriptionResponse {
  text: string;
}

/**
 * OpenAI GPT response
 */
export interface GPTResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Task extraction result from AI
 */
export interface TaskExtractionResult {
  tasks: string[];
}

/**
 * Error types for voice processing
 */
export enum VoiceErrorType {
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  RECORDING_FAILED = 'RECORDING_FAILED',
  TRANSCRIPTION_FAILED = 'TRANSCRIPTION_FAILED',
  TASK_EXTRACTION_FAILED = 'TASK_EXTRACTION_FAILED',
  API_ERROR = 'API_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Voice processing error
 */
export class VoiceProcessingError extends Error {
  constructor(
    message: string,
    public type: VoiceErrorType,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'VoiceProcessingError';
  }
}