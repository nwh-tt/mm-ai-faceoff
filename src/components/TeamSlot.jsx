/**
 * TeamSlot — a single team pill in the bracket.
 *
 * status: 'correct' | 'wrong' | 'pending' | 'neutral'
 *   correct  = pick matched actual result (green)
 *   wrong    = pick was eliminated (red)
 *   pending  = game not yet played (gray)
 *   neutral  = first-round team, no pick comparison needed
 */
export default function TeamSlot({ seed, team, status = 'neutral', isWinner = false, regionColor }) {
  const statusStyles = {
    correct: 'border-green-500/60 bg-green-500/10 text-green-300',
    wrong:   'border-red-500/60 bg-red-500/10 text-red-400 opacity-60',
    pending: 'border-slate-600/50 bg-slate-800/40 text-slate-400',
    neutral: 'border-slate-700/50 bg-slate-800/30 text-slate-300',
  }

  const indicatorColor = {
    correct: '#22c55e',
    wrong:   '#ef4444',
    pending: '#475569',
    neutral: 'transparent',
  }

  return (
    <div
      className={`
        relative flex items-center gap-1.5 px-2 py-1 rounded
        border text-xs font-condensed font-semibold tracking-wide
        transition-all duration-200
        ${statusStyles[status]}
      `}
      style={{
        borderLeftColor: status === 'neutral' && regionColor ? regionColor + '60' : undefined,
        borderLeftWidth: status === 'neutral' && regionColor ? '2px' : undefined,
      }}
    >
      {/* Seed */}
      <span className="text-[10px] font-bold opacity-50 w-4 shrink-0 text-right leading-none">
        {seed}
      </span>

      {/* Team name */}
      <span className={`truncate leading-none uppercase tracking-wider ${isWinner ? 'font-black' : ''}`}
            style={{ fontSize: '11px' }}>
        {team}
      </span>

      {/* Status indicator dot */}
      {status !== 'neutral' && (
        <span className="ml-auto shrink-0 w-1.5 h-1.5 rounded-full"
              style={{ background: indicatorColor[status] }} />
      )}

      {/* Trophy for champion */}
      {isWinner && status === 'correct' && (
        <span className="ml-auto text-yellow-400 text-xs">🏆</span>
      )}
    </div>
  )
}
