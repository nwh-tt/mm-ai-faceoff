/**
 * RegionColumn — renders one region's bracket column (R64 → R32 → S16 → E8)
 * flip: boolean — if true, rounds go E8→R64 (right-side regions)
 */
export default function RegionColumn({ regionData, picks, actual, flip = false }) {
  const { name, color, teams } = regionData
  const r32picks  = picks?.r32 || []
  const s16picks  = picks?.s16 || []
  const e8picks   = picks?.e8  || []
  const ffpick    = picks?.ff  || null
  const r32actual = actual?.r32 || []
  const s16actual = actual?.s16 || []
  const e8actual  = actual?.e8  || []
  const ffactual  = actual?.ff  ?? null

  const r64matchups = Array.from({ length: 8 }, (_, i) => ({
    top: teams[i * 2],
    bot: teams[i * 2 + 1],
  }))

  const r32matchups = Array.from({ length: 4 }, (_, i) => ({
    top: r32picks[i * 2]     ? { seed: getSeed(r32picks[i * 2],     teams), team: r32picks[i * 2]     } : { seed: '?', team: 'TBD' },
    bot: r32picks[i * 2 + 1] ? { seed: getSeed(r32picks[i * 2 + 1], teams), team: r32picks[i * 2 + 1] } : { seed: '?', team: 'TBD' },
    pickedWinner: s16picks[i] || null,
    actualWinner: s16actual[i] ?? null,
  }))

  const s16matchups = Array.from({ length: 2 }, (_, i) => ({
    top: s16picks[i * 2]     ? { seed: getSeed(s16picks[i * 2],     teams), team: s16picks[i * 2]     } : { seed: '?', team: 'TBD' },
    bot: s16picks[i * 2 + 1] ? { seed: getSeed(s16picks[i * 2 + 1], teams), team: s16picks[i * 2 + 1] } : { seed: '?', team: 'TBD' },
    pickedWinner: e8picks[i] || null,
    actualWinner: e8actual[i] ?? null,
  }))

  const e8matchup = {
    top: e8picks[0] ? { seed: getSeed(e8picks[0], teams), team: e8picks[0] } : { seed: '?', team: 'TBD' },
    bot: e8picks[1] ? { seed: getSeed(e8picks[1], teams), team: e8picks[1] } : { seed: '?', team: 'TBD' },
    pickedWinner: ffpick,
    actualWinner: ffactual,
  }

  const rounds = [
    { label: 'R64', slots: r64matchups.map((m, i) => ({ top: m.top, bot: m.bot, pickedWinner: r32picks[i] || null, actualWinner: r32actual[i] ?? null })) },
    { label: 'R32', slots: r32matchups },
    { label: 'S16', slots: s16matchups },
    { label: 'E8',  slots: [e8matchup] },
  ]

  const orderedRounds = flip ? [...rounds].reverse() : rounds

  return (
    <div className="flex flex-col gap-1">
      {/* Region header */}
      <div className={`flex items-center gap-2 mb-2 ${flip ? 'flex-row-reverse' : ''}`}>
        <div className="font-condensed font-black text-xl tracking-widest uppercase" style={{ color }}>
          {name}
        </div>
      </div>

      {/* Rounds */}
      <div className="flex gap-1">
        {orderedRounds.map((round) => (
          <RoundColumn
            key={round.label}
            slots={round.slots}
            color={color}
          />
        ))}
      </div>
    </div>
  )
}

function RoundColumn({ slots, color }) {
  return (
    <div className="flex flex-col w-[155px]">
      <div className="flex flex-col flex-1 justify-around" style={{ gap: '4px' }}>
        {slots.map((slot, i) => (
          <MatchupSlot key={i} slot={slot} color={color} />
        ))}
      </div>
    </div>
  )
}

function MatchupSlot({ slot, color }) {
  function getStatus(teamName) {
    if (!slot.pickedWinner || !teamName || teamName === 'TBD') return 'neutral'
    if (slot.pickedWinner !== teamName) return 'neutral'
    if (slot.actualWinner === null) return 'pending'
    return slot.actualWinner === teamName ? 'correct' : 'wrong'
  }

  return (
    <div className="flex flex-col rounded overflow-hidden border" style={{ borderColor: color + '20' }}>
      <SlotRow seed={slot.top?.seed} team={slot.top?.team} status={getStatus(slot.top?.team)} color={color} />
      <div className="h-px" style={{ background: color + '20' }} />
      <SlotRow seed={slot.bot?.seed} team={slot.bot?.team} status={getStatus(slot.bot?.team)} color={color} />
    </div>
  )
}

function SlotRow({ seed, team, status, color }) {
  const bgClass = {
    correct: 'bg-green-500/10',
    wrong:   'bg-red-500/[0.08]',
    pending: 'bg-slate-500/10',
    neutral: 'bg-white/[0.02]',
  }[status]

  const textClass = {
    correct: 'text-green-300',
    wrong:   'text-red-400',
    pending: 'text-slate-300',
    neutral: 'text-slate-300',
  }[status]

  const dotColor = {
    correct: '#22c55e',
    wrong:   '#ef4444',
    pending: '#64748b',
    neutral: null,
  }[status]

  return (
    <div className={`flex items-center gap-1.5 px-2 py-1.5 min-h-[30px] transition-colors ${bgClass}`}>
      <span className="font-condensed font-bold text-xs w-4 shrink-0 text-right" style={{ color: color + '80' }}>
        {seed}
      </span>
      <span className={`font-condensed font-semibold text-[13px] uppercase tracking-wide truncate flex-1 ${textClass}`}>
        {team || 'TBD'}
      </span>
      {dotColor && (
        <span className="shrink-0 rounded-full w-[9px] h-[9px]" style={{ background: dotColor, marginRight: '8px' }} />
      )}
    </div>
  )
}

function getSeed(teamName, teams) {
  const found = teams.find(t => t.team === teamName)
  return found ? found.seed : '?'
}
