# Portfolio Manager Mobile

A mobile-first voice and text interface for interacting with your investment portfolio. Built with React Native and Expo, this app allows you to ask questions about your portfolio and get AI-powered responses with text-to-speech capabilities.

## Features

- 📱 **Cross-Platform**: Run on iOS, Android, or web
- 💬 **Text Chat**: Type questions about your portfolio
- 🔊 **Text-to-Speech**: Listen to responses with built-in voice synthesis
- ⚡ **Quick Actions**: Predefined shortcuts for common queries
- 📊 **Source Attribution**: View sources and references for answers
- 🟢 **Connection Status**: Real-time backend connectivity indicator

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:8000` (see Configuration)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Running the App

### Web (Desktop Browser)
The easiest way to test the app on your desktop:

```bash
npm run web
```

The app will open in your browser at `http://localhost:8081`

### Mobile (iOS)
```bash
npm run ios
```

### Mobile (Android)
```bash
npm run android
```

### Development Server
Start the Expo development server with options for all platforms:

```bash
npm start
```

Then scan the QR code with:
- **iOS**: Camera app
- **Android**: Expo Go app

## Configuration

### API Endpoint
The app connects to a backend API. Configure the endpoint in `app.json`:

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "http://localhost:8000",
      "defaultAccountId": 1
    }
  }
}
```

Or modify directly in `src/config.ts`:
- `API_BASE_URL`: Backend API endpoint
- `DEFAULT_ACCOUNT_ID`: Default portfolio account ID
- `REQUEST_TIMEOUT_MS`: Request timeout in milliseconds (default: 60000)

### Backend CORS Setup

When running the web version, your backend must enable CORS to accept requests from `http://localhost:8081`.

**Example for FastAPI (Python):**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Project Structure

```
PortfolioManagerMobile/
├── App.tsx                 # Main application component
├── src/
│   ├── api/
│   │   └── client.ts       # API client and HTTP functions
│   ├── components/
│   │   ├── ActionButtons.tsx    # Quick action buttons
│   │   ├── AnswerCard.tsx       # Answer display card
│   │   └── SourceList.tsx       # Source attribution list
│   ├── models/
│   │   └── voice.ts        # TypeScript type definitions
│   ├── config.ts           # App configuration
│   └── utils/              # Utility functions
├── assets/                 # Images and static assets
├── app.json                # Expo configuration
└── package.json            # Dependencies and scripts
```

## API Response Format

The backend should return responses in this format:

```json
{
  "answerText": "Your detailed answer text here",
  "speakText": "Shorter version optimized for text-to-speech",
  "sources": [
    {
      "title": "Source Title",
      "url": "https://example.com",
      "publisher": "Publisher Name"
    }
  ],
  "actions": [
    {
      "id": "top_movers",
      "label": "Show top movers"
    }
  ],
  "telemetry": {
    "latency_ms": 1234,
    "tools": ["tool1", "tool2"],
    "model": "gpt-4"
  }
}
```

## Usage

1. **Type a question** in the text input field (e.g., "How's my portfolio doing today?")
2. **Click "Ask"** to submit your question
3. **View the answer** displayed in the response card
4. **Click "Speak"** (green button) to hear the answer read aloud
5. **Use Quick Actions** to ask common questions with one tap

## Troubleshooting

### "Offline" Status / Network Errors
- Ensure your backend is running on `http://localhost:8000`
- Check that CORS is properly configured on the backend
- Verify the `apiBaseUrl` in `app.json` or `src/config.ts`

### No Answer Displayed
- Check browser DevTools (F12) → Network tab for API response
- Verify backend is returning `answerText` and `speakText` fields
- Look for JavaScript errors in the Console tab

### Request Timeout
- Increase `REQUEST_TIMEOUT_MS` in `src/config.ts`
- Check backend performance and response times

## Technologies Used

- **React Native** - Mobile UI framework
- **Expo** - Development and build platform
- **TypeScript** - Type-safe JavaScript
- **expo-speech** - Text-to-speech functionality
- **expo-haptics** - Haptic feedback (mobile only)

## License

Private project
