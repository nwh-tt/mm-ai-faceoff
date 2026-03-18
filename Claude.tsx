import { useState } from "react";

const REGIONS = {
  east: {
    name: "EAST",
    color: "#2563eb",
    rounds: {
      r64: [
        { seed: 1, team: "Duke", record: "32-2" },
        { seed: 16, team: "Siena", record: "22-12" },
        { seed: 8, team: "Ohio State", record: "20-13" },
        { seed: 9, team: "TCU", record: "21-12" },
        { seed: 5, team: "St. John's", record: "25-8" },
        { seed: 12, team: "UNI", record: "27-7" },
        { seed: 4, team: "Kansas", record: "22-11" },
        { seed: 13, team: "Cal Baptist", record: "24-9" },
        { seed: 6, team: "Louisville", record: "23-10" },
        { seed: 11, team: "South Florida", record: "25-8" },
        { seed: 3, team: "Michigan St.", record: "30-3" },
        { seed: 14, team: "N. Dakota St.", record: "24-10" },
        { seed: 7, team: "UCLA", record: "22-11" },
        { seed: 10, team: "UCF", record: "23-10" },
        { seed: 2, team: "UConn", record: "27-6" },
        { seed: 15, team: "Furman", record: "25-9" },
      ],
      r32: [
        { seed: 1, team: "Duke", why: "Too much talent even shorthanded" },
        { seed: 8, team: "Ohio State", why: "Experience edge over TCU" },
        { seed: 5, team: "St. John's", why: "Pitino's tourney pedigree" },
        { seed: 4, team: "Kansas", why: "Peterson's ceiling is too high" },
        {
          seed: 11,
          team: "South Florida",
          why: "🔥 UPSET — Louisville without Mikel Brown Jr.",
        },
        { seed: 3, team: "Michigan St.", why: "Izzo in March, enough said" },
        {
          seed: 10,
          team: "UCF",
          why: "🔥 UPSET — UCF's athleticism too much for UCLA",
        },
        { seed: 2, team: "UConn", why: "Hurley's championship DNA" },
      ],
      s16: [
        { seed: 1, team: "Duke", why: "Boozer dominates inside" },
        { seed: 4, team: "Kansas", why: "Peterson goes nuclear vs St. John's" },
        { seed: 3, team: "Michigan St.", why: "Fears & Izzo grind down USF" },
        { seed: 2, team: "UConn", why: "Karaban & Ball too experienced" },
      ],
      e8: [
        { seed: 1, team: "Duke", why: "Boozer's Player of the Year push" },
        { seed: 2, team: "UConn", why: "Hurley outcoaches Izzo in a thriller" },
      ],
      regional: [
        {
          seed: 1,
          team: "Duke",
          why: "Boozer wills them to Indy despite injuries",
        },
      ],
    },
  },
  south: {
    name: "SOUTH",
    color: "#dc2626",
    rounds: {
      r64: [
        { seed: 1, team: "Florida", record: "26-7" },
        { seed: 16, team: "PV A&M/Lehigh", record: "TBD" },
        { seed: 8, team: "Clemson", record: "21-12" },
        { seed: 9, team: "Iowa", record: "22-11" },
        { seed: 5, team: "Vanderbilt", record: "24-9" },
        { seed: 12, team: "McNeese", record: "28-5" },
        { seed: 4, team: "Nebraska", record: "24-9" },
        { seed: 13, team: "Troy", record: "26-8" },
        { seed: 6, team: "North Carolina", record: "21-12" },
        { seed: 11, team: "VCU", record: "27-7" },
        { seed: 3, team: "Illinois", record: "23-10" },
        { seed: 14, team: "Penn", record: "22-8" },
        { seed: 7, team: "Saint Mary's", record: "26-7" },
        { seed: 10, team: "Texas A&M", record: "22-12" },
        { seed: 2, team: "Houston", record: "28-5" },
        { seed: 15, team: "Idaho", record: "24-10" },
      ],
      r32: [
        { seed: 1, team: "Florida", why: "Defending champs roll early" },
        {
          seed: 9,
          team: "Iowa",
          why: "🔥 UPSET — Iowa's offense clicks vs Clemson",
        },
        { seed: 5, team: "Vanderbilt", why: "Too athletic for McNeese" },
        { seed: 4, team: "Nebraska", why: "Survive a scrappy Troy team" },
        {
          seed: 11,
          team: "VCU",
          why: "🔥 UPSET — UNC without Caleb Wilson is cooked",
        },
        { seed: 3, team: "Illinois", why: "Wagler's shooting buries Penn" },
        {
          seed: 10,
          team: "Texas A&M",
          why: "🔥 UPSET — Tempo pushes past Saint Mary's",
        },
        { seed: 2, team: "Houston", why: "Flemings puts on a show" },
      ],
      s16: [
        { seed: 1, team: "Florida", why: "Frontcourt dominates Iowa" },
        { seed: 4, team: "Nebraska", why: "Grinds past Vandy in a war" },
        { seed: 3, team: "Illinois", why: "Wagler cooks VCU from deep" },
        { seed: 2, team: "Houston", why: "Flemings & vets handle A&M" },
      ],
      e8: [
        { seed: 1, team: "Florida", why: "Title experience carries the day" },
        {
          seed: 2,
          team: "Houston",
          why: "Flemings + home court in Toyota Center",
        },
      ],
      regional: [
        {
          seed: 2,
          team: "Houston",
          why: "🔥 UPSET — Revenge game in their building. Flemings > Haugh",
        },
      ],
    },
  },
  west: {
    name: "WEST",
    color: "#16a34a",
    rounds: {
      r64: [
        { seed: 1, team: "Arizona", record: "30-2" },
        { seed: 16, team: "LIU", record: "20-14" },
        { seed: 8, team: "Villanova", record: "24-8" },
        { seed: 9, team: "Utah State", record: "28-6" },
        { seed: 5, team: "Wisconsin", record: "23-10" },
        { seed: 12, team: "High Point", record: "28-5" },
        { seed: 4, team: "Arkansas", record: "24-9" },
        { seed: 13, team: "Hawai'i", record: "22-11" },
        { seed: 6, team: "BYU", record: "23-10" },
        { seed: 11, team: "Texas", record: "20-13" },
        { seed: 3, team: "Gonzaga", record: "30-4" },
        { seed: 14, team: "Kennesaw St.", record: "25-9" },
        { seed: 7, team: "Miami (FL)", record: "21-12" },
        { seed: 10, team: "Missouri", record: "21-12" },
        { seed: 2, team: "Purdue", record: "27-7" },
        { seed: 15, team: "Queens", record: "26-7" },
      ],
      r32: [
        { seed: 1, team: "Arizona", why: "Burries & Peat dominate" },
        { seed: 9, team: "Utah State", why: "Mountain West champs edge Nova" },
        {
          seed: 12,
          team: "High Point",
          why: "🔥 UPSET — 90 PPG & 11 steals/game buries Wiscy",
        },
        { seed: 4, team: "Arkansas", why: "Calipari survives... barely" },
        { seed: 6, team: "BYU", why: "Handles Texas in a tight one" },
        { seed: 3, team: "Gonzaga", why: "Ike is unstoppable inside" },
        {
          seed: 10,
          team: "Missouri",
          why: "🔥 UPSET — Mizzou catches fire vs cold Miami",
        },
        { seed: 2, team: "Purdue", why: "Braden Smith breaks assist record" },
      ],
      s16: [
        { seed: 1, team: "Arizona", why: "Too deep for Utah State" },
        {
          seed: 4,
          team: "Arkansas",
          why: "Calipari's curse... almost. Survives High Point",
        },
        { seed: 3, team: "Gonzaga", why: "Ike & Huff (if back) cruise" },
        { seed: 2, team: "Purdue", why: "Smith orchestrates clinic vs Mizzou" },
      ],
      e8: [
        { seed: 1, team: "Arizona", why: "Wildcats too balanced for Hogs" },
        {
          seed: 2,
          team: "Purdue",
          why: "Smith vs Gonzaga in a classic. Boilers pull away late",
        },
      ],
      regional: [
        {
          seed: 1,
          team: "Arizona",
          why: "Best roster in America. Burries goes off for 30",
        },
      ],
    },
  },
  midwest: {
    name: "MIDWEST",
    color: "#9333ea",
    rounds: {
      r64: [
        { seed: 1, team: "Michigan", record: "29-4" },
        { seed: 16, team: "Howard", record: "17-16" },
        { seed: 8, team: "Georgia", record: "20-13" },
        { seed: 9, team: "Saint Louis", record: "24-9" },
        { seed: 5, team: "Texas Tech", record: "23-10" },
        { seed: 12, team: "Akron", record: "26-8" },
        { seed: 4, team: "Alabama", record: "22-11" },
        { seed: 13, team: "Hofstra", record: "27-7" },
        { seed: 6, team: "Tennessee", record: "22-11" },
        { seed: 11, team: "SMU/MiamiOH", record: "TBD" },
        { seed: 3, team: "Virginia", record: "24-9" },
        { seed: 14, team: "Wright State", record: "18-11" },
        { seed: 7, team: "Kentucky", record: "20-13" },
        { seed: 10, team: "Santa Clara", record: "25-8" },
        { seed: 2, team: "Iowa State", record: "27-6" },
        { seed: 15, team: "Tenn. State", record: "23-10" },
      ],
      r32: [
        { seed: 1, team: "Michigan", why: "Lendeborg feasts on Howard" },
        { seed: 9, team: "Saint Louis", why: "Billikens' defense stymies UGA" },
        {
          seed: 12,
          team: "Akron",
          why: "🔥 UPSET — TTU fragile without Toppin, Anderson banged up",
        },
        { seed: 4, team: "Alabama", why: "Survive Hofstra's run — barely" },
        { seed: 6, team: "Tennessee", why: "Barnes' team grinds it out" },
        {
          seed: 3,
          team: "Virginia",
          why: "Onyenso blocks everything in sight",
        },
        {
          seed: 10,
          team: "Santa Clara",
          why: "🔥 UPSET — 3PT barrage buries 13-loss Kentucky",
        },
        { seed: 2, team: "Iowa State", why: "Momcilovic rains threes" },
      ],
      s16: [
        { seed: 1, team: "Michigan", why: "Size advantage too much for SLU" },
        { seed: 4, team: "Alabama", why: "Offense overwhelms Akron" },
        { seed: 3, team: "Virginia", why: "Onyenso anchors D vs Tennessee" },
        {
          seed: 2,
          team: "Iowa State",
          why: "Momcilovic stays hot vs Santa Clara",
        },
      ],
      e8: [
        { seed: 1, team: "Michigan", why: "Lendeborg & big men dominate Bama" },
        {
          seed: 2,
          team: "Iowa State",
          why: "🔥 UPSET — Virginia's offense can't keep up",
        },
      ],
      regional: [
        {
          seed: 1,
          team: "Michigan",
          why: "Size wins. Wolverines grind down Cyclones",
        },
      ],
    },
  },
};

