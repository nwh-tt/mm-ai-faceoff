import { useMemo } from 'react'
import { Trophy } from 'lucide-react'

// ─── design tokens ────────────────────────────────────────────────────────────

const C = {
  text:    '#e2e8f0',
  muted:   '#94a3b8',
  dim:     '#64748b',
  dimmer:  '#475569',
  border:  'rgba(255,255,255,0.06)',
  borderFaint: 'rgba(255,255,255,0.04)',
  surface: 'rgba(255,255,255,0.02)',
  correct: '#22c55e',
  wrong:   '#ef4444',
  amber:   '#b45309',
}

const label = (extra = {}) => ({
  fontSize: 10,
  color: C.dim,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  ...extra,
})

// ─── helpers ──────────────────────────────────────────────────────────────────

function getAllTeams(bracketData) {
  return Object.values(bracketData.regions).flatMap(r => r.teams)
}

function getSeed(teamName, allTeams) {
  return allTeams.find(t => t.team === teamName)?.seed ?? null
}

function computeStats(picks, actual, bracketData) {
  const allTeams = getAllTeams(bracketData)
  const regions  = ['east', 'south', 'west', 'midwest']

  const byRound = {
    r64:   { correct: 0, wrong: 0, pending: 0, pts: 0, ptsPer: 10,  total: 32 },
    r32:   { correct: 0, wrong: 0, pending: 0, pts: 0, ptsPer: 20,  total: 16 },
    s16:   { correct: 0, wrong: 0, pending: 0, pts: 0, ptsPer: 40,  total: 8  },
    e8:    { correct: 0, wrong: 0, pending: 0, pts: 0, ptsPer: 80,  total: 4  },
    ff:    { correct: 0, wrong: 0, pending: 0, pts: 0, ptsPer: 160, total: 2  },
    champ: { correct: 0, wrong: 0, pending: 0, pts: 0, ptsPer: 320, total: 1  },
  }

  let upsetsPicked = 0, upsetsHit = 0
  let biggestUpsetHit = null, biggestUpsetDiff = 0
  let ffCorrect = 0

  for (const region of regions) {
    const regionTeams = bracketData.regions[region].teams
    const r32p = picks[region]?.r32 || []
    const r32a = actual[region]?.r32 || []
    const s16p = picks[region]?.s16 || []
    const s16a = actual[region]?.s16 || []
    const e8p  = picks[region]?.e8  || []
    const e8a  = actual[region]?.e8  || []
    const ffP  = picks[region]?.ff
    const ffA  = actual[region]?.ff ?? null

    r32p.forEach((pick, i) => {
      if (!pick) return
      const act     = r32a[i] ?? null
      const favTeam = regionTeams[i * 2]
      const undTeam = regionTeams[i * 2 + 1]
      const isUpset = pick === undTeam?.team
      if (isUpset) {
        upsetsPicked++
        if (act === pick) {
          upsetsHit++
          const diff = (undTeam?.seed ?? 0) - (favTeam?.seed ?? 0)
          if (diff > biggestUpsetDiff) {
            biggestUpsetDiff = diff
            biggestUpsetHit = { team: pick, beaten: favTeam?.team, undSeed: undTeam?.seed, favSeed: favTeam?.seed }
          }
        }
      }
      if (act === null) byRound.r64.pending++
      else if (pick === act) { byRound.r64.correct++; byRound.r64.pts += 10 }
      else byRound.r64.wrong++
    })

    s16p.forEach((pick, i) => {
      if (!pick) return
      const act = s16a[i] ?? null
      const top = r32p[i * 2], bot = r32p[i * 2 + 1]
      if (top && bot) {
        const sTop = getSeed(top, allTeams), sBot = getSeed(bot, allTeams)
        if (sTop && sBot && pick === bot && sBot > sTop) {
          upsetsPicked++
          if (act === pick) upsetsHit++
        }
      }
      if (act === null) byRound.r32.pending++
      else if (pick === act) { byRound.r32.correct++; byRound.r32.pts += 20 }
      else byRound.r32.wrong++
    })

    e8p.forEach((pick, i) => {
      if (!pick) return
      const act = e8a[i] ?? null
      if (act === null) byRound.s16.pending++
      else if (pick === act) { byRound.s16.correct++; byRound.s16.pts += 40 }
      else byRound.s16.wrong++
    })

    if (ffP) {
      if (ffA === null) byRound.e8.pending++
      else if (ffP === ffA) { byRound.e8.correct++; byRound.e8.pts += 80; ffCorrect++ }
      else byRound.e8.wrong++
    }
  }

  const ff    = picks.finalFour  || {}
  const ffAct = actual.finalFour || {}
  ;['semifinal1', 'semifinal2'].forEach(k => {
    const p = ff[k]; const a = ffAct[k] ?? null
    if (!p) return
    if (a === null) byRound.ff.pending++
    else if (p === a) { byRound.ff.correct++; byRound.ff.pts += 160 }
    else byRound.ff.wrong++
  })

  const cp = ff.champion, ca = ffAct.champion ?? null
  if (cp) {
    if (ca === null) byRound.champ.pending++
    else if (cp === ca) { byRound.champ.correct++; byRound.champ.pts += 320 }
    else byRound.champ.wrong++
  }

  const totalPoints  = Object.values(byRound).reduce((s, r) => s + r.pts, 0)
  const totalCorrect = Object.values(byRound).reduce((s, r) => s + r.correct, 0)
  const totalWrong   = Object.values(byRound).reduce((s, r) => s + r.wrong, 0)
  const totalPending = Object.values(byRound).reduce((s, r) => s + r.pending, 0)
  const maxPossible  = totalPoints +
    byRound.r64.pending * 10  + byRound.r32.pending * 20  +
    byRound.s16.pending * 40  + byRound.e8.pending  * 80  +
    byRound.ff.pending  * 160 + byRound.champ.pending * 320

  return {
    byRound, totalPoints, totalCorrect, totalWrong, totalPending, maxPossible,
    upsetsPicked, upsetsHit, biggestUpsetHit, ffCorrect,
    champion: { pick: cp, actual: ca },
  }
}

