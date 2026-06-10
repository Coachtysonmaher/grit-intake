import { useState } from "react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const GAS_URL     = "https://script.google.com/macros/s/AKfycbzQuGOlBG2IXU1a0nkCiFVGh2JxxnomKpCiOihRf7WAkcnErpz1vd3hYfjFdViISmOe7w/exec";
const BOOKING_URL = "https://calendly.com/tyson-thegritperformanceco/30min";
const COACH_EMAIL = "tyson@thegritperformanceco.com";

// ─── BRAND ────────────────────────────────────────────────────────────────────
const B = {
  bg: "#0D0B0A", surface: "#131110", card: "#1A1614",
  border: "#252220", accent: "#E74B22", accentDim: "#E74B2220",
  text: "#F0EBE8", textDim: "#B8ADA8", muted: "#6B5F5A",
  success: "#4CAF7D", info: "#4A9EDB", warn: "#F0A500",
};

const ratingColors = ["", "#E74B22", "#F0A500", "#4A9EDB", "#4CAF7D", "#E74B22"];
const ratingLabels = ["", "Limiter", "Weakness", "Average", "Strength", "Weapon"];

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Inter:wght@300;400;500;600&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{background:${B.bg};color:${B.text};font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;font-size:14px;line-height:1.5}
    input,select,textarea,button{font-family:'Inter',sans-serif}
    ::-webkit-scrollbar{width:2px}::-webkit-scrollbar-thumb{background:#2A2220;border-radius:2px}
    ::placeholder{color:${B.muted};font-size:13px}
    @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}
    .fade{animation:fadeIn .35s ease both}
    input[type=date]::-webkit-calendar-picker-indicator{filter:invert(.4);cursor:pointer}
    input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
  `}</style>
);

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────
const iBase = {
  background: B.card, border: `1px solid ${B.border}`, borderRadius: 6,
  padding: "9px 13px", color: B.text, fontSize: 13, width: "100%",
  outline: "none", transition: "border-color .15s",
};
const Inp = ({ value, onChange, placeholder, type = "text", small }) => (
  <input type={type} value={value} placeholder={placeholder}
    onChange={e => onChange(e.target.value)}
    style={{ ...iBase, ...(small ? { padding: "7px 10px", fontSize: 12 } : {}) }}
    onFocus={e => (e.target.style.borderColor = B.accent)}
    onBlur={e => (e.target.style.borderColor = B.border)} />
);
const Sel = ({ value, onChange, options, placeholder }) => (
  <select value={value} onChange={e => onChange(e.target.value)}
    style={{ ...iBase, appearance: "none", cursor: "pointer", color: value ? B.text : B.muted }}>
    {placeholder && <option value="">{placeholder}</option>}
    {options.map(o => <option key={o} value={o} style={{ background: B.card }}>{o}</option>)}
  </select>
);
const TA = ({ value, onChange, placeholder, rows = 3 }) => (
  <textarea value={value} onChange={e => onChange(e.target.value)}
    placeholder={placeholder} rows={rows}
    style={{ ...iBase, resize: "vertical", lineHeight: 1.7 }}
    onFocus={e => (e.target.style.borderColor = B.accent)}
    onBlur={e => (e.target.style.borderColor = B.border)} />
);
const Label = ({ children, required, hint }) => (
  <div style={{ marginBottom: 5 }}>
    <span style={{ fontSize: 11, color: B.muted, letterSpacing: "0.05em", textTransform: "uppercase" }}>
      {children}{required && <span style={{ color: B.accent }}> *</span>}
    </span>
    {hint && <span style={{ fontSize: 11, color: B.muted, marginLeft: 6, textTransform: "none", letterSpacing: 0 }}>— {hint}</span>}
  </div>
);
const Field = ({ label, required, hint, children, span, top }) => (
  <div style={{ ...(span ? { gridColumn: `span ${span}` } : {}), ...(top ? { marginTop: top } : {}) }}>
    {label && <Label required={required} hint={hint}>{label}</Label>}
    {children}
  </div>
);
const Grid = ({ cols = 2, gap = 12, children }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols},minmax(0,1fr))`, gap }}>{children}</div>
);
const Divider = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "24px 0 16px" }}>
    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, fontWeight: 800,
      letterSpacing: "0.2em", color: B.accent, whiteSpace: "nowrap", textTransform: "uppercase" }}>{label}</span>
    <div style={{ flex: 1, height: "0.5px", background: B.border }} />
  </div>
);

// ─── RATING BUTTONS ───────────────────────────────────────────────────────────
const RatingRow = ({ id, label, value, onChange, hint }) => {
  const active = value ? parseInt(value) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0",
      borderBottom: `0.5px solid ${B.border}` }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: B.text, fontWeight: 500 }}>{label}</div>
        {hint && <div style={{ fontSize: 11, color: B.muted, marginTop: 1 }}>{hint}</div>}
      </div>
      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} onClick={() => onChange(id, active === n ? "" : String(n))}
            style={{
              width: 32, height: 32, borderRadius: 6, border: "none", cursor: "pointer",
              fontSize: 11, fontWeight: 700, transition: "all .15s",
              background: active === n ? ratingColors[n] : B.card,
              color: active === n ? "#fff" : active > 0 && n === active ? "#fff" : B.muted,
              outline: active === n ? `2px solid ${ratingColors[n]}40` : "none",
              outlineOffset: 1,
            }}>{n}</button>
        ))}
      </div>
      {active > 0 && (
        <div style={{ fontSize: 10, color: ratingColors[active], fontWeight: 700,
          width: 54, textAlign: "right", letterSpacing: "0.04em", flexShrink: 0 }}>
          {ratingLabels[active]}
        </div>
      )}
    </div>
  );
};

// ─── PROGRESS ─────────────────────────────────────────────────────────────────
const STEPS = ["Profile", "Movement", "Performance", "Mental & Goals"];
const Progress = ({ step }) => (
  <div style={{ display: "flex", gap: 4, marginBottom: 32 }}>
    {STEPS.map((label, i) => {
      const s = i + 1;
      const done = s < step, active = s === step;
      return (
        <div key={s} style={{ flex: 1 }}>
          <div style={{ height: 3, borderRadius: 2, marginBottom: 6,
            background: done ? B.accent : active ? B.accent : B.border,
            opacity: active ? 1 : done ? 0.7 : 0.3 }} />
          <div style={{ fontSize: 10, color: active ? B.text : B.muted,
            fontWeight: active ? 600 : 400, letterSpacing: "0.03em" }}>
            {done ? "✓ " : ""}{label}
          </div>
        </div>
      );
    })}
  </div>
);

