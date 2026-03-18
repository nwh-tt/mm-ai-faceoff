import TeamSlot from './TeamSlot'

/**
 * RegionColumn — renders one region's bracket column (R64 → R32 → S16 → E8 → FF)
 * flip: boolean — if true, rounds go right-to-left (for right-side regions)
 */
export default function RegionColumn({ region, regionData, picks, actual, flip = false }) {
  const { name, color, teams } = regionData
  const r32picks = picks?.r32 || []
  const s16picks = picks?.s16 || []
  const e8picks = picks?.e8 || []
  const ffpick = picks?.ff || null
  const r32actual = actual?.r32 || []
  const s16actual = actual?.s16 || []
  const e8actual = actual?.e8 || []
  const ffactual = actual?.ff || null

  // Build R64 matchups: teams come in pairs (0-1, 2-3, etc.)
  const r64matchups = Array.from({ length: 8 }, (_, i) => ({
    top: teams[i * 2],
    bot: teams[i * 2 + 1],
  }))

  // Build R32 matchups (winners of each pair of R64 matchups advance)
  const r32matchups = Array.from({ length: 4 }, (_, i) => ({
    top: r32picks[i * 2] ? { seed: getSeed(r32picks[i * 2], teams), team: r32picks[i * 2] } : { seed: '?', team: 'TBD' },
    bot: r32picks[i * 2 + 1] ? { seed: getSeed(r32picks[i * 2 + 1], teams), team: r32picks[i * 2 + 1] } : { seed: '?', team: 'TBD' },
    pickedWinner: s16picks[i] || null,
    actualWinner: s16actual[i] ?? null,
  }))

  // Build S16 matchups
  const s16matchups = Array.from({ length: 2 }, (_, i) => ({
    top: s16picks[i * 2] ? { seed: getSeed(s16picks[i * 2], teams), team: s16picks[i * 2] } : { seed: '?', team: 'TBD' },
    bot: s16picks[i * 2 + 1] ? { seed: getSeed(s16picks[i * 2 + 1], teams), team: s16picks[i * 2 + 1] } : { seed: '?', team: 'TBD' },
    pickedWinner: e8picks[i] || null,
    actualWinner: e8actual[i] ?? null,
  }))

  // E8
  const e8matchup = {
    top: e8picks[0] ? { seed: getSeed(e8picks[0], teams), team: e8picks[0] } : { seed: '?', team: 'TBD' },
    bot: e8picks[1] ? { seed: getSeed(e8picks[1], teams), team: e8picks[1] } : { seed: '?', team: 'TBD' },
    pickedWinner: ffpick,
    actualWinner: ffactual,
  }

  const rounds = [
    {
      label: 'R64',
      slots: r64matchups.map((m, i) => ({
        type: 'r64',
        top: m.top,
        bot: m.bot,
        pickedWinner: r32picks[i] || null,
        actualWinner: r32actual[i] ?? null,
      })),
    },
    {
      label: 'R32',
      slots: r32matchups,
    },
    {
      label: 'S16',
      slots: s16matchups,
    },
    {
      label: 'E8',
      slots: [e8matchup],
    },
  ]

  const orderedRounds = flip ? [...rounds].reverse() : rounds

  return (
    <div className="flex flex-col gap-1">
      {/* Region header */}
      <div className={`flex items-center gap-2 mb-2 ${flip ? 'flex-row-reverse' : ''}`}>
        <div
          className="font-condensed font-black text-sm tracking-widest uppercase px-3 py-1 rounded"
          style={{ background: color + '25', color, border: `1px solid ${color}40` }}
        >
          {name}
        </div>
        {ffpick && (
          <div className="font-condensed text-xs text-slate-500 uppercase tracking-wider">
            → {ffpick} to Final Four
          </div>
        )}
      </div>

      {/* Rounds */}
      <div className="flex gap-1">
        {orderedRounds.map((round) => (
          <RoundColumn
            key={round.label}
            label={round.label}
            slots={round.slots}
            color={color}
            flip={flip}
            teams={teams}
          />
        ))}
      </div>
    </div>
  )
}

function RoundColumn({ label, slots, color, flip, teams }) {
  return (
    <div className="flex flex-col" style={{ width: 130 }}>
      {/* Round label */}
      <div
        className={`font-condensed text-[10px] font-bold tracking-widest uppercase mb-1.5 ${flip ? 'text-right' : 'text-left'}`}
        style={{ color: color + 'aa' }}
      >
        {label}
      </div>

      {/* Slots distributed evenly */}
      <div className="flex flex-col flex-1 justify-around gap-1">
        {slots.map((slot, i) => (
          <MatchupSlot key={i} slot={slot} color={color} teams={teams} />
        ))}
      </div>
    </div>
  )
}

function MatchupSlot({ slot, color, teams }) {
  function getStatus(teamName) {
    if (!slot.pickedWinner || !teamName || teamName === 'TBD') return 'neutral'
    const isPicked = slot.pickedWinner === teamName
    if (!isPicked) return 'neutral'
    if (slot.actualWinner === null) return 'pending'
    return slot.actualWinner === teamName ? 'correct' : 'wrong'
  }

  const topStatus = getStatus(slot.top?.team)
  const botStatus = getStatus(slot.bot?.team)

  return (
    <div
      className="flex flex-col rounded overflow-hidden"
      style={{ border: `1px solid ${color}20` }}
    >
      <SlotRow
        seed={slot.top?.seed}
        team={slot.top?.team}
        status={topStatus}
        color={color}
        isPicked={slot.pickedWinner === slot.top?.team}
      />
      <div style={{ height: 1, background: color + '20' }} />
      <SlotRow
        seed={slot.bot?.seed}
        team={slot.bot?.team}
        status={botStatus}
        color={color}
        isPicked={slot.pickedWinner === slot.bot?.team}
      />
    </div>
  )
}

function SlotRow({ seed, team, status, color, isPicked }) {
  const bg = {
    correct: 'rgba(34,197,94,0.12)',
    wrong:   'rgba(239,68,68,0.08)',
    pending: 'rgba(100,116,139,0.10)',
    neutral: 'rgba(255,255,255,0.02)',
  }[status]

  const textColor = {
    correct: '#86efac',
    wrong:   '#fca5a5',
    pending: '#94a3b8',
    neutral: '#cbd5e1',
  }[status]

  const dot = {
    correct: '#22c55e',
    wrong:   '#ef4444',
    pending: '#475569',
    neutral: 'transparent',
  }[status]

  return (
    <div
      className="flex items-center gap-1 px-1.5 py-1 transition-colors"
      style={{ background: bg, minHeight: 24 }}
    >
      <span
        className="font-condensed font-bold shrink-0 text-right"
        style={{ fontSize: 10, color: color + '80', width: 14 }}
      >
        {seed}
      </span>
      <span
        className="font-condensed font-semibold uppercase tracking-wide truncate flex-1"
        style={{ fontSize: 11, color: textColor, fontWeight: isPicked ? 800 : 600 }}
      >
        {team || 'TBD'}
      </span>
      {status !== 'neutral' && (
        <span
          className="shrink-0 rounded-full"
          style={{ width: 5, height: 5, background: dot }}
        />
      )}
    </div>
  )
}

function getSeed(teamName, teams) {
  const found = teams.find(t => t.team === teamName)
  return found ? found.seed : '?'
}