function findDisagreements(pickerEntries) {
  const out = []
  const regions = ['east', 'south', 'west', 'midwest']
  const regionalRounds = [
    { key: 'ff',  label: 'E8',  single: true, pts: 80  },
    { key: 'e8',  label: 'S16', pts: 40 },
    { key: 's16', label: 'R32', pts: 20 },
    { key: 'r32', label: 'R64', pts: 10 },
  ]

  const ffKeys = [
    { k: 'champion',   label: 'Champion', pts: 320 },
    { k: 'semifinal1', label: 'SF1',      pts: 160 },
    { k: 'semifinal2', label: 'SF2',      pts: 160 },
  ]
  ffKeys.forEach(({ k, label, pts }) => {
    const perPicker = pickerEntries.map(([key, p]) => ({ key, label: p.label, color: p.color, pick: p.data.finalFour?.[k] ?? null }))
    if (new Set(perPicker.map(p => p.pick)).size > 1)
      out.push({ region: 'FF', round: label, pts, perPicker })
  })

  for (const region of regions) {
    const regionName = region.charAt(0).toUpperCase() + region.slice(1)
    for (const round of regionalRounds) {
      if (round.single) {
        const perPicker = pickerEntries.map(([key, p]) => ({ key, label: p.label, color: p.color, pick: p.data[region]?.[round.key] ?? null }))
        if (new Set(perPicker.map(p => p.pick)).size > 1)
          out.push({ region: regionName, round: round.label, pts: round.pts, perPicker })
      } else {
        const arrs = pickerEntries.map(([, p]) => p.data[region]?.[round.key] || [])
        const len  = Math.max(...arrs.map(a => a.length), 0)
        for (let i = 0; i < len; i++) {
          const perPicker = pickerEntries.map(([key, p], pi) => ({ key, label: p.label, color: p.color, pick: arrs[pi][i] ?? null }))
          if (new Set(perPicker.map(p => p.pick)).size > 1)
            out.push({ region: regionName, round: round.label, pts: round.pts, perPicker })
        }
      }
    }
  }

  return out
}

// ─── sub-components ───────────────────────────────────────────────────────────

function Stat({ value, valueColor, lbl }) {
  return (
    <div>
      <div className="font-condensed" style={{ fontWeight: 800, fontSize: 22, color: valueColor || C.text, lineHeight: 1 }}>{value}</div>
      <div className="font-condensed" style={label({ marginTop: 4 })}>{lbl}</div>
    </div>
  )
}