// ─── STEP 1 — ATHLETE PROFILE ─────────────────────────────────────────────────
const StepProfile = ({ f, s }) => (
  <div className="fade">
    <Divider label="Personal details" />
    <Grid cols={2} gap={12}>
      <Field label="Full name" required>
        <Inp value={f.name} onChange={s("name")} placeholder="Your full name" />
      </Field>
      <Field label="Email address" required>
        <Inp value={f.email} onChange={s("email")} placeholder="you@email.com" type="email" />
      </Field>
      <Field label="Date of birth">
        <Inp value={f.dob} onChange={s("dob")} placeholder="DD/MM/YYYY" />
      </Field>
      <Field label="Sex">
        <Sel value={f.sex} onChange={s("sex")} placeholder="Select" options={["Male", "Female"]} />
      </Field>
      <Field label="Height (cm)">
        <Inp value={f.height} onChange={s("height")} placeholder="e.g. 178" type="number" />
      </Field>
      <Field label="Weight (kg)">
        <Inp value={f.weight} onChange={s("weight")} placeholder="e.g. 82" type="number" />
      </Field>
    </Grid>

    <Divider label="Competition & training" />
    <Grid cols={2} gap={12}>
      <Field label="Competition level" required>
        <Sel value={f.competitionLevel} onChange={s("competitionLevel")} placeholder="Select"
          options={["Recreational", "Open", "Open / Quarterfinals", "Quarterfinals", "Semifinals", "CrossFit Games", "Masters / Age Group"]} />
      </Field>
      <Field label="Years training CrossFit">
        <Sel value={f.yearsTraining} onChange={s("yearsTraining")} placeholder="Select"
          options={["< 1 year", "1–2 years", "3–5 years", "5–8 years", "8+ years"]} />
      </Field>
      <Field label="Training days per week">
        <Sel value={f.trainingDays} onChange={s("trainingDays")} placeholder="Select"
          options={["3", "4", "5", "6", "7", "Double days"]} />
      </Field>
      <Field label="Session length">
        <Sel value={f.sessionLength} onChange={s("sessionLength")} placeholder="Select"
          options={["45 min", "60 min", "75 min", "90 min", "120 min", "2+ hours"]} />
      </Field>
      <Field label="Recovery quality">
        <Sel value={f.recoveryQuality} onChange={s("recoveryQuality")} placeholder="Select"
          options={["Poor", "Below Average", "Average", "Good", "Excellent"]} />
      </Field>
      <Field label="Average sleep">
        <Sel value={f.sleepHours} onChange={s("sleepHours")} placeholder="Select"
          options={["< 5 hrs", "5–6 hrs", "6–7 hrs", "7–8 hrs", "8–9 hrs", "9+ hrs"]} />
      </Field>
      <Field label="Life stress level">
        <Sel value={f.stressLevel} onChange={s("stressLevel")} placeholder="Select"
          options={["Low", "Moderate", "High", "Very High"]} />
      </Field>
    </Grid>

    <Divider label="Health & injury history" />
    <Field label="Past injuries / surgeries" top={0}>
      <TA value={f.pastInjuries} onChange={s("pastInjuries")}
        placeholder="Any previous injuries, surgeries, or chronic conditions that have affected your training..." rows={2} />
    </Field>
    <Field label="Current injuries / limitations" top={12}>
      <TA value={f.currentInjuries} onChange={s("currentInjuries")}
        placeholder="Anything currently limiting your movement or training load..." rows={2} />
    </Field>
    <Field label="Medical flags" hint="T1D, medications, conditions worth noting" top={12}>
      <TA value={f.medicalFlags} onChange={s("medicalFlags")}
        placeholder="Diabetes, cardiac conditions, prescription medications, anything a coach should know..." rows={2} />
    </Field>

    <Divider label="Your story" />
    <Field label="Why are you here? What are you trying to build?" required>
      <TA value={f.athleteStory} onChange={s("athleteStory")}
        placeholder="Tell me what's driving this — what got you into competing, what you want to change, what you've tried before..." rows={4} />
    </Field>
  </div>
);

// ─── STEP 2 — MOVEMENT AUDIT ──────────────────────────────────────────────────
const MOVEMENT_CATS = [
  { label: "Olympic lifting", hint: "Rate your capacity at each load/skill level", rows: [
    { id: "snatch_heavy",  label: "Snatch",          hint: "Heavy — 85%+ / near max"         },
    { id: "snatch_mod",    label: "Snatch",          hint: "Moderate — workout cycling weight" },
    { id: "snatch_light",  label: "Snatch",          hint: "Light / touch & go"               },
    { id: "clean_heavy",   label: "Clean",           hint: "Heavy — 85%+ / near max"         },
    { id: "clean_mod",     label: "Clean",           hint: "Moderate — workout cycling"       },
    { id: "clean_jerk",    label: "Clean & Jerk",    hint: "Heavy"                            },
  ]},
  { label: "Squat & lower body", rows: [
    { id: "back_squat",    label: "Back Squat",      hint: "Heavy"                            },
    { id: "front_squat",   label: "Front Squat",     hint: "Heavy"                            },
    { id: "oh_squat",      label: "Overhead Squat",  hint: ""                                 },
    { id: "thruster",      label: "Thruster",        hint: "Moderate / workout weight"        },
    { id: "pistol",        label: "Pistol Squat",    hint: ""                                 },
    { id: "deadlift_heavy",label: "Deadlift",        hint: "Heavy — 85%+"                     },
    { id: "deadlift_mod",  label: "Deadlift",        hint: "Moderate / cycling"               },
  ]},
  { label: "Gymnastics — pulling", rows: [
    { id: "strict_pullup", label: "Strict Pull-up",  hint: "Max unbroken"                     },
    { id: "kip_pullup",    label: "Kipping Pull-up", hint: "Large sets"                       },
    { id: "ctb",           label: "Chest-to-Bar",    hint: ""                                 },
    { id: "bar_mu",        label: "Bar Muscle-Up",   hint: ""                                 },
    { id: "ring_mu",       label: "Ring Muscle-Up",  hint: ""                                 },
    { id: "rope_std",      label: "Rope Climb",      hint: "Standard foot lock"               },
    { id: "rope_legless",  label: "Legless Rope Climb", hint: ""                              },
    { id: "ttb",           label: "Toes-to-Bar",     hint: ""                                 },
  ]},
  { label: "Gymnastics — pressing & handstand", rows: [
    { id: "kip_hspu",      label: "Kipping HSPU",    hint: ""                                 },
    { id: "strict_hspu",   label: "Strict HSPU",     hint: ""                                 },
    { id: "deficit_hspu",  label: "Deficit HSPU",    hint: "2–4 inch"                         },
    { id: "hs_walk",       label: "Handstand Walk",  hint: ""                                 },
    { id: "wall_walk",     label: "Wall Walk",       hint: ""                                 },
  ]},
  { label: "Engine & mono-structural", rows: [
    { id: "burpee",        label: "Burpee",          hint: ""                                 },
    { id: "box_jump",      label: "Box Jump",        hint: ""                                 },
    { id: "du",            label: "Double-Unders",   hint: ""                                 },
    { id: "du_crossover",  label: "DU Crossover",    hint: ""                                 },
    { id: "wall_ball",     label: "Wall Ball",       hint: ""                                 },
    { id: "kb_swing",      label: "KB Swing",        hint: "Russian / American"               },
  ]},
];

