# 📝 TodoApp — Expo + React Native To-Do List

A modern, feature-rich cross-platform to-do list built with **Expo**, **TypeScript**, and **React Native**.  
Supports **voice input (Whisper + GPT)**, **local persistence**, **themes**, **search/filters**, and **smooth animations**.

---

## ✨ Features

- ✅ Create / Read / Update / Delete tasks  
- 🎤 Voice input — automatically splits multi-task phrases  
- 💾 Local persistence with AsyncStorage  
- 🌓 Light / Dark theme support  
- 🔍 Search and filter tasks  
- 📅 Optional due dates  
- ⚡ Smooth animations  
- 📱 Cross-platform (iOS & Android)

---

## 🎤 Voice Feature Demo

Say into the mic:  
**"Buy provisions and call mom"**  
➡️ The app automatically creates **two tasks**:  
**Buy provisions** and **Call mom**

---

## 🚀 Quick Start

```bash
# 1. Create the project
npx create-expo-app TodoApp --template blank-typescript
cd TodoApp

# 2. Install dependencies
npm install

# 3. Copy example environment file and add your OpenAI key
cp .env.example .env
# then edit .env and add:
# EXPO_PUBLIC_OPENAI_API_KEY=your_actual_key_here

# 4. Start the app
npx expo start

🏗 Architecture Overview

Framework: Expo SDK 52
Language: TypeScript
Navigation: React Navigation
State Management: Zustand
Storage: AsyncStorage
Voice Input: Expo Audio + OpenAI Whisper
AI Task Parsing: GPT-4
Testing: Jest + React Native Testing Library

📁 Project Structure
TodoApp/
├─ src/
│  ├─ components/        # UI components (TaskItem, FAB, etc.)
│  ├─ screens/           # Screens (TaskList, AddTask)
│  ├─ navigation/        # Navigation setup
│  ├─ services/          # openai, voice, storage services
│  ├─ store/             # Zustand stores (taskStore, themeStore)
│  ├─ hooks/             # Custom hooks
│  ├─ utils/             # Helpers (taskParser, date utils)
│  ├─ types/             # TypeScript interfaces
│  └─ constants/         # Configs and theme
├─ __tests__/            # Unit & integration tests
├─ App.tsx
├─ app.json
├─ .env
├─ .env.example
└─ README.md


⚙️ Dependency Installation
# Navigation
npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
# Storage
npx expo install @react-native-async-storage/async-storage
# Audio & Voice
npx expo install expo-av expo-file-system
# UI & Feedback
npx expo install expo-haptics @expo/vector-icons
# State & API
npm install zustand axios
# Animations
npm install react-native-reanimated
# Testing
npm install --save-dev @testing-library/react-native @testing-library/jest-native jest-expo @testing-library/react-hooks


⚙️ Environment Variables
Create a .env file:
EXPO_PUBLIC_OPENAI_API_KEY=your_actual_api_key_here


🧪 Testing
npm test


Recommended test files:
__tests__/utils/taskParser.test.ts
__tests__/components/TaskItem.test.tsx
__tests__/services/storage.service.test.ts
__tests__/store/taskStore.test.ts

🧪 QA Checklist
Add task manually
Edit and delete task
Persist tasks across restarts
Test voice input — e.g., “Buy groceries and call John”
Toggle light/dark theme
Search & filter tasks
All Jest tests pass