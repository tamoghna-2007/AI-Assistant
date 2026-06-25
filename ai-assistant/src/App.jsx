import { useState } from 'react'
import './App.css'
import { generateGeminiResponse, promptTemplates } from './gemini'

const assistantFunctions = [
  {
    id: 'questionAnswering',
    title: 'Question Answering',
    description: 'Get direct, beginner-friendly answers with helpful context.',
    placeholder: 'Example: What is prompt engineering and why is it useful?',
  },
  {
    id: 'summarization',
    title: 'Text Summarization',
    description: 'Turn long text into clear notes, bullets, or study summaries.',
    placeholder: 'Paste an article, notes, or paragraph to summarize...',
  },
  {
    id: 'creativeGeneration',
    title: 'Creative Content Generation',
    description: 'Create captions, stories, emails, posts, and project ideas.',
    placeholder: 'Example: Write a LinkedIn post about learning React and AI.',
  },
  {
    id: 'adviceGenerator',
    title: 'Advice Generator',
    description: 'Receive practical advice with steps, cautions, and next actions.',
    placeholder: 'Example: How should I prepare for a prompt engineering internship?',
  },
]

const getStoredFeedback = () => {
  try {
    return JSON.parse(localStorage.getItem('aiAssistantFeedback')) || []
  } catch {
    return []
  }
}

function App() {
  const [selectedFunction, setSelectedFunction] = useState(assistantFunctions[0].id)
  const [selectedTemplate, setSelectedTemplate] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const activeFunction = assistantFunctions.find((item) => item.id === selectedFunction)
  const activeTemplates = promptTemplates[selectedFunction]

  const handleFunctionChange = (functionId) => {
    setSelectedFunction(functionId)
    setSelectedTemplate(0)
    setResponse('')
    setError('')
    setFeedbackMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!userInput.trim()) {
      setError('Please enter some text before generating a response.')
      return
    }

    setIsLoading(true)
    setError('')
    setResponse('')
    setFeedbackMessage('')

    try {
      const aiResponse = await generateGeminiResponse({
        functionId: selectedFunction,
        templateIndex: selectedTemplate,
        userInput,
      })
      setResponse(aiResponse)
    } catch (apiError) {
      setError(apiError.message || 'Something went wrong while generating the response.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFeedback = (value) => {
    const feedbackEntry = {
      id: crypto.randomUUID(),
      functionId: selectedFunction,
      templateTitle: activeTemplates[selectedTemplate].title,
      helpful: value === 'yes',
      createdAt: new Date().toISOString(),
    }

    const feedbackList = getStoredFeedback()
    localStorage.setItem('aiAssistantFeedback', JSON.stringify([feedbackEntry, ...feedbackList]))
    setFeedbackMessage('Thank you for your feedback!')
  }

  return (
    <main className="app-shell">
      <section className="hero-section" aria-labelledby="app-title">
        <div>
          <p className="eyebrow">Prompt Engineering Internship Major Project</p>
          <h1 id="app-title">AI Assistant Development</h1>
          <p className="hero-copy">
            A React and Gemini powered assistant for answering questions, summarizing text,
            generating creative content, and giving practical advice.
          </p>
        </div>
        <div className="status-panel" aria-label="Project highlights">
          <span>React Hooks</span>
          <span>Gemini API</span>
          <span>localStorage Feedback</span>
        </div>
      </section>

      <section className="workspace-grid">
        <aside className="tool-panel" aria-label="Assistant functions">
          <h2>Select a Function</h2>
          <div className="function-list">
            {assistantFunctions.map((item) => (
              <button
                className={`function-card ${selectedFunction === item.id ? 'active' : ''}`}
                key={item.id}
                onClick={() => handleFunctionChange(item.id)}
                type="button"
              >
                <span>{item.title}</span>
                <small>{item.description}</small>
              </button>
            ))}
          </div>
        </aside>

        <section className="composer-card" aria-labelledby="composer-title">
          <div className="section-heading">
            <p className="eyebrow">Selected Function</p>
            <h2 id="composer-title">{activeFunction.title}</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="template">Prompt Template</label>
            <select
              id="template"
              value={selectedTemplate}
              onChange={(event) => setSelectedTemplate(Number(event.target.value))}
            >
              {activeTemplates.map((template, index) => (
                <option key={template.title} value={index}>
                  {template.title}
                </option>
              ))}
            </select>

            <label htmlFor="user-input">Your Input</label>
            <textarea
              id="user-input"
              placeholder={activeFunction.placeholder}
              value={userInput}
              onChange={(event) => setUserInput(event.target.value)}
              rows="9"
            />

            <button className="generate-button" disabled={isLoading} type="submit">
              {isLoading ? 'Generating...' : 'Generate AI Response'}
            </button>
          </form>

          {error && <p className="error-message">{error}</p>}
        </section>
      </section>

      {response && (
        <section className="response-card" aria-live="polite">
          <div className="section-heading">
            <p className="eyebrow">Gemini Response</p>
            <h2>Result</h2>
          </div>
          <div className="response-text">
            {response.split('\n').map((line, index) => (
              <p key={`${line}-${index}`}>{line || '\u00A0'}</p>
            ))}
          </div>

          <div className="feedback-box">
            <p>Was this response helpful?</p>
            <div className="feedback-actions">
              <button onClick={() => handleFeedback('yes')} type="button">
                Yes
              </button>
              <button onClick={() => handleFeedback('no')} type="button">
                No
              </button>
            </div>
            {feedbackMessage && <strong>{feedbackMessage}</strong>}
          </div>
        </section>
      )}
    </main>
  )
}

export default App