function LeaderCard({ picker, rank }) {
  const { label: name, color, avatar, logo, stats } = picker
  const { totalPoints, maxPossible, totalCorrect, totalWrong, totalPending, upsetsPicked, upsetsHit, ffCorrect, champion } = stats

  const champColor = champion.actual
    ? champion.actual === champion.pick ? C.correct : C.wrong
    : C.muted

  return (
    <div style={{
      flex: 1, minWidth: 260,
      background: C.surface,
      border: `1px solid ${color}22`,
      borderTop: `2px solid ${color}`,
      borderRadius: 10,
      padding: 20,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ghost rank */}
      <div className="font-condensed" style={{
        position: 'absolute', top: -8, right: 12,
        fontWeight: 900, fontSize: 100, lineHeight: 1,
        color: rank === 1 ? `${color}12` : 'rgba(255,255,255,0.03)',
        userSelect: 'none', pointerEvents: 'none',
      }}>#{rank}</div>

      {/* Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        {logo
          ? <img src={logo} alt={name} style={{ width: 20, height: 20, objectFit: 'contain' }} />
          : <span style={{ fontSize: 16 }}>{avatar}</span>
        }
        <span className="font-condensed" style={{ fontWeight: 900, fontSize: 16, letterSpacing: '0.1em', textTransform: 'uppercase', color }}>{name}</span>
      </div>

      {/* Points */}
      <div style={{ marginBottom: 18 }}>
        <div className="font-condensed" style={{ fontWeight: 900, fontSize: 52, color: C.text, lineHeight: 1 }}>{totalPoints}</div>
        <div className="font-condensed" style={label({ marginTop: 4 })}>
          points &nbsp;·&nbsp; max <span style={{ color: C.muted }}>{maxPossible}</span>
        </div>
      </div>

      {/* Correct / Wrong row */}
      <div style={{ display: 'flex', gap: 20, paddingBottom: 14, borderBottom: `1px solid ${C.borderFaint}`, marginBottom: 14 }}>
        <Stat value={totalCorrect} valueColor={C.correct} lbl="Correct" />
        <Stat value={totalWrong}   valueColor={C.wrong}   lbl="Wrong"   />
      </div>

      {/* Secondary */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 14 }}>
        <div>
          <span className="font-condensed" style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{ffCorrect}</span>
          <span className="font-condensed" style={{ fontWeight: 400, fontSize: 15, color: C.dim }}>/4</span>
          <div className="font-condensed" style={label({ marginTop: 3 })}>Final Four</div>
        </div>
        <div>
          <span className="font-condensed" style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{upsetsHit}</span>
          <span className="font-condensed" style={{ fontWeight: 400, fontSize: 15, color: C.dim }}>/{upsetsPicked}</span>
          <div className="font-condensed" style={label({ marginTop: 3 })}>Upsets Hit</div>
        </div>
      </div>

      {/* Champion */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 12, borderTop: `1px solid ${C.borderFaint}` }}>
        <Trophy size={14} color={C.dim} strokeWidth={1.75} />
        <div>
          <div className="font-condensed" style={{ fontWeight: 700, fontSize: 14, color: champColor }}>{champion.pick || '—'}</div>
          {champion.actual && (
            <div className="font-condensed" style={label()}>
              {champion.actual === champion.pick ? 'Correct ✓' : `Actual: ${champion.actual}`}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const ROUND_ORDER = [
  { key: 'r64',   label: 'Round of 64',  pts: 10  },
  { key: 'r32',   label: 'Round of 32',  pts: 20  },
  { key: 's16',   label: 'Sweet 16',     pts: 40  },
  { key: 'e8',    label: 'Elite Eight',  pts: 80  },
  { key: 'ff',    label: 'Final Four',   pts: 160 },
  { key: 'champ', label: 'Championship', pts: 320 },
]

function RoundBreakdown({ pickerStats }) {
  const thStyle = {
    fontWeight: 700, fontSize: 10, color: C.dim,
    letterSpacing: '0.15em', textTransform: 'uppercase',
    padding: '8px 16px', textAlign: 'right',
    borderBottom: `1px solid ${C.border}`,
  }
  const tdStyle = {
    fontSize: 13, padding: '10px 16px',
    textAlign: 'right', borderBottom: `1px solid ${C.borderFaint}`,
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="font-condensed" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ ...thStyle, textAlign: 'left' }}>Round</th>
            <th style={thStyle}>Per Correct</th>
            {pickerStats.map(p => (
              <th key={p.key} style={{ ...thStyle, color: p.color }}>{p.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROUND_ORDER.map(round => (
            <tr key={round.key}>
              <td style={{ ...tdStyle, textAlign: 'left', color: C.muted, fontWeight: 600 }}>{round.label}</td>
              <td style={{ ...tdStyle, color: C.dimmer }}>{round.pts}pt</td>
              {pickerStats.map(p => {
                const r = p.stats.byRound[round.key]
                const played = r.correct + r.wrong
                const total  = played + r.pending
                const allPending = played === 0
                return (
                  <td key={p.key} style={{ ...tdStyle, color: C.text }}>
                    {allPending
                      ? <span style={{ color: C.dimmer }}>—</span>
                      : <>
                          <span style={{ color: r.pts > 0 ? C.correct : C.text, fontWeight: 700 }}>{r.pts}pts</span>
                          <span style={{ color: C.dim, fontSize: 11, marginLeft: 6 }}>{r.correct}/{total}</span>
                        </>
                    }
                  </td>
                )
              })}
            </tr>
          ))}
          <tr style={{ background: C.surface }}>
            <td style={{ ...tdStyle, textAlign: 'left', color: C.text, fontWeight: 800, borderTop: `1px solid ${C.border}` }}>Total</td>
            <td style={{ ...tdStyle, borderTop: `1px solid ${C.border}` }} />
            {pickerStats.map(p => (
              <td key={p.key} style={{ ...tdStyle, fontWeight: 800, borderTop: `1px solid ${C.border}` }}>
                <span style={{ color: p.color }}>{p.stats.totalPoints}</span>
                <span style={{ color: C.dim, fontSize: 11, marginLeft: 6 }}>
                  {p.stats.totalCorrect}/{p.stats.totalCorrect + p.stats.totalWrong + p.stats.totalPending}
                </span>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function DisagreementsSection({ disagreements }) {
  const shown = disagreements.slice(0, 30)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {shown.length === 0 && (
        <p className="font-condensed" style={{ color: C.muted, fontSize: 14 }}>All AIs agree on every pick.</p>
      )}
      {shown.map((d, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 16,
          background: C.surface, border: `1px solid ${C.borderFaint}`,
          borderRadius: 6, padding: '9px 14px', flexWrap: 'wrap',
        }}>
          <div style={{ width: 160, flexShrink: 0, display: 'flex', alignItems: 'baseline', gap: 8, whiteSpace: 'nowrap' }}>
            <span className="font-condensed" style={{ fontSize: 12, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{d.region} · {d.round}</span>
            <span className="font-condensed" style={{ fontSize: 11, color: C.dim }}>{d.pts}pt</span>
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {d.perPicker.map(pp => (
              <div key={pp.key} style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                <span className="font-condensed" style={{ fontSize: 11, color: pp.color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{pp.label}:</span>
                <span className="font-condensed" style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{pp.pick || '—'}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      {disagreements.length > 30 && (
        <p className="font-condensed" style={{ color: C.dim, fontSize: 12, textAlign: 'center', marginTop: 6 }}>+{disagreements.length - 30} more</p>
      )}
    </div>
  )
}

function SectionHeader({ title }) {
  return (
    <div className="font-condensed" style={{
      fontWeight: 800, fontSize: 11,
      letterSpacing: '0.22em', textTransform: 'uppercase',
      color: C.amber,
      marginBottom: 16, paddingBottom: 10,
      borderBottom: `1px solid rgba(180,83,9,0.18)`,
    }}>{title}</div>
  )
}

// ─── main export ──────────────────────────────────────────────────────────────

export default function Summary({ bracketData, pickers, actual }) {
  const pickerStats = useMemo(() =>
    Object.entries(pickers)
      .map(([key, p]) => ({ key, label: p.label, color: p.color, avatar: p.avatar, logo: p.logo, stats: computeStats(p.data, actual, bracketData) }))
      .sort((a, b) => b.stats.totalPoints - a.stats.totalPoints),
    [pickers, actual, bracketData]
  )

  const disagreements = useMemo(() => findDisagreements(Object.entries(pickers)), [pickers])

  const section = {
    background: 'rgba(15,11,7,0.7)',
    border: `1px solid ${C.border}`,
    borderRadius: 10, padding: 20,
    backdropFilter: 'blur(12px)',
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

      <div style={section}>
        <SectionHeader title="Leaderboard" />
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {pickerStats.map((p, rank) => <LeaderCard key={p.key} picker={p} rank={rank + 1} />)}
        </div>
      </div>

      <div style={section}>
        <SectionHeader title="Points by Round" />
        <RoundBreakdown pickerStats={pickerStats} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        <div style={section}>
          <SectionHeader title="Upset Picks" />
          {/* Column headers */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 8, paddingLeft: 14 }}>
            <div className="font-condensed" style={{ ...label(), width: 100 }}>Model</div>
            <div className="font-condensed" style={{ ...label(), width: 80 }}>Hit</div>
            <div className="font-condensed" style={{ ...label(), width: 70 }}>Rate</div>
            <div className="font-condensed" style={{ ...label() }}>Best Upset</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pickerStats.map(p => {
              const { upsetsPicked, upsetsHit, biggestUpsetHit } = p.stats
              const hitRate = upsetsPicked > 0 ? Math.round((upsetsHit / upsetsPicked) * 100) : null
              const rateColor = hitRate === null ? C.dim : hitRate > 50 ? C.correct : hitRate > 0 ? '#f59e0b' : C.text
              return (
                <div key={p.key} style={{ display: 'flex', alignItems: 'center', borderLeft: `2px solid ${p.color}`, paddingLeft: 12, gap: 0 }}>
                  <div className="font-condensed" style={{ fontWeight: 800, fontSize: 12, color: p.color, letterSpacing: '0.1em', textTransform: 'uppercase', width: 100 }}>{p.label}</div>
                  <div className="font-condensed" style={{ width: 80 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{upsetsHit}</span>
                    <span style={{ fontWeight: 400, fontSize: 15, color: C.dim }}>/{upsetsPicked}</span>
                  </div>
                  <div className="font-condensed" style={{ fontWeight: 700, fontSize: 15, color: rateColor, width: 70 }}>
                    {hitRate !== null ? `${hitRate}%` : '—'}
                  </div>
                  <div className="font-condensed" style={{ fontSize: 12, color: C.correct, flex: 1 }}>
                    {biggestUpsetHit ? `(${biggestUpsetHit.undSeed}) ${biggestUpsetHit.team} over (${biggestUpsetHit.favSeed}) ${biggestUpsetHit.beaten}` : <span style={{ color: C.dim }}>—</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={section}>
          <SectionHeader title="Final Four & Champion" />
          {/* Column headers */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 8, paddingLeft: 14 }}>
            <div className="font-condensed" style={{ ...label(), width: 100 }}>Model</div>
            <div className="font-condensed" style={{ ...label(), width: 70 }}>FF</div>
            <div className="font-condensed" style={{ ...label(), flex: 1 }}>Champion Pick</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pickerStats.map(p => {
              const { ffCorrect, champion } = p.stats
              const champStatus = champion.actual
                ? champion.actual === champion.pick ? 'correct' : 'wrong'
                : 'pending'
              const champColor = { correct: C.correct, wrong: C.wrong, pending: C.muted }[champStatus]
              return (
                <div key={p.key} style={{ display: 'flex', alignItems: 'center', borderLeft: `2px solid ${p.color}`, paddingLeft: 12, gap: 0 }}>
                  <div className="font-condensed" style={{ fontWeight: 800, fontSize: 12, color: p.color, letterSpacing: '0.1em', textTransform: 'uppercase', width: 100 }}>{p.label}</div>
                  <div className="font-condensed" style={{ width: 70 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{ffCorrect}</span>
                    <span style={{ fontWeight: 400, fontSize: 15, color: C.dim }}>/4</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, flex: 1 }}>
                    <Trophy size={13} color={C.dim} strokeWidth={1.75} />
                    <span className="font-condensed" style={{ fontWeight: 700, fontSize: 14, color: champColor }}>{champion.pick || '—'}</span>
                    {champion.actual && (
                      <span className="font-condensed" style={{ fontSize: 11, color: champColor === C.correct ? C.correct : C.wrong, marginLeft: 4 }}>
                        · {champStatus}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div style={section}>
        <SectionHeader title={`Disagreements · ${disagreements.length} games`} />
        <DisagreementsSection disagreements={disagreements} />
      </div>

    </div>
  )
}
