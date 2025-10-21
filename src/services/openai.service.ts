// ==========================================
// FILE: src/services/openai.service.ts
// ==========================================
import axios from 'axios';
import * as FileSystem from 'expo-file-system/legacy';

// -------------------------------------------------------------
// ✅ Config
// -------------------------------------------------------------
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL; // e.g. https://your-vercel-app.vercel.app

if (!API_BASE_URL) {
  console.warn('⚠️ Missing EXPO_PUBLIC_API_BASE_URL in your .env file');
}

// -------------------------------------------------------------
// ✅ Transcribe audio with Whisper (via backend)
// -------------------------------------------------------------
export const transcribeAudio = async (audioUri: string): Promise<string> => {
  console.log("📤 Reading audio file...");
  const base64 = await FileSystem.readAsStringAsync(audioUri, { encoding: 'base64' });

  console.log("🎙️ Uploading for transcription...");
  try {
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/transcribe`,
      { audioBase64: base64 },
      { timeout: 30000 }
    );

    console.log("✅ Transcription success:", response.data);
    return response.data.text;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("❌ Transcription failed:", error.response?.data || error.message);
    } else {
      console.error("❌ Transcription failed:", error);
    }
    throw new Error(
      error.response?.data?.error || "Failed to transcribe audio. Please check your backend logs."
    );
  }
};

// -------------------------------------------------------------
// ✅ Split transcript into tasks with GPT (via backend)
// -------------------------------------------------------------
export const splitTasksWithAI = async (transcript: string): Promise<string[]> => {
  try {
    if (!transcript || transcript.trim().length === 0)
      throw new Error('Transcript is empty');
    if (!API_BASE_URL) throw new Error('API base URL not configured');

    console.log('🧠 Sending transcript to AI:', transcript.slice(0, 100));
    const response = await axios.post(`${API_BASE_URL}/api/split-tasks`, { transcript });

    const tasks = response.data?.tasks;
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      console.warn('⚠️ No valid tasks from backend, using fallback');
      return splitTasksFallback(transcript);
    }

    console.log('✅ Extracted tasks:', tasks);
    return tasks;
  } catch (error: any) {
    console.error('❌ Task splitting failed:', error.response?.data || error.message);
    return splitTasksFallback(transcript);
  }
};

// -------------------------------------------------------------
// ✅ Fallback task extraction if GPT fails
// -------------------------------------------------------------
const splitTasksFallback = (text: string): string[] => {
  console.log('🔄 Using fallback task splitting');
  const delimiters = /\s+and\s+|,\s*(?:and\s+)?|;\s+|\.\s+|then\s+|also\s+|plus\s+/i;

  const tasks = text
    .split(delimiters)
    .map((task) => {
      task = task.trim();
      task = task.replace(/^(i need to|i have to|i want to|remind me to|don't forget to)\s+/i, '');
      task = task.charAt(0).toUpperCase() + task.slice(1);
      return task;
    })
    .filter((task) => task.length > 2 && task.length < 200)
    .slice(0, 10);

  if (tasks.length === 0) {
    const cleaned = text.trim();
    if (cleaned.length > 0)
      return [cleaned.charAt(0).toUpperCase() + cleaned.slice(1)];
  }

  return tasks;
};