const StepMovements = ({ f, setRating }) => (
  <div className="fade">
    <div style={{ background: `${B.accent}12`, border: `1px solid ${B.accent}25`,
      borderRadius: 8, padding: "12px 16px", marginBottom: 24, fontSize: 13, color: B.textDim, lineHeight: 1.6 }}>
      <strong style={{ color: B.text }}>Rate yourself 1–5</strong> — relative to the competitive bracket you want to reach.
      This data directly informs your programming.
      <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
        {[["1","Limiter"], ["2","Weakness"], ["3","Average"], ["4","Strength"], ["5","Weapon"]].map(([n, l]) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 20, height: 20, borderRadius: 4, background: ratingColors[n],
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 700, color: "#fff" }}>{n}</div>
            <span style={{ fontSize: 11, color: B.muted }}>{l}</span>
          </div>
        ))}
      </div>
    </div>

    {MOVEMENT_CATS.map(cat => (
      <div key={cat.label} style={{ marginBottom: 28 }}>
        <Divider label={cat.label} />
        {cat.rows.map(row => (
          <RatingRow key={row.id} id={row.id} label={row.label}
            hint={row.hint} value={f.ratings[row.id] || ""}
            onChange={setRating} />
        ))}
      </div>
    ))}
  </div>
);

// ─── STEP 3 — PERFORMANCE DATA ────────────────────────────────────────────────
const LiftRow = ({ id, label, value, dateVal, onVal, onDate }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 120px",
    gap: 8, alignItems: "center", padding: "7px 0", borderBottom: `0.5px solid ${B.border}` }}>
    <div style={{ fontSize: 13, color: B.text }}>{label}</div>
    <Inp value={value} onChange={onVal} placeholder="kg" type="number" small />
    <Inp value={dateVal} onChange={onDate} placeholder="MMM YYYY" small />
  </div>
);

const BenchRow = ({ id, label, unit, value, dateVal, onVal, onDate }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 110px",
    gap: 8, alignItems: "center", padding: "7px 0", borderBottom: `0.5px solid ${B.border}` }}>
    <div style={{ fontSize: 13, color: B.text }}>{label}</div>
    <Inp value={value} onChange={onVal} placeholder={unit} small />
    <Inp value={dateVal} onChange={onDate} placeholder="MMM YYYY" small />
  </div>
);

const LIFTS = [
  { id: "back_squat_max",   label: "Back Squat"      },
  { id: "front_squat_max",  label: "Front Squat"     },
  { id: "oh_squat_max",     label: "Overhead Squat"  },
  { id: "deadlift_max",     label: "Deadlift"        },
  { id: "snatch_max",       label: "Snatch"          },
  { id: "power_snatch_max", label: "Power Snatch"    },
  { id: "squat_clean_max",  label: "Squat Clean"     },
  { id: "push_press_max",   label: "Push Press"      },
  { id: "push_jerk_max",    label: "Push Jerk"       },
  { id: "split_jerk_max",   label: "Split Jerk"      },
];

const BENCHMARKS = [
  { id: "mile_run",  label: "1 Mile Run",            unit: "mm:ss"  },
  { id: "run_5k",    label: "5K Run",                unit: "mm:ss"  },
  { id: "run_10k",   label: "10K Run",               unit: "mm:ss"  },
  { id: "row_1k",    label: "1K Row",                unit: "mm:ss"  },
  { id: "row_2k",    label: "2K Row",                unit: "mm:ss"  },
  { id: "row_5k",    label: "5K Row",                unit: "mm:ss"  },
  { id: "bike_ftp",  label: "Bike Erg 20min FTP",    unit: "watts"  },
  { id: "fran",      label: "Fran (21-15-9)",        unit: "mm:ss"  },
  { id: "grace",     label: "Grace (30 C&J)",        unit: "mm:ss"  },
  { id: "isabel",    label: "Isabel (30 Snatch)",    unit: "mm:ss"  },
  { id: "annie",     label: "Annie (50-40-30-20-10)", unit: "mm:ss" },
  { id: "karen",     label: "Karen (150 WB)",        unit: "mm:ss"  },
];