const FINAL_FOUR = {
  semi1: {
    teams: ["Duke", "Houston"],
    winner: "Houston",
    why: "Flemings goes nuclear. Houston's defense smothers injured Duke",
  },
  semi2: {
    teams: ["Arizona", "Michigan"],
    winner: "Arizona",
    why: "Burries & Peat outclass Michigan's bigs with versatility",
  },
  final: {
    teams: ["Houston", "Arizona"],
    winner: "Arizona",
    why: "🏆 Wildcats' depth & health prevail. Burries = MOP",
  },
};

const UPSET_PICKS = [
  {
    matchup: "(11) South Florida over (6) Louisville",
    reason:
      "Louisville's star Mikel Brown Jr. is OUT. USF has the defense to capitalize.",
  },
  {
    matchup: "(10) UCF over (7) UCLA",
    reason:
      "UCF's length and athleticism creates matchup nightmares for the Bruins.",
  },
  {
    matchup: "(11) VCU over (6) North Carolina",
    reason:
      "UNC lost Caleb Wilson (broken thumb). VCU won 16 of 17. Hill Jr. shoots the lights out.",
  },
  {
    matchup: "(10) Texas A&M over (7) Saint Mary's",
    reason:
      "A&M's tempo at 87.7 PPG overwhelms Saint Mary's preferred slow pace.",
  },
  {
    matchup: "(12) High Point over (5) Wisconsin",
    reason:
      "90 PPG, 11 steals/game. Relentless pressure that Wisconsin can't handle.",
  },
  {
    matchup: "(12) Akron over (5) Texas Tech",
    reason:
      "Tech lost Toppin to ACL, Anderson is banged up. Akron smells blood.",
  },
  {
    matchup: "(10) Santa Clara over (7) Kentucky",
    reason:
      "Kentucky has 13 losses. Santa Clara's volume 3PT shooting is lethal in March.",
  },
  {
    matchup: "(2) Houston over (1) Florida — Elite Eight",
    reason:
      "Regional is IN Houston's Toyota Center. Flemings gets revenge for last year's title game loss.",
  },
];

