import RegionColumn from './RegionColumn'
import FinalFour from './FinalFour'

/**
 * Bracket — ESPN-style full 68-team bracket layout
 *
 * Layout:
 *   [East R64→E8] [FinalFour] [West E8→R64]
 *   [Midwest R64→E8]          [South E8→R64]
 *
 * Props:
 *   bracketData  — bracket.json
 *   picks        — predictor's picks (claude_picks.json shape)
 *   actual       — actual_results.json
 */
export default function Bracket({ bracketData, picks, actual }) {
  const { regions } = bracketData

  return (
    <div className="overflow-x-auto scrollbar-thin pb-4">
      <div className="flex gap-2 min-w-max justify-center">

        {/* LEFT SIDE: East (top) + South (bottom) */}
        <div className="flex flex-col gap-6">
          <RegionColumn
            region="east"
            regionData={regions.east}
            picks={picks?.east}
            actual={actual?.east}
            flip={false}
          />
          <RegionColumn
            region="south"
            regionData={regions.south}
            picks={picks?.south}
            actual={actual?.south}
            flip={false}
          />
        </div>

        {/* CENTER: Final Four + Championship */}
        <div className="flex items-center self-stretch">
          <FinalFour
            bracketData={bracketData}
            picks={picks}
            actual={actual}
          />
        </div>

        {/* RIGHT SIDE: West (top) + Midwest (bottom) — rounds flip right-to-left */}
        <div className="flex flex-col gap-6">
          <RegionColumn
            region="west"
            regionData={regions.west}
            picks={picks?.west}
            actual={actual?.west}
            flip={true}
          />
          <RegionColumn
            region="midwest"
            regionData={regions.midwest}
            picks={picks?.midwest}
            actual={actual?.midwest}
            flip={true}
          />
        </div>

      </div>
    </div>
  )
}