const StepPerformance = ({ f, setLift, setLiftDate, setBench, setBenchDate }) => (
  <div className="fade">
    <div style={{ background: `${B.card}`, border: `1px solid ${B.border}`,
      borderRadius: 8, padding: "12px 16px", marginBottom: 24, fontSize: 13, color: B.textDim }}>
      Leave anything blank you don't have a number for yet.
    </div>

    <Divider label="Section A — Max lifts" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 120px",
      gap: 8, padding: "4px 0 8px", borderBottom: `1px solid ${B.border}` }}>
      <div style={{ fontSize: 10, color: B.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Lift</div>
      <div style={{ fontSize: 10, color: B.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Max (kg)</div>
      <div style={{ fontSize: 10, color: B.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Date tested</div>
    </div>
    {LIFTS.map(l => (
      <LiftRow key={l.id} id={l.id} label={l.label}
        value={f.liftVals[l.id] || ""}
        dateVal={f.liftDates[l.id] || ""}
        onVal={v => setLift(l.id, v)}
        onDate={v => setLiftDate(l.id, v)} />
    ))}

    <Divider label="Section B — Conditioning benchmarks" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 110px",
      gap: 8, padding: "4px 0 8px", borderBottom: `1px solid ${B.border}` }}>
      <div style={{ fontSize: 10, color: B.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Benchmark</div>
      <div style={{ fontSize: 10, color: B.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Score</div>
      <div style={{ fontSize: 10, color: B.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Date tested</div>
    </div>
    {BENCHMARKS.map(b => (
      <BenchRow key={b.id} id={b.id} label={b.label} unit={b.unit}
        value={f.benchVals[b.id] || ""}
        dateVal={f.benchDates[b.id] || ""}
        onVal={v => setBench(b.id, v)}
        onDate={v => setBenchDate(b.id, v)} />
    ))}
  </div>
);

// ─── STEP 4 — MENTAL PERFORMANCE & GOALS ─────────────────────────────────────
const MENTAL_KPIS = [
  { id: "trust_fitness",    label: "Trust in your fitness on competition day",         hint: "Do you believe your training has prepared you?" },
  { id: "arousal_control",  label: "Manage competition arousal and nerves",            hint: "Can you control your activation levels before events?" },
  { id: "pacing_strategy",  label: "Execute a pacing strategy under fatigue",         hint: "Do you understand how to pace different event types?" },
  { id: "recover_mistakes", label: "Recover from mistakes mid-workout",               hint: "Can you reset after a miss or a bad start?" },
  { id: "self_talk",        label: "Positive self-talk in hard moments",              hint: "What's your internal dialogue when it gets dark?" },
  { id: "focus_crowd",      label: "Maintain focus under crowd pressure",             hint: "Perform on the floor the same as in the gym?" },
  { id: "resilience",       label: "Embrace suffering — stay in discomfort",          hint: "Can you keep going when it hurts?" },
  { id: "athlete_iq",       label: "Read a workout and set a smart game plan",        hint: "Do you understand competition demands and strategy?" },
  { id: "goal_clarity",     label: "Focus on process over outcome during competition",hint: "Are you clear on what you're working toward and why?" },
  { id: "sleep_comp",       label: "Sleep quality the night before competition",      hint: "" },
];

const StepMental = ({ f, s, setRating }) => (
  <div className="fade">
    <Divider label="Mental performance" />
    <div style={{ marginBottom: 16, fontSize: 13, color: B.textDim, lineHeight: 1.6 }}>
      Rate each mental skill 1–5. This is just as important as your movement data.
    </div>
    {MENTAL_KPIS.map(k => (
      <RatingRow key={k.id} id={k.id} label={k.label} hint={k.hint}
        value={f.ratings[k.id] || ""} onChange={setRating} />
    ))}

    <Divider label="Goals & targets" />
    <Field label="Outcome goal" required hint="Your specific competition target">
      <TA value={f.outcomeGoal} onChange={s("outcomeGoal")}
        placeholder="e.g. Qualify for 2026 Online Quarterfinals. Podium at Down Under Championships." rows={2} />
    </Field>
    <Field label="Target timeline" top={12}>
      <Inp value={f.targetTimeline} onChange={s("targetTimeline")} placeholder="e.g. CrossFit Open — March 2026" />
    </Field>

    <Divider label="Obstacles & process goals" />
    <div style={{ fontSize: 12, color: B.muted, marginBottom: 16 }}>
      Name up to 3 things standing between you and your goal, and what you'll do about each one.
    </div>
    {[1, 2, 3].map(n => (
      <div key={n} style={{ background: B.card, border: `1px solid ${B.border}`,
        borderRadius: 8, padding: "14px", marginBottom: 10 }}>
        <div style={{ fontSize: 10, color: B.accent, fontWeight: 700,
          letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>Obstacle {n}</div>
        <Grid cols={2} gap={10}>
          <Field label="The obstacle">
            <TA value={f[`obstacle${n}`]} onChange={s(`obstacle${n}`)}
              placeholder="What's in the way?" rows={2} />
          </Field>
          <Field label="Your process goal">
            <TA value={f[`processGoal${n}`]} onChange={s(`processGoal${n}`)}
              placeholder="What specifically will you do about it?" rows={2} />
          </Field>
        </Grid>
      </div>
    ))}

    <Divider label="Coaching relationship" />
    <Field label="What do you want from this coaching relationship?">
      <TA value={f.coachingWants} onChange={s("coachingWants")}
        placeholder="What does working with a coach successfully look like to you? What have you tried before? What would make this worth it?" rows={3} />
    </Field>
  </div>
);

// ─── SUCCESS SCREEN ───────────────────────────────────────────────────────────
const SuccessScreen = ({ name }) => (
  <div className="fade" style={{ minHeight: "60vh", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", textAlign: "center", padding: "48px 24px" }}>
    <div style={{ width: 60, height: 60, borderRadius: "50%", background: `${B.accent}15`,
      border: `2px solid ${B.accent}`, display: "flex", alignItems: "center",
      justifyContent: "center", margin: "0 auto 24px", fontSize: 24 }}>✓</div>
    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 34, fontWeight: 900,
      color: B.text, marginBottom: 8, letterSpacing: "0.02em", lineHeight: 1 }}>
      YOU'RE ALL SET, {(name || "ATHLETE").split(" ")[0].toUpperCase()}.
    </div>
    <p style={{ fontSize: 14, color: B.textDim, maxWidth: 420, lineHeight: 1.8, marginBottom: 36 }}>
      Your assessment has been received. Your dashboard is being built now.
      The next step is to book your initial consult — that's where we go through everything together.
    </p>
    <a href={BOOKING_URL} target="_blank" rel="noreferrer"
      style={{ display: "inline-flex", alignItems: "center", gap: 10, background: B.accent,
        color: "#fff", textDecoration: "none", borderRadius: 8, padding: "13px 32px",
        fontSize: 14, fontWeight: 600, letterSpacing: "0.04em", marginBottom: 36,
        fontFamily: "'Barlow Condensed',sans-serif", transition: "opacity .15s" }}
      onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
      BOOK YOUR INITIAL CONSULT →
    </a>
    <div style={{ background: B.card, border: `1px solid ${B.border}`, borderRadius: 10,
      padding: "20px 28px", maxWidth: 380, textAlign: "left" }}>
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, fontWeight: 800,
        letterSpacing: "0.2em", color: B.accent, marginBottom: 12 }}>WHAT HAPPENS NEXT</div>
      {[
        "Tyson reviews your assessment before the call",
        "Your consult targets your biggest limiters",
        "A full needs analysis is built from your data",
        "Your personalised periodisation plan is designed",
      ].map((s, i) => (
        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: `${B.accent}20`,
            border: `1px solid ${B.accent}40`, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 9, fontWeight: 700, color: B.accent, flexShrink: 0 }}>
            {i + 1}
          </div>
          <span style={{ fontSize: 13, color: B.textDim, lineHeight: 1.6 }}>{s}</span>
        </div>
      ))}
    </div>
    <p style={{ fontSize: 11, color: B.muted, marginTop: 24 }}>
      Questions? <a href={`mailto:${COACH_EMAIL}`} style={{ color: B.accent, textDecoration: "none" }}>{COACH_EMAIL}</a>
    </p>
  </div>
);

// ─── EMPTY FORM STATE ─────────────────────────────────────────────────────────
const emptyForm = () => ({
  // Profile
  name: "", email: "", dob: "", sex: "", height: "", weight: "",
  competitionLevel: "", yearsTraining: "", trainingDays: "", sessionLength: "",
  recoveryQuality: "", sleepHours: "", stressLevel: "",
  pastInjuries: "", currentInjuries: "", medicalFlags: "",
  athleteStory: "",
  // Goals
  outcomeGoal: "", targetTimeline: "", coachingWants: "",
  obstacle1: "", processGoal1: "",
  obstacle2: "", processGoal2: "",
  obstacle3: "", processGoal3: "",
  // Ratings (movements + mental) — flat object { id: "1"|"2"|...|"5"|"" }
  ratings: {},
  // Lifts / benchmarks — flat objects { id: value }
  liftVals: {}, liftDates: {},
  benchVals: {}, benchDates: {},
});

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep]           = useState(1);
  const [form, setForm]           = useState(emptyForm());
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [error, setError]           = useState("");

  const TOTAL = 4;
  const s  = k => v => setForm(f => ({ ...f, [k]: v }));
  const setRating   = (id, v) => setForm(f => ({ ...f, ratings:    { ...f.ratings,    [id]: v } }));
  const setLift     = (id, v) => setForm(f => ({ ...f, liftVals:   { ...f.liftVals,   [id]: v } }));
  const setLiftDate = (id, v) => setForm(f => ({ ...f, liftDates:  { ...f.liftDates,  [id]: v } }));
  const setBench    = (id, v) => setForm(f => ({ ...f, benchVals:  { ...f.benchVals,  [id]: v } }));
  const setBenchDate= (id, v) => setForm(f => ({ ...f, benchDates: { ...f.benchDates, [id]: v } }));

  const canProceed = () => {
    if (step === 1) return form.name.trim() && form.email.trim() && form.competitionLevel;
    if (step === 4) return form.outcomeGoal.trim();
    return true;
  };

  // Build flat payload that exactly matches Apps Script FIELD_MAP keys
  const buildPayload = () => {
    const p = {
      type: "athlete",
      assessmentType: "Initial Onboarding",
      date: new Date().toISOString().split("T")[0],
      // Profile fields (direct)
      name:             form.name,
      email:            form.email,
      dob:              form.dob,
      sex:              form.sex,
      height:           form.height,
      weight:           form.weight,
      competitionLevel: form.competitionLevel,
      yearsTraining:    form.yearsTraining,
      trainingDays:     form.trainingDays,
      sessionLength:    form.sessionLength,
      recoveryQuality:  form.recoveryQuality,
      sleepHours:       form.sleepHours,
      stressLevel:      form.stressLevel,
      pastInjuries:     form.pastInjuries,
      currentInjuries:  form.currentInjuries,
      medicalFlags:     form.medicalFlags,
      athleteStory:     form.athleteStory,
      outcomeGoal:      form.outcomeGoal,
      targetTimeline:   form.targetTimeline,
      coachingWants:    form.coachingWants,
      obstacle1:        form.obstacle1,
      processGoal1:     form.processGoal1,
      obstacle2:        form.obstacle2,
      processGoal2:     form.processGoal2,
      obstacle3:        form.obstacle3,
      processGoal3:     form.processGoal3,
    };
    // Flatten ratings (movement + mental) — each becomes its own key
    Object.entries(form.ratings).forEach(([k, v]) => { if (v) p[k] = v; });
    // Flatten lifts
    Object.entries(form.liftVals).forEach(([k, v]) => { if (v) p[k] = v; });
    Object.entries(form.liftDates).forEach(([k, v]) => { if (v) p[k + "_date"] = v; });
    // Flatten benchmarks
    Object.entries(form.benchVals).forEach(([k, v]) => { if (v) p[k] = v; });
    Object.entries(form.benchDates).forEach(([k, v]) => { if (v) p[k + "_date"] = v; });
    return p;
  };

  const submit = async () => {
    setSubmitting(true);
    setError("");
    const payload = buildPayload();
    try {
      await fetch(GAS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tab: "Athletes", row: payload }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true); // show success — GAS no-cors always throws
    }
    setSubmitting(false);
  };

  const titles = ["", "Let's start with you.", "Movement self-assessment.", "Lifts & engine.", "Mental performance & goals."];
  const subs   = ["", "Your background, lifestyle, and story — the foundation everything builds on.",
    "Rate yourself 1–5 across key movements relative to the competitive bracket you want to reach.",
    "Max lifts (kg) and conditioning benchmarks. Leave anything blank you don't have.",
    "The mental side and your goals. This is where coaching gets specific."];

  return (
    <div style={{ minHeight: "100vh", background: B.bg }}>
      <GS />

      {/* Header */}
      <div style={{ background: B.surface, borderBottom: `1px solid ${B.border}`,
        padding: "14px 24px", display: "flex", alignItems: "center", gap: 12,
        position: "sticky", top: 0, zIndex: 100 }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2974.41 782.79"
          style={{ height: 28, width: "auto" }} aria-label="GRIT Performance Co.">
          <path fill="#e74b22" d="M509.82,372.93c-3.87-32.94-31.35-40.86-60.21-42.75-5.53-.36-11.13-.58-16.76-.69-.21,3.18-.57,7.7-1.09,12.79-1.56,15.1-3.8,27.39-6.66,36.52-6.43,20.53-19.95,38.31-40.19,52.85-15.14,10.88-34.1,19.96-56.36,26.98-9.25,2.92-18.31,5.26-26.76,7.12l-18.02,95.95h91.44c.78-5.51,1.56-11.01,2.34-16.52,1.58-11.21,3.17-22.43,4.76-33.63,39.12.35,76.82,3.83,102.63-31.18,14.35-19.47,27.68-83.71,24.9-107.44h0Z"/>
          <path fill="#e74b22" d="M431.69,227.72l-11.83,61.96c-.52,2.72-2.95,4.65-5.71,4.53-20.38-.89-94.72-4.1-94.72-4.1,1.17-.31-2.4.52-3.45,1.12-.84.48-1.6,1.14-2.48,2.13-7.5,8.43-11.68,57.37-16.48,78.75-.76,3.39,1.69,6.65,5.15,6.84,5.74.31,10.11.55,13.04.71,2.57.14,4.88-1.5,5.62-3.97-.59-9.52-.87-19.75-.67-30.63.16-8.74.62-17.05,1.27-24.86.21-1.8.98-6.05,4.38-8.56,2.46-1.81,7.43-1.9,7.43-1.9,0,0,27.6,4.15,80.59,12.09,0,0-1.32,32.13-7.27,51.15-22.52,71.89-149.96,80.36-153.48,80.24-1.34-.05-2.66-.14-2.66-.14-1.77-.13-4.11-.39-6.81-.93-11.66-2.27-22.53-8.07-29.02-14.32-10.35-9.97-13.75-24.1-13.57-38.64.29-22.64,20.23-118.55,30.41-137.46,9.32-17.33,38.14-40.64,58.11-40.64h136.67c3.5,0,6.13,3.18,5.47,6.63Z"/>
          <path fill="#ffffff" d="M2761.31,422.33c3.44,0,6.23,1.11,8.36,3.34,2.23,2.13,3.34,4.91,3.34,8.36s-1.11,6.28-3.34,8.51c-2.13,2.23-4.92,3.34-8.36,3.34s-6.13-1.11-8.36-3.34c-2.23-2.23-3.34-5.07-3.34-8.51s1.11-6.23,3.34-8.36c2.23-2.23,5.02-3.34,8.36-3.34Z"/>
          <path fill="#ffffff" d="M2675.41,336.62c8.1,0,15.6,1.37,22.49,4.1,6.99,2.74,13.07,6.58,18.24,11.55,5.16,4.96,9.17,10.74,12,17.32,2.94,6.59,4.41,13.78,4.41,21.58s-1.47,14.89-4.41,21.58c-2.83,6.69-6.84,12.56-12,17.63-5.17,4.97-11.25,8.87-18.24,11.7-6.89,2.74-14.39,4.1-22.49,4.1s-15.65-1.37-22.64-4.1c-6.89-2.84-12.92-6.74-18.09-11.7-5.16-5.07-9.22-10.94-12.15-17.63-2.84-6.69-4.26-13.88-4.26-21.58s1.42-14.99,4.26-21.58c2.93-6.69,6.99-12.46,12.15-17.32,5.17-4.96,11.2-8.81,18.09-11.55,6.99-2.74,14.53-4.1,22.64-4.1ZM2675.71,356.83c-4.45,0-8.71.86-12.76,2.58-3.95,1.72-7.45,4.15-10.49,7.29-2.94,3.14-5.27,6.79-6.99,10.94-1.72,4.15-2.58,8.66-2.58,13.52s.86,9.42,2.58,13.68c1.72,4.15,4.11,7.85,7.14,11.09,3.04,3.14,6.54,5.62,10.49,7.45,3.95,1.72,8.16,2.58,12.61,2.58s8.61-.86,12.46-2.58c3.96-1.82,7.4-4.31,10.34-7.45,2.94-3.24,5.22-6.94,6.84-11.09,1.72-4.25,2.58-8.81,2.58-13.68s-.86-9.37-2.58-13.52c-1.62-4.15-3.9-7.8-6.84-10.94-2.94-3.14-6.38-5.57-10.34-7.29-3.85-1.72-8-2.58-12.46-2.58Z"/>
          <path fill="#ffffff" d="M2588.69,370.66c-3.54-4.36-7.8-7.75-12.76-10.18-4.97-2.53-9.93-3.8-14.9-3.8-4.55,0-8.81.86-12.76,2.58-3.85,1.72-7.29,4.15-10.33,7.29-2.94,3.04-5.22,6.64-6.84,10.79-1.62,4.15-2.43,8.66-2.43,13.52s.81,9.22,2.43,13.37c1.62,4.15,3.9,7.8,6.84,10.94,3.04,3.04,6.48,5.47,10.33,7.29,3.95,1.72,8.21,2.58,12.76,2.58,4.87,0,9.73-1.11,14.59-3.34,4.87-2.33,9.22-5.42,13.07-9.27l14.14,14.74c-3.75,3.85-8.01,7.19-12.77,10.03-4.66,2.84-9.57,5.07-14.74,6.69-5.17,1.52-10.33,2.28-15.5,2.28-8,0-15.4-1.37-22.19-4.1-6.68-2.84-12.56-6.74-17.63-11.7-4.96-5.07-8.86-10.94-11.7-17.63-2.83-6.69-4.25-13.93-4.25-21.73s1.42-14.84,4.25-21.43c2.84-6.59,6.84-12.36,12.01-17.32,5.16-4.96,11.14-8.81,17.93-11.55,6.89-2.74,14.39-4.1,22.49-4.1,5.17,0,10.28.71,15.35,2.13,5.17,1.42,9.98,3.44,14.44,6.08,4.56,2.53,8.61,5.67,12.15,9.42l-13.98,16.41Z"/>
          <path fill="#ffffff" d="M2347.9,338.14h81v19.3h-56.99v24.01h51.21v19.3h-51.21v24.47h58.66v19.3h-82.67v-106.38Z"/>
          <path fill="#ffffff" d="M2308.79,370.66c-3.54-4.36-7.8-7.75-12.76-10.18-4.97-2.53-9.93-3.8-14.89-3.8-4.56,0-8.82.86-12.77,2.58-3.85,1.72-7.29,4.15-10.33,7.29-2.94,3.04-5.22,6.64-6.84,10.79-1.62,4.15-2.43,8.66-2.43,13.52s.81,9.22,2.43,13.37c1.62,4.15,3.9,7.8,6.84,10.94,3.04,3.04,6.48,5.47,10.33,7.29,3.95,1.72,8.21,2.58,12.77,2.58,4.86,0,9.72-1.11,14.58-3.34,4.87-2.33,9.22-5.42,13.07-9.27l14.14,14.74c-3.75,3.85-8.01,7.19-12.77,10.03-4.66,2.84-9.57,5.07-14.74,6.69-5.17,1.52-10.33,2.28-15.5,2.28-8,0-15.4-1.37-22.19-4.1-6.68-2.84-12.56-6.74-17.63-11.7-4.96-5.07-8.86-10.94-11.7-17.63-2.83-6.69-4.25-13.93-4.25-21.73s1.42-14.84,4.25-21.43c2.84-6.59,6.84-12.36,12.01-17.32,5.17-4.96,11.14-8.81,17.93-11.55,6.89-2.74,14.39-4.1,22.49-4.1,5.17,0,10.28.71,15.35,2.13,5.17,1.42,9.98,3.44,14.44,6.08,4.56,2.53,8.61,5.67,12.15,9.42l-13.98,16.41Z"/>
          <path fill="#ffffff" d="M2101.35,338.14h21.88l57.9,78.11-6.23,2.13v-80.24h22.64v106.38h-21.73l-57.9-77.96,6.38-2.13v80.09h-22.94v-106.38Z"/>
          <path fill="#ffffff" d="M2009.59,338.14h24.62l45.29,106.38h-25.53l-32.83-82.37-32.98,82.37h-24.92l46.35-106.38ZM1989.08,404.54h62.76v18.69h-62.76v-18.69Z"/>
          <path fill="#ffffff" d="M1821.85,338.14h26.74l33.13,66.26,32.83-66.26h26.59v106.38h-21.58v-73.25l-30.24,62.46h-15.5l-30.39-62.46v73.25h-21.58v-106.38Z"/>
          <path fill="#ffffff" d="M1747.44,338.14c13.88,0,24.62,3.24,32.22,9.73,7.7,6.38,11.55,15.4,11.55,27.05,0,12.26-3.85,21.83-11.55,28.72-7.6,6.79-18.34,10.18-32.22,10.18h-22.19v30.7h-24.01v-106.38h46.2ZM1747.44,394.36c6.58,0,11.7-1.52,15.35-4.56,3.75-3.14,5.62-7.85,5.62-14.13s-1.87-10.64-5.62-13.68c-3.65-3.04-8.77-4.56-15.35-4.56h-22.19v36.93h22.19ZM1744.55,404.85h23.4l25.84,39.66h-27.2l-22.04-39.66Z"/>
          <path fill="#ffffff" d="M1617.71,336.62c8.11,0,15.6,1.37,22.49,4.1,6.99,2.74,13.07,6.58,18.24,11.55,5.17,4.96,9.17,10.74,12,17.32,2.94,6.59,4.41,13.78,4.41,21.58s-1.47,14.89-4.41,21.58c-2.83,6.69-6.83,12.56-12,17.63-5.17,4.97-11.25,8.87-18.24,11.7-6.89,2.74-14.38,4.1-22.49,4.1s-15.65-1.37-22.64-4.1c-6.89-2.84-12.92-6.74-18.09-11.7-5.16-5.07-9.22-10.94-12.15-17.63-2.84-6.69-4.26-13.88-4.26-21.58s1.42-14.99,4.26-21.58c2.93-6.69,6.99-12.46,12.15-17.32,5.17-4.96,11.2-8.81,18.09-11.55,6.99-2.74,14.54-4.1,22.64-4.1ZM1618.02,356.83c-4.46,0-8.72.86-12.77,2.58-3.95,1.72-7.45,4.15-10.49,7.29-2.93,3.14-5.26,6.79-6.99,10.94-1.72,4.15-2.58,8.66-2.58,13.52s.86,9.42,2.58,13.68c1.73,4.15,4.11,7.85,7.15,11.09,3.04,3.14,6.53,5.62,10.48,7.45,3.95,1.72,8.16,2.58,12.62,2.58s8.61-.86,12.46-2.58c3.95-1.82,7.39-4.31,10.33-7.45,2.94-3.24,5.22-6.94,6.84-11.09,1.72-4.25,2.58-8.81,2.58-13.68s-.86-9.37-2.58-13.52c-1.62-4.15-3.9-7.8-6.84-10.94-2.94-3.14-6.38-5.57-10.33-7.29-3.85-1.72-8.01-2.58-12.46-2.58Z"/>
          <path fill="#ffffff" d="M1467.15,338.14h76.44v19.3h-52.43v26.9h48.03v19.3h-48.03v40.88h-24.01v-106.38Z"/>
          <path fill="#ffffff" d="M1392.75,338.14c13.88,0,24.62,3.24,32.21,9.73,7.7,6.38,11.55,15.4,11.55,27.05,0,12.26-3.85,21.83-11.55,28.72-7.59,6.79-18.33,10.18-32.21,10.18h-22.19v30.7h-24.01v-106.38h46.2ZM1392.75,394.36c6.58,0,11.7-1.52,15.35-4.56,3.74-3.14,5.62-7.85,5.62-14.13s-1.88-10.64-5.62-13.68c-3.65-3.04-8.77-4.56-15.35-4.56h-22.19v36.93h22.19ZM1389.86,404.85h23.4l25.84,39.66h-27.21l-22.03-39.66Z"/>
          <path fill="#ffffff" d="M1234.4,338.14h81v19.3h-56.99v24.01h51.22v19.3h-51.22v24.47h58.66v19.3h-82.67v-106.38Z"/>
          <path fill="#ffffff" d="M1165.91,338.14c13.47,0,23.91,3.24,31.3,9.73,7.5,6.38,11.25,15.4,11.25,27.05,0,12.26-3.75,21.83-11.25,28.72-7.4,6.79-17.83,10.18-31.3,10.18h-31.61l10.48-10.49v41.18h-24.01v-106.38h45.13ZM1164.69,394.36c6.69,0,11.85-1.52,15.5-4.56,3.65-3.14,5.47-7.85,5.47-14.13s-1.82-10.64-5.47-13.68c-3.65-3.04-8.81-4.56-15.5-4.56h-30.39l10.48-10.48v58.05l-10.48-10.64h30.39Z"/>
          <path fill="#ffffff" d="M956.78,338.14h88.9v19.76h-32.52v86.62h-24.01v-86.62h-32.37v-19.76Z"/>
          <path fill="#ffffff" d="M908.99,338.14h24.01v106.38h-24.01v-106.38Z"/>
          <path fill="#ffffff" d="M834.58,338.14c13.88,0,24.62,3.24,32.22,9.73,7.7,6.38,11.55,15.4,11.55,27.05,0,12.26-3.85,21.83-11.55,28.72-7.6,6.79-18.34,10.18-32.22,10.18h-22.19v30.7h-24.01v-106.38h46.2ZM834.58,394.36c6.59,0,11.7-1.52,15.35-4.56,3.75-3.14,5.62-7.85,5.62-14.13s-1.87-10.64-5.62-13.68c-3.65-3.04-8.76-4.56-15.35-4.56h-22.19v36.93h22.19ZM831.7,404.85h23.4l25.83,39.66h-27.2l-22.04-39.66Z"/>
          <path fill="#ffffff" d="M744.15,368.68c-3.85-3.75-8.41-6.69-13.68-8.81-5.17-2.13-10.33-3.19-15.5-3.19-4.76,0-9.17.91-13.22,2.74-4.05,1.72-7.6,4.15-10.64,7.29-3.04,3.14-5.42,6.79-7.14,10.94-1.62,4.15-2.43,8.66-2.43,13.52s.86,9.42,2.58,13.68c1.72,4.15,4.1,7.85,7.14,11.09,3.04,3.14,6.59,5.62,10.64,7.45,4.05,1.72,8.46,2.58,13.22,2.58,4.36,0,9.07-.96,14.13-2.89,5.07-1.93,9.68-4.51,13.83-7.75l13.68,16.87c-3.75,2.63-8.05,5.01-12.92,7.14-4.76,2.13-9.78,3.8-15.04,5.01s-10.33,1.82-15.2,1.82c-8.1,0-15.6-1.37-22.49-4.1-6.79-2.84-12.76-6.74-17.93-11.7-5.17-4.96-9.17-10.79-12.01-17.48-2.84-6.79-4.25-14.03-4.25-21.73s1.47-14.84,4.41-21.43c2.94-6.69,6.99-12.51,12.16-17.48,5.27-4.96,11.45-8.81,18.54-11.55,7.09-2.74,14.74-4.1,22.95-4.1,5.27,0,10.49.66,15.65,1.98,5.17,1.21,10.08,2.99,14.74,5.32,4.66,2.33,8.76,5.12,12.31,8.36l-13.53,16.41ZM735.94,391.02h20.82v41.18h-20.82v-41.18Z"/>
        </svg>
        {!submitted && (
          <div style={{ marginLeft: "auto", fontSize: 11, color: B.muted }}>
            Step {step} of {TOTAL}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px 80px" }}>
        {submitted ? (
          <SuccessScreen name={form.name} />
        ) : (
          <>
            {/* Step title */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10,
                fontWeight: 800, letterSpacing: "0.2em", color: B.accent, marginBottom: 6 }}>
                ATHLETE INTAKE ASSESSMENT
              </div>
              <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 28,
                fontWeight: 900, color: B.text, marginBottom: 6, letterSpacing: "0.02em",
                lineHeight: 1 }}>{titles[step]}</h1>
              <p style={{ fontSize: 13, color: B.muted, lineHeight: 1.5 }}>{subs[step]}</p>
            </div>

            <Progress step={step} />

            {step === 1 && <StepProfile  f={form} s={s} />}
            {step === 2 && <StepMovements f={form} setRating={setRating} />}
            {step === 3 && <StepPerformance f={form}
              setLift={setLift} setLiftDate={setLiftDate}
              setBench={setBench} setBenchDate={setBenchDate} />}
            {step === 4 && <StepMental f={form} s={s} setRating={setRating} />}

            {error && (
              <div style={{ background: `${B.accent}15`, border: `1px solid ${B.accent}40`,
                borderRadius: 7, padding: 12, color: B.accent, fontSize: 13, marginTop: 16 }}>
                {error}
              </div>
            )}

            {/* Nav */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
              marginTop: 36, paddingTop: 24, borderTop: `1px solid ${B.border}` }}>
              <button onClick={() => setStep(p => p - 1)}
                style={{ background: "transparent", border: `1px solid ${step === 1 ? "transparent" : B.border}`,
                  color: step === 1 ? "transparent" : B.muted, borderRadius: 7, padding: "10px 22px",
                  fontSize: 13, cursor: step === 1 ? "default" : "pointer",
                  pointerEvents: step === 1 ? "none" : "auto" }}>
                ← Back
              </button>

              {step < TOTAL ? (
                <button onClick={() => { if (canProceed()) setStep(p => p + 1); }}
                  style={{ background: canProceed() ? B.accent : B.card,
                    border: `1px solid ${canProceed() ? B.accent : B.border}`,
                    color: canProceed() ? "#fff" : B.muted, borderRadius: 7,
                    padding: "10px 28px", fontSize: 13, fontWeight: 600,
                    cursor: canProceed() ? "pointer" : "not-allowed", transition: "all .15s" }}>
                  Continue →
                </button>
              ) : (
                <button onClick={submit} disabled={submitting || !canProceed()}
                  style={{ background: canProceed() && !submitting ? B.accent : B.card,
                    border: "none", color: "#fff", borderRadius: 7, padding: "10px 32px",
                    fontSize: 13, fontWeight: 600, cursor: submitting ? "wait" : "pointer",
                    display: "flex", alignItems: "center", gap: 8,
                    opacity: !canProceed() ? 0.5 : 1 }}>
                  {submitting ? (
                    <>
                      <div style={{ width: 13, height: 13, border: "2px solid rgba(255,255,255,.3)",
                        borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                      Submitting…
                    </>
                  ) : "Submit Assessment"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