function MatchupRow({ higher, lower, winner, isUpset }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 11,
        padding: "3px 6px",
        borderRadius: 4,
        background: isUpset ? "rgba(251, 191, 36, 0.08)" : "transparent",
        borderLeft: isUpset ? "2px solid #f59e0b" : "2px solid transparent",
      }}
    >
      <span
        style={{
          fontWeight: winner === higher.team ? 700 : 400,
          opacity: winner === higher.team ? 1 : 0.5,
          color: "var(--text)",
        }}
      >
        ({higher.seed}) {higher.team}
      </span>
      <span style={{ color: "var(--muted)", fontSize: 9 }}>vs</span>
      <span
        style={{
          fontWeight: winner === lower.team ? 700 : 400,
          opacity: winner === lower.team ? 1 : 0.5,
          color: winner === lower.team ? "#f59e0b" : "var(--text)",
        }}
      >
        ({lower.seed}) {lower.team}
      </span>
      {isUpset && <span style={{ fontSize: 9 }}>🔥</span>}
    </div>
  );
}

function RegionBracket({ region, data }) {
  const r64 = data.rounds.r64;
  const r32 = data.rounds.r32;
  const s16 = data.rounds.s16;
  const e8 = data.rounds.e8;
  const champ = data.rounds.regional[0];

  return (
    <div
      style={{
        background: "var(--card-bg)",
        borderRadius: 10,
        padding: 16,
        border: "1px solid var(--border)",
        flex: "1 1 340px",
        minWidth: 320,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
          borderBottom: `2px solid ${data.color}`,
          paddingBottom: 8,
        }}
      >
        <div
          style={{
            background: data.color,
            color: "#fff",
            fontWeight: 800,
            fontSize: 11,
            padding: "3px 10px",
            borderRadius: 4,
            fontFamily: "'Oswald', sans-serif",
            letterSpacing: 1.5,
          }}
        >
          {data.name}
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: data.color,
            fontFamily: "'Oswald', sans-serif",
          }}
        >
          → {champ.team} to Final Four
        </div>
      </div>

      <div
        style={{
          fontSize: 10,
          color: "var(--muted)",
          fontWeight: 600,
          marginBottom: 4,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        Round of 64
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          marginBottom: 10,
        }}
      >
        {Array.from({ length: 8 }, (_, i) => {
          const hi = r64[i * 2];
          const lo = r64[i * 2 + 1];
          const w = r32[i];
          const isUpset = w.seed > Math.min(hi.seed, lo.seed) + 2;
          return (
            <MatchupRow
              key={i}
              higher={hi}
              lower={lo}
              winner={w.team}
              isUpset={isUpset || w.why?.includes("UPSET")}
            />
          );
        })}
      </div>

      <div
        style={{
          fontSize: 10,
          color: "var(--muted)",
          fontWeight: 600,
          marginBottom: 4,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        Round of 32
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          marginBottom: 10,
        }}
      >
        {Array.from({ length: 4 }, (_, i) => {
          const hi = r32[i * 2];
          const lo = r32[i * 2 + 1];
          const w = s16[i];
          return (
            <MatchupRow
              key={i}
              higher={hi}
              lower={lo}
              winner={w.team}
              isUpset={w.why?.includes("UPSET")}
            />
          );
        })}
      </div>

      <div
        style={{
          fontSize: 10,
          color: "var(--muted)",
          fontWeight: 600,
          marginBottom: 4,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        Sweet 16
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          marginBottom: 10,
        }}
      >
        {Array.from({ length: 2 }, (_, i) => {
          const hi = s16[i * 2];
          const lo = s16[i * 2 + 1];
          const w = e8[i];
          return (
            <MatchupRow
              key={i}
              higher={hi}
              lower={lo}
              winner={w.team}
              isUpset={w.why?.includes("UPSET")}
            />
          );
        })}
      </div>

      <div
        style={{
          fontSize: 10,
          color: "var(--muted)",
          fontWeight: 600,
          marginBottom: 4,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        Elite 8
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 11,
          padding: "4px 8px",
          borderRadius: 4,
          background: `${data.color}15`,
          border: `1px solid ${data.color}30`,
        }}
      >
        <span style={{ fontWeight: 700, color: "var(--text)" }}>
          ({e8[0].seed}) {e8[0].team}
        </span>
        <span style={{ color: "var(--muted)", fontSize: 9 }}>vs</span>
        <span style={{ fontWeight: 700, color: "var(--text)" }}>
          ({e8[1].seed}) {e8[1].team}
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontWeight: 800,
            color: data.color,
            fontSize: 10,
          }}
        >
          → {champ.team}
        </span>
      </div>
      <div
        style={{
          fontSize: 10,
          color: "var(--muted)",
          marginTop: 4,
          fontStyle: "italic",
        }}
      >
        {champ.why}
      </div>
    </div>
  );
}

