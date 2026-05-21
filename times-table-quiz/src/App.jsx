import { useState } from 'react'
import SettingsScreen from './components/SettingsScreen'
import QuizScreen from './components/QuizScreen'
import ResultsScreen from './components/ResultsScreen'

function App() {
  const [screen, setScreen] = useState('settings')
  const [settings, setSettings] = useState({
    tables: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    numQuestions: 20,
    timeLimit: 10,
  })
  const [results, setResults] = useState(null)

  const handleStart = (config) => {
    setSettings(config)
    setScreen('quiz')
  }

  const handleQuizEnd = (quizResults) => {
    setResults(quizResults)
    setScreen('results')
  }

  const handleRetry = () => {
    setScreen('quiz')
  }

  const handleHome = () => {
    setScreen('settings')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {screen === 'settings' && (
          <SettingsScreen settings={settings} onStart={handleStart} />
        )}
        {screen === 'quiz' && (
          <QuizScreen settings={settings} onEnd={handleQuizEnd} />
        )}
        {screen === 'results' && (
          <ResultsScreen
            results={results}
            onRetry={handleRetry}
            onHome={handleHome}
          />
        )}
      </div>
    </div>
  )
}

export default App
