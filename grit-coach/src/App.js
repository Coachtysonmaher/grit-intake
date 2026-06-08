import { useState, useEffect } from "react";

// ─── THEME — GRIT PERFORMANCE CO. BRAND ─────────────────────────────────────
// Colours: #E74B22 orange, #100C0B black, #1E1E1E grey, #FFFFFF white
const T = {
  bg: "#100C0B", surface: "#1A1512", card: "#221C18", border: "#2E2520",
  accent: "#E74B22", accentDim: "#B83A1A", accentLight: "#F07050",
  text: "#F5F0EE", muted: "#6B5F5A",
  danger: "#ff4d4d", warn: "#ffaa00", info: "#4da6ff",
  weapon: "#E74B22", strength: "#6bcb77", avg: "#4da6ff",
  weak: "#ffaa00", limiter: "#ff4d4d",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const MOVEMENTS = [
  { cat: "BARBELL — OLYMPIC LIFTING", items: [
    { id: "snatch_heavy", name: "Snatch", ctx: "Heavy | 1RM / near-max" },
    { id: "snatch_mod", name: "Snatch", ctx: "Moderate | Workout weight, cycling" },
    { id: "snatch_light", name: "Snatch", ctx: "Light | High-rep, KB/DB snatch" },
    { id: "clean_heavy", name: "Clean", ctx: "Heavy | 1RM / near-max" },
    { id: "clean_mod", name: "Clean", ctx: "Moderate | Workout weight, cycling" },
    { id: "clean_light", name: "Clean", ctx: "Light | High-rep, light barbell or KB" },
    { id: "cnj_heavy", name: "Clean & Jerk", ctx: "Heavy" },
    { id: "cnj_mod", name: "Clean & Jerk", ctx: "Moderate" },
    { id: "cnj_light", name: "Clean & Jerk", ctx: "Light" },
  ]},
  { cat: "BARBELL — SQUATTING", items: [
    { id: "bsq_heavy", name: "Back Squat", ctx: "Heavy" },
    { id: "fsq_heavy", name: "Front Squat", ctx: "Heavy" },
    { id: "ohsq", name: "Overhead Squat", ctx: "Heavy / Moderate in workouts" },
    { id: "thruster_heavy", name: "Thruster", ctx: "Heavy" },
    { id: "thruster_mod", name: "Thruster", ctx: "Moderate | Workout cycling" },
    { id: "thruster_light", name: "Thruster", ctx: "Light | High-rep" },
  ]},
  { cat: "BARBELL — PRESSING / S2OH", items: [
    { id: "strict_press", name: "Strict Press", ctx: "" },
    { id: "push_press", name: "Push Press", ctx: "" },
    { id: "push_jerk", name: "Push Jerk", ctx: "" },
    { id: "split_jerk", name: "Split Jerk", ctx: "" },
    { id: "s2oh", name: "Shoulder-to-Overhead", ctx: "Generic / Workout context" },
  ]},
  { cat: "BARBELL — PULLING", items: [
    { id: "dl_heavy", name: "Deadlift", ctx: "Heavy | 1RM / near-max" },
    { id: "dl_mod", name: "Deadlift", ctx: "Moderate | Workout cycling" },
  ]},
  { cat: "GYMNASTICS — PULLING", items: [
    { id: "strict_pu", name: "Strict Pull-up", ctx: "Capacity" },
    { id: "kip_pu", name: "Kipping Pull-up", ctx: "Workout efficiency" },
    { id: "ctb", name: "Chest-to-Bar Pull-up", ctx: "" },
    { id: "bar_mu", name: "Bar Muscle-Up", ctx: "" },
    { id: "ring_mu", name: "Ring Muscle-Up", ctx: "" },
    { id: "rope_std", name: "Rope Climb", ctx: "Standard" },
    { id: "rope_ll", name: "Legless Rope Climb", ctx: "" },
  ]},
  { cat: "GYMNASTICS — HANDSTAND / PRESSING", items: [
    { id: "kip_hspu", name: "Kipping HSPU", ctx: "" },
    { id: "strict_hspu", name: "Strict HSPU", ctx: "" },
    { id: "deficit_hspu", name: "Deficit HSPU", ctx: "" },
    { id: "hs_walk", name: "Handstand Walk", ctx: "" },
    { id: "wall_walk", name: "Wall Walk", ctx: "" },
  ]},
  { cat: "GYMNASTICS — MIDLINE", items: [
    { id: "ttb", name: "Toes-to-Bar", ctx: "" },
    { id: "ghd", name: "GHD Sit-up", ctx: "" },
    { id: "lsit", name: "L-sit / Hanging Knee Raise", ctx: "" },
  ]},
  { cat: "BASIC CROSSFIT MOVEMENTS", items: [
    { id: "burpee", name: "Burpee / Burpee Variations", ctx: "" },
    { id: "box_jump", name: "Box Jump / Box Jump-Over", ctx: "" },
    { id: "du", name: "Double-Under", ctx: "" },
    { id: "du_cross", name: "Double-Under Crossover", ctx: "" },
    { id: "wall_ball", name: "Wall Ball", ctx: "" },
    { id: "air_squat", name: "Air Squat", ctx: "" },
    { id: "lunge", name: "Lunge Variations", ctx: "" },
    { id: "pistol", name: "Pistol Squat", ctx: "" },
  ]},
  { cat: "ODD OBJECT / STRONGMAN", items: [
    { id: "sandbag", name: "Sandbag", ctx: "Carry / Clean / Load" },
    { id: "sled_push", name: "Sled Push", ctx: "" },
    { id: "sled_pull", name: "Sled Pull / Drag", ctx: "" },
    { id: "farmers", name: "Farmers Carry", ctx: "" },
    { id: "yoke", name: "Yoke", ctx: "" },
  ]},
  { cat: "DUMBBELL", items: [
    { id: "db_snatch", name: "DB Snatch", ctx: "" },
    { id: "db_cnj", name: "DB Clean & Jerk", ctx: "" },
    { id: "db_ohsq", name: "DB Overhead Squat", ctx: "" },
  ]},
  { cat: "OTHER", items: [
    { id: "ring_dip", name: "Ring Dip", ctx: "" },
    { id: "pegboard", name: "Pegboard", ctx: "" },
    { id: "pushup", name: "Push-up", ctx: "" },
  ]},
];

// lbs → kg helper (rounds to nearest whole number)
const lbsToKg = (lbs) => {
  const isPlus = String(lbs).includes("+");
  const n = parseFloat(String(lbs).replace("+", ""));
  return Math.round(n / 2.2046) + (isPlus ? "+" : "");
};
const rangeToKg = (str) => str.split(" / ").map(lbsToKg).join(" / ");

const LIFTS = [
  { id: "back_squat", name: "Back Squat", ranges: { open: rangeToKg("315 / 225"), qf: rangeToKg("365 / 265"), semi: rangeToKg("405 / 295"), games: rangeToKg("445+ / 315+") }},
  { id: "front_squat", name: "Front Squat", ranges: { open: rangeToKg("275 / 195"), qf: rangeToKg("315 / 230"), semi: rangeToKg("355 / 260"), games: rangeToKg("385+ / 285+") }},
  { id: "oh_squat", name: "Overhead Squat", ranges: { open: rangeToKg("225 / 155"), qf: rangeToKg("265 / 185"), semi: rangeToKg("295 / 210"), games: rangeToKg("325+ / 235+") }},
  { id: "thruster", name: "Thruster (1RM)", ranges: { open: rangeToKg("225 / 155"), qf: rangeToKg("265 / 185"), semi: rangeToKg("295 / 210"), games: rangeToKg("315+ / 225+") }},
  { id: "deadlift", name: "Deadlift", ranges: { open: rangeToKg("405 / 275"), qf: rangeToKg("455 / 315"), semi: rangeToKg("500 / 345"), games: rangeToKg("545+ / 375+") }},
  { id: "snatch", name: "Snatch", ranges: { open: rangeToKg("205 / 135"), qf: rangeToKg("235 / 160"), semi: rangeToKg("265 / 185"), games: rangeToKg("295+ / 205+") }},
  { id: "power_snatch", name: "Power Snatch", ranges: { open: rangeToKg("185 / 120"), qf: rangeToKg("215 / 145"), semi: rangeToKg("240 / 165"), games: rangeToKg("265+ / 185+") }},
  { id: "power_clean", name: "Power Clean", ranges: { open: rangeToKg("275 / 185"), qf: rangeToKg("315 / 215"), semi: rangeToKg("345 / 240"), games: rangeToKg("375+ / 265+") }},
  { id: "squat_clean", name: "Squat Clean", ranges: { open: rangeToKg("275 / 185"), qf: rangeToKg("315 / 215"), semi: rangeToKg("345 / 240"), games: rangeToKg("375+ / 265+") }},
  { id: "push_press_lift", name: "Push Press", ranges: { open: rangeToKg("205 / 130"), qf: rangeToKg("235 / 155"), semi: rangeToKg("260 / 175"), games: rangeToKg("285+ / 190+") }},
  { id: "push_jerk_lift", name: "Push Jerk", ranges: { open: rangeToKg("235 / 155"), qf: rangeToKg("270 / 180"), semi: rangeToKg("300 / 200"), games: rangeToKg("325+ / 220+") }},
  { id: "split_jerk_lift", name: "Split Jerk", ranges: { open: rangeToKg("265 / 175"), qf: rangeToKg("305 / 205"), semi: rangeToKg("335 / 225"), games: rangeToKg("365+ / 250+") }},
];

const BENCHMARKS = [
  { id: "mile_run", name: "1 Mile Run", ranges: { open: "6:30 / 7:15", qf: "5:50 / 6:30", semi: "5:25 / 6:00", games: "5:00 / 5:35" }},
  { id: "5k_run", name: "5K Run", ranges: { open: "22:00 / 24:00", qf: "20:00 / 22:00", semi: "18:30 / 20:30", games: "17:00 / 19:00" }},
  { id: "10k_run", name: "10K Run", ranges: { open: "48:00 / 52:00", qf: "43:00 / 47:00", semi: "40:00 / 44:00", games: "37:00 / 41:00" }},
  { id: "1k_row", name: "1K Row", ranges: { open: "3:20 / 3:50", qf: "3:10 / 3:40", semi: "3:02 / 3:30", games: "2:55 / 3:20" }},
  { id: "2k_row", name: "2K Row", ranges: { open: "7:00 / 8:00", qf: "6:40 / 7:35", semi: "6:25 / 7:15", games: "6:10 / 7:00" }},
  { id: "5k_row", name: "5K Row", ranges: { open: "18:30 / 21:00", qf: "17:30 / 20:00", semi: "16:45 / 19:00", games: "16:00 / 18:00" }},
  { id: "echo_10min", name: "Echo Bike 10min TT (cals)", ranges: { open: "180 / 130", qf: "210 / 155", semi: "235 / 175", games: "260+ / 195+" }},
  { id: "bike_erg_ftp", name: "Bike Erg 20min FTP (watts)", ranges: { open: "200 / 140", qf: "235 / 170", semi: "265 / 195", games: "295+ / 215+" }},
];

// ─── SHARED UI ────────────────────────────────────────────────────────────────
const GS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Manrope:wght@300;400;500;600;700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{background:${T.bg};color:${T.text};font-family:'Manrope',sans-serif;-webkit-font-smoothing:antialiased}
    input,select,textarea{font-family:'Manrope',sans-serif}
    ::-webkit-scrollbar{width:3px;height:3px}
    ::-webkit-scrollbar-thumb{background:${T.border};border-radius:2px}
    ::placeholder{color:${T.muted}}
  `}</style>
);

const mono = { fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.06em" };

const Inp = ({ value, onChange, placeholder, type = "text", style = {} }) => (
  <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 7,
      padding: "9px 13px", color: T.text, fontSize: 13, width: "100%", outline: "none", ...style }}
    onFocus={e => e.target.style.borderColor = T.accent}
    onBlur={e => e.target.style.borderColor = T.border} />
);

const Sel = ({ value, onChange, options, placeholder }) => (
  <select value={value} onChange={e => onChange(e.target.value)}
    style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 7,
      padding: "9px 13px", color: value ? T.text : T.muted, fontSize: 13, width: "100%",
      outline: "none", cursor: "pointer", appearance: "none",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23555' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}>
    {placeholder && <option value="">{placeholder}</option>}
    {options.map(o => <option key={o.value || o} value={o.value || o} style={{ background: T.card }}>{o.label || o}</option>)}
  </select>
);

const TA = ({ value, onChange, placeholder, rows = 2 }) => (
  <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
    style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 7,
      padding: "9px 13px", color: T.text, fontSize: 13, width: "100%", outline: "none", resize: "vertical", lineHeight: 1.6 }}
    onFocus={e => e.target.style.borderColor = T.accent}
    onBlur={e => e.target.style.borderColor = T.border} />
);

const Lbl = ({ children, req }) => (
  <div style={{ fontSize: 11, color: T.muted, marginBottom: 5, letterSpacing: "0.04em" }}>
    {children}{req && <span style={{ color: T.accent }}> *</span>}
  </div>
);

const F = ({ label, req, children, span }) => (
  <div style={span ? { gridColumn: `span ${span}` } : {}}>
    {label && <Lbl req={req}>{label}</Lbl>}
    {children}
  </div>
);

const G = ({ cols = 2, gap = 14, children }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap }}>{children}</div>
);

const Sec = ({ title, children, accent }) => (
  <div style={{ marginBottom: 28 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <span style={{ ...mono, fontSize: 9, letterSpacing: "0.22em", color: accent || T.accent, textTransform: "uppercase" }}>{title}</span>
      <div style={{ flex: 1, height: 1, background: T.border }} />
    </div>
    {children}
  </div>
);

const Btn = ({ onClick, children, variant = "primary", disabled, small, style: s = {} }) => {
  const base = { borderRadius: 7, padding: small ? "7px 14px" : "11px 22px",
    fontSize: small ? 12 : 13, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.12s", border: "none", opacity: disabled ? 0.5 : 1,
    fontFamily: "'Manrope', sans-serif", ...s };
  if (variant === "primary") return <button onClick={onClick} disabled={disabled} style={{ ...base, background: T.accent, color: "#fff" }}>{children}</button>;
  if (variant === "secondary") return <button onClick={onClick} disabled={disabled} style={{ ...base, background: "transparent", color: T.text, border: `1px solid ${T.border}` }}>{children}</button>;
  return <button onClick={onClick} disabled={disabled} style={{ ...base, background: "transparent", color: T.muted, border: "none" }}>{children}</button>;
};

const Tag = ({ color, children, small }) => (
  <span style={{ background: `${color}18`, border: `1px solid ${color}40`, color,
    borderRadius: 4, padding: small ? "1px 6px" : "2px 8px", fontSize: small ? 10 : 11,
    ...mono, letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{children}</span>
);

// ─── RATING CHIP ──────────────────────────────────────────────────────────────
const ratingColor = (r) => {
  if (!r && r !== 0) return T.muted;
  const n = parseFloat(r);
  if (n === 5) return T.weapon;
  if (n >= 4) return T.strength;
  if (n === 3) return T.avg;
  if (n === 2) return T.warn;
  if (n <= 1) return T.limiter;
  return T.muted;
};
const ratingLabel = (r) => {
  if (!r && r !== 0) return "—";
  const n = parseFloat(r);
  if (n === 5) return "WEAPON";
  if (n >= 4) return "STRENGTH";
  if (n === 3) return "AVERAGE";
  if (n === 2) return "WEAKNESS";
  if (n <= 1) return "LIMITER";
  return "—";
};

const RatingPicker = ({ value, onChange }) => (
  <div style={{ display: "flex", gap: 4 }}>
    {[0, 1, 2, 3, 4, 5].map(n => (
      <button key={n} onClick={() => onChange(n === value ? null : n)}
        style={{ width: n === 0 ? 28 : 32, height: 32, borderRadius: 6, border: `1px solid`,
          borderColor: value === n ? ratingColor(n) : T.border,
          background: value === n ? `${ratingColor(n)}22` : T.card,
          color: value === n ? ratingColor(n) : T.muted,
          cursor: "pointer", fontSize: n === 0 ? 10 : 13, fontWeight: 700, transition: "all 0.1s",
          ...mono }}>
        {n === 0 ? "–" : n}
      </button>
    ))}
  </div>
);

// ─── NAV ──────────────────────────────────────────────────────────────────────
const SHEET_URL = "https://docs.google.com/spreadsheets/d/1ZhPLyIROLABLGcDCzDm_lvGyX_cicX6GGBTDKYhs3d0/edit";

const Nav = ({ view, setView, athleteCount, coachUnlocked }) => {
  const tabs = [
    { id: "client", label: "Athlete Intake", locked: false },
    { id: "coach", label: "Coach Panel", locked: !coachUnlocked },
    { id: "db", label: `Database${athleteCount > 0 ? ` (${athleteCount})` : ""}`, locked: !coachUnlocked },
  ];
  return (
    <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 28px", borderBottom: `1px solid ${T.border}`, background: T.surface,
      position: "sticky", top: 0, zIndex: 100 }}>

      {/* GRIT Brand Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* GP Mark — official logo */}
        <img src="data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAatBhoDASIAAhEBAxEB/8QAHAABAQACAwEBAAAAAAAAAAAAAAcGCAMEBQEC/8QATxABAAEDAgIECAkJBQYGAwEAAAECAwQFEQYHEiExURMUQWFxgZGhCBciMkJVkrHBFSNUYnKTorLCM1KC0dIkNUNTc3QWJTQ2N+Fj0/Dx/8QAGwEBAAIDAQEAAAAAAAAAAAAAAAYHAwQFAgH/xABAEQEAAQIDAwoCCAUDBQEBAAAAAQIDBAURBiFREhMxQWFxkaGx0YHBFRYiMkJSU+EUM0Pw8SM0YiQ1coKSorL/2gAMAwEAAhEDEQA/ANMgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/2Q==" alt="GRIT Performance Co." style={{ width: 34, height: 34, objectFit: "contain" }} />
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1, gap: 2 }}>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 800,
            color: T.text, letterSpacing: "0.05em", lineHeight: 1 }}>GRIT</span>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 7.5, fontWeight: 500,
            color: T.muted, letterSpacing: "0.24em", textTransform: "uppercase" }}>
            Performance Co.
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 3 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setView(t.id)}
            style={{ background: view === t.id ? T.accent : "transparent",
              color: view === t.id ? "#fff" : T.muted,
              border: `1px solid ${view === t.id ? T.accent : T.border}`,
              borderRadius: 5, padding: "6px 16px", fontSize: 12, fontWeight: 600,
              cursor: "pointer", transition: "all 0.12s", fontFamily: "'Manrope', sans-serif",
              letterSpacing: "0.02em", display: "flex", alignItems: "center", gap: 5,
              opacity: t.locked && view !== t.id ? 0.7 : 1 }}>
            {t.locked && <span style={{ fontSize: 10 }}>🔒</span>}
            {t.label}
          </button>
        ))}
        {coachUnlocked && (
          <a href={SHEET_URL} target="_blank" rel="noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 6,
              background: "transparent", border: `1px solid ${T.border}`,
              borderRadius: 5, padding: "6px 14px", fontSize: 12, fontWeight: 500,
              color: T.muted, textDecoration: "none", fontFamily: "'Manrope', sans-serif",
              marginLeft: 8, transition: "all 0.12s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
            Sheet
          </a>
        )}
      </div>
    </nav>
  );
};

// ─── MOVEMENT SELF-ASSESSMENT FORM ───────────────────────────────────────────
const MovementForm = ({ data, onChange }) => {
  const set = (id, field) => (val) => onChange({ ...data, [id]: { ...(data[id] || {}), [field]: val } });

  return (
    <div>
      <div style={{ background: `${T.accent}10`, border: `1px solid ${T.accent}25`, borderRadius: 8, padding: "12px 16px", marginBottom: 20 }}>
        <div style={{ ...mono, fontSize: 9, letterSpacing: "0.18em", color: T.accent, marginBottom: 8 }}>RATING SCALE</div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[
            [5, T.weapon, "Weapon — Elite, top of your competitive tier"],
            [4, T.strength, "Strength — Above average for your tier"],
            [3, T.avg, "Average — Competent, not a differentiator"],
            [2, T.warn, "Weakness — Below average for your tier"],
            [1, T.limiter, "Limiter — Consistently fail at this in competition"],
          ].map(([n, c, label]) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ ...mono, fontSize: 12, color: c, fontWeight: 700 }}>{n}</span>
              <span style={{ fontSize: 11, color: T.muted }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {MOVEMENTS.map(({ cat, items }) => {
        const isGymnastics = cat.toUpperCase().includes("GYMNASTICS");
        return (
        <div key={cat} style={{ marginBottom: 24 }}>
          <div style={{ ...mono, fontSize: 9, letterSpacing: "0.18em", color: T.muted, textTransform: "uppercase", marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${T.border}` }}>
            {cat}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {items.map(({ id, name, ctx }) => {
              const entry = data[id] || {};
              return (
                <div key={id} style={{ display: "grid", gridTemplateColumns: "220px 1fr auto", gap: 12, alignItems: "center",
                  background: T.card, borderRadius: 8, padding: "10px 14px",
                  border: `1px solid ${entry.rating !== undefined && entry.rating !== null ? `${ratingColor(entry.rating)}30` : T.border}` }}>
                  <div>
                    <div style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>{name}</div>
                    {ctx && <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{ctx}</div>}
                  </div>
                  <input value={entry.notes || ""} onChange={e => set(id, "notes")(e.target.value)}
                    placeholder={isGymnastics ? "Max unbroken reps" : "Notes (optional)"}
                    style={{ background: "transparent", border: "none", outline: "none",
                      color: T.muted, fontSize: 12, width: "100%", fontFamily: "'Manrope', sans-serif" }} />
                  <RatingPicker value={entry.rating} onChange={set(id, "rating")} />
                </div>
              );
            })}
          </div>
        </div>
        );
      })}
    </div>
  );
};



// ─── LOCAL STORAGE HELPERS (replaces window.storage for deployed app) ─────────
const localGet = async (key) => {
  try {
    const val = localStorage.getItem(key);
    return val ? { value: val } : null;
  } catch { return null; }
};
const localSet = async (key, value) => {
  try {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    return { value };
  } catch { return null; }
};

