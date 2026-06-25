import { GoogleGenerativeAI } from '@google/generative-ai'

export const promptTemplates = {
  questionAnswering: [
    {
      title: 'Clear Explanation',
      buildPrompt: (input) => `
You are a patient AI tutor. Answer the question clearly and accurately.
Use simple language, include key points, and add one short example when useful.

Question:
${input}
`,
    },
    {
      title: 'Step-by-Step Answer',
      buildPrompt: (input) => `
You are an expert teacher. Answer the question step by step.
Start with a direct answer, then explain the reasoning in a beginner-friendly way.

Question:
${input}
`,
    },
    {
      title: 'Interview Style Answer',
      buildPrompt: (input) => `
You are helping a student prepare for an internship interview.
Answer the question in a polished way with definition, importance, and practical use.

Question:
${input}
`,
    },
  ],
  summarization: [
    {
      title: 'Short Summary',
      buildPrompt: (input) => `
Summarize the following text in 4 to 6 concise sentences.
Keep the most important ideas and remove repetition.

Text:
${input}
`,
    },
    {
      title: 'Bullet Notes',
      buildPrompt: (input) => `
Convert the following text into clear study notes.
Use bullet points, simple language, and highlight the main ideas.

Text:
${input}
`,
    },
    {
      title: 'Executive Summary',
      buildPrompt: (input) => `
Create an executive summary of the following text.
Include the purpose, key insights, important details, and final takeaway.

Text:
${input}
`,
    },
  ],
  creativeGeneration: [
    {
      title: 'Social Post',
      buildPrompt: (input) => `
Create engaging social media content based on the idea below.
Make it clear, original, and suitable for a student or early-career professional.

Idea:
${input}
`,
    },
    {
      title: 'Story Builder',
      buildPrompt: (input) => `
Write a creative short piece based on the prompt below.
Use vivid language, a strong opening, and a satisfying ending.

Creative Prompt:
${input}
`,
    },
    {
      title: 'Project Content',
      buildPrompt: (input) => `
Generate polished project content for the topic below.
Include a title, objective, features, and a short conclusion.

Topic:
${input}
`,
    },
  ],
  adviceGenerator: [
    {
      title: 'Practical Action Plan',
      buildPrompt: (input) => `
Give practical advice for the situation below.
Include clear steps, common mistakes to avoid, and a realistic next action.

Situation:
${input}
`,
    },
    {
      title: 'Career Mentor',
      buildPrompt: (input) => `
Act as a supportive career mentor.
Give thoughtful advice, explain why it matters, and suggest how to start today.

Situation:
${input}
`,
    },
    {
      title: 'Decision Helper',
      buildPrompt: (input) => `
Help the user make a decision about the situation below.
Compare options, mention tradeoffs, and end with a recommended path.

Situation:
${input}
`,
    },
  ],
}

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

export async function generateGeminiResponse({ functionId, templateIndex, userInput }) {
  if (!apiKey) {
    throw new Error('Missing Gemini API key. Add VITE_GEMINI_API_KEY to your .env file.')
  }

  const templates = promptTemplates[functionId]

  if (!templates || !templates[templateIndex]) {
    throw new Error('Invalid prompt template selected.')
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
  const prompt = templates[templateIndex].buildPrompt(userInput.trim())
  const result = await model.generateContent(prompt)
  const text = result.response.text()

  return text || 'Gemini returned an empty response. Please try again with more detail.'
}
