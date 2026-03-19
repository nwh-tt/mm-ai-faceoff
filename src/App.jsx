import { useState } from "react";
import Bracket from "./components/Bracket";
import bracketData from "./data/bracket.json";
import claudePicks from "./data/claude_picks.json";
import gptPicks from "./data/gpt_picks.json";
import geminiPicks from "./data/gemini_picks.json";
import actualResults from "./data/actual_results.json";

// Score: count correct picks across all rounds
function scorePicksVsActual(picks, actual) {
  if (!picks || !actual) return { correct: 0, total: 0, possible: 63 };
  let correct = 0;
  let total = 0;

  const regions = ["east", "south", "west", "midwest"];
  const rounds = ["r32", "s16", "e8"];

  regions.forEach((region) => {
    rounds.forEach((round) => {
      const pickArr = picks[region]?.[round] || [];
      const actualArr = actual[region]?.[round] || [];
      pickArr.forEach((pick, i) => {
        if (actualArr[i] !== null && actualArr[i] !== undefined) {
          total++;
          if (pick === actualArr[i]) correct++;
        }
      });
    });
    if (picks[region]?.ff !== undefined) {
      const ffActual = actual[region]?.ff;
      if (ffActual !== null && ffActual !== undefined) {
        total++;
        if (picks[region].ff === ffActual) correct++;
      }
    }
  });

  const ff = picks.finalFour || {};
  const ffA = actual.finalFour || {};
  ["semifinal1", "semifinal2", "champion"].forEach((key) => {
    if (ff[key] !== undefined && ffA[key] !== null && ffA[key] !== undefined) {
      total++;
      if (ff[key] === ffA[key]) correct++;
    }
  });

  return { correct, total, possible: 63 };
}

export default function App() {
  const [activePicker, setActivePicker] = useState("claude");

  const pickers = {
    claude: {
      label: "Claude",
      data: claudePicks,
      avatar: "🤖",
      logo: "/logos/claude.png",
      color: "#d97757",
    },
    gpt: {
      label: "ChatGPT",
      data: gptPicks,
      avatar: "🧠",
      logo: "/logos/openai.png",
      color: "#10a37f",
    },
    gemini: {
      label: "Gemini",
      data: geminiPicks,
      avatar: "✨",
      logo: "/logos/gemini.png",
      color: "#4285f4",
    },
  };

  const activePicks = pickers[activePicker]?.data;
  const score = scorePicksVsActual(activePicks, actualResults);
  const hasResults = score.total > 0;

  return (
    <div className="min-h-screen" style={{ background: "#0a0805" }}>
      {/* Background grid texture */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(180,130,60,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180,130,60,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute"
          style={{
            top: "-15%",
            left: "-5%",
            width: "45%",
            height: "45%",
            background:
              "radial-gradient(circle, rgba(180,110,40,0.07) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: "-15%",
            right: "-5%",
            width: "45%",
            height: "45%",
            background:
              "radial-gradient(circle, rgba(160,80,40,0.07) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ── Sticky top bar ── */}
      <div
        className="sticky top-0 z-20 flex items-center"
        style={{
          padding: "10px 28px",
          background: "rgba(10,8,5,0.88)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Left — picker */}
        <div className="shrink-0" style={{ minWidth: 160 }}>
          {Object.keys(pickers).length > 1 && (
            <div className="flex items-end" style={{ gap: 2 }}>
              {Object.entries(pickers).map(([key, p]) => {
                const isActive = activePicker === key
                return (
                  <button
                    key={key}
                    onClick={() => setActivePicker(key)}
                    className="font-condensed font-black uppercase flex flex-col items-center transition-all"
                    style={{
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                      padding: '4px 12px 6px',
                      position: 'relative',
                      color: isActive ? p.color : '#3f4a5a',
                      letterSpacing: '0.12em',
                      fontSize: 11,
                      textShadow: isActive ? `0 0 12px ${p.color}60` : 'none',
                      transition: 'color 0.2s, text-shadow 0.2s',
                    }}
                  >
                    {p.logo ? (
                      <img
                        src={p.logo}
                        alt={p.label}
                        style={{
                          width: 18,
                          height: 18,
                          marginBottom: 2,
                          objectFit: 'contain',
                          opacity: isActive ? 1 : 0.35,
                          filter: isActive ? `drop-shadow(0 0 6px ${p.color}90)` : 'none',
                          transition: 'opacity 0.2s, filter 0.2s',
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: 15, marginBottom: 2, filter: isActive ? `drop-shadow(0 0 6px ${p.color}90)` : 'none', transition: 'filter 0.2s' }}>
                        {p.avatar}
                      </span>
                    )}
                    {p.label}
                    {/* Active bar */}
                    <span style={{
                      position: 'absolute',
                      bottom: 0,
                      left: '12px',
                      right: '12px',
                      height: 2,
                      borderRadius: 1,
                      background: isActive ? p.color : 'transparent',
                      boxShadow: isActive ? `0 0 8px ${p.color}` : 'none',
                      transition: 'background 0.2s, box-shadow 0.2s',
                    }} />
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Center — title + subtitle row */}
        <div className="flex-1 text-center">
          <div
            className="font-condensed font-black uppercase"
            style={{
              fontSize: "clamp(14px, 2.5vw, 22px)",
              letterSpacing: "0.12em",
              color: "#e2e8f0",
            }}
          >
            AI March Madness 2026
          </div>
          <div className="flex items-center justify-center gap-4 mt-1">
            <span
              className="font-condensed text-slate-600"
              style={{ fontSize: 10, letterSpacing: "0.3em" }}
            >
              NCAA Tournament · Bracket Predictions
            </span>
            {hasResults && (
              <>
                <span className="text-slate-700" style={{ fontSize: 10 }}>
                  ·
                </span>
                <span
                  className="font-condensed font-black text-green-400"
                  style={{ fontSize: 12 }}
                >
                  {score.correct}
                </span>
                <span
                  className="font-condensed text-slate-600"
                  style={{ fontSize: 10 }}
                >
                  correct · {score.total} played ·{" "}
                  {score.possible - score.total} remaining
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right — legend */}
        <div
          className="shrink-0 flex gap-3"
          style={{ minWidth: 160, justifyContent: "flex-end" }}
        >
          {[
            { dot: "#22c55e", label: "Correct" },
            { dot: "#ef4444", label: "Wrong" },
            { dot: "#475569", label: "Pending" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span
                className="rounded-full shrink-0"
                style={{ width: 6, height: 6, background: item.dot }}
              />
              <span
                className="font-condensed uppercase text-slate-600"
                style={{ fontSize: 9, letterSpacing: "0.1em" }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 px-4 py-8">
        {/* ── Bracket ── */}
        <div
          className="rounded-2xl"
          style={{
            border: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(15,11,7,0.7)",
            backdropFilter: "blur(12px)",
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
          <p
            className="font-condensed text-slate-700 uppercase tracking-widest"
            style={{ fontSize: 10 }}
          >
            Predictions by {activePicks?.name} · March 18, 2026 · Based on
            KenPom, injury reports & betting odds
          </p>
        </footer>
      </div>
    </div>
  );
}
