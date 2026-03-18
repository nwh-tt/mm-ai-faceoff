import { useState } from 'react'
import Bracket from './components/Bracket'
import bracketData from './data/bracket.json'
import claudePicks from './data/claude_picks.json'
import actualResults from './data/actual_results.json'

// Score: count correct picks across all rounds
function scorePicksVsActual(picks, actual) {
  if (!picks || !actual) return { correct: 0, total: 0, possible: 63 }
  let correct = 0
  let total = 0

  const regions = ['east', 'south', 'west', 'midwest']
  const rounds = ['r32', 's16', 'e8']

  regions.forEach(region => {
    rounds.forEach(round => {
      const pickArr = picks[region]?.[round] || []
      const actualArr = actual[region]?.[round] || []
      pickArr.forEach((pick, i) => {
        if (actualArr[i] !== null && actualArr[i] !== undefined) {
          total++
          if (pick === actualArr[i]) correct++
        }
      })
    })
    if (picks[region]?.ff !== undefined) {
      const ffActual = actual[region]?.ff
      if (ffActual !== null && ffActual !== undefined) {
        total++
        if (picks[region].ff === ffActual) correct++
      }
    }
  })

  const ff = picks.finalFour || {}
  const ffA = actual.finalFour || {}
  ;['semifinal1', 'semifinal2', 'champion'].forEach(key => {
    if (ff[key] !== undefined && ffA[key] !== null && ffA[key] !== undefined) {
      total++
      if (ff[key] === ffA[key]) correct++
    }
  })

  return { correct, total, possible: 63 }
}

export default function App() {
  const [activePicker, setActivePicker] = useState('claude')

  const pickers = {
    claude: { label: "Claude", data: claudePicks, avatar: '🤖', color: '#818cf8' },
    // To add another picker:
    // human: { label: "Your Picks", data: humanPicksJson, avatar: '👤', color: '#f59e0b' },
  }

  const activePicks = pickers[activePicker]?.data
  const score = scorePicksVsActual(activePicks, actualResults)
  const hasResults = score.total > 0

  return (
    <div className="min-h-screen" style={{ background: '#080c12' }}>
      {/* Background grid texture */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute" style={{
          top: '-15%', left: '-5%', width: '45%', height: '45%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)',
        }} />
        <div className="absolute" style={{
          bottom: '-15%', right: '-5%', width: '45%', height: '45%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)',
        }} />
      </div>

      <div className="relative z-10 px-4 py-8">

        {/* ── Header ── */}
        <header className="text-center mb-8">
          <div
            className="font-condensed font-black uppercase mb-1"
            style={{
              fontSize: 'clamp(32px, 6vw, 60px)',
              letterSpacing: '0.1em',
              color: '#e2e8f0',
            }}
          >
            March Madness 2026
          </div>
          <div
            className="font-condensed uppercase text-slate-600"
            style={{ fontSize: 11, letterSpacing: '0.35em' }}
          >
            NCAA Tournament · Bracket Predictions
          </div>

          {/* Score pill */}
          {hasResults && (
            <div
              className="inline-flex items-center gap-3 mt-4 px-5 py-2 rounded-full"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <span className="font-condensed font-black text-green-400 text-xl">{score.correct}</span>
              <span className="text-slate-600">correct</span>
              <span className="text-slate-700">·</span>
              <span className="font-condensed text-slate-400">{score.total} games played</span>
              <span className="text-slate-700">·</span>
              <span className="font-condensed text-slate-600">{score.possible - score.total} remaining</span>
            </div>
          )}
        </header>

        {/* ── Picker tabs (shown only if multiple pickers) ── */}
        {Object.keys(pickers).length > 1 && (
          <div className="flex justify-center gap-2 mb-6">
            {Object.entries(pickers).map(([key, p]) => (
              <button
                key={key}
                onClick={() => setActivePicker(key)}
                className="font-condensed font-bold uppercase tracking-wider px-4 py-2 rounded-lg text-sm transition-all"
                style={{
                  background: activePicker === key ? p.color + '20' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${activePicker === key ? p.color + '50' : 'rgba(255,255,255,0.07)'}`,
                  color: activePicker === key ? p.color : '#475569',
                }}
              >
                {p.avatar} {p.label}
              </button>
            ))}
          </div>
        )}

        {/* ── Legend ── */}
        <div className="flex justify-center gap-5 mb-6">
          {[
            { dot: '#22c55e', label: 'Correct' },
            { dot: '#ef4444', label: 'Wrong' },
            { dot: '#475569', label: 'Pending' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="rounded-full shrink-0" style={{ width: 7, height: 7, background: item.dot }} />
              <span className="font-condensed uppercase tracking-widest text-slate-500" style={{ fontSize: 10 }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Bracket ── */}
        <div
          className="rounded-2xl"
          style={{
            border: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(5,8,15,0.7)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="p-4 md:p-6">
            <Bracket
              bracketData={bracketData}
              picks={activePicks}
              actual={actualResults}
            />
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="text-center mt-8">
          <p className="font-condensed text-slate-700 uppercase tracking-widest" style={{ fontSize: 10 }}>
            Predictions by {activePicks?.name} · March 18, 2026 · Based on KenPom, injury reports & betting odds
          </p>
        </footer>

      </div>
    </div>
  )
}
