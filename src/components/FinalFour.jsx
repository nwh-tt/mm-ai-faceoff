/**
 * FinalFour — center piece of the bracket
 */
export default function FinalFour({ bracketData, picks, actual }) {
  const ff = picks?.finalFour || {}
  const ffActual = actual?.finalFour || {}
  const regions = bracketData.regions

  // Semifinal 1: East vs South
  const sf1top = ff.semifinal1 === regions.east.teams?.find(t => t.seed === 1)?.team
    ? { team: picks.east?.ff, seed: getSeed(picks.east?.ff, regions.east.teams) }
    : { team: picks.east?.ff, seed: getSeed(picks.east?.ff, regions.east.teams) }

  const eastFF = picks.east?.ff
  const southFF = picks.south?.ff
  const westFF = picks.west?.ff
  const midwestFF = picks.midwest?.ff

  const sf1winner = ff.semifinal1
  const sf2winner = ff.semifinal2
  const champion = ff.champion

  const sf1actualWinner = ffActual.semifinal1 ?? null
  const sf2actualWinner = ffActual.semifinal2 ?? null
  const champActual = ffActual.champion ?? null

  function getStatus(picked, actual) {
    if (!picked) return 'neutral'
    if (actual === null) return 'pending'
    return actual === picked ? 'correct' : 'wrong'
  }

  const eastColor = regions.east.color
  const southColor = regions.south.color
  const westColor = regions.west.color
  const midwestColor = regions.midwest.color

  return (
    <div className="flex flex-col items-center gap-4" style={{ width: 280 }}>
      {/* Header */}
      <div className="text-center">
        <div
          className="font-condensed font-black text-xl tracking-widest uppercase"
          style={{ color: '#e2e8f0' }}
        >
          Final Four
        </div>
        <div className="font-condensed text-xs text-slate-600 uppercase tracking-wider mt-0.5">
          Indianapolis
        </div>
      </div>

      {/* Semifinal 1 — East vs South */}
      <SemifinalCard
        label="Semifinal 1"
        topTeam={eastFF} topSeed={getSeed(eastFF, regions.east.teams)} topColor={eastColor} topRegion="East"
        botTeam={southFF} botSeed={getSeed(southFF, regions.south.teams)} botColor={southColor} botRegion="South"
        pickedWinner={sf1winner}
        actualWinner={sf1actualWinner}
      />

      {/* Championship */}
      <div
        className="w-full rounded-lg overflow-hidden"
        style={{ border: '1px solid rgba(245,158,11,0.4)', background: 'rgba(245,158,11,0.05)' }}
      >
        <div className="font-condensed text-xs font-bold tracking-widest uppercase text-center py-1.5"
             style={{ color: '#f59e0b', borderBottom: '1px solid rgba(245,158,11,0.2)' }}>
          Championship · Apr 6
        </div>
        <FFSlotRow
          seed={getSeed(sf1winner, [...regions.east.teams, ...regions.south.teams])}
          team={sf1winner}
          status={getStatus(champion, champActual) === 'correct' && champion === sf1winner ? 'correct'
                  : getStatus(champion, champActual) === 'wrong' && champion === sf1winner ? 'wrong'
                  : sf1actualWinner === null ? 'pending' : 'neutral'}
          color={'#f59e0b'}
          isPicked={champion === sf1winner}
        />
        <div style={{ height: 1, background: 'rgba(245,158,11,0.2)' }} />
        <FFSlotRow
          seed={getSeed(sf2winner, [...regions.west.teams, ...regions.midwest.teams])}
          team={sf2winner}
          status={getStatus(champion, champActual) === 'correct' && champion === sf2winner ? 'correct'
                  : getStatus(champion, champActual) === 'wrong' && champion === sf2winner ? 'wrong'
                  : sf2actualWinner === null ? 'pending' : 'neutral'}
          color={'#f59e0b'}
          isPicked={champion === sf2winner}
        />
        {/* Champion banner */}
        <div
          className="font-condensed font-black text-center py-3 text-base uppercase tracking-widest"
          style={{
            borderTop: '1px solid rgba(245,158,11,0.2)',
            color: champActual ? (champActual === champion ? '#fcd34d' : '#f87171') : '#f59e0b',
            background: 'rgba(0,0,0,0.2)',
          }}
        >
          {champActual
            ? champActual === champion
              ? `🏆 ${champion}`
              : `🏆 ${champActual}`
            : `🏆 ${champion}`}
        </div>
      </div>

      {/* Semifinal 2 — West vs Midwest */}
      <SemifinalCard
        label="Semifinal 2"
        topTeam={westFF} topSeed={getSeed(westFF, regions.west.teams)} topColor={westColor} topRegion="West"
        botTeam={midwestFF} botSeed={getSeed(midwestFF, regions.midwest.teams)} botColor={midwestColor} botRegion="Midwest"
        pickedWinner={sf2winner}
        actualWinner={sf2actualWinner}
      />
    </div>
  )
}

function SemifinalCard({ label, topTeam, topSeed, topColor, topRegion, botTeam, botSeed, botColor, botRegion, pickedWinner, actualWinner }) {
  function getStatus(team) {
    if (!pickedWinner || !team) return 'neutral'
    const isPicked = pickedWinner === team
    if (!isPicked) return 'neutral'
    if (actualWinner === null) return 'pending'
    return actualWinner === team ? 'correct' : 'wrong'
  }

  return (
    <div className="w-full rounded-lg overflow-hidden"
         style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="font-condensed text-xs font-bold tracking-widest uppercase text-center py-1.5"
           style={{ color: '#475569', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}>
        {label} · Apr 4
      </div>
      <FFSlotRow seed={topSeed} team={topTeam} status={getStatus(topTeam)} color={topColor}
                 isPicked={pickedWinner === topTeam} region={topRegion} />
      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
      <FFSlotRow seed={botSeed} team={botTeam} status={getStatus(botTeam)} color={botColor}
                 isPicked={pickedWinner === botTeam} region={botRegion} />
      {pickedWinner && (
        <div className="font-condensed text-xs text-center py-1.5 uppercase tracking-wider"
             style={{
               borderTop: '1px solid rgba(255,255,255,0.06)',
               color: actualWinner === null ? '#64748b' : actualWinner === pickedWinner ? '#86efac' : '#fca5a5',
               background: 'rgba(0,0,0,0.2)',
             }}>
          → {actualWinner || pickedWinner}
        </div>
      )}
    </div>
  )
}

function FFSlotRow({ seed, team, status, color, isPicked, region }) {
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

  const dot = { correct: '#22c55e', wrong: '#ef4444', pending: '#475569', neutral: 'transparent' }[status]

  return (
    <div className="flex items-center gap-1.5 px-2 py-1.5" style={{ background: bg }}>
      <span className="font-condensed font-bold shrink-0" style={{ fontSize: 12, color: color + '90', width: 16, textAlign: 'right' }}>
        {seed}
      </span>
      <span className="font-condensed uppercase tracking-wide flex-1 truncate"
            style={{ fontSize: 13, color: textColor, fontWeight: isPicked ? 800 : 600 }}>
        {team || 'TBD'}
      </span>
      {region && <span className="font-condensed text-[10px] shrink-0" style={{ color: color + '70' }}>{region}</span>}
      {status !== 'neutral' && (
        <span className="shrink-0 rounded-full" style={{ width: 6, height: 6, background: dot }} />
      )}
    </div>
  )
}

function getSeed(teamName, teams = []) {
  const found = teams.find(t => t.team === teamName)
  return found ? found.seed : '?'
}
