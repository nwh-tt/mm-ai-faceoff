import TeamSlot from './TeamSlot'

/**
 * Matchup — shows two teams facing off.
 * pickedWinner: team name the predictor picked
 * actualWinner: team name who actually won (null = not played)
 */
export default function Matchup({ topTeam, bottomTeam, pickedWinner, actualWinner, regionColor, showConnector = true }) {
  function getStatus(team) {
    if (!pickedWinner) return 'neutral'
    const isPicked = pickedWinner === team.team
    if (!isPicked) return 'neutral'
    if (actualWinner === null) return 'pending'
    return actualWinner === team.team ? 'correct' : 'wrong'
  }

  const topStatus = getStatus(topTeam)
  const botStatus = getStatus(bottomTeam)

  return (
    <div className="relative flex flex-col gap-px">
      <TeamSlot
        seed={topTeam.seed}
        team={topTeam.team}
        status={topStatus}
        regionColor={regionColor}
      />
      <TeamSlot
        seed={bottomTeam.seed}
        team={bottomTeam.team}
        status={botStatus}
        regionColor={regionColor}
      />
      {/* divider line */}
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
           style={{ background: regionColor + '20' }} />
    </div>
  )
}