// ─── COMPETITION DEMANDS DATABASE ────────────────────────────────────────────
// Reference data for needs analysis Part 2 — competitive context comparison
// Full event database stored in GRIT_Competition_Database.xlsx (Google Sheets)
const COMP_DEMANDS = {
  open: {
    label: "CrossFit Open",
    volume: { wall_ball: "100–150 shots", burpees: "60–100", rope_climbs: "0–5", muscle_ups: "0", row_cals: "60–150", max_lift_pct: "75–85%" },
    engine: "8–20 min events. Aerobic capacity exposed in final rounds. Breathing efficiency and pacing are differentiators.",
    gymnastics: "Kipping HSPU, CTB Pull-Ups, TTB, Bar MU (24.2 introduced). Wall walks common. No pegboard/legless RC.",
    lifting: "Moderate barbell cycling 95–135lb (M) / 65–95lb (F). Max lift events appear — typically snatch or C&J.",
    key_gaps: ["Kipping HSPU capacity", "Barbell cycling at moderate loads", "Aerobic floor under fatigue", "CTB efficiency"],
    movements_required: ["kip_hspu", "ctb", "ttb", "wall_ball", "du", "thruster", "clean_and_jerk", "snatch"],
  },
  quarterfinals: {
    label: "Quarterfinals",
    volume: { wall_ball: "150–200+ shots", burpees: "80–120", rope_climbs: "5–15", muscle_ups: "10–30 RMU", row_cals: "100–250", max_lift_pct: "80–90%" },
    engine: "7–25 min events. Long AMRAP format tests pacing and decision-making. 300 wall balls (24.2) is now a QF benchmark.",
    gymnastics: "Ring muscle-ups required. Strict HSPU appears. CTW HSPU in 23.1. Rope climbs 5–15 total. Handstand walk in 23.1. No pegboard.",
    lifting: "Heavy barbell: 185–315lb (M) DL/snatch/C&J. Ascending load formats test barbell cycling at 80%+. Max lift events (Other Total, CrossFit Total).",
    key_gaps: ["Ring muscle-up capacity", "Strict pressing (strict HSPU)", "High volume engine (300 WB, 120+ cals)", "Heavy barbell cycling (185lb+)"],
    movements_required: ["ring_mu", "strict_hspu", "rope_std", "ctb", "bar_mu", "wall_ball", "row", "handstand_walk"],
  },
  semifinals: {
    label: "Semifinals",
    volume: { wall_ball: "200–250+ shots", burpees: "100–144+", rope_climbs: "10–20+", muscle_ups: "20–40+", row_cals: "200–400+", max_lift_pct: "85–95%" },
    engine: "10–30 min events. Long AMRAPs expose aerobic floor. Multiple events across 2–3 days — recovery becomes a factor.",
    gymnastics: "Pegboard introduced. Legless rope climbs. Deficit HSPU (2–4in). Handstand walk 200ft+ expected. Elite gymnastics density.",
    lifting: "Near-maximal loading. 275–315lb barbell cycling expected. Max lift events at 90%+ of 1RM. Barbell efficiency under fatigue is critical.",
    key_gaps: ["Legless rope climbs", "Deficit HSPU", "Handstand walk volume (200ft+)", "Long aerobic pieces (20–30min)", "Heavy barbell cycling at 85%+"],
    movements_required: ["ring_mu", "legless_rope_climb", "deficit_hspu", "hs_walk", "pegboard", "row", "bike", "snatch", "clean_and_jerk"],
  },
  games: {
    label: "CrossFit Games",
    volume: { wall_ball: "200–300+ shots", burpees: "144–200+", rope_climbs: "20–30+", muscle_ups: "30–50+", row_cals: "500+", handstand_walk_ft: "450+ ft", max_lift_pct: "90%+" },
    engine: "5–35+ min events. Outdoor events (run, swim, terrain). 4–5 competition days. Aerobic base is the foundation of recovery.",
    gymnastics: "All elite movements. Pegboard density. Legless RC volume. 450+ ft HS walk across events. Deficit HSPU at 4in+. Full gymnastics toolkit required.",
    lifting: "90%+ of 1RM in competition context. Odd objects (farmer carry, sandbag, yoke). Heavy barbell across multiple events per day.",
    key_gaps: ["Full gymnastics toolkit", "Running economy", "Odd objects", "Multi-day recovery", "Sport-specific fitness at all time domains"],
    movements_required: ["ring_mu", "legless_rope_climb", "deficit_hspu", "hs_walk", "pegboard", "row", "bike", "run", "snatch", "clean_and_jerk", "back_squat", "deadlift"],
  },
  age_group: {
    label: "Age Group (35+)",
    note: "Programming largely mirrors Individual division at QF (shared in 2024 and 2026). Loads scaled ~10–30% for 55+ divisions. Ring MU and rope climbs required for 35–54. Scaling increases at 55+.",
    scaling: { "35-54": "Same as Individual Rx", "55-59": "~30% load reduction, HSPU to 2in riser, 12ft rope climbs", "60+": "Further reductions, Pike HSPU, step-overs permitted" },
  }
};

// Get competition context for a given athlete's level
const getCompContext = (level) => {
  if (!level) return null;
  const l = level.toLowerCase();
  if (l.includes("game") || l.includes("games")) return COMP_DEMANDS.games;
  if (l.includes("semi")) return COMP_DEMANDS.semifinals;
  if (l.includes("quarter") || l.includes("qf")) return COMP_DEMANDS.quarterfinals;
  if (l.includes("open") || l.includes("local") || l.includes("recreational")) return COMP_DEMANDS.open;
  if (l.includes("age") || l.includes("master")) return COMP_DEMANDS.age_group;
  return COMP_DEMANDS.quarterfinals; // default
};

// ─── GYMNASTICS BENCHMARKS ────────────────────────────────────────────────────
const GYMN_BENCHMARKS = [
  { id: "rmu_30_time", name: "30 Ring Muscle-Ups", unit: "for time", placeholder: "e.g. 3:45",
    ranges: {
      open: "15+ reps / 3+ reps",
      qf:   "< 5:40 / < 6:30",
      semi: "< 2:50 / < 3:25",
      games:"< 1:40 / < 2:00",
    }
  },
  { id: "hspu_50_strict", name: "50 Strict HSPU", unit: "for time", placeholder: "e.g. 8:20",
    ranges: {
      open: "15+ reps / 10+ reps",
      qf:   "30+ reps / 22+ reps",
      semi: "< 4:00 / < 4:30",
      games:"< 2:45 / < 3:00",
    }
  },
];

// ─── SPEED CURVE CHART + CLASSIFICATION ──────────────────────────────────────
const parseTime = (str) => {
  if (!str) return null;
  const clean = String(str).trim();
  const parts = clean.split(":").map(Number);
  if (parts.some(isNaN)) return null;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return null;
};
const speedMs = (distM, timeS) => distM / timeS;
const fmtPace = (spd) => spd > 0
  ? `${Math.floor(1000/spd/60)}:${String(Math.round(1000/spd%60)).padStart(2,"0")}`
  : "—";

// ── Classification engine ────────────────────────────────────────────────────
// fadeRatio: speed[last] / speed[first] for a series. 1.0 = no fade, <1 = fade
const fadeRatio = (series) => {
  const valid = series.filter(p => p.speed !== null);
  if (valid.length < 2) return null;
  return valid[valid.length - 1].speed / valid[0].speed;
};

// Classify based on fade ratios across both modalities
// Returns { profile, color, focus, interventions, divergence }
const classifySpeedCurve = (runSeries, rowSeries) => {
  const runFade = fadeRatio(runSeries);
  const rowFade = fadeRatio(rowSeries);

  // Use whichever series has more data, or average both if both present
  const primaryFade = (runFade !== null && rowFade !== null)
    ? (runFade + rowFade) / 2
    : (runFade ?? rowFade);

  if (primaryFade === null) return null;

  // Thresholds derived from pace-theory framework
  // <0.78 = steep fade (delivery/respiratory), >0.92 = flat curve (utilization), middle = balanced
  let profile, color, limiterLink, focus, interventions, detail;

  if (primaryFade < 0.78) {
    profile = "Steep Fade — Delivery / Respiratory Limited";
    color = "#ff6b6b";
    limiterLink = "delivery / respiratory";
    focus = "Aerobic base & speed endurance";
    detail = "High top-end speed/power but pace degrades sharply across distance. Excels at shorter durations, struggles to sustain output at longer events. Typical of delivery or respiratory limitation where oxygen supply cannot keep pace with demand at moderate-to-high intensities.";
    interventions = [
      { title: "Extended aerobic pieces (20–30 min)", desc: "Build the aerobic floor first. Longer continuous work at a pace the athlete can sustain and breathe through. Prioritize time at threshold before adding intensity." },
      { title: "Threshold intervals (B1 training)", desc: "Repeated work at maximum metabolic steady-state. The goal is accumulating time just below the point where lactate begins accumulating faster than it is cleared. Row/run repeats with 1:1 work:rest ratio." },
      { title: "Hard-start intervals", desc: "Begin above race pace, then settle into sustainable pace. Maximally stresses the pulmonary system and drives VO2max adaptations. Ideal for respiratory-limited athletes." },
      { title: "Pacing practice", desc: "Deliberate training in correct pacing strategies. Negative split and even-effort pieces across race-relevant time domains (8–18 min). Learn to extend power across the full duration." },
      { title: "Monitor: fade rate across reassessment", desc: "Goal is for the fade ratio to approach 0.85–0.90+ across a 6–8 week block. A rising floor without raising the ceiling is the priority here." },
    ];
  } else if (primaryFade > 0.92) {
    profile = "Flat Curve — Utilization Limited";
    color = T.strength;
    limiterLink = "utilization";
    focus = "Top-end power & VO2max ceiling";
    detail = "Pace is nearly identical across all distances — the classic 'single gear' athlete. Good speed endurance at a high percentage of max, but the ceiling itself is low. Lacks the ability to shift up when the race accelerates. The critical power gap is small: can sustain a high % of max for a long time, but max is the problem.";
    interventions = [
      { title: "Repeat desaturation intervals (sprint-recovery)", desc: "Short maximal efforts (15–45s) to full SmO2 nadir, full recovery to baseline. Forces tissue-level oxygen extraction and raises mitochondrial ceiling. Best performed on Echo Bike or SkiErg." },
      { title: "Extended desaturation training", desc: "2–6 min efforts at 5s/500m faster than 2K PR pace (row) or equivalent. Hold until SmO2 stops declining. Rest until SmO2 recovers. 2–6 sets. Accumulates more time at high % VO2 peak with less volume." },
      { title: "Short high-intensity intervals (B2 training)", desc: "Efforts at or just above the point where oxygen utilization outstrips supply. 3–5 min efforts, near-maximal output. The goal is to raise the speed at which the athlete hits VO2max." },
      { title: "Power development resistance work", desc: "Utilization-limited athletes benefit from resistance training that improves force-velocity output and rate of force development. Contrast methods (heavy → explosive) are appropriate." },
      { title: "Monitor: mile/1K absolute speed", desc: "The ceiling is the target metric. If the 1-mile run or 1K row improves significantly while the flat curve pattern persists, the limiter is shifting. Reassess in 4–6 weeks." },
    ];
  } else {
    profile = "Moderate Taper — Balanced / Respiratory Limited";
    color = T.warn;
    limiterLink = "respiratory (likely)";
    focus = "Respiratory capacity & threshold elevation";
    detail = "Good at middle distances, competitive across the full range. Pace tapers naturally but not dramatically. Balanced speed/power and endurance. Often excels at the 8–18 min event window that defines CrossFit competition. Respiratory limitation may cap further threshold development.";
    interventions = [
      { title: "Threshold volume (B1 training)", desc: "Sustained work just below ventilatory threshold. 5K row/run at controlled pace, or 20–30 min continuous pieces. Move the athlete's output from a balanced lower threshold to a higher one over time." },
      { title: "VO2max intervals (B2 training)", desc: "3–5 min efforts at maximal aerobic intensity. Ramp pace across the interval to stress the respiratory system progressively. Target VE:VO2 elevation in the final 90s of each effort." },
      { title: "Respiratory muscle training", desc: "Inspiratory/expiratory muscle work (POWERbreathe or equivalent). Improve diaphragm strength and fatigue resistance independently of cardiovascular load. Separate these sessions from high-demand training days." },
      { title: "Race-specific pace practice", desc: "Deliberate practice across all four pace types: competitive, specific, special, and general. Mixed-modal pieces at race pace (8–18 min) to develop the specific endurance profile needed in competition." },
      { title: "Monitor: threshold pace over time", desc: "Track sustainable threshold pace on a known test (e.g. 5K row split). A rising threshold without a proportional ceiling increase confirms respiratory limitation. Reassess at 4–6 weeks." },
    ];
  }

  // Modality divergence flag
  let divergence = null;
  if (runFade !== null && rowFade !== null) {
    const diff = Math.abs(runFade - rowFade);
    if (diff > 0.08) {
      if (runFade < rowFade) {
        divergence = { flag: "Run fades faster than Row", detail: "Suggests running economy, posterior chain endurance, or ground-contact mechanics as a sport-specific limiter layered on top of the bioenergetic profile. Running-specific threshold work and economy training warranted." };
      } else {
        divergence = { flag: "Row fades faster than Run", detail: "Suggests local pulling/postural fatigue (lats, lower back, grip) reaching its limit before the cardiovascular system. May indicate local muscle endurance as the rate-limiter on the erg rather than aerobic capacity." };
      }
    }
  }

  return { profile, color, limiterLink, focus, interventions, detail, runFade, rowFade, divergence };
};

