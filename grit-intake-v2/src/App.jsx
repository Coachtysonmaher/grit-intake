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
      <strong style={{ color: B.text }}>Rate yourself 1–5</strong> — be accurate, not impressive.
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
      Leave anything blank if you don't have a number yet. Partial data is fine — we can test these in the first session.
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
    "Rate yourself 1–5 across the key movements. Be accurate, not impressive.",
    "Max lifts (kg) and conditioning benchmarks. Leave anything blank you don't have.",
    "The mental side and your goals. This is where coaching gets specific."];

  return (
    <div style={{ minHeight: "100vh", background: B.bg }}>
      <GS />

      {/* Header */}
      <div style={{ background: B.surface, borderBottom: `1px solid ${B.border}`,
        padding: "14px 24px", display: "flex", alignItems: "center", gap: 12,
        position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ width: 30, height: 30, borderRadius: 6, background: B.accent,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 13, color: "#fff" }}>G</div>
        <div>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900,
            fontSize: 15, letterSpacing: "0.08em", color: B.text, lineHeight: 1 }}>GRIT</div>
          <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.2em",
            color: B.muted, textTransform: "uppercase" }}>Performance Co.</div>
        </div>
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
