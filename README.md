# AI Assistant Development

AI Assistant Development is a beginner-friendly React + JavaScript web application built with Vite and the Gemini API. It is suitable for a Prompt Engineering internship major project because it demonstrates prompt templates, AI response generation, user feedback storage, and a clean responsive interface.

## Features

- Question Answering
- Text Summarization
- Creative Content Generation
- Advice Generator
- Three editable prompt templates for every function
- Gemini API integration with `@google/generative-ai`
- Feedback system with `localStorage`
- Responsive card-based UI

## Project Structure

```text
src/
  App.jsx
  App.css
  gemini.js
  index.css
  main.jsx
  components/
```

## Installation Steps

1. Create a Vite React project if you are starting from scratch:

```bash
npm create vite@latest ai-assistant -- --template react
cd ai-assistant
```

2. Install dependencies:

```bash
npm install
npm install @google/generative-ai
```

3. Add the code files from this project into the matching paths.

## Add the Gemini API Key

1. Create a `.env` file in the project root.
2. Copy the value from `.env.example`.
3. Replace the placeholder with your Gemini API key.

```env
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

Restart the development server after changing `.env`.

## Run the Project

Start the local development server:

```bash
npm run dev
```

Build the production version:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## How It Works

The user selects one of four assistant functions, chooses a prompt template, enters text, and submits the form. `src/gemini.js` builds the final prompt and sends it to Gemini using the API key from `VITE_GEMINI_API_KEY`. After a response is shown, the user can mark it helpful or not helpful, and that feedback is saved in browser `localStorage`.

## Important Files

- `src/App.jsx`: Main React app, state management, form handling, response display, and feedback logic.
- `src/App.css`: Responsive application styling.
- `src/gemini.js`: Gemini API setup and prompt templates.
- `.env.example`: Example environment variable file.

## Notes for Submission

- Do not commit your real `.env` file or API key.
- Keep prompt templates in `gemini.js` so they are easy to modify.
- Use the feedback data in `localStorage` to explain how the app can be improved in future versions.