const SpeedCurveChart = ({ benchmarks }) => {
  const [expanded, setExpanded] = useState(false);

  const runPoints = [
    { id: "mile_run", label: "1 Mile", dist: 1609 },
    { id: "5k_run", label: "5K Run", dist: 5000 },
    { id: "10k_run", label: "10K Run", dist: 10000 },
  ];
  const rowPoints = [
    { id: "1k_row", label: "1K Row", dist: 1000 },
    { id: "2k_row", label: "2K Row", dist: 2000 },
    { id: "5k_row", label: "5K Row", dist: 5000 },
  ];

  const computeSeries = (points) => points.map(({ id, label, dist }) => {
    const entry = benchmarks?.[id];
    const t = parseTime(entry?.score);
    if (!t) return { label, speed: null };
    return { label, speed: speedMs(dist, t) };
  });

  const runSeries = computeSeries(runPoints);
  const rowSeries = computeSeries(rowPoints);
  const hasRun = runSeries.some(p => p.speed !== null);
  const hasRow = rowSeries.some(p => p.speed !== null);

  if (!hasRun && !hasRow) return (
    <div style={{ background: T.card, border: `1px dashed ${T.border}`, borderRadius: 10,
      padding: "20px 24px", marginBottom: 20, textAlign: "center" }}>
      <div style={{ ...mono, fontSize: 9, letterSpacing: "0.2em", color: T.muted, marginBottom: 6 }}>SPEED CURVE</div>
      <div style={{ fontSize: 12, color: T.muted }}>
        Link an athlete and ensure they have entered run / row benchmark times to generate the speed curve.
      </div>
    </div>
  );

  const classification = classifySpeedCurve(runSeries, rowSeries);

  const allSpeeds = [...runSeries, ...rowSeries].map(p => p.speed).filter(Boolean);
  const maxSpeed = Math.max(...allSpeeds);
  const minSpeed = Math.min(...allSpeeds) * 0.88;
  const range = maxSpeed - minSpeed || 0.01;

  const W = 580, H = 200, PAD = { top: 20, right: 24, bottom: 38, left: 58 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const toY = (speed) => PAD.top + innerH - ((speed - minSpeed) / range) * innerH;
  const xs = [0, 1, 2].map(i => PAD.left + (i / 2) * innerW);

  const buildPath = (series) => {
    const pts = series.map((p, i) => ({ ...p, x: xs[i] })).filter(p => p.speed !== null);
    if (pts.length < 2) return { d: null, pts };
    const d = pts.map((p, j) => `${j === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${toY(p.speed).toFixed(1)}`).join(" ");
    return { d, pts };
  };

  const runPath = buildPath(runSeries);
  const rowPath = buildPath(rowSeries);

  const tickCount = 4;
  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const spd = minSpeed + (i / (tickCount - 1)) * range;
    return { y: toY(spd), pace: fmtPace(spd) };
  });

  // x-axis: use run labels if present, else row labels
  const xLabels = hasRun ? runPoints : rowPoints;

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Chart card */}
      <div style={{ background: T.card, border: `1px solid ${classification?.color || T.border}33`,
        borderRadius: 10, padding: "18px 20px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ ...mono, fontSize: 9, letterSpacing: "0.2em", color: T.accent }}>SPEED CURVE</div>
            {classification && (
              <div style={{ background: `${classification.color}18`, border: `1px solid ${classification.color}44`,
                borderRadius: 4, padding: "2px 8px", display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: classification.color }} />
                <span style={{ ...mono, fontSize: 9, color: classification.color, letterSpacing: "0.06em" }}>
                  {classification.focus.toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            {hasRun && <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="18" height="8"><line x1="0" y1="4" x2="18" y2="4" stroke={T.accent} strokeWidth="2" /></svg>
              <span style={{ fontSize: 10, color: T.muted }}>Run</span>
            </div>}
            {hasRow && <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="18" height="8"><line x1="0" y1="4" x2="18" y2="4" stroke={T.info} strokeWidth="2" strokeDasharray="4 2" /></svg>
              <span style={{ fontSize: 10, color: T.muted }}>Row</span>
            </div>}
          </div>
        </div>

        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
          {/* Grid */}
          {ticks.map((tk, i) => (
            <g key={i}>
              <line x1={PAD.left} x2={PAD.left + innerW} y1={tk.y} y2={tk.y}
                stroke={T.border} strokeWidth="1" />
              <text x={PAD.left - 8} y={tk.y + 4} textAnchor="end"
                fill={T.muted} fontSize="9" fontFamily="'Barlow Condensed', sans-serif">{tk.pace}/km</text>
            </g>
          ))}

          {/* X labels */}
          {xLabels.map((p, i) => (
            <text key={p.id} x={xs[i]} y={H - 4} textAnchor="middle"
              fill={T.muted} fontSize="9" fontFamily="'Barlow Condensed', sans-serif">{p.label}</text>
          ))}

          {/* Run path */}
          {runPath.d && (
            <>
              <path d={runPath.d} fill="none" stroke={T.accent} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
              {runPath.pts.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={toY(p.speed)} r="4.5" fill={T.bg} stroke={T.accent} strokeWidth="2" />
                  <text x={p.x} y={toY(p.speed) - 12} textAnchor="middle"
                    fill={T.accent} fontSize="9" fontFamily="'Barlow Condensed', sans-serif">{fmtPace(p.speed)}</text>
                </g>
              ))}
            </>
          )}

          {/* Row path */}
          {rowPath.d && (
            <>
              <path d={rowPath.d} fill="none" stroke={T.info} strokeWidth="2.5"
                strokeDasharray="6 3" strokeLinejoin="round" strokeLinecap="round" />
              {rowPath.pts.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={toY(p.speed)} r="4.5" fill={T.bg} stroke={T.info} strokeWidth="2" />
                  <text x={p.x} y={toY(p.speed) - 12} textAnchor="middle"
                    fill={T.info} fontSize="9" fontFamily="'Barlow Condensed', sans-serif">{fmtPace(p.speed)}</text>
                </g>
              ))}
            </>
          )}
        </svg>

        {/* Fade ratio badges */}
        {classification && (
          <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
            {classification.runFade !== null && (
              <div style={{ fontSize: 11, color: T.muted }}>
                Run fade: <span style={{ color: classification.runFade < 0.78 ? T.danger : classification.runFade > 0.92 ? T.strength : T.warn, ...mono, fontWeight: 700 }}>
                  {(classification.runFade * 100).toFixed(0)}%
                </span>
              </div>
            )}
            {classification.rowFade !== null && (
              <div style={{ fontSize: 11, color: T.muted }}>
                Row fade: <span style={{ color: classification.rowFade < 0.78 ? T.danger : classification.rowFade > 0.92 ? T.strength : T.warn, ...mono, fontWeight: 700 }}>
                  {(classification.rowFade * 100).toFixed(0)}%
                </span>
              </div>
            )}
            <div style={{ fontSize: 11, color: T.muted, fontStyle: "italic" }}>
              100% = no fade · &lt;78% steep fade · &gt;92% flat curve
            </div>
          </div>
        )}
      </div>

      {/* Classification panel */}
      {classification && (
        <div style={{ marginTop: 8, background: `${classification.color}08`,
          border: `1px solid ${classification.color}30`, borderRadius: 10, overflow: "hidden" }}>

          {/* Header row */}
          <div style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center",
            borderBottom: expanded ? `1px solid ${classification.color}20` : "none",
            cursor: "pointer" }} onClick={() => setExpanded(e => !e)}>
            <div>
              <div style={{ ...mono, fontSize: 9, letterSpacing: "0.16em", color: classification.color, marginBottom: 4 }}>
                SPEED CURVE PROFILE
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{classification.profile}</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
                Bioenergetic link: <span style={{ color: classification.color }}>{classification.limiterLink}</span>
                &nbsp;·&nbsp;
                Focus: <span style={{ color: T.text }}>{classification.focus}</span>
              </div>
            </div>
            <div style={{ ...mono, fontSize: 11, color: classification.color, marginLeft: 12 }}>
              {expanded ? "▲ HIDE" : "▼ INTERVENTIONS"}
            </div>
          </div>

          {expanded && (
            <div style={{ padding: "16px 18px" }}>
              {/* Profile description */}
              <div style={{ fontSize: 12, color: "#bbb", lineHeight: 1.7, marginBottom: 18,
                paddingBottom: 16, borderBottom: `1px solid ${classification.color}20` }}>
                {classification.detail}
              </div>

              {/* Divergence flag if present */}
              {classification.divergence && (
                <div style={{ background: `${T.warn}10`, border: `1px solid ${T.warn}30`, borderRadius: 8,
                  padding: "10px 14px", marginBottom: 16 }}>
                  <div style={{ ...mono, fontSize: 9, letterSpacing: "0.14em", color: T.warn, marginBottom: 4 }}>
                    ⚠ MODALITY DIVERGENCE — {classification.divergence.flag.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 12, color: "#bbb", lineHeight: 1.6 }}>{classification.divergence.detail}</div>
                </div>
              )}

              {/* Interventions */}
              <div style={{ ...mono, fontSize: 9, letterSpacing: "0.16em", color: T.muted, marginBottom: 12 }}>
                PRIORITY TRAINING INTERVENTIONS
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {classification.interventions.map((iv, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 14, alignItems: "start",
                    background: `${classification.color}06`, border: `1px solid ${classification.color}18`,
                    borderRadius: 8, padding: "10px 14px" }}>
                    <div style={{ ...mono, fontSize: 11, color: classification.color, fontWeight: 700,
                      minWidth: 18, textAlign: "center", marginTop: 1 }}>
                      {i + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 3 }}>{iv.title}</div>
                      <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.65 }}>{iv.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── MAX LIFTS & BENCHMARKS FORM ─────────────────────────────────────────────
const BenchmarkForm = ({ data, onChange, sex }) => {
  const set = (id, field) => (val) => onChange({ ...data, [id]: { ...(data[id] || {}), [field]: val } });
  const idx = (sex === "Female") ? 1 : 0;

  return (
    <div>
      <Sec title="Section A — Max Lifts (kg)">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                {["Lift", "Your Max", "Date Tested", "Open", "Quarterfinals", "Semifinals", "Games"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: "left", ...mono, fontSize: 9,
                    letterSpacing: "0.12em", color: T.muted, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LIFTS.map(({ id, name, ranges }) => {
                const entry = data[id] || {};
                const getRange = (r) => r.split(" / ")[idx];
                return (
                  <tr key={id} style={{ borderBottom: `1px solid ${T.border}` }}>
                    <td style={{ padding: "8px 10px", color: T.text, fontWeight: 500, whiteSpace: "nowrap" }}>{name}</td>
                    <td style={{ padding: "8px 10px" }}>
                      <input value={entry.max || ""} onChange={e => set(id, "max")(e.target.value)}
                        placeholder="—" style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 5,
                          padding: "5px 8px", color: T.accent, fontSize: 13, width: 90, outline: "none",
                          fontWeight: 600, ...mono }}
                        onFocus={e => e.target.style.borderColor = T.accent}
                        onBlur={e => e.target.style.borderColor = T.border} />
                    </td>
                    <td style={{ padding: "8px 10px" }}>
                      <input value={entry.date || ""} onChange={e => set(id, "date")(e.target.value)}
                        placeholder="When?" style={{ background: "transparent", border: "none", outline: "none",
                          color: T.muted, fontSize: 12, width: 110, fontFamily: "'Manrope', sans-serif" }} />
                    </td>
                    {["open", "qf", "semi", "games"].map(tier => (
                      <td key={tier} style={{ padding: "8px 10px", ...mono, fontSize: 11,
                        color: tier === "games" ? T.accent : tier === "semi" ? T.strength : tier === "qf" ? T.info : T.muted }}>
                        {getRange(ranges[tier])}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Sec>

      <Sec title="Section B — Conditioning Benchmarks">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                {["Benchmark", "Your Score", "Date Tested", "Open", "Quarterfinals", "Semifinals", "Games"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: "left", ...mono, fontSize: 9,
                    letterSpacing: "0.12em", color: T.muted, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BENCHMARKS.map(({ id, name, ranges }) => {
                const entry = data[id] || {};
                const getRange = (r) => r.split(" / ")[idx];
                return (
                  <tr key={id} style={{ borderBottom: `1px solid ${T.border}` }}>
                    <td style={{ padding: "8px 10px", color: T.text, fontWeight: 500, whiteSpace: "nowrap" }}>{name}</td>
                    <td style={{ padding: "8px 10px" }}>
                      <input value={entry.score || ""} onChange={e => set(id, "score")(e.target.value)}
                        placeholder="—" style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 5,
                          padding: "5px 8px", color: T.accent, fontSize: 13, width: 110, outline: "none",
                          fontWeight: 600, ...mono }}
                        onFocus={e => e.target.style.borderColor = T.accent}
                        onBlur={e => e.target.style.borderColor = T.border} />
                    </td>
                    <td style={{ padding: "8px 10px" }}>
                      <input value={entry.date || ""} onChange={e => set(id, "date")(e.target.value)}
                        placeholder="When?" style={{ background: "transparent", border: "none", outline: "none",
                          color: T.muted, fontSize: 12, width: 110, fontFamily: "'Manrope', sans-serif" }} />
                    </td>
                    {["open", "qf", "semi", "games"].map(tier => (
                      <td key={tier} style={{ padding: "8px 10px", ...mono, fontSize: 11,
                        color: tier === "games" ? T.accent : tier === "semi" ? T.strength : tier === "qf" ? T.info : T.muted }}>
                        {getRange(ranges[tier])}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: T.muted, fontStyle: "italic" }}>
          Reference ranges shown for {sex === "Female" ? "Female" : "Male"} athletes in kg. Times in mm:ss. Echo Bike in cals. Bike Erg in watts.
        </div>
      </Sec>

      <Sec title="Section C — Gymnastics Benchmarks">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                {["Test", "Unit", "Your Score", "Date Tested", "Open", "Quarterfinals", "Semi-Finals", "Games"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: "left", ...mono, fontSize: 9,
                    letterSpacing: "0.12em", color: T.muted, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GYMN_BENCHMARKS.map(({ id, name, unit, placeholder, ranges }) => {
                const entry = data[id] || {};
                const getRange = (r) => r ? r.split(" / ")[idx] : "—";
                return (
                  <tr key={id} style={{ borderBottom: `1px solid ${T.border}` }}>
                    <td style={{ padding: "8px 10px", color: T.text, fontWeight: 500, whiteSpace: "nowrap" }}>{name}</td>
                    <td style={{ padding: "8px 10px", color: T.muted, ...mono, fontSize: 11 }}>{unit}</td>
                    <td style={{ padding: "8px 10px" }}>
                      <input value={entry.score || ""} onChange={e => set(id, "score")(e.target.value)}
                        placeholder={placeholder} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 5,
                          padding: "5px 8px", color: T.accent, fontSize: 13, width: 120, outline: "none",
                          fontWeight: 600, ...mono }}
                        onFocus={e => e.target.style.borderColor = T.accent}
                        onBlur={e => e.target.style.borderColor = T.border} />
                    </td>
                    <td style={{ padding: "8px 10px" }}>
                      <input value={entry.date || ""} onChange={e => set(id, "date")(e.target.value)}
                        placeholder="When?" style={{ background: "transparent", border: "none", outline: "none",
                          color: T.muted, fontSize: 12, width: 110, fontFamily: "'Manrope', sans-serif" }} />
                    </td>
                    {ranges ? (
                      ["open", "qf", "semi", "games"].map(tier => (
                        <td key={tier} style={{ padding: "8px 10px", ...mono, fontSize: 11,
                          color: tier === "games" ? T.accent : tier === "semi" ? T.strength : tier === "qf" ? T.info : T.muted }}>
                          {getRange(ranges[tier])}
                        </td>
                      ))
                    ) : (
                      <td colSpan={4} style={{ padding: "8px 10px", color: T.muted, fontSize: 11, fontStyle: "italic" }}>
                        Benchmarks coming soon
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: T.muted, fontStyle: "italic" }}>
          Timed tests: enter as mm:ss (e.g. 3:45). Reference ranges shown for {sex === "Female" ? "Female" : "Male"} athletes.
          {" "}<span style={{ color: T.muted }}>Open column = minimum reps to qualify for a score / timed standard.</span>
        </div>
      </Sec>
    </div>
  );
};

// ─── MENTAL PERFORMANCE + GOAL ENGINEERING FORM ─────────────────────────────
const MENTAL_SKILLS = [
  { id: "trust_fitness", label: "Trust your fitness on competition day", desc: "Do you believe in what you've built when the pressure is on?" },
  { id: "competition_arousal", label: "Manage arousal & nerves before an event", desc: "Ability to stay calm, focused, and ready — not over or under-activated." },
  { id: "pacing_strategy", label: "Execute a pacing strategy under fatigue", desc: "Stick to the plan when the body wants to blow up or shut down." },
  { id: "recover_mistakes", label: "Recover from mistakes mid-workout", desc: "Reset after a missed lift, a fall, or a bad start without spiralling." },
  { id: "self_talk", label: "Use positive self-talk in hard moments", desc: "Internal narrative during max effort moments." },
  { id: "focus_under_crowd", label: "Maintain focus in loud / high-pressure environments", desc: "Perform on the floor the same way you do in the gym." },
  { id: "resilience_suffering", label: "Embrace suffering and stay in discomfort", desc: "Willingness to sit in the dark place and not tap out early." },
  { id: "athlete_iq", label: "Read a workout and set a smart game plan", desc: "Fitness IQ — strategy, transitions, pacing decisions before the clock starts." },
  { id: "goal_process", label: "Focus on process over outcome during competition", desc: "Stay on your own performance rather than watching the leaderboard." },
  { id: "sleep_competition", label: "Sleep well the night before competition", desc: "Quality of pre-competition sleep — often an underrated limiter." },
];

const MentalGoalsForm = ({ mentalRatings, onMentalChange, form, s }) => {
  const setRating = (id, val) => onMentalChange({ ...mentalRatings, [id]: val === mentalRatings[id] ? null : val });

  const ratingScale = [
    { val: 1, label: "1", desc: "Major limiter — costs you places on the leaderboard regularly", color: T.limiter },
    { val: 2, label: "2", desc: "Weakness — noticeably below your competition tier", color: T.warn },
    { val: 3, label: "3", desc: "Average — doesn't help or hurt you significantly", color: T.avg },
    { val: 4, label: "4", desc: "Strength — a reliable asset in competition", color: T.strength },
    { val: 5, label: "5", desc: "Weapon — a genuine competitive edge at your level", color: T.weapon },
  ];

  const completedMental = Object.keys(mentalRatings).filter(k => mentalRatings[k] !== null && mentalRatings[k] !== undefined).length;

  return (
    <div>
      {/* Mental Performance */}
      <Sec title="Layer 4A — Mental Performance Self-Assessment">
        <div style={{ background: `${T.accent}08`, border: `1px solid ${T.accent}18`, borderRadius: 8, padding: "12px 16px", marginBottom: 20 }}>
          <div style={{ ...mono, fontSize: 9, letterSpacing: "0.18em", color: T.accent, marginBottom: 8 }}>RATING SCALE — SAME 1–5 AS MOVEMENT AUDIT</div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {ratingScale.map(({ val, label, desc, color }) => (
              <div key={val} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ ...mono, fontSize: 12, color, fontWeight: 700 }}>{label}</span>
                <span style={{ fontSize: 11, color: T.muted }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {MENTAL_SKILLS.map(({ id, label, desc }) => {
            const r = mentalRatings[id];
            const rColor = r ? (r <= 1 ? T.limiter : r === 2 ? T.warn : r === 3 ? T.avg : r === 4 ? T.strength : T.weapon) : T.border;
            return (
              <div key={id} style={{
                display: "grid", gridTemplateColumns: "1fr auto",
                gap: 16, alignItems: "center",
                background: T.card, borderRadius: 8, padding: "12px 16px",
                border: `1px solid ${r ? `${rColor}40` : T.border}`,
              }}>
                <div>
                  <div style={{ fontSize: 13, color: T.text, fontWeight: 500, marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>{desc}</div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {[1,2,3,4,5].map(n => {
                    const nc = n <= 1 ? T.limiter : n === 2 ? T.warn : n === 3 ? T.avg : n === 4 ? T.strength : T.weapon;
                    return (
                      <button key={n} onClick={() => setRating(id, n)}
                        style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid`,
                          borderColor: r === n ? nc : T.border,
                          background: r === n ? `${nc}22` : T.card,
                          color: r === n ? nc : T.muted,
                          cursor: "pointer", fontSize: 13, fontWeight: 700, transition: "all 0.1s", ...mono }}>
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: T.muted, marginTop: 10 }}>
          {completedMental}/{MENTAL_SKILLS.length} rated
          {completedMental > 0 && (() => {
            const limiters = MENTAL_SKILLS.filter(m => mentalRatings[m.id] <= 2 && mentalRatings[m.id] !== null && mentalRatings[m.id] !== undefined);
            if (limiters.length === 0) return null;
            return <span style={{ color: T.warn, marginLeft: 12 }}>⚠ {limiters.length} mental limiter{limiters.length > 1 ? "s" : ""} flagged for consult</span>;
          })()}
        </div>
      </Sec>

      {/* Goal Engineering */}
      <Sec title="Layer 4B — Goal Engineering">
        <div style={{ background: `${T.info}08`, border: `1px solid ${T.info}20`, borderRadius: 8, padding: "12px 16px", marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.7 }}>
            Good goal setting goes beyond the outcome. Define your outcome, identify what stands between you and it, then build your process goals — the specific actions you'll take on a regular basis to address each obstacle.
          </div>
        </div>

        <Sec title="Outcome Goal" accent={T.info}>
          <G cols={2}>
            <F label="What is your primary outcome goal?" req>
              <TA value={form.outcomeGoal} onChange={s("outcomeGoal")} placeholder="e.g. Qualify for the CrossFit Games Age Group. Compete at Online Semifinals. Podium at my local competition." rows={2} />
            </F>
            <F label="Target timeline / next key event">
              <Inp value={form.targetTimeline} onChange={s("targetTimeline")} placeholder="e.g. Online Quarterfinals — March 2026" />
            </F>
          </G>
        </Sec>

        <Sec title="Obstacles & Process Goals" accent={T.warn}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              ["Obstacle 1", "obstacle1", "obstacle1Process", "What is the biggest thing standing between you and your outcome goal?"],
              ["Obstacle 2", "obstacle2", "obstacle2Process", "What is the second most significant obstacle?"],
              ["Obstacle 3", "obstacle3", "obstacle3Process", "What is the third obstacle — could be a skill, mental, or lifestyle factor."],
            ].map(([title, obstacleKey, processKey, placeholder]) => (
              <div key={obstacleKey} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ ...mono, fontSize: 9, color: T.warn, letterSpacing: "0.14em", marginBottom: 10 }}>{title.toUpperCase()}</div>
                <G cols={1}>
                  <F label="Describe the obstacle">
                    <Inp value={form[obstacleKey]} onChange={s(obstacleKey)} placeholder={placeholder} />
                  </F>
                  <F label="Process goal — what specific actions will you take regularly to address this?">
                    <TA value={form[processKey]} onChange={s(processKey)} placeholder="e.g. Complete 3 gymnastics skill sessions per week, submit video to coach for review each Friday..." rows={2} />
                  </F>
                </G>
              </div>
            ))}
          </div>
        </Sec>

        <Sec title="Coaching Goals" accent={T.muted}>
          <F label="What do you want from this coaching relationship specifically?">
            <TA value={form.coachingGoals} onChange={s("coachingGoals")} placeholder="What does a successful coaching relationship look like to you? What would make you feel like working with a coach was worth it?" rows={3} />
          </F>
        </Sec>
      </Sec>
    </div>
  );
};

// ─── CLIENT INTAKE FORM ───────────────────────────────────────────────────────
const emptyIntake = () => ({
  name: "", email: "", sex: "", age: "", height: "", weight: "",
  competitionLevel: "", ltadStage: "", yearsTraining: "",
  trainingDays: "", sessionLength: "",
  injuryHistory: "", currentInjuries: "", notes: "",
  assessmentType: "onboarding", date: new Date().toISOString().split("T")[0],
  movements: {}, lifts: {}, benchmarks: {},
  // Layer 3 — Mental Performance
  mentalRatings: {},
  // Layer 4 — Goal Engineering
  outcomeGoal: "", targetTimeline: "",
  obstacle1: "", obstacle1Process: "",
  obstacle2: "", obstacle2Process: "",
  obstacle3: "", obstacle3Process: "",
  coachingGoals: "", athleteStory: "",
});

const ClientForm = ({ onSave }) => {
  const [form, setForm] = useState(emptyIntake());
  const [tab, setTab] = useState("info");
  const [saved, setSaved] = useState(false);
  const s = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  const tabs = [
    { id: "info", label: "Athlete Profile" },
    { id: "movements", label: "Movement Audit" },
    { id: "benchmarks", label: "Performance Data" },
    { id: "mental", label: "Mental & Goals" },
  ];

  const completedMovements = Object.keys(form.movements).filter(k => form.movements[k]?.rating !== undefined && form.movements[k]?.rating !== null).length;
  const totalMovements = MOVEMENTS.reduce((a, c) => a + c.items.length, 0);

  const handleSave = () => {
    if (!form.name) { alert("Name is required"); return; }
    onSave({ ...form, id: Date.now(), type: "athlete" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setForm(emptyIntake());
    setTab("info");
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "36px 24px" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ ...mono, fontSize: 9, letterSpacing: "0.2em", color: T.accent, marginBottom: 8 }}>GRIT PERFORMANCE CO.</div>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 800, color: T.text, marginBottom: 4, letterSpacing: "0.02em" }}>Athlete Onboarding</h1>
        <p style={{ color: T.muted, fontSize: 13 }}>Movement audit · Performance data · Mental performance & goals</p>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 2, marginBottom: 24, background: T.surface, borderRadius: 8, padding: 3, border: `1px solid ${T.border}`, width: "fit-content" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ background: tab === t.id ? T.card : "transparent",
              color: tab === t.id ? T.text : T.muted,
              border: `1px solid ${tab === t.id ? T.border : "transparent"}`,
              borderRadius: 6, padding: "7px 16px", fontSize: 12, fontWeight: 500,
              cursor: "pointer", fontFamily: "'Manrope', sans-serif", transition: "all 0.1s" }}>
            {t.label}
            {t.id === "movements" && completedMovements > 0 && (
              <span style={{ marginLeft: 6, background: `${T.accent}22`, color: T.accent, borderRadius: 10,
                padding: "1px 6px", fontSize: 10, ...mono }}>{completedMovements}/{totalMovements}</span>
            )}
          </button>
        ))}
      </div>

      <div style={{ background: T.surface, borderRadius: 12, padding: "28px", border: `1px solid ${T.border}` }}>
        {tab === "info" && (
          <>
            <Sec title="Assessment Details">
              <G cols={3}>
                <F label="Assessment Type" req>
                  <Sel value={form.assessmentType} onChange={s("assessmentType")} options={[
                    { value: "onboarding", label: "Initial Onboarding" },
                    { value: "reassessment", label: "Reassessment" },
                  ]} />
                </F>
                <F label="Date">
                  <Inp value={form.date} onChange={s("date")} type="date" />
                </F>
              </G>
            </Sec>

            <Sec title="Personal Info">
              <G cols={3}>
                <F label="Full Name" req><Inp value={form.name} onChange={s("name")} placeholder="Athlete name" /></F>
                <F label="Email"><Inp value={form.email} onChange={s("email")} placeholder="email@domain.com" /></F>
                <F label="Sex">
                  <Sel value={form.sex} onChange={s("sex")} placeholder="Select" options={["Male", "Female"]} />
                </F>
                <F label="Age"><Inp value={form.age} onChange={s("age")} type="number" placeholder="Years" /></F>
                <F label="Height (cm)"><Inp value={form.height} onChange={s("height")} placeholder="e.g. 175" /></F>
                <F label="Weight (kg)"><Inp value={form.weight} onChange={s("weight")} placeholder="e.g. 82" /></F>
              </G>
            </Sec>

            <Sec title="Athletic Background">
              <G cols={3}>
                <F label="Competition Level">
                  <Sel value={form.competitionLevel} onChange={s("competitionLevel")} placeholder="Select" options={[
                    "Recreational", "Local / Open", "Quarterfinals", "Semifinals", "CrossFit Games", "Masters"
                  ]} />
                </F>
                <F label="Years Training CrossFit">
                  <Sel value={form.yearsTraining} onChange={s("yearsTraining")} placeholder="Select" options={[
                    "< 1 year", "1–2 years", "2–3 years", "3–5 years", "5–8 years", "8+ years"
                  ]} />
                </F>
                <F label="LTAD Stage">
                  <Sel value={form.ltadStage} onChange={s("ltadStage")} placeholder="Select" options={[
                    "Learn to Train", "Train to Train", "Train to Compete", "Train to Win", "Train for Life"
                  ]} />
                </F>
                <F label="Training Days / Week">
                  <Sel value={form.trainingDays} onChange={s("trainingDays")} placeholder="Select" options={["3", "4", "5", "6", "7", "8+", "Double days"]} />
                </F>
                <F label="Avg Session Length">
                  <Sel value={form.sessionLength} onChange={s("sessionLength")} placeholder="Select" options={["60 min", "75 min", "90 min", "120 min", "2+ hours"]} />
                </F>
              </G>
            </Sec>

            <Sec title="Athlete Story">
              <G cols={1}>
                <F label="Why are you here — what's driving this?" req>
                  <TA value={form.athleteStory} onChange={s("athleteStory")} placeholder="Tell us your story. Why CrossFit? What got you into competing? What matters most to you about getting better?" rows={3} />
                </F>
              </G>
            </Sec>

            <Sec title="Recovery & Lifestyle">
              <G cols={3}>
                <F label="Recovery Quality">
                  <Sel value={form.recoveryQuality} onChange={s("recoveryQuality")} placeholder="Select" options={["Poor", "Below Average", "Average", "Good", "Excellent"]} />
                </F>
                <F label="Avg Sleep (hrs)">
                  <Sel value={form.sleepHours} onChange={s("sleepHours")} placeholder="Select" options={["< 6", "6–7", "7–8", "8–9", "9+"]} />
                </F>
                <F label="Life Stress Level">
                  <Sel value={form.stressLevel} onChange={s("stressLevel")} placeholder="Select" options={["Low", "Moderate", "High", "Very High"]} />
                </F>
              </G>
            </Sec>

            <Sec title="Injury & Health">
              <G cols={1}>
                <F label="Past Significant Injuries">
                  <TA value={form.injuryHistory} onChange={s("injuryHistory")} placeholder="Surgeries, chronic issues, anything that affected training history..." />
                </F>
                <F label="Current Limitations">
                  <TA value={form.currentInjuries} onChange={s("currentInjuries")} placeholder="Anything currently limiting movement or training..." />
                </F>
              </G>
            </Sec>

            <Sec title="Additional Notes">
              <TA value={form.notes} onChange={s("notes")} placeholder="Anything else relevant..." rows={3} />
            </Sec>
          </>
        )}

        {tab === "movements" && (
          <MovementForm data={form.movements}
            onChange={(v) => setForm(f => ({ ...f, movements: v }))} />
        )}

        {tab === "benchmarks" && (
          <BenchmarkForm
            data={{ ...form.lifts, ...form.benchmarks }}
            onChange={(v) => {
              const lifts = {};
              const benchmarks = {};
              LIFTS.forEach(l => { if (v[l.id]) lifts[l.id] = v[l.id]; });
              BENCHMARKS.forEach(b => { if (v[b.id]) benchmarks[b.id] = v[b.id]; });
              setForm(f => ({ ...f, lifts, benchmarks }));
            }}
            sex={form.sex}
          />
        )}

        {tab === "mental" && (
          <MentalGoalsForm
            mentalRatings={form.mentalRatings}
            onMentalChange={(v) => setForm(f => ({ ...f, mentalRatings: v }))}
            form={form} s={s}
          />
        )}

        <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 20, marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 12, color: T.muted }}>
            {completedMovements}/{totalMovements} movements rated
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="secondary" onClick={() => setForm(emptyIntake())}>Clear</Btn>
            <Btn onClick={handleSave}>{saved ? "✓ Saved" : "Save Athlete"}</Btn>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── COACH PANEL ──────────────────────────────────────────────────────────────
const emptyCoach = () => ({
  athleteId: "", date: new Date().toISOString().split("T")[0],
  leanMass: "", lungCap: "", movOHS: "", movHinge: "", movFrontRack: "", movNotes: "",
  snatchCJRatio: "", pushPullRatio: "", squat1RMLeft: "", squat1RMRight: "",
  strictPU5: "", strictHSPU5: "", deficitHSPU10: "", ropeClimb10: "", rowTest: "", rampTest: "",
  smO2: "", spO2: "", hrBehavior: "", cpGap: "", fatigueSite: "", breathNotes: "",
  limiter: "", movQuality: "", workCap: "", recoverability: "", adaptability: "", fitnessIQ: "",
  coachNotes: "",
});

// ─── MOVEMENT RADAR CHART ─────────────────────────────────────────────────────
const RADAR_AXES = [
  { label: "Olympic Lifting",    keys: ["snatch_heavy","snatch_mod","snatch_light","clean_heavy","clean_mod","cnj_heavy","cnj_mod","cnj_light"] },
  { label: "Squat / Lower",      keys: ["bsq_heavy","fsq_heavy","ohsq","thruster_mod","thruster_light","pistol"] },
  { label: "Barbell Pulling",    keys: ["dl_heavy","dl_mod"] },
  { label: "Gymnastics Pull",    keys: ["strict_pu","kip_pu","ctb","bar_mu","ring_mu","rope_std","rope_ll","ttb"] },
  { label: "Handstand / Press",  keys: ["kip_hspu","strict_hspu","deficit_hspu","hs_walk","wall_walk"] },
  { label: "Engine / Mono",      keys: ["burpee","du","du_cross","wall_ball"] },
  { label: "Odd Object / Carry", keys: ["sled_push","sled_pull","farmers","sandbag","db_snatch","db_cnj"] },
  { label: "Midline / Core",     keys: ["ghd","ttb","pushup","ring_dip"] },
];

const MovementRadar = ({ movements }) => {
  if (!movements || Object.keys(movements).length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
        height: 280, color: "#6B5F5A", fontSize: 12, fontStyle: "italic" }}>
        No movement data — complete the athlete intake to populate the radar.
      </div>
    );
  }

  // Average rating per axis (only rated movements, ignore unrated)
  const axisScores = RADAR_AXES.map(({ label, keys }) => {
    const rated = keys.map(k => movements[k]?.rating).filter(r => r != null && r > 0);
    const avg = rated.length ? rated.reduce((a, b) => a + b, 0) / rated.length : 0;
    return { label, score: avg, count: rated.length, total: keys.length };
  });

  const N = axisScores.length;
  const CX = 200, CY = 200, R = 155;
  const angleStep = (2 * Math.PI) / N;
  const angle = (i) => -Math.PI / 2 + i * angleStep;

  // Grid rings at 1–5
  const rings = [1, 2, 3, 4, 5];

  const pointOnRing = (i, val) => {
    const r = (val / 5) * R;
    return { x: CX + r * Math.cos(angle(i)), y: CY + r * Math.sin(angle(i)) };
  };

  // Polygon for athlete scores
  const polyPoints = axisScores.map((s, i) => pointOnRing(i, s.score));
  const polyStr = polyPoints.map(p => `${p.x},${p.y}`).join(" ");

  // Color by average
  const overall = axisScores.reduce((a, s) => a + s.score, 0) / N;
  const fillColor = overall >= 4 ? "#4CAF7D" : overall >= 3 ? "#4A9EDB" : overall >= 2 ? "#F0A500" : "#E74B22";

  return (
    <svg viewBox="0 0 400 400" style={{ width: "100%", maxWidth: 420 }}>
      {/* Grid rings */}
      {rings.map(r => {
        const pts = RADAR_AXES.map((_, i) => pointOnRing(i, r));
        const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";
        return (
          <g key={r}>
            <path d={d} fill="none" stroke="#2A2220" strokeWidth={r === 5 ? 1.5 : 0.8} />
            <text x={CX + 4} y={CY - (r / 5) * R - 3} fill="#6B5F5A"
              fontSize="8" fontFamily="'Manrope', sans-serif">{r}</text>
          </g>
        );
      })}

      {/* Axis spokes */}
      {RADAR_AXES.map((_, i) => {
        const outer = pointOnRing(i, 5);
        return <line key={i} x1={CX} y1={CY} x2={outer.x} y2={outer.y} stroke="#2A2220" strokeWidth={0.8} />;
      })}

      {/* Score polygon */}
      <polygon points={polyStr} fill={`${fillColor}25`} stroke={fillColor} strokeWidth={2} strokeLinejoin="round" />

      {/* Score dots */}
      {polyPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill={fillColor} stroke="#100C0B" strokeWidth={1.5} />
      ))}

      {/* Axis labels */}
      {RADAR_AXES.map((ax, i) => {
        const labelR = R + 22;
        const lx = CX + labelR * Math.cos(angle(i));
        const ly = CY + labelR * Math.sin(angle(i));
        const anchor = lx < CX - 10 ? "end" : lx > CX + 10 ? "start" : "middle";
        const score = axisScores[i].score;
        const scoreColor = score >= 4 ? "#4CAF7D" : score >= 3 ? "#4A9EDB" : score >= 2 ? "#F0A500" : score > 0 ? "#E74B22" : "#6B5F5A";
        return (
          <g key={i}>
            <text x={lx} y={ly - 5} textAnchor={anchor} fill="#C4B8B2"
              fontSize="9" fontFamily="'Barlow Condensed', sans-serif" fontWeight="700" letterSpacing="0.06em">
              {ax.label.toUpperCase()}
            </text>
            <text x={lx} y={ly + 8} textAnchor={anchor} fill={scoreColor}
              fontSize="10" fontFamily="'Manrope', sans-serif" fontWeight="600">
              {score > 0 ? score.toFixed(1) : "—"}
            </text>
          </g>
        );
      })}

      {/* Centre dot */}
      <circle cx={CX} cy={CY} r={3} fill="#2A2220" />
    </svg>
  );
};

const CoachPanel = ({ onSave, athletes }) => {
  const [form, setForm] = useState(emptyCoach());
  const [saved, setSaved] = useState(false);
  const s = (k) => (v) => setForm(f => ({ ...f, [k]: v }));
  const ratings = ["1 — Poor", "2 — Below Average", "3 — Average", "4 — Good", "5 — Elite"];

  const [bioOpen, setBioOpen] = useState(false);

  const lmpl = form.leanMass && form.lungCap
    ? (parseFloat(form.leanMass) / parseFloat(form.lungCap)).toFixed(1) : null;

  // Get selected athlete for radar
  const selectedAthlete = athletes.find(a => String(a.id) === String(form.athleteId));
  const athleteMovements = selectedAthlete?.movements || {};

  const handleSave = () => {
    if (!form.athleteId) { alert("Select an athlete"); return; }
    onSave({ ...form, id: Date.now(), type: "coach" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setForm(emptyCoach());
  };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "36px 24px" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ ...mono, fontSize: 9, letterSpacing: "0.2em", color: T.accent, marginBottom: 8 }}>GRIT PERFORMANCE CO.</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 800, color: T.text, letterSpacing: "0.02em" }}>Coach Assessment Panel</h1>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.danger }} />
            <span style={{ ...mono, fontSize: 9, letterSpacing: "0.16em", color: T.muted }}>INTERNAL — NOT VISIBLE TO ATHLETES</span>
          </div>
        </div>
      </div>

      <div style={{ background: T.surface, borderRadius: 12, padding: 28, border: `1px solid ${T.border}` }}>
        <Sec title="Athlete & Session">
          <G cols={2}>
            <F label="Athlete" req>
              <Sel value={form.athleteId} onChange={s("athleteId")} placeholder="Select athlete"
                options={athletes.filter(a => !a.type || a.type === "athlete").map(a => ({ value: a.id.toString(), label: a.name }))} />
            </F>
            <F label="Date"><Inp value={form.date} onChange={s("date")} type="date" /></F>
          </G>
        </Sec>

        {/* Movement Radar */}
        <Sec title="Movement Profile Radar">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "center" }}>
            <MovementRadar movements={athleteMovements} />
            <div>
              <div style={{ ...mono, fontSize: 9, letterSpacing: "0.16em", color: T.muted, marginBottom: 12 }}>CATEGORY BREAKDOWN</div>
              {RADAR_AXES.map(({ label, keys }) => {
                const rated = keys.map(k => athleteMovements[k]?.rating).filter(r => r != null && r > 0);
                const avg = rated.length ? (rated.reduce((a, b) => a + b, 0) / rated.length) : 0;
                const pct = (avg / 5) * 100;
                const color = avg >= 4 ? "#4CAF7D" : avg >= 3 ? "#4A9EDB" : avg >= 2 ? "#F0A500" : avg > 0 ? "#E74B22" : "#2A2220";
                const label5 = avg >= 4.5 ? "Weapon" : avg >= 3.5 ? "Strength" : avg >= 2.5 ? "Average" : avg >= 1.5 ? "Weakness" : avg > 0 ? "Limiter" : "No data";
                return (
                  <div key={label} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 11, color: T.textDim }}>{label}</span>
                      <span style={{ fontSize: 11, color, ...mono, fontWeight: 600 }}>
                        {avg > 0 ? `${avg.toFixed(1)} — ${label5}` : "—"}
                      </span>
                    </div>
                    <div style={{ height: 4, background: "#2A2220", borderRadius: 2 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2, transition: "width 0.4s ease" }} />
                    </div>
                  </div>
                );
              })}
              <div style={{ marginTop: 14, padding: "10px 14px", background: "#100C0B", borderRadius: 8, border: "1px solid #2A2220" }}>
                <div style={{ ...mono, fontSize: 9, letterSpacing: "0.14em", color: T.muted, marginBottom: 4 }}>RATING SCALE</div>
                {[[5,"#4CAF7D","Weapon"],[4,"#4CAF7D","Strength"],[3,"#4A9EDB","Average"],[2,"#F0A500","Weakness"],[1,"#E74B22","Limiter"]].map(([n,c,l]) => (
                  <div key={n} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                    <span style={{ ...mono, fontSize: 10, color: c, fontWeight: 700, width: 12 }}>{n}</span>
                    <span style={{ fontSize: 10, color: T.muted }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Sec>

        <Sec title="Anthropometrics">
          <G cols={3}>
            <F label="Lean Mass — lbs (InBody)"><Inp value={form.leanMass} onChange={s("leanMass")} placeholder="e.g. 155" /></F>
            <F label="Lung Capacity — L (Piko 6)"><Inp value={form.lungCap} onChange={s("lungCap")} placeholder="e.g. 5.2" /></F>
            <F label="Lean Mass / Liter O₂">
              <div style={{ background: T.card, border: `1px solid ${lmpl ? (parseFloat(lmpl) < 30 ? T.strength : T.warn) : T.border}`,
                borderRadius: 7, padding: "9px 13px", fontSize: 13,
                color: lmpl ? (parseFloat(lmpl) < 30 ? T.strength : T.warn) : T.muted, ...mono }}>
                {lmpl ? `${lmpl} lbs/L  ${parseFloat(lmpl) < 30 ? "✓ KPI MET" : "⚠ > 30"}` : "auto-calculated"}
              </div>
            </F>
          </G>
        </Sec>

        <Sec title="Movement Screen">
          <G cols={3}>
            {[["Overhead Squat", "movOHS"], ["Hip Hinge / Deadlift", "movHinge"], ["Front Rack / Clean Catch", "movFrontRack"]].map(([label, key]) => (
              <F key={key} label={label}><Sel value={form[key]} onChange={s(key)} placeholder="Rate" options={ratings} /></F>
            ))}
          </G>
          <div style={{ marginTop: 14 }}>
            <F label="Movement Notes"><TA value={form.movNotes} onChange={s("movNotes")} placeholder="Restrictions, compensations, asymmetries..." /></F>
          </div>
        </Sec>

        {/* Speed Curve — pulls from linked athlete's benchmark data */}
        {(() => {
          const linkedAthlete = athletes.find(a => a.id.toString() === form.athleteId);
          const benchmarks = linkedAthlete
            ? { ...linkedAthlete.benchmarks }
            : {};
          return (
            <Sec title="Speed Curve Analysis">
              <SpeedCurveChart benchmarks={benchmarks} />
            </Sec>
          );
        })()}

        {/* Bioenergetic Profile — collapsible, advanced data entry */}
        <div style={{ marginBottom: 28 }}>
          <button onClick={() => setBioOpen(o => !o)}
            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%",
              background: "transparent", border: "none", cursor: "pointer", padding: 0, marginBottom: bioOpen ? 16 : 0 }}>
            <div style={{ ...mono, fontSize: 9, letterSpacing: "0.18em", color: T.muted }}>
              BIOENERGETIC PROFILE (PEIKON / LBP FRAMEWORK)
            </div>
            <div style={{ flex: 1, height: 1, background: T.border }} />
            <div style={{ ...mono, fontSize: 9, color: T.muted, flexShrink: 0 }}>
              {form.limiter ? <span style={{ color: "#ff6b6b" }}>{form.limiter.replace("_", " + ").toUpperCase()}</span> : "NOT CLASSIFIED"}
              {" "}{bioOpen ? "▲ HIDE" : "▼ EXPAND"}
            </div>
          </button>
          {bioOpen && (
            <div>
              <div style={{ background: `${T.accent}08`, border: `1px solid ${T.accent}20`, borderRadius: 8,
                padding: "10px 14px", marginBottom: 16, fontSize: 11, color: T.muted, lineHeight: 1.7 }}>
                <strong style={{ color: T.textDim }}>Note:</strong> SmO2/SpO2 data requires NIRS equipment (e.g. NNOXX, Moxy).
                Without device data, classify the limiter using observable patterns: speed curve fade profile, breathing reports,
                HR behaviour, and self-reported fatigue sites. Observable data from the speed curve and movement audit
                is often sufficient for initial classification.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
                {[
                  { label: "Respiratory", color: "#ff6b6b", markers: ["SmO2 ↓ progressive", "SpO2 drop >3%", "HR climbs to failure", "Speed curve: steep fade"] },
                  { label: "Delivery", color: T.warn, markers: ["SmO2 ↓ progressive", "HR plateaus @ 85–90%", "Strong at short efforts", "Speed curve: moderate fade"] },
                  { label: "Utilization", color: T.strength, markers: ["SmO2 HIGH at failure", "Small CP gap", "'Fixed gear' pattern", "Speed curve: flat / no fade"] },
                ].map(({ label, color, markers }) => (
                  <div key={label} style={{ background: `${color}08`, border: `1px solid ${color}30`, borderRadius: 8, padding: 12 }}>
                    <div style={{ ...mono, fontSize: 9, letterSpacing: "0.14em", color, marginBottom: 8 }}>{label.toUpperCase()}</div>
                    {markers.map(m => <div key={m} style={{ fontSize: 11, color: T.muted, marginBottom: 3 }}>· {m}</div>)}
                  </div>
                ))}
              </div>
              <G cols={2}>
                <F label="SmO2 Behavior (if tested)">
                  <Sel value={form.smO2} onChange={s("smO2")} placeholder="Select or skip" options={["Progressive decline to failure", "Plateau before failure", "Elevated / high at failure", "Not tested"]} />
                </F>
                <F label="SpO2 Change (if tested)">
                  <Sel value={form.spO2} onChange={s("spO2")} placeholder="Select or skip" options={["Minimal (<2%)", "Moderate (2–4%)", "Significant (>4%)", "Not tested"]} />
                </F>
                <F label="HR Behavior Near VO2max">
                  <Sel value={form.hrBehavior} onChange={s("hrBehavior")} placeholder="Select" options={["Climbs to failure", "Plateaus @ ~85–90%", "Early plateau", "Not tested"]} />
                </F>
                <F label="Critical Power Gap">
                  <Sel value={form.cpGap} onChange={s("cpGap")} placeholder="Select" options={["Large (high max, poor sustainability)", "Small (low max, high sustainability)", "Balanced", "Not tested"]} />
                </F>
                <F label="Primary Fatigue Site (subjective)">
                  <Sel value={form.fatigueSite} onChange={s("fatigueSite")} placeholder="Select" options={["Breathing / Can't get air in", "Cardiovascular / Heart pounding", "Local Muscle / Legs/Arms burn", "Mixed"]} />
                </F>
                <F label="Classified Limiter">
                  <Sel value={form.limiter} onChange={s("limiter")} placeholder="Classify" options={[
                    { value: "respiratory", label: "Respiratory — pulmonary ceiling" },
                    { value: "delivery", label: "Delivery — cardiovascular ceiling" },
                    { value: "utilization", label: "Utilization — muscular ceiling" },
                    { value: "resp_delivery", label: "Respiratory + Delivery (mixed)" },
                    { value: "del_util", label: "Delivery + Utilization (mixed)" },
                    { value: "undetermined", label: "Undetermined — needs testing" },
                  ]} />
                </F>
              </G>
              <div style={{ marginTop: 14 }}>
                <F label="Observable Notes (breathing reports, HR patterns, athlete descriptions)">
                  <TA value={form.breathNotes} onChange={s("breathNotes")} placeholder="e.g. Athlete reports 'can't get air in' rather than 'legs gone'. HR climbs to failure. Steep speed curve fade. Consistent with respiratory profile." rows={2} />
                </F>
              </div>
            </div>
          )}
        </div>

        {/* Lift Percentage Calculator */}
        {(() => {
          const linkedAthlete = athletes.find(a => a.id.toString() === form.athleteId);
          if (!linkedAthlete || !linkedAthlete.lifts) return null;
          const liftEntries = LIFTS.map(l => ({ name: l.name, max: linkedAthlete.lifts[l.id]?.max }))
            .filter(l => l.max && !isNaN(parseFloat(l.max)));
          if (liftEntries.length === 0) return null;
          const pcts = [95, 90, 85, 80, 75, 70, 65, 60];
          return (
            <Sec title="Lift Percentage Calculator">
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                      <th style={{ padding: "7px 10px", textAlign: "left", ...mono, fontSize: 9, letterSpacing: "0.1em", color: T.muted }}>Lift</th>
                      <th style={{ padding: "7px 10px", textAlign: "left", ...mono, fontSize: 9, letterSpacing: "0.1em", color: T.accent }}>1RM</th>
                      {pcts.map(p => (
                        <th key={p} style={{ padding: "7px 10px", textAlign: "center", ...mono, fontSize: 9, letterSpacing: "0.1em", color: T.muted }}>{p}%</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {liftEntries.map(({ name, max }) => {
                      const rm = parseFloat(max);
                      return (
                        <tr key={name} style={{ borderBottom: `1px solid ${T.border}` }}>
                          <td style={{ padding: "7px 10px", color: T.text, fontWeight: 500, whiteSpace: "nowrap" }}>{name}</td>
                          <td style={{ padding: "7px 10px", color: T.accent, ...mono, fontWeight: 700 }}>{max}</td>
                          {pcts.map(p => (
                            <td key={p} style={{ padding: "7px 10px", color: T.muted, ...mono, textAlign: "center" }}>
                              {Math.round(rm * p / 100)}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 8, fontStyle: "italic" }}>
                Based on athlete's self-reported maxes. Use for metcon stimulus checks and percentage-based programming.
              </div>
            </Sec>
          );
        })()}

        <Sec title="Coach Notes">
          <TA value={form.coachNotes} onChange={s("coachNotes")} placeholder="Full observations, hypotheses, programming rationale..." rows={4} />
        </Sec>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <Btn variant="secondary" onClick={() => setForm(emptyCoach())}>Clear</Btn>
          <Btn onClick={handleSave}>{saved ? "✓ Saved" : "Save Assessment"}</Btn>
        </div>
      </div>
    </div>
  );
};

// ─── NEEDS ANALYSIS MODAL ─────────────────────────────────────────────────────
const NeedsAnalysis = ({ athlete, coach, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState("");
  const [error, setError] = useState("");

  const getMovementSummary = () => {
    const limiters = [], weaknesses = [], weapons = [];
    MOVEMENTS.forEach(({ items }) => items.forEach(({ id, name, ctx }) => {
      const r = athlete.movements?.[id]?.rating;
      const note = athlete.movements?.[id]?.notes;
      if (r !== undefined && r !== null) {
        const label = `${name}${ctx ? ` (${ctx})` : ""}${note ? ` — "${note}"` : ""}`;
        if (r <= 1) limiters.push(label);
        else if (r === 2) weaknesses.push(label);
        else if (r === 5) weapons.push(label);
      }
    }));
    return { limiters, weaknesses, weapons };
  };

  const getLiftSummary = () => {
    return LIFTS.map(({ id, name, ranges }) => {
      const entry = athlete.lifts?.[id];
      if (!entry?.max) return null;
      const sexIdx = athlete.sex === "Female" ? 1 : 0;
      return `${name}: ${entry.max}${entry.date ? ` (${entry.date})` : ""} | Ref: Open ${ranges.open.split(" / ")[sexIdx]}, Semi ${ranges.semi.split(" / ")[sexIdx]}, Games ${ranges.games.split(" / ")[sexIdx]}`;
    }).filter(Boolean).join("\n");
  };

  const getBenchmarkSummary = () => {
    return BENCHMARKS.map(({ id, name, ranges }) => {
      const entry = athlete.benchmarks?.[id];
      if (!entry?.score) return null;
      const sexIdx = athlete.sex === "Female" ? 1 : 0;
      return `${name}: ${entry.score}${entry.date ? ` (${entry.date})` : ""} | Ref: Open ${ranges.open.split(" / ")[sexIdx]}, Semi ${ranges.semi.split(" / ")[sexIdx]}`;
    }).filter(Boolean).join("\n");
  };

  const getMentalSummary = () => {
    if (!athlete.mentalRatings) return "Not completed";
    const lines = MENTAL_SKILLS.map(m => {
      const r = athlete.mentalRatings[m.id];
      if (r == null) return null;
      return `${m.label}: ${r}/5`;
    }).filter(Boolean);
    return lines.length ? lines.join("\n") : "Not completed";
  };

  const generate = async () => {
    setLoading(true); setError(""); setReport("");
    const { limiters, weaknesses, weapons } = getMovementSummary();
    const mentalLimiters = athlete.mentalRatings
      ? MENTAL_SKILLS.filter(m => athlete.mentalRatings[m.id] <= 2 && athlete.mentalRatings[m.id] != null).map(m => m.label)
      : [];
    const mentalWeapons = athlete.mentalRatings
      ? MENTAL_SKILLS.filter(m => athlete.mentalRatings[m.id] >= 4 && athlete.mentalRatings[m.id] != null).map(m => m.label)
      : [];

    const limiterClassified = coach?.limiter && coach.limiter !== "undetermined";
    const hasBioData = coach && (coach.smO2 || coach.spO2 || coach.hrBehavior);
    const speedCurvePattern = (() => {
      const b = athlete.benchmarks || {};
      const runTimes = [b.mile_run, b["5k_run"]].filter(v => v?.score);
      const rowTimes = [b["1k_row"], b["2k_row"], b["5k_row"]].filter(v => v?.score);
      if (runTimes.length < 1 && rowTimes.length < 1) return "No speed curve data available";
      return `Run: ${runTimes.map(v=>v.score).join(" → ") || "none"} | Row: ${rowTimes.map(v=>v.score).join(" → ") || "none"}`;
    })();

    // Get competition context for Part 2
    const compCtx = getCompContext(athlete.competitionLevel);
    const compContextStr = compCtx ? `
COMPETITION LEVEL CONTEXT (${compCtx.label}):
Volume benchmarks: ${JSON.stringify(compCtx.volume || {})}
Engine demands: ${compCtx.engine || ""}
Gymnastics demands: ${compCtx.gymnastics || ""}
Lifting demands: ${compCtx.lifting || ""}
Key gaps athletes at this level typically face: ${(compCtx.key_gaps || []).join(", ")}
Movements that MUST be competition-ready: ${(compCtx.movements_required || []).join(", ")}
` : "No competition context available for this level.";

    const prompt = `You are a CrossFit performance coach conducting a structured 2-part needs analysis. Your output must serve two audiences simultaneously: the athlete (clear, direct, motivating) and the coach (structured programming direction).

IMPORTANT FRAMING:
- Part 1 leads with observable data only — movement audit, benchmarks, speed curve, performance data. No speculation.
- Part 2 uses real CrossFit competition demands data to contextualise the athlete's profile against what their target level actually requires.
- Bioenergetic classification is used where data supports it. State hypotheses clearly when formal testing has not been conducted.
- Write like a coach. Use the athlete's name. Be direct.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ATHLETE PROFILE:
Name: ${athlete.name} | Age: ${athlete.age} | Sex: ${athlete.sex} | Level: ${athlete.competitionLevel}
Training: ${athlete.trainingDays} days/week, ${athlete.sessionLength} | Years: ${athlete.yearsTraining}
Recovery: ${athlete.recoveryQuality} | Sleep: ${athlete.sleepHours} | Stress: ${athlete.stressLevel}
Assessment: ${athlete.assessmentType === "reassessment" ? "REASSESSMENT" : "INITIAL ONBOARDING"}
Injuries (past): ${athlete.injuryHistory || "None"} | Current: ${athlete.currentInjuries || "None"}

ATHLETE'S OWN WORDS: ${athlete.athleteStory || "Not provided"}

MOVEMENT AUDIT (self-rated 1–5):
Weapons (4–5): ${weapons.join(", ") || "None rated"}
Limiters (1): ${limiters.join(", ") || "None"}
Weaknesses (2): ${weaknesses.join(", ") || "None"}
Movement notes: ${Object.entries(athlete.movements || {}).filter(([,v])=>v?.notes).map(([k,v])=>`${k}: ${v.notes}`).join(" | ") || "None"}

PERFORMANCE DATA:
Lifts: ${getLiftSummary() || "No data"}
Conditioning benchmarks: ${getBenchmarkSummary() || "No data"}
Speed curve (pace across distances): ${speedCurvePattern}

MENTAL PERFORMANCE:
Limiters (≤2): ${mentalLimiters.join(", ") || "None flagged"}
Weapons (≥4): ${mentalWeapons.join(", ") || "None flagged"}
${getMentalSummary()}

GOAL ENGINEERING:
Outcome: ${athlete.outcomeGoal || "Not provided"} | Timeline: ${athlete.targetTimeline || "Not provided"}
Obstacle 1: ${athlete.obstacle1 || "—"} → ${athlete.obstacle1Process || "—"}
Obstacle 2: ${athlete.obstacle2 || "—"} → ${athlete.obstacle2Process || "—"}
Obstacle 3: ${athlete.obstacle3 || "—"} → ${athlete.obstacle3Process || "—"}
What they want from coaching: ${athlete.coachingGoals || "Not provided"}

${coach ? `COACH OBSERVATIONS:
Lean Mass: ${coach.leanMass}lbs | Lung Capacity: ${coach.lungCap}L | Movement screen: OHS=${coach.movOHS}, Hinge=${coach.movHinge}, Front Rack=${coach.movFrontRack}
Movement notes: ${coach.movNotes || "None"}
${limiterClassified ? `Classified limiter: ${coach.limiter.replace("_"," + ").toUpperCase()}` : "Limiter: Not formally classified"}
${hasBioData ? `Bioenergetic markers: HR=${coach.hrBehavior} | CP Gap=${coach.cpGap} | Fatigue site=${coach.fatigueSite}` : "Formal bioenergetic testing: not conducted"}
${coach.breathNotes ? `Observable patterns: ${coach.breathNotes}` : ""}
Coach notes: ${coach.coachNotes || "None"}` : "No coach assessment completed yet."}

${compContextStr}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generate the needs analysis with these sections:

## PART 1 — ATHLETE PROFILE ANALYSIS

### Who This Athlete Is
2–3 sentences capturing their athletic identity, background, and why they're here. Use their own language. Make them feel seen.

### What The Data Shows
Lead with the most objective data — what jumps out immediately from the movement audit, speed curve, and benchmarks combined? What is confirmed by multiple data points vs what is a single signal? Be grounded in observable evidence only.

### Physical Limiters (Ranked by impact)
Top 3–4 physical gaps. For each: state the specific data point, explain why it matters at their level, and what it's costing them in competition. Be precise — not "needs more engine" but "your 2K row split of X puts you 45 seconds behind the QF standard for your sex and age."

### Aerobic Profile
Based on speed curve and conditioning data, describe their engine in plain language. ${limiterClassified ? `Coach has classified limiter as: ${coach?.limiter?.replace("_"," + ")}. Explain what this means practically.` : "Describe what the data suggests about their aerobic profile — where it's strong and where it breaks down. State this as a working hypothesis."} Keep technical language accessible.

### Mental Game
The 1–2 mental factors most likely to affect their competition performance. Be specific to this athlete's story — not generic.

---

## PART 2 — COMPETITIVE CONTEXT ANALYSIS

### What ${compCtx?.label || athlete.competitionLevel} Actually Requires
Open with the 3–4 most important demands of their target competition level — volume, movement standards, time domains. Use specific numbers from the competition demands data. Make it concrete.

### Profile vs Competition Requirements: Gap Analysis
Go through the athlete's profile against what their target level demands. For each major requirement, state: does this athlete currently meet it, and if not, by how much? Format as a clear comparison — not a wall of text. Identify the 2–3 biggest gaps between current profile and competition standard.

### Movement Readiness Assessment
For the key movements required at their level, assess readiness: Ready ✓ / Needs work ⚠ / Not competition-ready ✗. Base this on their movement audit ratings and self-reported notes. Be honest.

---

## COACH PROGRAMMING ROADMAP

### Priority Gaps (Ranked — Coach's Action List)
A clean ranked list of 4–5 gaps from highest to lowest coaching priority. Format: **[Gap]** — one sentence on why this ranks here and what addressing it unlocks. This is the programming roadmap.

### Next 8–12 Week Direction
Give the coach a clear structural framework:
- **Primary focus** (what gets the most training time)
- **Secondary focus** (maintained alongside primary)
- **Pull back on** (what to reduce to allow adaptation)
- **Week 4 checkpoint** (what should be measurably different)
- **Key session types** (2–3 specific session formats to prioritise — not full programmes, just clear direction)

### For ${athlete.name.split(" ")[0]}
3–4 sentences written directly to the athlete. What they need to hear about where they are, why the plan makes sense, and what success looks like. Honest, motivating, personal.

Be direct. Every sentence must earn its place. Use the athlete's name.`;

    try {
      const res = await fetch("/api/needs-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setReport(data.content?.map(b => b.text || "").join("") || "");
    } catch (e) { setError("Failed to generate. Check connection."); }
    setLoading(false);
  };

  const limiterColors = { respiratory: "#ff6b6b", delivery: T.warn, utilization: T.strength, resp_delivery: T.warn, del_util: T.warn, undetermined: T.muted };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 200,
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      padding: "32px 20px", overflowY: "auto" }}>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14,
        width: "100%", maxWidth: 800, padding: 32, position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={{ ...mono, fontSize: 9, letterSpacing: "0.2em", color: T.accent, marginBottom: 8 }}>GRIT PERFORMANCE CO. — NEEDS ANALYSIS</div>
            <h2 style={{ fontSize: 20, fontWeight: 600 }}>{athlete.name}</h2>
            <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
              {athlete.competitionLevel && <Tag color={T.info}>{athlete.competitionLevel}</Tag>}
              {athlete.sex && <Tag color={T.muted}>{athlete.sex}</Tag>}
              {athlete.ltadStage && <Tag color={T.muted}>{athlete.ltadStage}</Tag>}
              {coach?.limiter && <Tag color={limiterColors[coach.limiter] || T.muted}>{coach.limiter.replace("_", " + ").toUpperCase()}</Tag>}
            </div>
          </div>
          <Btn variant="ghost" onClick={onClose}>✕</Btn>
        </div>

        {!report && !loading && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⚡</div>
            <p style={{ color: T.muted, fontSize: 13, marginBottom: 20, maxWidth: 380, margin: "0 auto 20px" }}>
              Generate an AI-powered Needs Analysis using athlete self-assessment data, benchmark scores, and LBP framework.
            </p>
            <Btn onClick={generate}>Generate Needs Analysis</Btn>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ width: 36, height: 36, border: `3px solid ${T.border}`, borderTopColor: T.accent,
              borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 12px" }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <p style={{ color: T.muted, fontSize: 13 }}>Analyzing athlete data...</p>
          </div>
        )}

        {error && <div style={{ background: `${T.danger}15`, border: `1px solid ${T.danger}44`, borderRadius: 8, padding: 14, color: T.danger, marginBottom: 16 }}>{error}</div>}

        {report && (
          <div>
            {report.split("\n").map((line, i) => {
              if (line.startsWith("### ")) return (
                <div key={i} style={{ marginTop: 26, marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ ...mono, fontSize: 9, letterSpacing: "0.18em", color: T.accent }}>{line.replace("### ", "").toUpperCase()}</span>
                    <div style={{ flex: 1, height: 1, background: T.border }} />
                  </div>
                </div>
              );
              if (line.trim() === "") return <div key={i} style={{ height: 6 }} />;
              return <div key={i} style={{ color: "#ccc", fontSize: 13, lineHeight: 1.75, marginBottom: 3 }}>{line}</div>;
            })}
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 18, marginTop: 24, display: "flex", gap: 10 }}>
              <Btn variant="secondary" small onClick={generate}>Regenerate</Btn>
              <Btn variant="secondary" small onClick={() => {
                const el = document.createElement("textarea");
                el.value = report; document.body.appendChild(el); el.select();
                document.execCommand("copy"); document.body.removeChild(el);
              }}>Copy Report</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── DATABASE ─────────────────────────────────────────────────────────────────
const Database = ({ athletes, coaches, onAnalysis }) => {
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterLimiter, setFilterLimiter] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const limiterColors = { respiratory: "#ff6b6b", delivery: T.warn, utilization: T.strength, resp_delivery: T.warn, del_util: T.warn, undetermined: T.muted };

  const list = athletes.filter(a => !a.type || a.type === "athlete").filter(a => {
    const coach = coaches.find(c => c.athleteId === a.id.toString());
    return (!search || a.name.toLowerCase().includes(search.toLowerCase()))
      && (!filterLevel || a.competitionLevel === filterLevel)
      && (!filterLimiter || (coach && coach.limiter === filterLimiter));
  });

  const getMovementSnapshot = (a) => {
    const limiters = [], weapons = [];
    MOVEMENTS.forEach(({ items }) => items.forEach(({ id, name }) => {
      const r = a.movements?.[id]?.rating;
      if (r === 1 || r === 0) limiters.push(name);
      if (r === 5) weapons.push(name);
    }));
    return { limiters: limiters.slice(0, 4), weapons: weapons.slice(0, 4) };
  };

  return (
    <div style={{ maxWidth: 1060, margin: "0 auto", padding: "36px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
        <div>
          <div style={{ ...mono, fontSize: 9, letterSpacing: "0.2em", color: T.accent, marginBottom: 6 }}>GRIT PERFORMANCE CO.</div>
          <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Athlete Database</h1>
          <p style={{ color: T.muted, fontSize: 13 }}>{list.length} athlete{list.length !== 1 ? "s" : ""} on file</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <Inp value={search} onChange={setSearch} placeholder="Search by name..." style={{ width: 200 }} />
        <div style={{ width: 200 }}>
          <Sel value={filterLevel} onChange={setFilterLevel} placeholder="All Levels" options={["Recreational", "Local / Open", "Quarterfinals", "Semifinals", "CrossFit Games", "Masters"]} />
        </div>
        <div style={{ width: 200 }}>
          <Sel value={filterLimiter} onChange={setFilterLimiter} placeholder="All Limiters" options={[
            { value: "respiratory", label: "Respiratory" },
            { value: "delivery", label: "Delivery" },
            { value: "utilization", label: "Utilization" },
            { value: "resp_delivery", label: "Resp + Delivery" },
            { value: "del_util", label: "Del + Utilization" },
            { value: "undetermined", label: "Undetermined" },
          ]} />
        </div>
        {(search || filterLevel || filterLimiter) && (
          <Btn variant="ghost" small onClick={() => { setSearch(""); setFilterLevel(""); setFilterLimiter(""); }}>Clear</Btn>
        )}
      </div>

      {list.length === 0 ? (
        <div style={{ background: T.surface, border: `1px dashed ${T.border}`, borderRadius: 12, padding: "56px 24px", textAlign: "center" }}>
          <p style={{ color: T.muted, fontSize: 14 }}>
            {athletes.filter(a => !a.type || a.type === "athlete").length === 0
              ? "No athletes yet — submit the Athlete Intake form to get started"
              : "No athletes match the current filters"}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {list.map(a => {
            const coach = coaches.find(c => c.athleteId === a.id.toString());
            const { limiters, weapons } = getMovementSnapshot(a);
            const isExpanded = expandedId === a.id;
            const completedMov = Object.keys(a.movements || {}).filter(k => a.movements[k]?.rating !== undefined && a.movements[k]?.rating !== null).length;
            const completedLifts = Object.keys(a.lifts || {}).filter(k => a.lifts[k]?.max).length;

            return (
              <div key={a.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10,
                overflow: "hidden", transition: "border-color 0.12s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = `${T.accent}40`}
                onMouseLeave={e => e.currentTarget.style.borderColor = T.border}>
                <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 16, alignItems: "center", cursor: "pointer" }}
                  onClick={() => setExpandedId(isExpanded ? null : a.id)}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{a.name}</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {a.sex && <Tag color={T.muted} small>{a.sex}</Tag>}
                      {a.age && <Tag color={T.muted} small>{a.age}y</Tag>}
                      {a.competitionLevel && <Tag color={T.info} small>{a.competitionLevel}</Tag>}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: T.muted, marginBottom: 5 }}>Data completeness</div>
                    <div style={{ fontSize: 12, color: T.muted }}>
                      {completedMov} movements · {completedLifts} lifts
                      {coach ? " · Coach ✓" : " · No coach data"}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: T.muted, marginBottom: 5 }}>Bioenergetic Limiter</div>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {coach?.limiter ? <Tag color={limiterColors[coach.limiter] || T.muted} small>{coach.limiter.replace("_", "+")}</Tag> : <span style={{ fontSize: 11, color: T.muted }}>—</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <Btn small onClick={(e) => { e.stopPropagation(); onAnalysis(a, coach); }}>Analysis</Btn>
                    <span style={{ color: T.muted, fontSize: 12, ...mono }}>{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ borderTop: `1px solid ${T.border}`, padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                    <div>
                      <div style={{ ...mono, fontSize: 9, letterSpacing: "0.14em", color: T.danger, marginBottom: 8 }}>LIMITERS / WEAKNESSES</div>
                      {limiters.length > 0 ? limiters.map(l => <div key={l} style={{ fontSize: 12, color: T.warn, marginBottom: 3 }}>· {l}</div>)
                        : <div style={{ fontSize: 12, color: T.muted }}>None rated 1</div>}
                    </div>
                    <div>
                      <div style={{ ...mono, fontSize: 9, letterSpacing: "0.14em", color: T.weapon, marginBottom: 8 }}>WEAPONS</div>
                      {weapons.length > 0 ? weapons.map(w => <div key={w} style={{ fontSize: 12, color: T.strength, marginBottom: 3 }}>· {w}</div>)
                        : <div style={{ fontSize: 12, color: T.muted }}>None rated 5</div>}
                    </div>
                    <div>
                      <div style={{ ...mono, fontSize: 9, letterSpacing: "0.14em", color: T.muted, marginBottom: 8 }}>GOAL / TIMELINE</div>
                      <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>{a.currentGoal || "—"}</div>
                      {a.nextEvent && <div style={{ fontSize: 11, color: T.accent, marginTop: 4 }}>{a.nextEvent}</div>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── ATHLETE DASHBOARD (embedded) ────────────────────────────────────────────
// Reuses GRIT brand tokens from T. Full 5-tab dashboard wired to real athlete data.

const D_PHASE = {
  accumulation:    { label: "Accumulation",    color: "#4A9EDB", short: "ACC", goal: "Learning"   },
  intensification: { label: "Intensification", color: "#F0A500", short: "INT", goal: "Testing"    },
  pre_competition: { label: "Pre-Competition", color: "#E8864A", short: "PRE", goal: "Sharpening" },
  deload:          { label: "Deload",          color: "#4CAF7D", short: "DL",  goal: "Recovery"   },
};
const D_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const D_TABS = [
  { id: "profile", icon: "◈", label: "Profile" },
  { id: "needs",   icon: "⚡", label: "Needs Analysis" },
  { id: "metrics", icon: "◎", label: "Metrics" },
  { id: "goals",   icon: "◇", label: "Goals" },
  { id: "plan",    icon: "▦", label: "Periodisation" },
];
const D_MENTAL_LABELS = {
  trust_fitness: "Trust fitness on comp day", competition_arousal: "Manage arousal & nerves",
  pacing_strategy: "Execute pacing under fatigue", recover_mistakes: "Recover from mistakes",
  self_talk: "Positive self-talk", focus_under_crowd: "Focus in loud environments",
  resilience_suffering: "Embrace suffering", athlete_iq: "Fitness IQ / game plan",
  goal_process: "Process over outcome", sleep_competition: "Pre-comp sleep",
};
const D_LIFT_RANGES = {
  back_squat:  { name: "Back Squat",    ranges: { open:[143,102], qf:[166,120], semi:[184,134], games:[202,143] } },
  front_squat: { name: "Front Squat",   ranges: { open:[125,88],  qf:[143,104], semi:[161,118], games:[175,129] } },
  snatch:      { name: "Snatch",        ranges: { open:[93,61],   qf:[107,73],  semi:[120,84],  games:[134,93]  } },
  squat_clean: { name: "Squat Clean",   ranges: { open:[125,84],  qf:[143,98],  semi:[157,109], games:[170,120] } },
  deadlift:    { name: "Deadlift",      ranges: { open:[184,125], qf:[206,143], semi:[227,157], games:[247,170] } },
  oh_squat:    { name: "Overhead Squat",ranges: { open:[102,70],  qf:[120,84],  semi:[134,95],  games:[148,107] } },
  thruster:    { name: "Thruster",      ranges: { open:[102,70],  qf:[120,84],  semi:[134,95],  games:[143,102] } },
  push_press_lift: { name: "Push Press",ranges: { open:[93,59],   qf:[107,70],  semi:[118,79],  games:[129,86]  } },
};
const D_COND_RANGES = {
  mile_run: { name: "1 Mile Run",  ranges: { qf: "5:50/6:30", semi: "5:25/6:00" } },
  "5k_run": { name: "5K Run",     ranges: { qf: "20:00/22:00", semi: "18:30/20:30" } },
  "10k_run":{ name: "10K Run",    ranges: { qf: "43:00/47:00", semi: "40:00/44:00" } },
  "1k_row": { name: "1K Row",     ranges: { qf: "3:10/3:40", semi: "3:02/3:30" } },
  "2k_row": { name: "2K Row",     ranges: { qf: "6:40/7:35", semi: "6:25/7:15" } },
  "5k_row": { name: "5K Row",     ranges: { qf: "17:30/20:00", semi: "16:45/19:00" } },
  echo_10min: { name: "Echo Bike 10min (cals)", ranges: { qf: "210/155", semi: "235/175" } },
};
const D_PCTS = [95, 90, 85, 80, 75, 70];

const dRatingColor = r => r >= 5 ? T.accent : r >= 4 ? "#4CAF7D" : r === 3 ? "#4A9EDB" : r === 2 ? "#F0A500" : T.danger;
const dTierColor = t => t === "games" ? T.accent : t === "semi" ? "#4CAF7D" : t === "qf" ? "#4A9EDB" : t === "open" ? T.muted : T.danger;

// ── Shared mini-components inside dashboard ─────────────────────────────────
const DCard = ({ children, style: s = {}, accent }) => (
  <div style={{ background: "#1E1814", borderRadius: 10, border: `1px solid ${accent ? `${accent}30` : "#2A2220"}`, ...s }}>{children}</div>
);
const DLabel = ({ children, color = T.accent }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", color, textTransform: "uppercase" }}>{children}</span>
    <div style={{ flex: 1, height: 1, background: "#2A2220" }} />
  </div>
);
const DTag = ({ color = T.muted, children }) => (
  <span style={{ background: `${color}18`, border: `1px solid ${color}40`, color, borderRadius: 4, padding: "1px 7px", fontSize: 9, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "0.08em", whiteSpace: "nowrap", textTransform: "uppercase" }}>{children}</span>
);

// ── Profile ──────────────────────────────────────────────────────────────────
const DProfileTab = ({ athlete }) => {
  const movLimiters = Object.entries(athlete.movements || {}).filter(([,v]) => v?.rating <= 2).map(([k, v]) => ({ key: k, rating: v.rating, notes: v.notes }));
  const movWeapons  = Object.entries(athlete.movements || {}).filter(([,v]) => v?.rating >= 4).map(([k, v]) => ({ key: k, rating: v.rating }));
  const mentalFlags = Object.entries(athlete.mentalRatings || {}).filter(([,v]) => v <= 2).map(([k]) => D_MENTAL_LABELS[k]).filter(Boolean);
  const info = [["Age",`${athlete.age}y`],["Sex",athlete.sex],["Height",`${athlete.height}"`],["Weight",`${athlete.weight}lbs`],["Training",`${athlete.trainingDays}×/wk · ${athlete.sessionLength}`],["Years in CF",athlete.yearsTraining],["Recovery",athlete.recoveryQuality],["Sleep",athlete.sleepHours],["Stress",athlete.stressLevel]];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <DCard style={{ padding: 22 }}>
          <DLabel>Athlete Info</DLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 18px" }}>
            {info.map(([l, v]) => (
              <div key={l}>
                <div style={{ fontSize: 9, color: T.muted, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>{l}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{v || "—"}</div>
              </div>
            ))}
          </div>
        </DCard>
        <DCard style={{ padding: 22 }}>
          <DLabel>Athlete Story</DLabel>
          <p style={{ fontSize: 13, color: "#C4B8B2", lineHeight: 1.8, fontStyle: "italic" }}>"{athlete.athleteStory || "No story provided."}"</p>
        </DCard>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <DCard style={{ padding: 22 }}>
          <DLabel>Movement Weapons & Limiters</DLabel>
          {movLimiters.length > 0 && (<div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.14em", color: T.danger, marginBottom: 8, fontWeight: 700 }}>LIMITERS / WEAKNESSES</div>
            {movLimiters.map(m => <div key={m.key} style={{ display: "flex", gap: 8, marginBottom: 5 }}><div style={{ width: 5, height: 5, borderRadius: "50%", background: dRatingColor(m.rating), marginTop: 5, flexShrink: 0 }} /><div><span style={{ fontSize: 12, color: "#C4B8B2", textTransform: "capitalize" }}>{m.key.replace(/_/g, " ")}</span>{m.notes && <span style={{ fontSize: 11, color: T.muted, marginLeft: 6 }}>— {m.notes}</span>}</div></div>)}
          </div>)}
          {movWeapons.length > 0 && (<div>
            <div style={{ fontSize: 9, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.14em", color: T.accent, marginBottom: 8, fontWeight: 700 }}>WEAPONS</div>
            {movWeapons.map(m => <div key={m.key} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 5 }}><div style={{ width: 5, height: 5, borderRadius: "50%", background: T.accent, flexShrink: 0 }} /><span style={{ fontSize: 12, color: "#C4B8B2", textTransform: "capitalize" }}>{m.key.replace(/_/g, " ")}</span></div>)}
          </div>)}
        </DCard>
        <DCard style={{ padding: 22 }}>
          <DLabel color="#F0A500">Mental Performance Flags</DLabel>
          {mentalFlags.length > 0 ? (<div>{mentalFlags.map(m => <div key={m} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}><div style={{ width: 5, height: 5, borderRadius: "50%", background: "#F0A500", flexShrink: 0 }} /><span style={{ fontSize: 12, color: "#C4B8B2" }}>{m}</span></div>)}</div>)
          : <p style={{ fontSize: 12, color: T.muted }}>No mental limiters flagged.</p>}
        </DCard>
      </div>
    </div>
  );
};

// ── Metrics ──────────────────────────────────────────────────────────────────
const DMetricsTab = ({ athlete }) => {
  const si = athlete.sex === "Female" ? 1 : 0;
  const getTier = (max, id) => {
    const n = parseFloat(max); if (isNaN(n)) return null;
    const r = D_LIFT_RANGES[id]?.ranges; if (!r) return null;
    if (n >= r.games[si]) return "games"; if (n >= r.semi[si]) return "semi";
    if (n >= r.qf[si]) return "qf"; if (n >= r.open[si]) return "open"; return "below";
  };
  const lifts = Object.entries(athlete.lifts || {}).filter(([,v]) => v?.max);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <DCard style={{ padding: 22 }}>
        <DLabel>Max Lifts (kg) vs. Competitive Benchmarks</DLabel>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead><tr style={{ borderBottom: `1px solid #2A2220` }}>
              {["Lift","Your Max","Date","Tier","Open","QF","Semis","Games"].map(h => <th key={h} style={{ padding:"7px 10px", textAlign:"left", fontFamily:"'Barlow Condensed', sans-serif", fontSize:9, letterSpacing:"0.12em", color:T.muted, fontWeight:700 }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {lifts.map(([id, entry]) => {
                const meta = D_LIFT_RANGES[id]; if (!meta) return null;
                const tier = getTier(entry.max, id);
                return (<tr key={id} style={{ borderBottom:`1px solid #2A2220` }}>
                  <td style={{ padding:"8px 10px", fontWeight:600, color:T.text }}>{meta.name}</td>
                  <td style={{ padding:"8px 10px", color:T.accent, fontFamily:"'Barlow Condensed', sans-serif", fontSize:15, fontWeight:800 }}>{entry.max} kg</td>
                  <td style={{ padding:"8px 10px", color:T.muted, fontSize:11 }}>{entry.date || "—"}</td>
                  <td style={{ padding:"8px 10px" }}>{tier && <DTag color={dTierColor(tier)}>{tier}</DTag>}</td>
                  {["open","qf","semi","games"].map(t => <td key={t} style={{ padding:"8px 10px", color:T.muted, fontFamily:"'Barlow Condensed', sans-serif", fontSize:12 }}>{meta.ranges[t]?.[si] ?? "—"}</td>)}
                </tr>);
              })}
            </tbody>
          </table>
        </div>
      </DCard>
      {lifts.length > 0 && (<DCard style={{ padding: 22 }}>
        <DLabel color="#4A9EDB">Programming Percentages</DLabel>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead><tr style={{ borderBottom:`1px solid #2A2220` }}>
              <th style={{ padding:"7px 10px", textAlign:"left", fontFamily:"'Barlow Condensed', sans-serif", fontSize:9, letterSpacing:"0.12em", color:T.muted, fontWeight:700 }}>LIFT</th>
              <th style={{ padding:"7px 10px", textAlign:"left", fontFamily:"'Barlow Condensed', sans-serif", fontSize:9, letterSpacing:"0.12em", color:T.accent, fontWeight:700 }}>1RM</th>
              {D_PCTS.map(p => <th key={p} style={{ padding:"7px 10px", textAlign:"center", fontFamily:"'Barlow Condensed', sans-serif", fontSize:9, color:T.muted, fontWeight:700 }}>{p}%</th>)}
            </tr></thead>
            <tbody>
              {lifts.filter(([,e]) => !isNaN(parseFloat(e.max))).map(([id, e]) => {
                const rm = parseFloat(e.max); const meta = D_LIFT_RANGES[id];
                return (<tr key={id} style={{ borderBottom:`1px solid #2A2220` }}>
                  <td style={{ padding:"7px 10px", fontWeight:600, color:T.text }}>{meta?.name || id}</td>
                  <td style={{ padding:"7px 10px", color:T.accent, fontFamily:"'Barlow Condensed', sans-serif", fontWeight:700 }}>{e.max}</td>
                  {D_PCTS.map(p => <td key={p} style={{ padding:"7px 10px", color:T.muted, fontFamily:"'Barlow Condensed', sans-serif", textAlign:"center" }}>{Math.round(rm * p / 100)}</td>)}
                </tr>);
              })}
            </tbody>
          </table>
        </div>
      </DCard>)}
      <DCard style={{ padding: 22 }}>
        <DLabel color="#4CAF7D">Conditioning Benchmarks</DLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {Object.entries(athlete.benchmarks || {}).map(([id, entry]) => {
            const meta = D_COND_RANGES[id]; if (!meta || !entry.score) return null;
            const [mRef, fRef] = (meta.ranges.qf || "/").split("/");
            const ref = si === 0 ? mRef?.trim() : fRef?.trim();
            return (<div key={id} style={{ background:"#161210", border:`1px solid #2A2220`, borderRadius:8, padding:"12px 14px" }}>
              <div style={{ fontSize:9, fontFamily:"'Barlow Condensed', sans-serif", letterSpacing:"0.1em", color:T.muted, marginBottom:5, fontWeight:700 }}>{meta.name.toUpperCase()}</div>
              <div style={{ fontSize:20, fontFamily:"'Barlow Condensed', sans-serif", fontWeight:800, color:T.text, lineHeight:1 }}>{entry.score}</div>
              <div style={{ fontSize:10, color:T.muted, marginTop:4 }}>QF: {ref || "—"} · {entry.date || "—"}</div>
            </div>);
          })}
        </div>
      </DCard>
    </div>
  );
};

// ── Goals ────────────────────────────────────────────────────────────────────
const DGoalsTab = ({ athlete }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <DCard style={{ padding: 22 }}>
        <DLabel>Outcome Goal</DLabel>
        <div style={{ fontSize: 18, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, color: T.text, lineHeight: 1.3, marginBottom: 8 }}>{athlete.outcomeGoal || "Not set"}</div>
        <div style={{ fontSize: 12, color: T.muted }}><span style={{ color: T.accent, fontWeight: 600 }}>Timeline: </span>{athlete.targetTimeline || "Not set"}</div>
      </DCard>
      {[1,2,3].map(n => {
        const ok = athlete[`obstacle${n}`], proc = athlete[`obstacle${n}Process`];
        if (!ok) return null;
        return (<DCard key={n} style={{ padding: 18 }}>
          <div style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:10 }}>
            <div style={{ width:22, height:22, borderRadius:5, background:"#F0A50018", border:"1px solid #F0A50040", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ fontFamily:"'Barlow Condensed', sans-serif", fontSize:11, fontWeight:800, color:"#F0A500" }}>{n}</span>
            </div>
            <div><div style={{ fontSize:9, fontFamily:"'Barlow Condensed', sans-serif", letterSpacing:"0.14em", color:"#F0A500", fontWeight:700, marginBottom:4 }}>OBSTACLE</div>
            <div style={{ fontSize:13, fontWeight:600, color:T.text }}>{ok}</div></div>
          </div>
          {proc && <div style={{ background:"#161210", borderRadius:6, padding:"9px 12px", borderLeft:"3px solid #4CAF7D" }}>
            <div style={{ fontSize:9, fontFamily:"'Barlow Condensed', sans-serif", letterSpacing:"0.12em", color:"#4CAF7D", fontWeight:700, marginBottom:3 }}>PROCESS GOAL</div>
            <div style={{ fontSize:12, color:"#C4B8B2", lineHeight:1.6 }}>{proc}</div>
          </div>}
        </DCard>);
      })}
    </div>
    <DCard style={{ padding: 22 }}>
      <DLabel color="#F0A500">Mental Performance Ratings</DLabel>
      <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
        {Object.entries(athlete.mentalRatings || {}).map(([id, rating]) => {
          const label = D_MENTAL_LABELS[id]; if (!label) return null;
          const c = dRatingColor(rating);
          return (<div key={id} style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:12, alignItems:"center" }}>
            <div><div style={{ fontSize:12, color:"#C4B8B2", marginBottom:4 }}>{label}</div>
            <div style={{ height:3, background:"#2A2220", borderRadius:2, overflow:"hidden" }}>
              <div style={{ width:`${(rating/5)*100}%`, height:"100%", background:c, borderRadius:2 }} /></div></div>
            <div style={{ fontFamily:"'Barlow Condensed', sans-serif", fontWeight:800, fontSize:15, color:c, minWidth:18, textAlign:"right" }}>{rating}</div>
          </div>);
        })}
      </div>
    </DCard>
  </div>
);

// ── Needs Analysis ────────────────────────────────────────────────────────────
const DNeedsTab = ({ athlete, coach }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState("");
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true); setError(""); setReport("");
    const movL = Object.entries(athlete.movements||{}).filter(([,v])=>v?.rating<=2).map(([k,v])=>`${k.replace(/_/g," ")}${v.notes?` ("${v.notes}")`:""}` );
    const movW = Object.entries(athlete.movements||{}).filter(([,v])=>v?.rating>=4).map(([k])=>k.replace(/_/g," "));
    const mentL = Object.entries(athlete.mentalRatings||{}).filter(([,v])=>v<=2).map(([k])=>k.replace(/_/g," "));
    const coachSec = coach ? `COACH: Limiter=${coach.limiter} | SmO2=${coach.smO2} | HR=${coach.hrBehavior} | CP Gap=${coach.cpGap} | KPIs: Mov=${coach.movQuality} Cap=${coach.workCap} Rec=${coach.recoverability} Adapt=${coach.adaptability} IQ=${coach.fitnessIQ} | Notes: ${coach.coachNotes}` : "No coach assessment.";
    const prompt = `Elite CrossFit coach, LBP model. Concise Needs Analysis.

${athlete.name}, ${athlete.age}y ${athlete.sex}, ${athlete.competitionLevel}
Story: "${athlete.athleteStory||"N/A"}"
Training: ${athlete.trainingDays}×/wk ${athlete.sessionLength} | Recovery: ${athlete.recoveryQuality} Sleep: ${athlete.sleepHours} Stress: ${athlete.stressLevel}
Movement weapons: ${movW.join(", ")||"None"} | Limiters: ${movL.join(", ")||"None"}
Lifts (kg): ${Object.entries(athlete.lifts||{}).filter(([,v])=>v.max).map(([k,v])=>`${k.replace(/_/g," ")} ${v.max}`).join(", ")||"None"}
Benchmarks: ${Object.entries(athlete.benchmarks||{}).filter(([,v])=>v.score).map(([k,v])=>`${k.replace(/_/g," ")} ${v.score}`).join(", ")||"None"}
Mental limiters: ${mentL.join(", ")||"None"} | Trust fitness: ${athlete.mentalRatings?.trust_fitness||"?"}/5
Goal: ${athlete.outcomeGoal} by ${athlete.targetTimeline}
Obstacles: 1) ${athlete.obstacle1} → ${athlete.obstacle1Process} | 2) ${athlete.obstacle2} → ${athlete.obstacle2Process} | 3) ${athlete.obstacle3} → ${athlete.obstacle3Process}
${coachSec}

### Executive Summary
### Primary Performance Gaps (top 4, ranked)
### Bioenergetic Limiter ${coach?.limiter ? "— " + coach.limiter : "Hypothesis"}
### Mental Performance Priority
### Training Priorities — Next Block
### 8-Week Direction

Direct coach voice, not academic.`;
    try {
      const res = await fetch("/api/needs-analysis", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ prompt }) });
      const d = await res.json();
      setReport(d.content?.map(b=>b.text||"").join("")||"");
    } catch { setError("Failed to generate."); }
    setLoading(false);
  };

  return (
    <DCard style={{ padding: 26 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
        <div><DLabel>Needs Analysis</DLabel><p style={{ fontSize:12, color:T.muted, marginTop:-10 }}>AI-generated · LBP framework</p></div>
        <div style={{ display:"flex", gap:8 }}>
          {report && <button onClick={()=>{const e=document.createElement("textarea");e.value=report;document.body.appendChild(e);e.select();document.execCommand("copy");document.body.removeChild(e);}} style={{ background:"transparent", border:`1px solid #2A2220`, color:T.muted, borderRadius:6, padding:"7px 14px", fontSize:12, cursor:"pointer", fontFamily:"'Manrope', sans-serif" }}>Copy</button>}
          <button onClick={generate} disabled={loading} style={{ background:T.accent, border:"none", color:"#fff", borderRadius:6, padding:"8px 18px", fontSize:12, fontWeight:600, cursor:loading?"not-allowed":"pointer", opacity:loading?0.7:1, fontFamily:"'Manrope', sans-serif" }}>{loading?"Generating…":report?"Regenerate":"Generate Analysis"}</button>
        </div>
      </div>
      {!report&&!loading&&!error&&(<div style={{ textAlign:"center", padding:"40px 0", color:T.muted }}><div style={{ fontSize:28, marginBottom:10 }}>⚡</div><p style={{ fontSize:13 }}>Generate a Needs Analysis for {athlete.name}.</p></div>)}
      {loading&&(<div style={{ textAlign:"center", padding:"40px 0" }}><div style={{ width:28,height:28,border:`3px solid #2A2220`,borderTopColor:T.accent,borderRadius:"50%",animation:"spin 0.7s linear infinite",margin:"0 auto 10px" }} /><p style={{ fontSize:12, color:T.muted }}>Analysing…</p></div>)}
      {error&&<div style={{ background:`${T.danger}15`,border:`1px solid ${T.danger}40`,borderRadius:8,padding:14,color:T.danger,fontSize:13 }}>{error}</div>}
      {report&&report.split("\n").map((line,i)=>{
        if(line.startsWith("### ")) return (<div key={i} style={{ marginTop:22, marginBottom:8 }}><div style={{ display:"flex", alignItems:"center", gap:8 }}><span style={{ fontFamily:"'Barlow Condensed', sans-serif", fontSize:10, fontWeight:800, letterSpacing:"0.2em", color:T.accent }}>{line.replace("### ","").toUpperCase()}</span><div style={{ flex:1, height:1, background:"#2A2220" }} /></div></div>);
        if(line.trim()==="") return <div key={i} style={{ height:5 }} />;
        return <div key={i} style={{ fontSize:13, color:"#C4B8B2", lineHeight:1.8, marginBottom:2 }}>{line}</div>;
      })}
    </DCard>
  );
};

// ── Periodisation ─────────────────────────────────────────────────────────────
const DPlanTab = ({ athlete, plan, setPlan }) => {
  const [timelineOpen, setTimelineOpen] = useState(true);
  const [expandedBlocks, setExpandedBlocks] = useState({});
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [nb, setNb] = useState({ phase:"accumulation", label:"", startDate:"", durationWeeks:4, focusPoints:[""], bienergeticFocus:"", notes:"" });

  const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  // ── helpers ──────────────────────────────────────────────────────────────────
  const toggleBlock = id => setExpandedBlocks(s => ({ ...s, [id]: !s[id] }));
  const toggleWeek  = key => setExpandedWeeks(s => ({ ...s, [key]: !s[key] }));

  // Auto-calculate start date: end of previous block
  const getAutoStart = () => {
    const blocks = plan.blocks ?? [];
    if (blocks.length === 0) return "";
    const last = blocks[blocks.length - 1];
    if (!last.startDate) return "";
    const base = new Date(last.startDate);
    if (isNaN(base)) return "";
    base.setDate(base.getDate() + (last.durationWeeks || 4) * 7);
    return base.toISOString().split("T")[0];
  };

  const sf = k => v => setEditForm(f => ({ ...f, [k]: v }));
  const openEdit = b => { setEditId(b.id); setEditForm({ ...b, focusPoints: [...(b.focusPoints||[])] }); };
  const saveEdit = () => { setPlan({ ...plan, blocks: (plan.blocks??[]).map(b => b.id===editId ? {...editForm} : b) }); setEditId(null); };
  const delBlock = id => setPlan({ ...plan, blocks: (plan.blocks??[]).filter(b => b.id!==id) });
  const addBlock = () => {
    const block = { ...nb, id:`b${Date.now()}`, focusPoints: nb.focusPoints.filter(f=>f.trim()), weekSchedule: {} };
    setPlan({ ...plan, blocks: [...(plan.blocks??[]), block] });
    setAdding(false);
    setNb({ phase:"accumulation", label:"", startDate: getAutoStart(), durationWeeks:4, focusPoints:[""], bienergeticFocus:"", notes:"" });
  };

  // Update a single session (AM/PM) in a block's week schedule
  const updateSession = (blockId, weekNum, day, session, value) => {
    const blocks = (plan.blocks??[]).map(b => {
      if (b.id !== blockId) return b;
      const ws = { ...(b.weekSchedule||{}) };
      const wk = { ...(ws[weekNum]||{}) };
      const dy = { ...(wk[day]||{}) };
      dy[session] = value;
      wk[day] = dy;
      ws[weekNum] = wk;
      return { ...b, weekSchedule: ws };
    });
    setPlan({ ...plan, blocks });
  };

  // Timeline calculations
  // Derive month number from startDate for timeline positioning
  const blockStartMonth = b => {
    if (b.startDate) { const d = new Date(b.startDate); if (!isNaN(d)) return d.getMonth() + 1; }
    return 1;
  };
  const allM = (plan.blocks??[]).flatMap(b => Array.from({length:Math.ceil(b.durationWeeks/4.33)},(_,i)=>blockStartMonth(b)+i));
  const minM = Math.min(...allM, 1), maxM = Math.max(...allM, 12);
  const tlMonths = Array.from({length:maxM-minM+1},(_,i)=>minM+i);
  const mW = 52;

  const iStyle = { background:"#100C0B", border:`1px solid #2A2220`, borderRadius:6, padding:"7px 10px", color:T.text, fontSize:12, width:"100%", outline:"none", fontFamily:"'Manrope', sans-serif" };

  const BlockEditForm = ({ vals, setVal, onSave, onCancel }) => (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <div><div style={{ fontSize:9,color:T.muted,marginBottom:4 }}>LABEL</div>
        <input value={vals.label} onChange={e=>setVal("label")(e.target.value)} placeholder="e.g. Accumulation 1" style={iStyle} /></div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
        <div><div style={{ fontSize:9,color:T.muted,marginBottom:4 }}>PHASE</div>
          <select value={vals.phase} onChange={e=>setVal("phase")(e.target.value)} style={{...iStyle,appearance:"none"}}>
            {Object.keys(D_PHASE).map(k=><option key={k} value={k} style={{background:"#100C0B"}}>{D_PHASE[k].label}</option>)}
          </select></div>
        <div><div style={{ fontSize:9,color:T.muted,marginBottom:4 }}>START DATE</div>
          <input type="date" value={vals.startDate||""} onChange={e=>setVal("startDate")(e.target.value)} style={iStyle} /></div>
        <div><div style={{ fontSize:9,color:T.muted,marginBottom:4 }}>WEEKS</div>
          <input type="number" min={1} value={vals.durationWeeks} onChange={e=>setVal("durationWeeks")(parseInt(e.target.value)||1)} style={iStyle} /></div>
      </div>
      <div><div style={{ fontSize:9,color:T.muted,marginBottom:4 }}>FOCUS POINTS</div>
        {(vals.focusPoints||[]).map((fp,i)=>(
          <div key={i} style={{ display:"flex",gap:6,marginBottom:6 }}>
            <input value={fp} onChange={e=>{const fps=[...vals.focusPoints];fps[i]=e.target.value;setVal("focusPoints")(fps);}} placeholder={`Focus ${i+1}`} style={iStyle} />
            <button onClick={()=>setVal("focusPoints")(vals.focusPoints.filter((_,j)=>j!==i))} style={{ background:"transparent",border:`1px solid #2A2220`,color:T.muted,borderRadius:5,padding:"0 8px",cursor:"pointer",flexShrink:0 }}>✕</button>
          </div>
        ))}
        <button onClick={()=>setVal("focusPoints")([...(vals.focusPoints||[]),""])} style={{ background:"transparent",border:`1px dashed #2A2220`,color:T.muted,borderRadius:6,padding:"6px 12px",fontSize:11,cursor:"pointer",width:"100%",fontFamily:"'Manrope', sans-serif" }}>+ focus point</button>
      </div>
      <div><div style={{ fontSize:9,color:T.muted,marginBottom:4 }}>BIOENERGETIC / ENERGY FOCUS</div>
        <input value={vals.bienergeticFocus||""} onChange={e=>setVal("bienergeticFocus")(e.target.value)} placeholder="e.g. Delivery — threshold intervals" style={iStyle} /></div>
      <div><div style={{ fontSize:9,color:T.muted,marginBottom:4 }}>NOTES</div>
        <textarea value={vals.notes||""} onChange={e=>setVal("notes")(e.target.value)} rows={3} style={{...iStyle,resize:"vertical"}} /></div>
      <div style={{ display:"flex",gap:10,justifyContent:"flex-end" }}>
        <button onClick={onCancel} style={{ background:"transparent",border:`1px solid #2A2220`,color:T.muted,borderRadius:6,padding:"8px 16px",fontSize:12,cursor:"pointer",fontFamily:"'Manrope', sans-serif" }}>Cancel</button>
        <button onClick={onSave} disabled={!vals.label} style={{ background:T.accent,border:"none",color:"#fff",borderRadius:6,padding:"9px 20px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Manrope', sans-serif",opacity:vals.label?1:0.5 }}>Save</button>
      </div>
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

      {/* ── Timeline card (collapsible) ─────────────────────────────────────── */}
      <DCard style={{ padding:18 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: timelineOpen ? 14 : 0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <DLabel style={{ margin:0 }}>Periodisation Plan — {plan.year}</DLabel>
            {plan.nextCompetition && <DTag color={T.accent}>{plan.nextCompetition}</DTag>}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>setAdding(true)} style={{ background:T.accent,border:"none",color:"#fff",borderRadius:6,padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Manrope', sans-serif" }}>+ Add Block</button>
            <button onClick={()=>setTimelineOpen(o=>!o)} style={{ background:"transparent",border:`1px solid #2A2220`,color:T.muted,borderRadius:6,padding:"6px 12px",fontSize:11,cursor:"pointer",fontFamily:"'Manrope', sans-serif" }}>
              {timelineOpen ? "▲ Hide" : "▼ Timeline"}
            </button>
          </div>
        </div>

        {timelineOpen && (<>
          <div style={{ overflowX:"auto", paddingBottom:6 }}>
            <div style={{ minWidth: tlMonths.length*mW+100 }}>
              <div style={{ display:"flex", marginLeft:100, marginBottom:6 }}>
                {tlMonths.map(m=><div key={m} style={{ width:mW,fontSize:9,fontFamily:"'Barlow Condensed', sans-serif",fontWeight:700,color:T.muted,letterSpacing:"0.1em",textAlign:"center" }}>{D_MONTHS[(m-1)%12]}</div>)}
              </div>
              {(plan.blocks??[]).map(block=>{
                const ph=D_PHASE[block.phase]||D_PHASE.accumulation;
                const wM=block.durationWeeks/4.33, leftOff=(blockStartMonth(block)-minM)*mW, bW=Math.max(wM*mW-4, 24);
                return (
                  <div key={block.id} style={{ display:"flex", alignItems:"center", marginBottom:4 }}>
                    <div style={{ width:100,paddingRight:10,textAlign:"right",flexShrink:0 }}>
                      <span style={{ fontSize:9,fontFamily:"'Barlow Condensed', sans-serif",fontWeight:800,color:ph.color,letterSpacing:"0.06em" }}>{ph.short}</span>
                    </div>
                    <div style={{ position:"relative", height:28, flex:1 }}>
                      <div style={{ position:"absolute",left:leftOff,width:bW,height:26,borderRadius:5,background:`${ph.color}18`,border:`1px solid ${ph.color}50`,display:"flex",alignItems:"center",paddingLeft:10,gap:8,cursor:"pointer",overflow:"hidden" }}
                        onClick={()=>toggleBlock(block.id)}
                        onMouseEnter={e=>e.currentTarget.style.borderColor=ph.color}
                        onMouseLeave={e=>e.currentTarget.style.borderColor=`${ph.color}50`}>
                        <span style={{ fontSize:11,fontWeight:600,color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{block.label}</span>
                        <span style={{ fontSize:10,color:T.muted,whiteSpace:"nowrap",flexShrink:0 }}>{block.durationWeeks}w</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ display:"flex",gap:12,flexWrap:"wrap",marginTop:10,paddingTop:10,borderTop:`1px solid #2A2220` }}>
            {Object.entries(D_PHASE).map(([k,m])=><div key={k} style={{ display:"flex",alignItems:"center",gap:5 }}><div style={{ width:7,height:7,borderRadius:2,background:m.color }} /><span style={{ fontSize:10,color:T.muted }}>{m.label}</span></div>)}
          </div>
        </>)}
      </DCard>

      {/* ── Block list (dropdown cards) ─────────────────────────────────────── */}
      {(plan.blocks??[]).map((block, blockIdx) => {
        const ph = D_PHASE[block.phase] || D_PHASE.accumulation;
        const isOpen = !!expandedBlocks[block.id];
        const weeks = Array.from({length: block.durationWeeks || 1}, (_, i) => i + 1);

        // Auto start: end of previous block
        const prevBlock = blockIdx > 0 ? (plan.blocks??[])[blockIdx - 1] : null;
        const autoStart = block.startDate
          ? new Date(block.startDate).toLocaleDateString("en-AU", {day:"numeric", month:"short", year:"numeric"})
          : prevBlock?.startDate
            ? (() => { const d = new Date(prevBlock.startDate); d.setDate(d.getDate()+(prevBlock.durationWeeks||4)*7); return d.toLocaleDateString("en-AU",{day:"numeric",month:"short",year:"numeric"}); })()
            : "No date set";

        return (
          <DCard key={block.id} accent={isOpen ? ph.color : undefined} style={{ overflow:"hidden" }}>
            {/* Block header — always visible */}
            <div style={{ padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}
              onClick={()=>toggleBlock(block.id)}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:3, height:36, borderRadius:2, background:ph.color, flexShrink:0 }} />
                <div>
                  <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:3 }}>
                    <DTag color={ph.color}>{ph.label}</DTag>
                    <span style={{ fontSize:11, color:T.muted }}>{block.durationWeeks}w</span>
                    <span style={{ fontSize:11, color:T.muted }}>·</span>
                    <span style={{ fontSize:11, color:T.muted }}>Starts {autoStart}</span>
                  </div>
                  <div style={{ fontSize:14, fontWeight:700, color:T.text, lineHeight:1 }}>{block.label || "Untitled Block"}</div>
                  {!isOpen && block.focusPoints?.length > 0 && (
                    <div style={{ fontSize:11, color:T.muted, marginTop:4 }}>{block.focusPoints.slice(0,2).join(" · ")}{block.focusPoints.length > 2 ? ` +${block.focusPoints.length-2} more` : ""}</div>
                  )}
                </div>
              </div>
              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                <button onClick={e=>{e.stopPropagation();openEdit(block);}} style={{ background:"transparent",border:`1px solid #2A2220`,color:T.muted,borderRadius:5,padding:"4px 10px",fontSize:11,cursor:"pointer",fontFamily:"'Manrope', sans-serif" }}>Edit</button>
                <button onClick={e=>{e.stopPropagation();delBlock(block.id);}} style={{ background:"transparent",border:`1px solid #2A2220`,color:T.muted,borderRadius:5,padding:"4px 10px",fontSize:11,cursor:"pointer",fontFamily:"'Manrope', sans-serif" }}>✕</button>
                <span style={{ fontSize:11, color:T.muted, marginLeft:4, ...mono }}>{isOpen ? "▲" : "▼"}</span>
              </div>
            </div>

            {/* Block body — shown when expanded */}
            {isOpen && (
              <div style={{ borderTop:`1px solid #2A2220`, padding:"18px 18px 20px" }}>

                {/* Block overview */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
                  {block.focusPoints?.length > 0 && (
                    <div>
                      <div style={{ fontSize:9,fontFamily:"'Barlow Condensed', sans-serif",letterSpacing:"0.14em",color:T.muted,fontWeight:700,marginBottom:8 }}>FOCUS POINTS</div>
                      {block.focusPoints.map((fp,i) => (
                        <div key={i} style={{ display:"flex",gap:7,alignItems:"flex-start",marginBottom:5 }}>
                          <div style={{ width:4,height:4,borderRadius:"50%",background:ph.color,marginTop:5,flexShrink:0 }} />
                          <span style={{ fontSize:12,color:"#C4B8B2",lineHeight:1.5 }}>{fp}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div>
                    {block.bienergeticFocus && (
                      <div style={{ background:`${T.accent}0a`,border:`1px solid ${T.accent}20`,borderRadius:6,padding:"8px 12px",marginBottom:10 }}>
                        <div style={{ fontSize:9,fontFamily:"'Barlow Condensed', sans-serif",color:T.accent,letterSpacing:"0.1em",fontWeight:700,marginBottom:3 }}>ENERGY FOCUS</div>
                        <div style={{ fontSize:12,color:"#C4B8B2" }}>{block.bienergeticFocus}</div>
                      </div>
                    )}
                    {block.notes && (
                      <div style={{ fontSize:12,color:T.muted,fontStyle:"italic",lineHeight:1.7 }}>{block.notes}</div>
                    )}
                  </div>
                </div>

                {/* Week planner */}
                <div style={{ fontSize:9,fontFamily:"'Barlow Condensed', sans-serif",letterSpacing:"0.16em",color:ph.color,fontWeight:700,marginBottom:12 }}>
                  WEEKLY PLANNER — {block.durationWeeks} WEEK{block.durationWeeks > 1 ? "S" : ""}
                </div>

                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {weeks.map(wk => {
                    const wkKey = `${block.id}-w${wk}`;
                    const wkOpen = !!expandedWeeks[wkKey];
                    const ws = block.weekSchedule?.[wk] || {};
                    // Count filled sessions for preview
                    const filledCount = DAYS.reduce((n,d) => n + (ws[d]?.am ? 1 : 0) + (ws[d]?.pm ? 1 : 0), 0);

                    return (
                      <div key={wk} style={{ background:"#100C0B", border:`1px solid #2A2220`, borderRadius:8, overflow:"hidden" }}>
                        {/* Week header */}
                        <div style={{ padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}
                          onClick={()=>toggleWeek(wkKey)}>
                          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <span style={{ fontFamily:"'Barlow Condensed', sans-serif", fontSize:12, fontWeight:700, color:T.text, letterSpacing:"0.06em" }}>WEEK {wk}</span>
                            {filledCount > 0 && <span style={{ fontSize:10, color:T.muted }}>{filledCount} session{filledCount!==1?"s":""} planned</span>}
                          </div>
                          <span style={{ fontSize:10, color:T.muted, ...mono }}>{wkOpen ? "▲" : "▼"}</span>
                        </div>

                        {/* Day grid */}
                        {wkOpen && (
                          <div style={{ borderTop:`1px solid #2A2220`, padding:"12px 14px" }}>
                            <div style={{ display:"grid", gridTemplateColumns:`80px repeat(${DAYS.length}, 1fr)`, gap:6, marginBottom:6 }}>
                              <div />
                              {DAYS.map(d => (
                                <div key={d} style={{ fontSize:9, fontFamily:"'Barlow Condensed', sans-serif", fontWeight:700, color:T.muted, letterSpacing:"0.1em", textAlign:"center" }}>{d.toUpperCase()}</div>
                              ))}
                            </div>
                            {["am","pm"].map(session => (
                              <div key={session} style={{ display:"grid", gridTemplateColumns:`80px repeat(${DAYS.length}, 1fr)`, gap:6, marginBottom:6 }}>
                                <div style={{ fontSize:9, fontFamily:"'Barlow Condensed', sans-serif", fontWeight:700, color:ph.color, letterSpacing:"0.1em", display:"flex", alignItems:"center" }}>{session.toUpperCase()}</div>
                                {DAYS.map(day => {
                                  const val = ws[day]?.[session] || "";
                                  return (
                                    <div key={day} style={{ position:"relative" }}>
                                      <input
                                        type="text"
                                        value={val}
                                        onChange={e => updateSession(block.id, wk, day, session, e.target.value)}
                                        placeholder="—"
                                        style={{ width:"100%", background: val ? `${ph.color}12` : "#1A1512", border:`1px solid ${val ? ph.color+"50" : "#2A2220"}`, borderRadius:5, padding:"5px 4px", color: val ? T.text : T.muted, fontSize:10, outline:"none", fontFamily:"'Manrope', sans-serif", textAlign:"center" }}
                                        onFocus={e => e.target.style.borderColor = ph.color}
                                        onBlur={e => e.target.style.borderColor = val ? ph.color+"50" : "#2A2220"}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </DCard>
        );
      })}

      {(plan.blocks??[]).length === 0 && (
        <DCard style={{ padding:"48px 24px", textAlign:"center" }}>
          <div style={{ fontSize:11, color:T.muted }}>No blocks yet — click "+ Add Block" to start building your periodisation plan.</div>
        </DCard>
      )}

      {/* ── Edit modal ──────────────────────────────────────────────────────── */}
      {editId && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
          <div style={{ background:"#1A1512",border:`1px solid ${D_PHASE[editForm.phase]?.color||"#2A2220"}`,borderRadius:14,padding:26,width:"100%",maxWidth:540,maxHeight:"85vh",overflowY:"auto" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18 }}>
              <div style={{ fontFamily:"'Barlow Condensed', sans-serif",fontSize:16,fontWeight:800,color:T.text }}>Edit Block</div>
              <button onClick={()=>setEditId(null)} style={{ background:"transparent",border:"none",color:T.muted,cursor:"pointer",fontSize:16 }}>✕</button>
            </div>
            <BlockEditForm vals={editForm} setVal={sf} onSave={saveEdit} onCancel={()=>setEditId(null)} />
          </div>
        </div>
      )}

      {/* ── Add modal ───────────────────────────────────────────────────────── */}
      {adding && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
          <div style={{ background:"#1A1512",border:`1px solid #2A2220`,borderRadius:14,padding:26,width:"100%",maxWidth:540,maxHeight:"85vh",overflowY:"auto" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18 }}>
              <div style={{ fontFamily:"'Barlow Condensed', sans-serif",fontSize:16,fontWeight:800,color:T.text }}>Add Training Block</div>
              <button onClick={()=>setAdding(false)} style={{ background:"transparent",border:"none",color:T.muted,cursor:"pointer",fontSize:16 }}>✕</button>
            </div>
            <BlockEditForm vals={nb} setVal={k=>v=>setNb(n=>({...n,[k]:v}))} onSave={addBlock} onCancel={()=>setAdding(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

// ── AthletesDashboard main component (embedded in assessment app) ─────────────
const AthletesDashboard = ({ allAthletes, allCoaches, initialAthleteId, onBack }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [activeId, setActiveId] = useState(initialAthleteId);
  const [plans, setPlans] = useState({});
  const SK_PLANS = "plans_v1";

  useEffect(() => {
    (async () => {
      try {
        const r = await localGet(SK_PLANS);
        if (r) setPlans(JSON.parse(r.value));
      } catch {}
    })();
  }, []);

  const athlete = allAthletes.find(a => a.id === activeId) || allAthletes[0];
  const coach = allCoaches.find(c => c.athleteId === String(athlete?.id));

  const updatePlan = async (newPlan) => {
    if (!athlete) return;
    const next = { ...plans, [athlete.id]: newPlan };
    setPlans(next);
    try { await localSet(SK_PLANS, JSON.stringify(next)); } catch {}
  };

  const currentPlan = athlete ? (plans[athlete.id] || { year: new Date().getFullYear(), nextCompetition: athlete.targetTimeline || "", notes: "", blocks: [] }) : null;

  if (!athlete) return null;

  // Switcher dropdown
  const [switchOpen, setSwitchOpen] = useState(false);

  return (
    <div style={{ minHeight:"100vh", background:T.bg }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}} .dash-fade{animation:fadeUp 0.3s ease both}`}</style>
      {/* Nav */}
      <div style={{ background:"#161210", borderBottom:`1px solid #2A2220`, position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 28px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14, padding:"11px 0" }}>
            {/* Back button */}
            <button onClick={onBack} style={{ background:"transparent", border:`1px solid #2A2220`, color:T.muted, borderRadius:6, padding:"6px 12px", fontSize:11, cursor:"pointer", fontFamily:"'Manrope', sans-serif", display:"flex", alignItems:"center", gap:5 }}>
              ← Roster
            </button>
            <div style={{ width:1, height:24, background:"#2A2220" }} />
            {/* Athlete switcher */}
            {allAthletes.length > 1 ? (
              <div style={{ position:"relative" }}>
                <button onClick={()=>setSwitchOpen(o=>!o)} style={{ background:"#1E1814", border:`1px solid ${switchOpen?T.accent:"#2A2220"}`, borderRadius:7, padding:"6px 12px", color:T.text, fontSize:12, fontFamily:"'Manrope', sans-serif", cursor:"pointer", display:"flex", alignItems:"center", gap:8, minWidth:200 }}>
                  <div style={{ textAlign:"left", flex:1 }}>
                    <div style={{ fontWeight:700, lineHeight:1 }}>{athlete.name}</div>
                    <div style={{ fontSize:10, color:T.muted, marginTop:2 }}>{athlete.competitionLevel}</div>
                  </div>
                  <span style={{ color:T.muted, fontSize:9 }}>▼</span>
                </button>
                {switchOpen && (
                  <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, background:"#1E1814", border:`1px solid #2A2220`, borderRadius:8, zIndex:200, overflow:"hidden", boxShadow:"0 8px 24px rgba(0,0,0,0.5)" }}>
                    {allAthletes.map(a => (
                      <button key={a.id} onClick={()=>{setActiveId(a.id);setActiveTab("profile");setSwitchOpen(false);}}
                        style={{ width:"100%", padding:"10px 14px", background:a.id===activeId?`${T.accent}18`:"transparent", border:"none", borderBottom:`1px solid #2A2220`, color:a.id===activeId?T.accent:T.text, fontSize:12, textAlign:"left", cursor:"pointer", fontFamily:"'Manrope', sans-serif", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span style={{ fontWeight:a.id===activeId?600:400 }}>{a.name}</span>
                        <span style={{ fontSize:10, color:T.muted }}>{a.competitionLevel}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:T.text, lineHeight:1 }}>{athlete.name}</div>
                <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{athlete.competitionLevel} · {athlete.ltadStage}</div>
              </div>
            )}
          </div>
          {/* Tabs */}
          <div style={{ display:"flex", gap:1 }}>
            {D_TABS.map(t => (
              <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{ background:"transparent", border:"none", borderBottom:`2px solid ${activeTab===t.id?T.accent:"transparent"}`, padding:"15px 15px 13px", color:activeTab===t.id?T.text:T.muted, fontSize:12, fontWeight:activeTab===t.id?600:400, cursor:"pointer", transition:"all 0.12s", fontFamily:"'Manrope', sans-serif", display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ fontSize:9, opacity:0.7 }}>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Content */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"26px 24px" }} className="dash-fade" key={`${activeId}-${activeTab}`}>
        {activeTab === "profile"  && <DProfileTab athlete={athlete} />}
        {activeTab === "needs"    && <DNeedsTab athlete={athlete} coach={coach} />}
        {activeTab === "metrics"  && <DMetricsTab athlete={athlete} />}
        {activeTab === "goals"    && <DGoalsTab athlete={athlete} />}
        {activeTab === "plan"     && <DPlanTab athlete={athlete} plan={currentPlan} setPlan={updatePlan} />}
      </div>
    </div>
  );
};

// ─── EXAMPLE ATHLETE — SEED DATA ─────────────────────────────────────────────
// Pre-filled example client for assessment review & system testing
const EXAMPLE_ATHLETE = {
  id: 9001,
  type: "athlete",
  assessmentType: "onboarding",
  date: "2025-09-15",
  name: "Jordan Hayes",
  email: "jordan.hayes@example.com",
  sex: "Male",
  age: "24",
  height: "69",
  weight: "178",
  competitionLevel: "Quarterfinals",
  ltadStage: "Train to Compete",
  yearsTraining: "3–5 years",
  trainingDays: "5",
  sessionLength: "90 min",
  athleteStory: "Played AFL for 6 years before finding CrossFit in 2021. The sport component hooked me immediately — I want to compete seriously and see how far I can go. I'm not afraid of hard work but I've never had structured programming. Most of my training has been following generic online programs which has got me to QF level but I feel like I've been stuck there for two years now and not making progress. My coach suggested I look at individual programming to break through.",
  recoveryQuality: "Average",
  sleepHours: "6–7",
  stressLevel: "Moderate",
  injuryHistory: "Left shoulder labrum tear 2022 — conservative rehab, no surgery. Fully cleared but still guard it. Lower back tightness recurring when volume gets high.",
  currentInjuries: "Mild left shoulder impingement flaring when overhead volume spikes. Lower back stiffness after heavy squat sessions.",
  notes: "Works full time as a tradie — physical job, on feet all day. This adds to recovery demands. Trains before work at 5am.",
  // Goal Engineering
  outcomeGoal: "Qualify for Online Semifinals (Top 2000 globally, Individual Men)",
  targetTimeline: "CrossFit Open — March 2026",
  obstacle1: "Aerobic engine — I fall apart in anything over 10 minutes",
  obstacle1Process: "Commit to 3 dedicated aerobic sessions per week separate from strength work — rowing and running at controlled pace",
  obstacle2: "Left shoulder overhead — HSPU volume and deficit HSPU are a significant limiter under fatigue",
  obstacle2Process: "Daily shoulder prehab + strict pressing progressions 3x per week, avoid high-volume kipping HSPU until strength base is rebuilt",
  obstacle3: "Consistency — early morning sessions mean I sometimes skip when work is physically demanding",
  obstacle3Process: "Pre-plan the week on Sunday, log training daily, communicate with coach if a session needs to be moved rather than skipped",
  // Mental Performance
  mentalRatings: {
    trust_fitness: 2,
    competition_arousal: 2,
    pacing_strategy: 2,
    recover_mistakes: 3,
    self_talk: 3,
    focus_under_crowd: 3,
    resilience_suffering: 4,
    athlete_iq: 2,
    goal_process: 3,
    sleep_competition: 3,
  },
  // Movement Self-Assessment
  movements: {
    // Olympic Lifting
    snatch_heavy:   { rating: 2, notes: "1RM around 90kg. Technique breaks under fatigue." },
    snatch_mod:     { rating: 3, notes: "Comfortable at ~70kg cycling but get out of breath fast" },
    snatch_light:   { rating: 2, notes: "Touch-and-go light snatches gas me out quickly" },
    clean_heavy:    { rating: 3, notes: "1RM around 120kg, feel solid here" },
    clean_mod:      { rating: 3 },
    clean_light:    { rating: 3 },
    cnj_heavy:      { rating: 3, notes: "Jerk is inconsistent — split jerk not trained enough" },
    cnj_mod:        { rating: 3 },
    cnj_light:      { rating: 2, notes: "High rep CnJ really gasses me" },
    // Squatting
    bsq_heavy:      { rating: 4, notes: "Back squat is a strength. ~160kg" },
    fsq_heavy:      { rating: 3, notes: "Front squat ~130kg, mobility limits depth slightly" },
    ohsq:           { rating: 2, notes: "Shoulder limits overhead — can't comfortably load" },
    thruster_heavy: { rating: 3, notes: "Capable but shoulder is the limiter, not legs" },
    thruster_mod:   { rating: 3 },
    thruster_light: { rating: 3 },
    // Pressing
    strict_press:   { rating: 3, notes: "Conservative due to shoulder — ~80kg" },
    push_press:     { rating: 3 },
    push_jerk:      { rating: 3 },
    split_jerk:     { rating: 2, notes: "Underdeveloped — never really trained it" },
    s2oh:           { rating: 3 },
    // Pulling
    dl_heavy:       { rating: 4, notes: "Deadlift is strong ~200kg" },
    dl_mod:         { rating: 4 },
    // Gymnastics Pulling
    strict_pu:      { rating: 3, notes: "Can do ~15 strict, not a limiter" },
    kip_pu:         { rating: 3 },
    ctb:            { rating: 3, notes: "Decent but blow up on large unbroken sets" },
    bar_mu:         { rating: 3, notes: "Can string 5-6 but inefficient kip" },
    ring_mu:        { rating: 2, notes: "Significant limiter — can only do 2-3 before failing, especially under fatigue" },
    rope_std:       { rating: 3 },
    rope_ll:        { rating: 2, notes: "Grip fails quickly" },
    // Handstand
    kip_hspu:       { rating: 3, notes: "OK but shoulder fires up after ~15 reps" },
    strict_hspu:    { rating: 2, notes: "Major limiter — shoulder. Can do 3-4 strict max." },
    deficit_hspu:   { rating: 1, notes: "Cannot do deficit HSPU due to shoulder" },
    hs_walk:        { rating: 3, notes: "Can walk but inconsistent under fatigue" },
    wall_walk:      { rating: 3 },
    // Midline
    ttb:            { rating: 3, notes: "Decent in isolation but blow up when combined with pulling" },
    ghd:            { rating: 2, notes: "Rarely programmed, not conditioned for high volume" },
    lsit:           { rating: 2 },
    // Basic CF
    burpee:         { rating: 3 },
    box_jump:       { rating: 4, notes: "Explosive, good here" },
    du:             { rating: 4 },
    du_cross:       { rating: 2, notes: "Inconsistent — maybe 50% success rate" },
    wall_ball:      { rating: 3 },
    air_squat:      { rating: 4 },
    lunge:          { rating: 3 },
    pistol:         { rating: 2, notes: "Left ankle mobility limits left pistol" },
    // Odd Object
    sandbag:        { rating: 3 },
    sled_push:      { rating: 4, notes: "AFL background — grunt work is fine" },
    sled_pull:      { rating: 4 },
    farmers:        { rating: 4 },
    yoke:           { rating: 3 },
    // Dumbbell
    db_snatch:      { rating: 3 },
    db_cnj:         { rating: 3 },
    db_ohsq:        { rating: 2, notes: "Left shoulder limits overhead dumbbell work" },
    // Other
    ring_dip:       { rating: 3 },
    pegboard:       { rating: 1, notes: "Never trained — no access to pegboard" },
    pushup:         { rating: 4 },
  },
  // Max Lifts (kg)
  lifts: {
    back_squat:      { max: "160", date: "Aug 2025" },
    front_squat:     { max: "130", date: "Jul 2025" },
    oh_squat:        { max: "85",  date: "Jun 2025" },
    thruster:        { max: "100", date: "May 2025" },
    deadlift:        { max: "200", date: "Aug 2025" },
    snatch:          { max: "90",  date: "Jul 2025" },
    power_snatch:    { max: "80",  date: "Jun 2025" },
    power_clean:     { max: "110", date: "Jul 2025" },
    squat_clean:     { max: "120", date: "Aug 2025" },
    push_press_lift: { max: "95",  date: "Jun 2025" },
    push_jerk_lift:  { max: "100", date: "Jul 2025" },
    split_jerk_lift: { max: "105", date: "May 2025" },
  },
  // Conditioning Benchmarks
  benchmarks: {
    mile_run:    { score: "6:10",  date: "Jul 2025" },
    "5k_run":    { score: "22:45", date: "Aug 2025" },
    "10k_run":   { score: "49:00", date: "Jun 2025" },
    "1k_row":    { score: "3:22",  date: "Aug 2025" },
    "2k_row":    { score: "7:08",  date: "Aug 2025" },
    "5k_row":    { score: "19:45", date: "Jul 2025" },
    echo_10min:  { score: "168",   date: "Aug 2025" },
    bike_erg_ftp:{ score: "210",   date: "Jul 2025" },
  },
};

const EXAMPLE_COACH = {
  id: 9002,
  type: "coach",
  athleteId: "9001",
  date: "2025-09-22",
  // Anthropometrics
  leanMass: "152",
  lungCap: "5.4",
  // Movement Screen
  movOHS: "2 — Below Average",
  movHinge: "4 — Good",
  movFrontRack: "3 — Average",
  movNotes: "OHS limited by left shoulder and T-spine mobility. Hip hinge is a genuine strength — deadlift mechanics are excellent. Front rack functional but wrist flexibility slightly restricted.",
  // Structural Balance
  snatchCJRatio: "0.86",
  pushPullRatio: "0.72",
  squat1RMLeft: "Approx. 5% L/R deficit on left — ankle and hip mobility asymmetry",
  // KPI Tests
  strictPU5: "28",
  strictHSPU5: "8",
  deficitHSPU10: "0",
  ropeClimb10: "5",
  rowTest: "148 / 141",
  rampTest: "290W @ 4:45",
  // Bioenergetic Profile
  smO2: "Progressive decline to failure",
  spO2: "Minimal (<2%)",
  hrBehavior: "Climbs to failure",
  cpGap: "Large (high max, poor sustainability)",
  fatigueSite: "Breathing / Diaphragm",
  breathNotes: "Reports feeling like he can't get enough air in high-intensity cycling pieces. Breathing becomes erratic under fatigue. No SpO2 data yet — Piko-6 not yet tested. FVC/FEV1 pending. Self-reported pattern strongly suggests respiratory.",
  limiter: "respiratory",
  // Athlete KPIs
  movQuality: "3 — Average",
  workCap: "3 — Average",
  recoverability: "2 — Below Average",
  adaptability: "4 — Good",
  fitnessIQ: "2 — Below Average",
  coachNotes: "Jordan is a talented athlete being held back by a combination of a respiratory limiter, a shoulder structural issue, and critically — no individual coaching history means his pacing and strategy are underdeveloped. The AFL background gives him strong movement intuition and work ethic. Priority 1 is respiratory limiter work. Priority 2 is rebuilding the left shoulder pressing base conservatively. Priority 3 is developing fitness IQ — he needs deliberate pacing practice and competition strategy exposure. Recoverability flag is real given full-time physical work + 5am sessions + moderate stress. Load management will be critical. Lean mass per litre O2 is 28.1 — just under the 30 KPI which is a good sign for the aerobic ceiling once the limiter is addressed.",
};


// ─── MOCK CLIENT — Mia Thornton (submitted via client intake form) ─────────────
const MOCK_CLIENT = {
  id: 9003,
  type: "athlete",
  assessmentType: "onboarding",
  date: "2025-10-04",
  name: "Mia Thornton",
  email: "mia.thornton@example.com",
  sex: "Female",
  age: "29",
  height: "165",
  weight: "64",
  competitionLevel: "Semifinals",
  ltadStage: "Train to Perform",
  yearsTraining: "5–8 years",
  trainingDays: "6",
  sessionLength: "120 min",
  athleteStory: "Came from a gymnastics background — 12 years competing through to senior level before I stopped at 22. Found CrossFit in 2018 and it felt like home immediately. I made Semifinals twice but keep finishing mid-pack. My gymnastics means my skill work is strong but my engine just isn't where it needs to be at this level. I want to build a real aerobic base and stop being the person who dies in long workouts. I'm self-coached right now which I think is the main problem.",
  recoveryQuality: "Good",
  sleepHours: "7–8",
  stressLevel: "Low",
  injuryHistory: "Right wrist TFCC sprain 2023, managed with PT. Fully cleared. Left hip flexor recurring tightness from gymnastics days.",
  currentInjuries: "Occasional wrist discomfort on heavy clean & jerk if volume is high. Manageable.",
  outcomeGoal: "Finish top 200 at Online Semifinals and qualify for an in-person Semifinal",
  targetTimeline: "Online Semifinals — May 2026",
  obstacle1: "Aerobic engine — I can do the skills but I gas out hard after 12 minutes",
  obstacle1Process: "3 dedicated aerobic sessions per week — long slow rowing and running, separate from skill work",
  obstacle2: "Heavy barbell cycling under fatigue — technique breaks down when tired",
  obstacle2Process: "Weekly barbell cycling at 70-75% with deliberate breathing practice between reps",
  obstacle3: "No structure — I programme my own training and tend to do what I'm good at",
  obstacle3Process: "Trust the coach's programme fully for 12 weeks, don't add extra gymnastics work",
  coachingGoals: "I want someone to tell me what to work on and hold me to it. I'm good at executing — I just need the plan. And I want to understand the why so I can be a better self-coach long term.",
  mentalRatings: {
    trust_fitness: 4, competition_arousal: 3, pacing_strategy: 2,
    recover_mistakes: 4, self_talk: 4, focus_under_crowd: 4,
    resilience_suffering: 3, athlete_iq: 2, goal_process: 3, sleep_competition: 4,
  },
  movements: {
    snatch_heavy:  { rating: 4, notes: "Strong. 75kg 1RM, clean technique." },
    snatch_mod:    { rating: 4, notes: "Comfortable cycling at 50–55kg" },
    snatch_light:  { rating: 3, notes: "Gas out on touch-and-go after ~20 reps" },
    clean_heavy:   { rating: 4, notes: "95kg 1RM, solid positions" },
    clean_mod:     { rating: 4 },
    cnj_heavy:     { rating: 3, notes: "Wrist sometimes limits overhead confidence under fatigue" },
    cnj_mod:       { rating: 3 },
    cnj_light:     { rating: 2, notes: "High rep cycling falls apart — breathing is the limiter" },
    bsq_heavy:     { rating: 3, notes: "110kg. Not a limiter but not a strength." },
    fsq_heavy:     { rating: 3 },
    ohsq:          { rating: 4, notes: "Gymnastics background — overhead position is strong" },
    thruster_mod:  { rating: 3, notes: "Breathing limits me in big sets" },
    thruster_light:{ rating: 2, notes: "Fran-style thrusters at pace — I blow up" },
    pistol:        { rating: 5, notes: "Gymnastics weapon. 20+ unbroken each side." },
    strict_press:  { rating: 3 },
    push_press:    { rating: 3 },
    split_jerk:    { rating: 4 },
    dl_heavy:      { rating: 3, notes: "130kg. Functional, not a strength." },
    dl_mod:        { rating: 3 },
    strict_pu:     { rating: 4, notes: "15+ strict easily" },
    kip_pu:        { rating: 5 },
    ctb:           { rating: 5, notes: "Can string 20+ unbroken. Big weapon." },
    bar_mu:        { rating: 5, notes: "Gymnastics. Efficient kip. 10+ unbroken." },
    ring_mu:       { rating: 5, notes: "Strongest part of my game. 8+ unbroken under fatigue." },
    rope_std:      { rating: 5 },
    rope_ll:       { rating: 4, notes: "Strong but grip fades after 4–5 climbs" },
    ttb:           { rating: 5, notes: "Fast and efficient. Big sets no problem." },
    ghd:           { rating: 4 },
    kip_hspu:      { rating: 5, notes: "20+ unbroken. Gymnastics background obvious here." },
    strict_hspu:   { rating: 5 },
    deficit_hspu:  { rating: 4, notes: "4\" deficit, 10 unbroken." },
    hs_walk:       { rating: 5, notes: "Weapon. 200ft+ without breaking." },
    wall_walk:     { rating: 5 },
    burpee:        { rating: 3, notes: "OK but not efficient." },
    box_jump:      { rating: 4 },
    du:            { rating: 4 },
    du_cross:      { rating: 3 },
    wall_ball:     { rating: 3, notes: "Breathing. Large sets fall apart." },
    air_squat:     { rating: 4 },
    lunge:         { rating: 4 },
    sandbag:       { rating: 3 },
    db_snatch:     { rating: 4 },
    db_cnj:        { rating: 4 },
    ring_dip:      { rating: 5, notes: "Gymnastics. Easy." },
    pushup:        { rating: 4 },
    pegboard:      { rating: 4, notes: "Gymnastics background helps here" },
  },
  lifts: {
    back_squat:      { max: "110", date: "Sep 2025" },
    front_squat:     { max: "95",  date: "Sep 2025" },
    oh_squat:        { max: "80",  date: "Aug 2025" },
    snatch:          { max: "75",  date: "Oct 2025" },
    squat_clean:     { max: "95",  date: "Sep 2025" },
    deadlift:        { max: "130", date: "Aug 2025" },
    push_press_lift: { max: "65",  date: "Aug 2025" },
    split_jerk_lift: { max: "90",  date: "Sep 2025" },
    thruster:        { max: "65",  date: "Jul 2025" },
  },
  benchmarks: {
    mile_run:   { score: "6:55",  date: "Aug 2025" },
    "5k_run":   { score: "25:10", date: "Sep 2025" },
    "1k_row":   { score: "3:48",  date: "Sep 2025" },
    "2k_row":   { score: "7:52",  date: "Sep 2025" },
    "5k_row":   { score: "22:30", date: "Aug 2025" },
    echo_10min: { score: "148",   date: "Sep 2025" },
  },
};

const MOCK_CLIENT_COACH = {
  id: 9004,
  type: "coach",
  athleteId: "9003",
  date: "2025-10-11",
  leanMass: "118",
  lungCap: "4.1",
  movOHS: "5 — Elite",
  movHinge: "3 — Average",
  movFrontRack: "4 — Good",
  movNotes: "OHS exceptional — gymnastics background. Hip hinge slightly underdeveloped relative to upper body. Front rack clean.",
  snatchCJRatio: "0.79",
  pushPullRatio: "0.95",
  strictPU5: "22",
  strictHSPU5: "18",
  deficitHSPU10: "12",
  ropeClimb10: "8",
  rowTest: "118 / 112",
  rampTest: "210W @ 4:20",
  smO2: "Rapid desaturation, slow recovery",
  spO2: "Drops 3–4% at high intensity",
  hrBehavior: "Climbs rapidly, stays elevated",
  cpGap: "Moderate-large",
  fatigueSite: "Breathing / Ventilation",
  breathNotes: "Classic respiratory limiter. SmO2 drops fast, recovers slowly. SpO2 dips under load. Describes 'can't get air in' not 'legs gone'. Ramp test power low relative to gymnastics KPIs — engine is the ceiling. Lean mass per litre O2 is 28.8 — confirms aerobic ceiling is the primary target.",
  limiter: "respiratory",
  movQuality: "5 — Elite",
  workCap: "2 — Below Average",
  recoverability: "4 — Good",
  adaptability: "4 — Good",
  fitnessIQ: "2 — Below Average",
  coachNotes: "Mia is a fascinating profile — games-level gymnastics with a QF-level engine. The gap between skill ceiling and aerobic floor is the widest I've seen at Semis level. Pure respiratory limiter work will unlock massive gains because the skills are already there. Do NOT touch gymnastics skill work for the first 8 weeks — maintain only. The fitnessIQ 2 is the hidden limiter — she paces by feel and feel is unreliable for her because gymnastics effort is discrete, not sustained. Deliberate pacing education in every long workout.",
};

const GAS_URL = "https://script.google.com/macros/s/AKfycbzQuGOlBG2IXU1a0nkCiFVGh2JxxnomKpCiOihRf7WAkcnErpz1vd3hYfjFdViISmOe7w/exec";

const STORAGE_KEYS = { athletes: "athletes_v1", coaches: "coaches_v1" };

// Write to localStorage (local backup)
const localSave = async (key, data) => {
  try { await localSet(key, JSON.stringify(data)); } catch (e) { /* silent */ }
};

// Read from localStorage
const localLoad = async (key) => {
  try {
    const r = await localGet(key);
    return r ? JSON.parse(r.value) : [];
  } catch { return []; }
};

// Append one row to Google Sheets
const sheetAppend = async (tab, row) => {
  try {
    await fetch(GAS_URL, {
      method: "POST",
      body: JSON.stringify({ action: "append", tab, row }),
    });
  } catch { /* silent — local storage is the backup */ }
};

// Load all rows from a Google Sheet tab
const sheetLoad = async (tab) => {
  try {
    const res = await fetch(`${GAS_URL}?tab=${tab}`);
    const json = await res.json();
    // Apps Script returns a plain array, not { rows: [] }
    const rows = Array.isArray(json) ? json : (json.rows || []);
    if (!rows.length) return null;
    return rows.map(r => {
      // Parse all JSON fields serialised on save
      ["movements", "lifts", "benchmarks", "mentalRatings"].forEach(f => {
        if (r[f] && typeof r[f] === "string") {
          try { r[f] = JSON.parse(r[f]); } catch { r[f] = {}; }
        }
      });
      // Ensure numeric fields are numbers
      ["id", "age"].forEach(f => { if (r[f] !== undefined) r[f] = String(r[f]); });
      return r;
    });
  } catch { return null; } // null = network failed, fall back to local
};

// ── Sync status toast ────────────────────────────────────────────────────────
const SyncToast = ({ status }) => {
  if (!status) return null;
  const cfg = {
    saving:  { color: T.warn,     icon: "⟳", text: "Saving…" },
    saved:   { color: T.strength, icon: "✓", text: "Saved to Sheets" },
    local:   { color: T.info,     icon: "⬡", text: "Saved locally (Sheets unreachable)" },
    error:   { color: T.danger,   icon: "✕", text: "Save failed" },
    loading: { color: T.info,     icon: "⟳", text: "Loading data…" },
  }[status] || {};
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 300,
      background: T.surface, border: `1px solid ${cfg.color}55`,
      borderRadius: 8, padding: "10px 16px",
      display: "flex", alignItems: "center", gap: 8,
      boxShadow: `0 4px 24px rgba(0,0,0,0.4)`,
      animation: "fadeIn 0.2s ease",
    }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <span style={{ color: cfg.color, fontSize: 14 }}>{cfg.icon}</span>
      <span style={{ fontSize: 12, color: T.text, fontFamily: "'Manrope', sans-serif" }}>{cfg.text}</span>
    </div>
  );
};

// ─── ROOT ─────────────────────────────────────────────────────────────────────
const COACH_PASSWORD = "grit2025";

const PasswordGate = ({ onUnlock }) => {
  const [val, setVal] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const attempt = () => {
    if (val === COACH_PASSWORD) {
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setVal("");
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <div style={{
        background: T.surface, border: `1px solid ${error ? T.danger : T.border}`,
        borderRadius: 14, padding: "40px 48px", width: "100%", maxWidth: 360, textAlign: "center",
        animation: shake ? "shake 0.4s ease" : "none",
      }}>
        <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${T.accent}15`,
          border: `1px solid ${T.accent}30`, display: "flex", alignItems: "center",
          justifyContent: "center", margin: "0 auto 20px", fontSize: 20 }}>🔒</div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 800,
          color: T.text, letterSpacing: "0.04em", marginBottom: 6 }}>COACH ACCESS</div>
        <div style={{ fontSize: 12, color: T.muted, marginBottom: 24 }}>
          Enter your password to access coach tools
        </div>
        <input
          type="password"
          value={val}
          onChange={e => { setVal(e.target.value); setError(false); }}
          onKeyDown={e => e.key === "Enter" && attempt()}
          placeholder="Password"
          autoFocus
          style={{ width: "100%", background: T.card, border: `1px solid ${error ? T.danger : T.border}`,
            borderRadius: 8, padding: "11px 14px", color: T.text, fontSize: 14,
            outline: "none", fontFamily: "'Manrope', sans-serif", textAlign: "center",
            letterSpacing: "0.2em", marginBottom: 12 }}
        />
        {error && <div style={{ fontSize: 11, color: T.danger, marginBottom: 10 }}>Incorrect password</div>}
        <button onClick={attempt} style={{
          width: "100%", background: T.accent, border: "none", color: "#fff",
          borderRadius: 8, padding: "11px", fontSize: 13, fontWeight: 600,
          cursor: "pointer", fontFamily: "'Manrope', sans-serif", letterSpacing: "0.04em",
        }}>Unlock</button>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState("client");
  const [athletes, setAthletes] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [syncStatus, setSyncStatus] = useState(null);
  const [booted, setBooted] = useState(false);
  const [coachUnlocked, setCoachUnlocked] = useState(false);

  // ── Boot: load from Sheets, fall back to local storage ──────────────────
  useEffect(() => {
    (async () => {
      setSyncStatus("loading");
      const [sheetAthletes, sheetCoaches] = await Promise.all([
        sheetLoad("Athletes"),
        sheetLoad("CoachAssessments"),
      ]);

      if (sheetAthletes !== null && sheetAthletes.length > 0) {
        setAthletes(sheetAthletes);
        setCoaches(sheetCoaches || []);
        await localSave(STORAGE_KEYS.athletes, sheetAthletes);
        await localSave(STORAGE_KEYS.coaches, sheetCoaches || []);
      } else {
        const [la, lc] = await Promise.all([
          localLoad(STORAGE_KEYS.athletes),
          localLoad(STORAGE_KEYS.coaches),
        ]);
        // Seed both example athletes if storage is empty
        const athletes = (la && la.length > 0) ? la : [EXAMPLE_ATHLETE, MOCK_CLIENT];
        const coaches  = (lc && lc.length > 0) ? lc : [EXAMPLE_COACH, MOCK_CLIENT_COACH];
        if (!la || la.length === 0) {
          await localSave(STORAGE_KEYS.athletes, athletes);
          await localSave(STORAGE_KEYS.coaches, coaches);
          // Push seed data to Sheets so it shows in the database
          const toSheetAthlete = a => ({
            ...a,
            movements:    JSON.stringify(a.movements  || {}),
            lifts:        JSON.stringify(a.lifts       || {}),
            benchmarks:   JSON.stringify(a.benchmarks  || {}),
            mentalRatings:JSON.stringify(a.mentalRatings|| {}),
          });
          await Promise.all([
            sheetAppend("Athletes",        toSheetAthlete(EXAMPLE_ATHLETE)),
            sheetAppend("Athletes",        toSheetAthlete(MOCK_CLIENT)),
            sheetAppend("CoachAssessments", EXAMPLE_COACH),
            sheetAppend("CoachAssessments", MOCK_CLIENT_COACH),
          ]);
        }
        setAthletes(athletes);
        setCoaches(coaches);
      }
      setSyncStatus(null);
      setBooted(true);
    })();
  }, []);

  // ── Save athlete ──────────────────────────────────────────────────────────
  const saveAthlete = async (entry) => {
    const next = [...athletes, entry];
    setAthletes(next);
    setSyncStatus("saving");
    await localSave(STORAGE_KEYS.athletes, next);
    try {
      await sheetAppend("Athletes", {
        ...entry,
        movements: JSON.stringify(entry.movements || {}),
        lifts: JSON.stringify(entry.lifts || {}),
        benchmarks: JSON.stringify(entry.benchmarks || {}),
      });
      setSyncStatus("saved");
    } catch {
      setSyncStatus("local");
    }
    setTimeout(() => setSyncStatus(null), 2800);
  };

  // ── Save coach assessment ─────────────────────────────────────────────────
  const saveCoach = async (entry) => {
    const next = [...coaches, entry];
    setCoaches(next);
    setSyncStatus("saving");
    await localSave(STORAGE_KEYS.coaches, next);
    try {
      await sheetAppend("CoachAssessments", entry);
      setSyncStatus("saved");
    } catch {
      setSyncStatus("local");
    }
    setTimeout(() => setSyncStatus(null), 2800);
  };

  // ── Dashboard full-screen view ────────────────────────────────────────────
  if (dashboard) {
    return (
      <AthletesDashboard
        allAthletes={athletes.filter(a => !a.type || a.type === "athlete")}
        allCoaches={coaches}
        initialAthleteId={dashboard.athlete.id}
        onBack={() => setDashboard(null)}
      />
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>
      <GS />
      <Nav view={view} setView={setView}
        athleteCount={athletes.filter(a => !a.type || a.type === "athlete").length}
        coachUnlocked={coachUnlocked} onCoachClick={() => { setView("coach"); if (!coachUnlocked) {} }} />
      {!booted && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 32, height: 32, border: `3px solid ${T.border}`, borderTopColor: T.accent,
              borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 12px" }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <p style={{ color: T.muted, fontSize: 13 }}>Loading athlete data…</p>
          </div>
        </div>
      )}
      {booted && view === "client" && <ClientForm onSave={saveAthlete} />}
      {booted && view === "coach" && (
        coachUnlocked
          ? <CoachPanel onSave={saveCoach} athletes={athletes} />
          : <PasswordGate onUnlock={() => setCoachUnlocked(true)} />
      )}
      {booted && view === "db" && (
        coachUnlocked
          ? <Database athletes={athletes} coaches={coaches} onAnalysis={(a, c) => setDashboard({ athlete: a, coach: c })} />
          : <PasswordGate onUnlock={() => setCoachUnlocked(true)} />
      )}
      <SyncToast status={syncStatus} />
    </div>
  );
}
