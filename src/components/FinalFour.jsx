import { Trophy } from 'lucide-react'

export default function FinalFour({ bracketData, picks, actual }) {
  const ff = picks?.finalFour || {};
  const ffActual = actual?.finalFour || {};
  const regions = bracketData.regions;

  const eastFF = picks.east?.ff;
  const southFF = picks.south?.ff;
  const westFF = picks.west?.ff;
  const midwestFF = picks.midwest?.ff;

  const sf1winner = ff.semifinal1;
  const sf2winner = ff.semifinal2;
  const champion = ff.champion;

  const sf1actualWinner = ffActual.semifinal1 ?? null;
  const sf2actualWinner = ffActual.semifinal2 ?? null;
  const champActual = ffActual.champion ?? null;

  function getStatus(picked, actual) {
    if (!picked) return "neutral";
    if (actual === null) return "pending";
    return actual === picked ? "correct" : "wrong";
  }

  const champColor = champActual
    ? champActual === champion
      ? "text-yellow-300"
      : "text-red-400"
    : "text-yellow-500";

  return (
    <div className="flex flex-col items-center gap-4 w-[280px]">
      {/* Header */}
      <div className="text-center">
        <div className="font-condensed font-black text-xl tracking-widest uppercase text-slate-200">
          Final Four
        </div>
        <div className="font-condensed text-xs text-slate-600 uppercase tracking-wider mt-0.5">
          Indianapolis
        </div>
      </div>

      {/* Semifinal 1 — East vs South */}
      <SemifinalCard
        label="Semifinal 1"
        topTeam={eastFF}
        topSeed={getSeed(eastFF, regions.east.teams)}
        topColor={regions.east.color}
        botTeam={southFF}
        botSeed={getSeed(southFF, regions.south.teams)}
        botColor={regions.south.color}
        pickedWinner={sf1winner}
        actualWinner={sf1actualWinner}
      />

      {/* Championship */}
      <div className="w-full rounded-lg overflow-hidden border border-yellow-500/40 bg-yellow-500/5">
        <div className="font-condensed text-xs font-bold tracking-widest uppercase text-center py-1.5 text-yellow-500 border-b border-yellow-500/20">
          Championship · Apr 6
        </div>
        <FFSlotRow
          seed={getSeed(sf1winner, [
            ...regions.east.teams,
            ...regions.south.teams,
          ])}
          team={sf1winner}
          status={
            champActual === sf1winner
              ? champion === sf1winner
                ? "correct"
                : "wrong"
              : champion === sf1winner
                ? "pending"
                : "neutral"
          }
          color="#f59e0b"
          isPicked={champion === sf1winner}
        />
        <div className="h-px bg-yellow-500/20" />
        <FFSlotRow
          seed={getSeed(sf2winner, [
            ...regions.west.teams,
            ...regions.midwest.teams,
          ])}
          team={sf2winner}
          status={
            champActual === sf2winner
              ? champion === sf2winner
                ? "correct"
                : "wrong"
              : champion === sf2winner
                ? "pending"
                : "neutral"
          }
          color="#f59e0b"
          isPicked={champion === sf2winner}
        />
        {/* Champion banner */}
        <div
          className={`font-condensed font-black text-center py-3 text-base uppercase tracking-widest border-t border-yellow-500/20 bg-black/20 ${champColor}`}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Trophy size={14} color="#f59e0b" strokeWidth={1.75} />
            {champActual
              ? champActual === champion ? champion : champActual
              : champion}
          </span>
        </div>
      </div>

      {/* Semifinal 2 — West vs Midwest */}
      <SemifinalCard
        label="Semifinal 2"
        topTeam={westFF}
        topSeed={getSeed(westFF, regions.west.teams)}
        topColor={regions.west.color}
        botTeam={midwestFF}
        botSeed={getSeed(midwestFF, regions.midwest.teams)}
        botColor={regions.midwest.color}
        pickedWinner={sf2winner}
        actualWinner={sf2actualWinner}
      />
    </div>
  );
}

function SemifinalCard({
  label,
  topTeam,
  topSeed,
  topColor,
  botTeam,
  botSeed,
  botColor,
  pickedWinner,
  actualWinner,
}) {
  function getStatus(team) {
    if (!pickedWinner || !team) return "neutral";
    if (pickedWinner !== team) return "neutral";
    if (actualWinner === null) return "pending";
    return actualWinner === team ? "correct" : "wrong";
  }

  const winnerTextClass =
    actualWinner === null
      ? "text-slate-500"
      : actualWinner === pickedWinner
        ? "text-green-300"
        : "text-red-400";

  return (
    <div className="w-full rounded-lg overflow-hidden border border-white/[0.08]">
      <div className="font-condensed text-xs font-bold tracking-widest uppercase text-center py-1.5 text-slate-600 border-b border-white/[0.06] bg-black/30">
        {label} · Apr 4
      </div>
      <FFSlotRow
        seed={topSeed}
        team={topTeam}
        status={getStatus(topTeam)}
        color={topColor}
        isPicked={pickedWinner === topTeam}
      />
      <div className="h-px bg-white/[0.06]" />
      <FFSlotRow
        seed={botSeed}
        team={botTeam}
        status={getStatus(botTeam)}
        color={botColor}
        isPicked={pickedWinner === botTeam}
      />
      {pickedWinner && (
        <div
          className={`font-condensed text-xs text-center py-3 uppercase tracking-wider border-t border-white/[0.06] bg-black/20 ${winnerTextClass}`}
        >
          → {actualWinner || pickedWinner}
        </div>
      )}
    </div>
  );
}

function FFSlotRow({ seed, team, status, color, isPicked }) {
  const bgClass = {
    correct: "bg-green-500/10",
    wrong: "bg-red-500/[0.08]",
    pending: "bg-slate-500/10",
    neutral: "bg-white/[0.02]",
  }[status];

  const textClass = {
    correct: "text-green-300",
    wrong: "text-red-400",
    pending: "text-slate-300",
    neutral: "text-slate-300",
  }[status];

  const dotColor = {
    correct: "#22c55e",
    wrong: "#ef4444",
    pending: "#64748b",
    neutral: null,
  }[status];

  return (
    <div className={`flex items-center gap-1.5 px-2 ${bgClass}`}>
      <span
        className="font-condensed font-bold text-xs w-4 shrink-0 text-right"
        style={{ color: color + "90" }}
      >
        {seed}
      </span>
      <span
        className={`font-condensed text-[13px] uppercase tracking-wide flex-1 truncate font-semibold ${textClass}`}
      >
        {team || "TBD"}
      </span>
      {dotColor && (
        <span
          className="shrink-0 rounded-full w-[9px] h-[9px]"
          style={{ background: dotColor, marginRight: "8px" }}
        />
      )}
    </div>
  );
}

function getSeed(teamName, teams = []) {
  const found = teams.find((t) => t.team === teamName);
  return found ? found.seed : "?";
}
