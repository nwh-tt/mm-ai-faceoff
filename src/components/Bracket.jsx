import RegionColumn from './RegionColumn'
import FinalFour from './FinalFour'

export default function Bracket({ bracketData, picks, actual }) {
  const { regions } = bracketData

  return (
    <div className="overflow-x-auto scrollbar-thin pb-4">
      {/* Single round-label header */}
      <div className="flex items-center gap-1 min-w-max justify-center mb-2">
        <div className="flex gap-1">
          {['R64', 'R32', 'S16', 'E8'].map(l => (
            <div key={l} className="font-condensed font-bold text-[11px] tracking-widest uppercase text-center text-slate-600 w-[155px]">{l}</div>
          ))}
        </div>
        <div className="w-[280px]" />
        <div className="flex gap-1">
          {['E8', 'S16', 'R32', 'R64'].map(l => (
            <div key={l} className="font-condensed font-bold text-[11px] tracking-widest uppercase text-center text-slate-600 w-[155px]">{l}</div>
          ))}
        </div>
      </div>

      <div className="flex gap-1 min-w-max justify-center">

        {/* LEFT SIDE: East (top) + South (bottom) */}
        <div className="flex flex-col gap-6">
          <RegionColumn region="east"  regionData={regions.east}  picks={picks?.east}  actual={actual?.east}  flip={false} />
          <RegionColumn region="south" regionData={regions.south} picks={picks?.south} actual={actual?.south} flip={false} />
        </div>

        {/* CENTER: Final Four + Championship */}
        <div className="flex items-center self-stretch">
          <FinalFour bracketData={bracketData} picks={picks} actual={actual} />
        </div>

        {/* RIGHT SIDE: West (top) + Midwest (bottom) */}
        <div className="flex flex-col gap-6">
          <RegionColumn region="west"    regionData={regions.west}    picks={picks?.west}    actual={actual?.west}    flip={true} />
          <RegionColumn region="midwest" regionData={regions.midwest} picks={picks?.midwest} actual={actual?.midwest} flip={true} />
        </div>

      </div>
    </div>
  )
}