export default function MarchMadnessBracket() {
  const [tab, setTab] = useState("bracket");

  return (
    <div
      style={{
        "--bg": "#0a0a0f",
        "--card-bg": "#12121a",
        "--text": "#e8e6e3",
        "--muted": "#6b7280",
        "--border": "#1e1e2e",
        "--accent": "#f59e0b",
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "'Inter', -apple-system, sans-serif",
        minHeight: "100vh",
        padding: 16,
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
            background:
              "linear-gradient(135deg, #f59e0b, #ef4444, #8b5cf6, #3b82f6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          March Madness 2026
        </div>
        <div
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: 14,
            letterSpacing: 2,
            color: "var(--muted)",
            textTransform: "uppercase",
            marginTop: 2,
          }}
        >
          Claude's Complete Bracket Predictions
        </div>
        <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 6 }}>
          8 first-round upsets • Houston over Florida in the Elite Eight •
          Arizona cuts down the nets
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          justifyContent: "center",
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        {[
          { id: "bracket", label: "Full Bracket" },
          { id: "upsets", label: "Upset Picks" },
          { id: "ff", label: "Final Four" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "6px 16px",
              borderRadius: 6,
              border: "1px solid var(--border)",
              background: tab === t.id ? "var(--accent)" : "var(--card-bg)",
              color: tab === t.id ? "#000" : "var(--text)",
              fontWeight: 600,
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "'Oswald', sans-serif",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Bracket Tab */}
      {tab === "bracket" && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "center",
          }}
        >
          {Object.entries(REGIONS).map(([key, data]) => (
            <RegionBracket key={key} region={key} data={data} />
          ))}
        </div>
      )}

      {/* Upsets Tab */}
      {tab === "upsets" && (
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: 18,
              fontWeight: 700,
              color: "var(--accent)",
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            🔥 8 Upset Picks 🔥
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {UPSET_PICKS.map((u, i) => (
              <div
                key={i}
                style={{
                  background: "var(--card-bg)",
                  borderRadius: 8,
                  padding: 12,
                  border: "1px solid var(--border)",
                  borderLeft: "3px solid var(--accent)",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: "var(--accent)",
                    marginBottom: 4,
                  }}
                >
                  {u.matchup}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--muted)",
                    lineHeight: 1.5,
                  }}
                >
                  {u.reason}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 16,
              padding: 12,
              background: "var(--card-bg)",
              borderRadius: 8,
              border: "1px solid var(--border)",
              fontSize: 11,
              color: "var(--muted)",
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: "var(--text)" }}>Upset Strategy:</strong>{" "}
            I'm targeting injury situations (Louisville without Brown, UNC
            without Wilson, Texas Tech without Toppin), tempo mismatches (Texas
            A&M's pace vs Saint Mary's, High Point's chaos vs Wisconsin), and
            3-point shooting variance (Santa Clara's volume from deep vs a
            13-loss Kentucky). The biggest swing is Houston over Florida in the
            Elite Eight — playing in their own Toyota Center with a roster built
            to avenge last year's title game loss.
          </div>
        </div>
      )}

      {/* Final Four Tab */}
      {tab === "ff" && (
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <div
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: 18,
              fontWeight: 700,
              color: "var(--accent)",
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            Final Four — Indianapolis
          </div>

          {/* Semifinal 1 */}
          <div
            style={{
              background: "var(--card-bg)",
              borderRadius: 10,
              padding: 16,
              border: "1px solid var(--border)",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 6,
                fontWeight: 600,
              }}
            >
              Semifinal 1 — Saturday, April 4
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: 10,
                  borderRadius: 8,
                  background:
                    FINAL_FOUR.semi1.winner === "Duke"
                      ? "#2563eb20"
                      : "transparent",
                  border:
                    FINAL_FOUR.semi1.winner === "Duke"
                      ? "1px solid #2563eb50"
                      : "1px solid transparent",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 700,
                    fontSize: 16,
                    color: "#2563eb",
                  }}
                >
                  DUKE
                </div>
                <div style={{ fontSize: 10, color: "var(--muted)" }}>
                  (1) East
                </div>
              </div>
              <div
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: 12,
                  color: "var(--muted)",
                }}
              >
                VS
              </div>
              <div
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: 10,
                  borderRadius: 8,
                  background:
                    FINAL_FOUR.semi1.winner === "Houston"
                      ? "#dc262620"
                      : "transparent",
                  border:
                    FINAL_FOUR.semi1.winner === "Houston"
                      ? "1px solid #dc262650"
                      : "1px solid transparent",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 700,
                    fontSize: 16,
                    color: "#dc2626",
                  }}
                >
                  HOUSTON
                </div>
                <div style={{ fontSize: 10, color: "var(--muted)" }}>
                  (2) South
                </div>
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#dc2626" }}>
                → Houston advances
              </span>
              <div
                style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}
              >
                {FINAL_FOUR.semi1.why}
              </div>
            </div>
          </div>

          {/* Semifinal 2 */}
          <div
            style={{
              background: "var(--card-bg)",
              borderRadius: 10,
              padding: 16,
              border: "1px solid var(--border)",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 6,
                fontWeight: 600,
              }}
            >
              Semifinal 2 — Saturday, April 4
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: 10,
                  borderRadius: 8,
                  background:
                    FINAL_FOUR.semi2.winner === "Arizona"
                      ? "#16a34a20"
                      : "transparent",
                  border:
                    FINAL_FOUR.semi2.winner === "Arizona"
                      ? "1px solid #16a34a50"
                      : "1px solid transparent",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 700,
                    fontSize: 16,
                    color: "#16a34a",
                  }}
                >
                  ARIZONA
                </div>
                <div style={{ fontSize: 10, color: "var(--muted)" }}>
                  (1) West
                </div>
              </div>
              <div
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: 12,
                  color: "var(--muted)",
                }}
              >
                VS
              </div>
              <div
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: 10,
                  borderRadius: 8,
                  background:
                    FINAL_FOUR.semi2.winner === "Michigan"
                      ? "#9333ea20"
                      : "transparent",
                  border:
                    FINAL_FOUR.semi2.winner === "Michigan"
                      ? "1px solid #9333ea50"
                      : "1px solid transparent",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 700,
                    fontSize: 16,
                    color: "#9333ea",
                  }}
                >
                  MICHIGAN
                </div>
                <div style={{ fontSize: 10, color: "var(--muted)" }}>
                  (1) Midwest
                </div>
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#16a34a" }}>
                → Arizona advances
              </span>
              <div
                style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}
              >
                {FINAL_FOUR.semi2.why}
              </div>
            </div>
          </div>

          {/* Championship */}
          <div
            style={{
              background: "linear-gradient(135deg, #1a1a2e, #16213e)",
              borderRadius: 12,
              padding: 20,
              marginTop: 16,
              border: "1px solid var(--accent)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: 12,
                color: "var(--accent)",
                textTransform: "uppercase",
                letterSpacing: 2,
                marginBottom: 10,
                fontWeight: 600,
              }}
            >
              National Championship — April 6
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                marginBottom: 12,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 700,
                    fontSize: 20,
                    color: "#dc2626",
                  }}
                >
                  HOUSTON
                </div>
                <div style={{ fontSize: 10, color: "var(--muted)" }}>
                  (2) South
                </div>
              </div>
              <div
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: 14,
                  color: "var(--accent)",
                }}
              >
                VS
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 700,
                    fontSize: 20,
                    color: "#16a34a",
                  }}
                >
                  ARIZONA
                </div>
                <div style={{ fontSize: 10, color: "var(--muted)" }}>
                  (1) West
                </div>
              </div>
            </div>
            <div
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: 24,
                fontWeight: 700,
                color: "var(--accent)",
                letterSpacing: 2,
                marginBottom: 4,
              }}
            >
              🏆 ARIZONA 🏆
            </div>
            <div style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>
              National Champions
            </div>
            <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4 }}>
              {FINAL_FOUR.final.why}
            </div>
            <div
              style={{
                marginTop: 12,
                fontSize: 11,
                color: "var(--muted)",
                lineHeight: 1.6,
                textAlign: "left",
                padding: "10px 12px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: 8,
              }}
            >
              <strong style={{ color: "var(--text)" }}>
                Championship Thesis:
              </strong>{" "}
              Arizona is the most complete team in the field — elite guard play
              (Burries, Bradley), a dominant freshman forward (Peat), a proven
              sixth man (Dell'Orso), and no significant injuries. They've won 9
              straight including wins over Kansas, Houston, and Iowa State
              (twice). Houston is the toughest opponent they could face, but
              Arizona's depth and versatility on both ends gives them the edge
              in a tight championship game. Brayden Burries earns Most
              Outstanding Player honors.
            </div>
          </div>

          {/* Final Four Summary */}
          <div
            style={{
              marginTop: 16,
              padding: 12,
              background: "var(--card-bg)",
              borderRadius: 8,
              border: "1px solid var(--border)",
              fontSize: 11,
              color: "var(--muted)",
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: "var(--text)" }}>Final Four:</strong> (1)
            Duke vs (2) Houston • (1) Arizona vs (1) Michigan
            <br />
            <strong style={{ color: "var(--text)" }}>Championship:</strong>{" "}
            Houston vs Arizona
            <br />
            <strong style={{ color: "var(--accent)" }}>
              Champion: Arizona Wildcats
            </strong>
            <br />
            <strong style={{ color: "var(--text)" }}>MOP:</strong> Brayden
            Burries
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          marginTop: 20,
          fontSize: 10,
          color: "var(--muted)",
          borderTop: "1px solid var(--border)",
          paddingTop: 12,
        }}
      >
        Predictions by Claude (Opus 4.6) • March 18, 2026 • Based on current
        injury reports, KenPom data, betting odds & expert analysis
      </div>
    </div>
  );
}
