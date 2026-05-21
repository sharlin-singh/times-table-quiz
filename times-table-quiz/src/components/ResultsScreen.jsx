export default function ResultsScreen({ results, onRetry, onHome }) {
  if (!results) return null

  const { score, total, totalTime, details } = results
  const percent = total > 0 ? Math.round((score / total) * 100) : 0

  const emoji = percent >= 90 ? '\u{1F3C6}' : percent >= 70 ? '\u2B50' : percent >= 50 ? '\u{1F44D}' : '\u{1F4AA}'
  const message =
    percent >= 90
      ? 'Outstanding work!'
      : percent >= 70
      ? 'Great job!'
      : percent >= 50
      ? 'Good effort, keep practicing!'
      : 'Keep at it, you\u2019ll improve!'

  return (
    <div className="glass-card p-8 animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-6">
        <span className="text-6xl inline-block animate-float">{emoji}</span>
        <h1 className="text-3xl font-bold text-white mt-3 glow-text">Results</h1>
        <p className="text-slate-400 mt-1">{message}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="stat-card p-4 text-center">
          <span className="block text-3xl font-black text-indigo-400">{score}</span>
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Correct</span>
        </div>
        <div className="stat-card p-4 text-center">
          <span className="block text-3xl font-black text-indigo-400">{total}</span>
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total</span>
        </div>
        <div className="stat-card p-4 text-center">
          <span className="block text-3xl font-black text-emerald-400">{percent}%</span>
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Accuracy</span>
        </div>
        <div className="stat-card p-4 text-center">
          <span className="block text-3xl font-black text-amber-400">{totalTime}s</span>
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Time</span>
        </div>
      </div>

      {/* Detail Table */}
      {details.length > 0 && (
        <div className="rounded-xl overflow-hidden mb-6 max-h-56 overflow-y-auto border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5 sticky top-0">
              <tr className="text-slate-400">
                <th className="text-left p-3 font-semibold">#</th>
                <th className="text-left p-3 font-semibold">Question</th>
                <th className="text-left p-3 font-semibold">You</th>
                <th className="text-left p-3 font-semibold">Answer</th>
              </tr>
            </thead>
            <tbody>
              {details.map((r, i) => (
                <tr
                  key={i}
                  className={
                    r.correct
                      ? 'bg-green-500/10 text-green-300'
                      : 'bg-red-500/10 text-red-300'
                  }
                >
                  <td className="p-3 border-t border-white/5">{i + 1}</td>
                  <td className="p-3 border-t border-white/5">{r.question}</td>
                  <td className="p-3 border-t border-white/5">{r.userAnswer}</td>
                  <td className="p-3 border-t border-white/5">{r.correctAnswer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={onRetry} className="btn-primary flex-1">
          🔄 Try Again
        </button>
        <button onClick={onHome} className="btn-secondary flex-1">
          ⚙️ Settings
        </button>
      </div>
    </div>
  )
}
