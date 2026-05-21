import { useState, useEffect, useCallback, useRef } from 'react'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generateQuestions(tables, count) {
  const pool = []
  for (const table of tables) {
    for (let i = 1; i <= 12; i++) {
      pool.push({ a: table, b: i, answer: table * i })
    }
  }
  return shuffle(pool).slice(0, count)
}

function generateChoices(correctAnswer) {
  const choices = new Set([correctAnswer])

  while (choices.size < 4) {
    let wrong
    const strategy = Math.random()

    if (strategy < 0.4) {
      const offset = Math.floor(Math.random() * 10) + 1
      wrong = correctAnswer + (Math.random() < 0.5 ? offset : -offset)
    } else if (strategy < 0.7) {
      const factor = Math.floor(Math.random() * 12) + 1
      const base = Math.floor(Math.random() * 12) + 1
      wrong = factor * base
    } else {
      wrong = correctAnswer + (Math.floor(Math.random() * 20) - 10)
    }

    if (wrong > 0 && wrong !== correctAnswer) {
      choices.add(wrong)
    }
  }

  return shuffle(Array.from(choices))
}

export default function QuizScreen({ settings, onEnd }) {
  const [questions] = useState(() =>
    generateQuestions(settings.tables, settings.numQuestions)
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [results, setResults] = useState([])
  const [choices, setChoices] = useState([])
  const [selected, setSelected] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState(settings.timeLimit)
  const [isAnswered, setIsAnswered] = useState(false)
  const [streak, setStreak] = useState(0)

  const startTimeRef = useRef(Date.now())
  const timerRef = useRef(null)

  const currentQuestion = questions[currentIndex]

  // Generate choices when question changes
  useEffect(() => {
    if (currentQuestion) {
      setChoices(generateChoices(currentQuestion.answer))
      setSelected(null)
      setIsAnswered(false)
      setTimeRemaining(settings.timeLimit)
    }
  }, [currentIndex, currentQuestion, settings.timeLimit])

  // Timer
  useEffect(() => {
    if (settings.timeLimit === 0 || isAnswered) return

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [currentIndex, settings.timeLimit, isAnswered])

  // Handle timeout
  useEffect(() => {
    if (settings.timeLimit > 0 && timeRemaining === 0 && !isAnswered) {
      handleTimeout()
    }
  }, [timeRemaining, isAnswered, settings.timeLimit])

  const handleTimeout = () => {
    setIsAnswered(true)
    setStreak(0)
    setResults((prev) => [
      ...prev,
      {
        question: `${currentQuestion.a} \u00d7 ${currentQuestion.b}`,
        correctAnswer: currentQuestion.answer,
        userAnswer: '\u2014',
        correct: false,
      },
    ])

    setTimeout(advance, 1500)
  }

  const handleChoice = (choice) => {
    if (isAnswered) return

    clearInterval(timerRef.current)
    setIsAnswered(true)
    setSelected(choice)

    const isCorrect = choice === currentQuestion.answer

    if (isCorrect) {
      setScore((s) => s + 1)
      setStreak((s) => s + 1)
    } else {
      setStreak(0)
    }

    setResults((prev) => [
      ...prev,
      {
        question: `${currentQuestion.a} \u00d7 ${currentQuestion.b}`,
        correctAnswer: currentQuestion.answer,
        userAnswer: choice,
        correct: isCorrect,
      },
    ])

    setTimeout(advance, 1200)
  }

  const advance = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      finishQuiz()
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }, [currentIndex, questions.length])

  const finishQuiz = () => {
    const totalTime = Math.round((Date.now() - startTimeRef.current) / 1000)
    setResults((currentResults) => {
      onEnd({
        score: currentResults.filter((r) => r.correct).length,
        total: currentResults.length,
        totalTime,
        details: currentResults,
      })
      return currentResults
    })
  }

  const handleQuit = () => {
    clearInterval(timerRef.current)
    const totalTime = Math.round((Date.now() - startTimeRef.current) / 1000)
    onEnd({
      score,
      total: results.length,
      totalTime,
      details: results,
    })
  }

  if (!currentQuestion) return null

  const progress = ((currentIndex + 1) / questions.length) * 100
  const timerPercent = settings.timeLimit > 0 ? (timeRemaining / settings.timeLimit) * 100 : 100

  return (
    <div className="glass-card p-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center text-sm font-bold text-slate-400 mb-3">
        <span className="bg-white/5 px-3 py-1 rounded-full">
          {currentIndex + 1} / {questions.length}
        </span>
        {streak >= 3 && (
          <span className="text-amber-400 animate-float">
            🔥 {streak} streak
          </span>
        )}
        <span className="bg-white/5 px-3 py-1 rounded-full">
          ⭐ {score}
        </span>
      </div>

      {/* Progress bar */}
      <div className="progress-bar-track mb-4">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Timer bar */}
      {settings.timeLimit > 0 && (
        <div className="w-full h-1.5 rounded-full overflow-hidden mb-6 bg-white/5">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              timeRemaining <= 3 ? 'bg-red-500 animate-pulse' : 'bg-emerald-400'
            }`}
            style={{ width: `${timerPercent}%` }}
          />
        </div>
      )}

      {/* Question */}
      <div className="text-center mb-8">
        <h2 className="text-5xl font-black text-white glow-text tracking-tight">
          {currentQuestion.a} &times; {currentQuestion.b}
        </h2>
        <p className="text-2xl text-slate-400 mt-2 font-light">= ?</p>

        {/* Feedback */}
        <div className="h-10 mt-4 flex items-center justify-center">
          {isAnswered && selected !== null && selected === currentQuestion.answer && (
            <p className="text-green-400 font-bold text-lg animate-fade-in-up">
              ✓ Correct!
            </p>
          )}
          {isAnswered && selected !== null && selected !== currentQuestion.answer && (
            <p className="text-red-400 font-bold text-lg animate-fade-in-up">
              ✗ It was {currentQuestion.answer}
            </p>
          )}
          {isAnswered && selected === null && (
            <p className="text-red-400 font-bold text-lg animate-fade-in-up">
              ⏱️ Time up! It was {currentQuestion.answer}
            </p>
          )}
        </div>
      </div>

      {/* Choices */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {choices.map((choice, idx) => {
          let className = 'choice-btn'
          if (isAnswered) {
            if (choice === currentQuestion.answer) {
              className += ' correct'
            } else if (choice === selected && choice !== currentQuestion.answer) {
              className += ' incorrect'
            }
          }

          return (
            <button
              key={`${currentIndex}-${idx}`}
              className={className}
              onClick={() => handleChoice(choice)}
              disabled={isAnswered}
            >
              {choice}
            </button>
          )
        })}
      </div>

      {/* Quit */}
      <div className="text-center">
        <button onClick={handleQuit} className="btn-secondary text-sm px-6 py-2">
          Quit
        </button>
      </div>
    </div>
  )
}
