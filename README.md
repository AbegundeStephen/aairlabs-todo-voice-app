# TodoApp with Voice Input

A cross-platform to-do list app built with Expo and React Native. Features voice input that can understand multiple tasks in one sentence.

---

## Features

- Add, edit, and delete tasks
- Voice input with automatic task splitting (e.g., "Buy groceries and call mom" creates two tasks)
- Tasks persist locally between app sessions
- Light and dark theme
- Search and filter tasks
- Optional due dates
- Smooth animations

---

## Voice Input Example

Say: **"Buy provisions and call mom"**  
Result: Creates two separate tasks automatically

---

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI
- ASSEMBLY API key

### Installation
```bash
# Clone the repository
git clone https://github.com/AbegundeStephen/aairlabs-todo-voice-app.git
cd aairlabs-todo-voice-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your OpenAI API key to .env

# Start the app
npm start
```

### Running on Device

- **iOS**: Press `i` in the terminal or scan QR code with Camera app
- **Android**: Press `a` in the terminal or scan QR code with Expo Go app
- **Web**: Press `w` to open in browser

---

## Tech Stack

- **Framework**: Expo SDK 54
- **Language**: TypeScript
- **UI**: React 19.1.0 + React Native 0.81.5
- **Navigation**: React Navigation v7
- **State**: Zustand
- **Storage**: AsyncStorage
- **Voice**: Expo Audio + Expo AV
- **AI**: OpenAI Whisper + GPT (via Axios)
- **Animations**: React Native Reanimated
- **Testing**: Jest + React Native Testing Library

---

## Project Structure
```
src/
├── components/       # Reusable UI components
├── screens/          # Main screens (TaskList, AddTask)
├── navigation/       # Navigation config
├── services/         # API services (OpenAI, storage)
├── store/            # State management (Zustand)
├── hooks/            # Custom React hooks
├── utils/            # Helper functions
├── types/            # TypeScript types
└── constants/        # App configuration
```

---

## Available Scripts
```bash
npm start          # Start Expo dev server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run in web browser
npm test           # Run tests
```

---

## Testing
```bash
npm test or npx jest __tests__/utils/taskParser.test.ts  
```

Key test files:
- `__tests__/utils/taskParser.test.ts` - Task parsing logic
- `__tests__/components/TaskItem.test.tsx` - Component tests
- `__tests__/services/storage.service.test.ts` - Storage tests

---

## Environment Variables

Create a `.env` file with:
```
OPENAI_API_KEY=your_openai_api_key_here
```

---

## How It Works

1. **Voice Input**: Tap the microphone button to record
2. **Transcription**: Audio is sent to OpenAI Whisper API
3. **Task Parsing**: GPT analyzes the text and splits it into individual tasks
4. **Storage**: Tasks are saved locally with AsyncStorage
5. **Persistence**: Tasks remain after closing the app

---

## Requirements Met

- ✅ Add, complete, and delete tasks
- ✅ Visual distinction for completed tasks
- ✅ Data persistence with AsyncStorage
- ✅ Navigation between screens (React Navigation)
- ✅ Voice input with FAB
- ✅ Multi-task parsing from natural language
- ✅ Due dates and sorting
- ✅ Search/filter functionality
- ✅ Light/Dark theme toggle
- ✅ Unit tests (Jest)
- ✅ Animations (Reanimated)
- ✅ TypeScript

---

## Troubleshooting

**Voice input not working:**
- Check that your OpenAI API key is valid
- Ensure microphone permissions are granted
- Check network connection

**Tasks not persisting:**
- Clear app data and restart
- Check AsyncStorage implementation in logs

**Build errors:**
- Delete `node_modules` and run `npm install` again
- Clear Expo cache: `npx expo start -c`

---

## License

This project was created by Abegunde Oluwatimilehin Stephen as part of the AAIR Labs developer exercise (August 2025).