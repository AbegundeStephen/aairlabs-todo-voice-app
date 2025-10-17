// src/services/openai.service.ts
import axios from 'axios';
import * as FileSystem from 'expo-file-system';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const WHISPER_API_URL = 'https://api.openai.com/v1/audio/transcriptions';
const GPT_API_URL = 'https://api.openai.com/v1/chat/completions';

export const transcribeAudio = async (audioUri: string): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: audioUri,
      type: 'audio/m4a',
      name: 'recording.m4a',
    } as any);
    formData.append('model', 'whisper-1');
    
    const response = await axios.post(WHISPER_API_URL, formData, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.text;
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
};

export const splitTasksWithAI = async (transcript: string): Promise<string[]> => {
  try {
    const response = await axios.post(
      GPT_API_URL,
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a task parser. Split the user's input into separate, clear tasks. 
            Return ONLY a JSON array of task titles, nothing else. 
            Example: ["Buy groceries", "Call mom", "Finish report"]`,
          },
          {
            role: 'user',
            content: transcript,
          },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    const content = response.data.choices[0].message.content;
    const tasks = JSON.parse(content);
    return Array.isArray(tasks) ? tasks : [transcript];
  } catch (error) {
    console.error('Task splitting error:', error);
    // Fallback: simple split by "and"
    return splitTasksFallback(transcript);
  }
};

// Fallback parser if AI fails
const splitTasksFallback = (text: string): string[] => {
  // Split by common delimiters
  const delimiters = /\s+and\s+|,\s+|;\s+|\.\s+/i;
  return text
    .split(delimiters)
    .map(task => task.trim())
    .filter(task => task.length > 0);
};