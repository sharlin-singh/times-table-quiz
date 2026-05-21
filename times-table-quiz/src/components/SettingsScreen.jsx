import { useState } from 'react'

const ALL_TABLES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

export default function SettingsScreen({ settings, onStart }) {
  const [tables, setTables] = useState(new Set(settings.tables))
  const [numQuestions, setNumQuestions] = useState(settings.numQuestions)
  const [timeLimit, setTimeLimit] = useState(settings.timeLimit)

  const toggleTable = (num) => {
    setTables((prev) => {
      const next = new Set(prev)
      if (next.has(num)) {
        next.delete(num)
      } else {
        next.add(num)
      }
      return next
    })
  }

  const selectAll = () => setTables(new Set(ALL_TABLES))
  const deselectAll = () => setTables(new Set())

  const handleStart = () => {
    if (tables.size === 0) {
      alert('Please select at least one times table.')
      return
    }
    onStart({
      tables: Array.from(tables),
      numQuestions,
      timeLimit,
    })
  }

  return (
    <div className="glass-card p-8 animate-fade-in-up">
      {/* Title */}
      <div className="text-center mb-8">
        <span className="text-5xl animate-float inline-block">🧮</span>
        <h1 className="text-3xl font-bold text-white mt-3 glow-text">
          Times Table Quiz
        </h1>
        <p className="text-slate-400 mt-1">Test your multiplication skills!</p>
      </div>

      {/* Table Selection */}
      <div className="mb-6">
        <label className="block font-semibold text-sm mb-3 text-slate-300 uppercase tracking-wider">
          Tables to practice
        </label>
        <div className="grid grid-cols-4 gap-2">
          {ALL_TABLES.map((num) => (
            <button
              key={num}
              type="button"
              className={`table-toggle ${tables.has(num) ? 'selected' : ''}`}
              onClick={() => toggleTable(num)}
              aria-pressed={tables.has(num)}
            >
              {num}
            </button>
          ))}
        </div>
        <div className="flex gap-4 mt-3">
          <button
            onClick={selectAll}
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Select All
          </button>
          <button
            onClick={deselectAll}
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Deselect All
          </button>
        </div>
      </div>

      {/* Number of Questions */}
      <div className="mb-6">
        <label htmlFor="num-questions" className="block font-semibold text-sm mb-2 text-slate-300 uppercase tracking-wider">
          Questions
        </label>
        <select
          id="num-questions"
          value={numQuestions}
          onChange={(e) => setNumQuestions(Number(e.target.value))}
          className="w-full p-3 rounded-xl text-base text-white bg-[#1a1a2e] border border-white/10
                     focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30
                     transition-all appearance-none cursor-pointer"
          style={{ colorScheme: 'dark' }}
        >
          <option value={10}>10 questions</option>
          <option value={20}>20 questions</option>
          <option value={30}>30 questions</option>
          <option value={50}>50 questions</option>
        </select>
      </div>

      {/* Time Limit */}
      <div className="mb-8">
        <label htmlFor="time-limit" className="block font-semibold text-sm mb-2 text-slate-300 uppercase tracking-wider">
          Time per question
        </label>
        <select
          id="time-limit"
          value={timeLimit}
          onChange={(e) => setTimeLimit(Number(e.target.value))}
          className="w-full p-3 rounded-xl text-base text-white bg-[#1a1a2e] border border-white/10
                     focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30
                     transition-all appearance-none cursor-pointer"
          style={{ colorScheme: 'dark' }}
        >
          <option value={0}>No limit</option>
          <option value={5}>5 seconds</option>
          <option value={10}>10 seconds</option>
          <option value={15}>15 seconds</option>
          <option value={30}>30 seconds</option>
        </select>
      </div>

      <button onClick={handleStart} className="btn-primary w-full text-lg">
        🚀 Start Quiz
      </button>
    </div>
  )
}
