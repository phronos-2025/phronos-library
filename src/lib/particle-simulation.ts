/**
 * Particle Simulation v2.7 — Phronos Essay
 *
 * Cumulative, scroll-driven canvas simulation with 5 character types:
 * - Unconstrained particles (white, free-roaming)
 * - Constrained particles (white, fixed, pulsing halo, gravitational pull)
 * - Semi-constrained particles (pastel red, wander within small range — extrinsic constraint)
 * - AI-generated particles (pastel purple, attracted to parent AI)
 * - AI entities (translucent purple spheres, produce particles, trap, seek bonds)
 *
 * States are cumulative — each section's elements persist and accumulate.
 * Driven by continuous scroll progress (0.0–9.0), not discrete state switches.
 */

// ── Colors (overrides brand) ───────────────────────────────
const C = {
  bg: '#000000',
  white: 'rgba(255, 255, 255,',
  yellow: 'rgba(255, 245, 200,',   // faint yellow-white for constrained particles
  purple: 'rgba(180, 140, 220,',
  amber: 'rgba(210, 170, 50,',
  red: 'rgba(220, 140, 140,',      // pastel red for semi-constrained / extrinsic constraint
};

// ── Semantic word map ───────────────────────────────────────
// 1000 words with 2D positions in [0,1]×[0,1] semantic space.
// Nearby words are semantically similar; distant words are unrelated.
// Particles receive labels based on spatial proximity to the word's (x,y).
// Regions: top-left=movement, top-center=methodology, top-right=structure,
// mid-left=emotion, mid-center=cognition, mid-right=computation,
// bot-left=aesthetics, bot-center=knowledge, bot-right=measurement.
const SEMANTIC_WORDS: { word: string; x: number; y: number }[] = [
  { word: "ache", x: 0.06, y: 0.36 },
  { word: "act", x: 0.38, y: 0.23 },
  { word: "actor", x: 0.32, y: 0.35 },
  { word: "acumen", x: 0.68, y: 0.93 },
  { word: "adapt", x: 0.58, y: 0.66 },
  { word: "afar", x: 0.25, y: 0.13 },
  { word: "affix", x: 0.44, y: 0.90 },
  { word: "agate", x: 0.10, y: 0.91 },
  { word: "agent", x: 0.66, y: 0.37 },
  { word: "agile", x: 0.28, y: 0.39 },
  { word: "agony", x: 0.15, y: 0.60 },
  { word: "aid", x: 0.18, y: 0.73 },
  { word: "aim", x: 0.63, y: 0.13 },
  { word: "alarm", x: 0.10, y: 0.35 },
  { word: "alert", x: 0.51, y: 0.48 },
  { word: "algo", x: 0.95, y: 0.59 },
  { word: "align", x: 0.46, y: 0.07 },
  { word: "allot", x: 0.46, y: 0.42 },
  { word: "allure", x: 0.08, y: 0.76 },
  { word: "aloft", x: 0.17, y: 0.13 },
  { word: "alpha", x: 0.93, y: 0.84 },
  { word: "alter", x: 0.62, y: 0.60 },
  { word: "amble", x: 0.13, y: 0.24 },
  { word: "angst", x: 0.18, y: 0.28 },
  { word: "annals", x: 0.62, y: 0.97 },
  { word: "apex", x: 0.91, y: 0.12 },
  { word: "api", x: 0.77, y: 0.30 },
  { word: "apply", x: 0.45, y: 0.08 },
  { word: "apt", x: 0.67, y: 0.38 },
  { word: "arc", x: 0.62, y: 0.49 },
  { word: "arch", x: 0.97, y: 0.24 },
  { word: "area", x: 0.64, y: 0.53 },
  { word: "argue", x: 0.31, y: 0.74 },
  { word: "armor", x: 0.21, y: 0.34 },
  { word: "ask", x: 0.75, y: 0.71 },
  { word: "assay", x: 0.57, y: 0.07 },
  { word: "assert", x: 0.55, y: 0.37 },
  { word: "assess", x: 0.64, y: 0.22 },
  { word: "asset", x: 0.83, y: 0.92 },
  { word: "astute", x: 0.65, y: 0.88 },
  { word: "attend", x: 0.39, y: 0.40 },
  { word: "attest", x: 0.85, y: 0.94 },
  { word: "audit", x: 0.32, y: 0.03 },
  { word: "aura", x: 0.25, y: 0.40 },
  { word: "awake", x: 0.64, y: 0.68 },
  { word: "aware", x: 0.72, y: 0.27 },
  { word: "away", x: 0.03, y: 0.16 },
  { word: "awe", x: 0.23, y: 0.90 },
  { word: "axiom", x: 0.38, y: 0.38 },
  { word: "axis", x: 0.82, y: 0.48 },
  { word: "axle", x: 0.81, y: 0.21 },
  { word: "badge", x: 0.42, y: 0.42 },
  { word: "balm", x: 0.16, y: 0.66 },
  { word: "bar", x: 0.75, y: 0.07 },
  { word: "bare", x: 0.12, y: 0.61 },
  { word: "base", x: 0.76, y: 0.05 },
  { word: "basis", x: 0.58, y: 0.94 },
  { word: "batch", x: 0.30, y: 0.11 },
  { word: "beam", x: 0.95, y: 0.22 },
  { word: "beat", x: 0.05, y: 0.36 },
  { word: "beauty", x: 0.32, y: 0.81 },
  { word: "begin", x: 0.55, y: 0.15 },
  { word: "being", x: 0.50, y: 0.94 },
  { word: "bell", x: 0.19, y: 0.93 },
  { word: "bench", x: 0.29, y: 0.22 },
  { word: "bent", x: 0.36, y: 0.28 },
  { word: "bet", x: 0.74, y: 0.37 },
  { word: "beta", x: 0.86, y: 0.81 },
  { word: "beyond", x: 0.02, y: 0.10 },
  { word: "bias", x: 0.59, y: 0.45 },
  { word: "bill", x: 0.79, y: 0.98 },
  { word: "bit", x: 0.91, y: 0.34 },
  { word: "blank", x: 0.07, y: 0.31 },
  { word: "bleak", x: 0.24, y: 0.49 },
  { word: "blend", x: 0.50, y: 0.43 },
  { word: "bliss", x: 0.16, y: 0.95 },
  { word: "blob", x: 0.92, y: 0.37 },
  { word: "block", x: 0.94, y: 0.17 },
  { word: "bloom", x: 0.13, y: 1.00 },
  { word: "blunt", x: 0.05, y: 0.36 },
  { word: "blur", x: 0.56, y: 0.67 },
  { word: "bold", x: 0.03, y: 0.26 },
  { word: "bolt", x: 0.07, y: 0.06 },
  { word: "bond", x: 0.61, y: 0.54 },
  { word: "book", x: 0.42, y: 0.99 },
  { word: "bore", x: 0.60, y: 0.40 },
  { word: "bound", x: 0.61, y: 0.36 },
  { word: "box", x: 0.43, y: 0.58 },
  { word: "brace", x: 0.76, y: 0.18 },
  { word: "brand", x: 0.61, y: 0.66 },
  { word: "brave", x: 0.20, y: 0.73 },
  { word: "break", x: 0.27, y: 0.15 },
  { word: "brick", x: 0.84, y: 0.02 },
  { word: "bridge", x: 0.68, y: 0.23 },
  { word: "brief", x: 0.70, y: 0.29 },
  { word: "bring", x: 0.29, y: 0.05 },
  { word: "broad", x: 0.05, y: 0.24 },
  { word: "brood", x: 0.15, y: 0.49 },
  { word: "bud", x: 0.14, y: 0.81 },
  { word: "bug", x: 0.73, y: 0.65 },
  { word: "build", x: 0.75, y: 0.21 },
  { word: "burn", x: 0.30, y: 0.67 },
  { word: "bus", x: 0.91, y: 0.68 },
  { word: "byte", x: 0.90, y: 0.63 },
  { word: "cache", x: 0.79, y: 0.44 },
  { word: "cage", x: 0.41, y: 0.31 },
  { word: "call", x: 0.83, y: 0.48 },
  { word: "calm", x: 0.17, y: 0.72 },
  { word: "canny", x: 0.32, y: 0.95 },
  { word: "canon", x: 0.32, y: 0.48 },
  { word: "cap", x: 0.92, y: 0.06 },
  { word: "carry", x: 0.33, y: 0.24 },
  { word: "cast", x: 0.53, y: 0.01 },
  { word: "catch", x: 0.48, y: 0.41 },
  { word: "cause", x: 0.61, y: 0.45 },
  { word: "chain", x: 0.86, y: 0.72 },
  { word: "chance", x: 0.39, y: 0.65 },
  { word: "change", x: 0.54, y: 0.37 },
  { word: "charm", x: 0.03, y: 0.82 },
  { word: "chart", x: 0.47, y: 0.13 },
  { word: "chase", x: 0.53, y: 0.18 },
  { word: "check", x: 0.26, y: 0.23 },
  { word: "chime", x: 0.18, y: 0.91 },
  { word: "chip", x: 0.91, y: 0.33 },
  { word: "choice", x: 0.57, y: 0.58 },
  { word: "chop", x: 0.57, y: 0.56 },
  { word: "chore", x: 0.56, y: 0.25 },
  { word: "chunk", x: 0.49, y: 0.37 },
  { word: "cipher", x: 0.58, y: 0.87 },
  { word: "claim", x: 0.47, y: 0.60 },
  { word: "clamp", x: 0.78, y: 0.11 },
  { word: "clarity", x: 0.34, y: 0.84 },
  { word: "clasp", x: 0.79, y: 0.24 },
  { word: "class", x: 0.40, y: 0.44 },
  { word: "clause", x: 0.41, y: 0.87 },
  { word: "clean", x: 0.46, y: 0.39 },
  { word: "clear", x: 0.66, y: 0.77 },
  { word: "cli", x: 0.93, y: 0.58 },
  { word: "climb", x: 0.25, y: 0.13 },
  { word: "cloak", x: 0.22, y: 0.37 },
  { word: "clock", x: 0.86, y: 0.39 },
  { word: "clue", x: 0.35, y: 0.63 },
  { word: "cluster", x: 0.68, y: 0.17 },
  { word: "coach", x: 0.34, y: 0.99 },
  { word: "coast", x: 0.11, y: 0.24 },
  { word: "code", x: 0.89, y: 0.63 },
  { word: "codex", x: 0.74, y: 0.78 },
  { word: "cog", x: 0.87, y: 0.06 },
  { word: "coil", x: 0.90, y: 0.24 },
  { word: "cold", x: 0.06, y: 0.60 },
  { word: "color", x: 0.06, y: 0.85 },
  { word: "compare", x: 0.33, y: 0.23 },
  { word: "cool", x: 0.10, y: 0.87 },
  { word: "cope", x: 0.32, y: 0.48 },
  { word: "copy", x: 0.84, y: 0.61 },
  { word: "coral", x: 0.17, y: 0.99 },
  { word: "core", x: 0.12, y: 0.63 },
  { word: "cost", x: 0.44, y: 0.41 },
  { word: "count", x: 0.72, y: 0.14 },
  { word: "crack", x: 0.58, y: 0.67 },
  { word: "craft", x: 0.50, y: 0.58 },
  { word: "crane", x: 0.91, y: 0.07 },
  { word: "crave", x: 0.01, y: 0.44 },
  { word: "creed", x: 0.33, y: 0.47 },
  { word: "crest", x: 0.87, y: 0.23 },
  { word: "crisp", x: 0.59, y: 0.50 },
  { word: "cron", x: 0.95, y: 0.48 },
  { word: "crown", x: 0.77, y: 0.13 },
  { word: "crux", x: 0.43, y: 0.45 },
  { word: "cry", x: 0.10, y: 0.62 },
  { word: "csv", x: 0.98, y: 0.40 },
  { word: "cue", x: 0.45, y: 0.41 },
  { word: "cure", x: 0.11, y: 0.44 },
  { word: "cusp", x: 0.46, y: 0.30 },
  { word: "cut", x: 0.55, y: 0.43 },
  { word: "cycle", x: 0.45, y: 0.65 },
  { word: "dare", x: 0.72, y: 0.46 },
  { word: "dark", x: 0.18, y: 0.48 },
  { word: "dash", x: 0.18, y: 0.17 },
  { word: "data", x: 0.80, y: 0.60 },
  { word: "datum", x: 0.53, y: 0.90 },
  { word: "dawn", x: 0.12, y: 0.67 },
  { word: "daze", x: 0.19, y: 0.53 },
  { word: "deal", x: 0.28, y: 0.57 },
  { word: "debt", x: 0.78, y: 0.80 },
  { word: "debug", x: 0.78, y: 0.64 },
  { word: "decay", x: 0.47, y: 0.61 },
  { word: "decode", x: 0.84, y: 0.26 },
  { word: "deduce", x: 0.41, y: 0.75 },
  { word: "deed", x: 0.29, y: 0.05 },
  { word: "deep", x: 0.17, y: 0.71 },
  { word: "deft", x: 0.26, y: 0.89 },
  { word: "delay", x: 0.24, y: 0.75 },
  { word: "delve", x: 0.66, y: 0.56 },
  { word: "dense", x: 0.25, y: 0.62 },
  { word: "density", x: 0.70, y: 0.80 },
  { word: "deny", x: 0.13, y: 0.49 },
  { word: "depth", x: 0.43, y: 0.51 },
  { word: "derive", x: 0.52, y: 0.48 },
  { word: "dew", x: 0.06, y: 0.78 },
  { word: "dial", x: 0.79, y: 1.00 },
  { word: "dig", x: 0.57, y: 0.26 },
  { word: "dim", x: 0.21, y: 0.45 },
  { word: "disk", x: 0.96, y: 0.64 },
  { word: "dogma", x: 0.42, y: 0.54 },
  { word: "domain", x: 0.33, y: 0.56 },
  { word: "dome", x: 0.99, y: 0.07 },
  { word: "door", x: 0.93, y: 0.08 },
  { word: "dose", x: 0.83, y: 0.96 },
  { word: "doubt", x: 0.12, y: 0.60 },
  { word: "draft", x: 0.29, y: 0.16 },
  { word: "drag", x: 0.08, y: 0.38 },
  { word: "draw", x: 0.28, y: 0.15 },
  { word: "dread", x: 0.00, y: 0.66 },
  { word: "dream", x: 0.23, y: 0.96 },
  { word: "drift", x: 0.12, y: 0.30 },
  { word: "drill", x: 0.75, y: 0.16 },
  { word: "drip", x: 0.22, y: 0.86 },
  { word: "drive", x: 0.43, y: 0.17 },
  { word: "drum", x: 0.97, y: 0.19 },
  { word: "dry", x: 0.24, y: 0.50 },
  { word: "duct", x: 0.97, y: 0.53 },
  { word: "due", x: 0.66, y: 0.49 },
  { word: "dump", x: 0.82, y: 0.45 },
  { word: "dusk", x: 0.04, y: 0.29 },
  { word: "dusky", x: 0.19, y: 0.55 },
  { word: "duty", x: 0.58, y: 0.00 },
  { word: "dwell", x: 0.13, y: 0.46 },
  { word: "dye", x: 0.13, y: 0.88 },
  { word: "ease", x: 0.21, y: 0.66 },
  { word: "echo", x: 0.20, y: 0.84 },
  { word: "edge", x: 0.83, y: 0.21 },
  { word: "edit", x: 0.78, y: 0.70 },
  { word: "effect", x: 0.58, y: 0.33 },
  { word: "effort", x: 0.66, y: 0.07 },
  { word: "ego", x: 0.00, y: 0.72 },
  { word: "embed", x: 0.94, y: 0.39 },
  { word: "ember", x: 0.54, y: 0.65 },
  { word: "empty", x: 0.17, y: 0.60 },
  { word: "encode", x: 0.76, y: 0.50 },
  { word: "endure", x: 0.15, y: 0.57 },
  { word: "energy", x: 0.61, y: 0.73 },
  { word: "engine", x: 0.99, y: 0.74 },
  { word: "enigma", x: 0.31, y: 0.76 },
  { word: "entity", x: 0.39, y: 1.00 },
  { word: "entry", x: 0.81, y: 0.18 },
  { word: "enum", x: 0.99, y: 0.49 },
  { word: "envy", x: 0.16, y: 0.63 },
  { word: "epic", x: 0.62, y: 0.51 },
  { word: "epoch", x: 0.84, y: 0.65 },
  { word: "equal", x: 0.62, y: 0.30 },
  { word: "equity", x: 0.88, y: 0.83 },
  { word: "erosion", x: 0.18, y: 0.45 },
  { word: "error", x: 0.73, y: 0.68 },
  { word: "essay", x: 0.53, y: 0.78 },
  { word: "ethic", x: 0.50, y: 0.79 },
  { word: "event", x: 0.77, y: 0.67 },
  { word: "evil", x: 0.49, y: 0.86 },
  { word: "evolve", x: 0.74, y: 0.50 },
  { word: "exact", x: 0.95, y: 0.94 },
  { word: "exec", x: 0.76, y: 0.67 },
  { word: "exert", x: 0.37, y: 0.10 },
  { word: "exit", x: 0.07, y: 0.06 },
  { word: "expand", x: 0.55, y: 0.68 },
  { word: "fable", x: 0.58, y: 0.26 },
  { word: "face", x: 0.59, y: 0.62 },
  { word: "fact", x: 0.43, y: 0.95 },
  { word: "fading", x: 0.21, y: 0.53 },
  { word: "faint", x: 0.41, y: 0.65 },
  { word: "fair", x: 0.40, y: 0.62 },
  { word: "fault", x: 0.61, y: 0.74 },
  { word: "fear", x: 0.02, y: 0.39 },
  { word: "feat", x: 0.69, y: 0.22 },
  { word: "feel", x: 0.13, y: 0.48 },
  { word: "fence", x: 0.48, y: 0.36 },
  { word: "fern", x: 0.22, y: 0.94 },
  { word: "fetch", x: 0.33, y: 0.07 },
  { word: "field", x: 0.69, y: 0.32 },
  { word: "file", x: 0.86, y: 0.46 },
  { word: "find", x: 0.46, y: 0.05 },
  { word: "finesse", x: 0.27, y: 0.64 },
  { word: "fire", x: 0.64, y: 0.13 },
  { word: "firm", x: 0.24, y: 0.45 },
  { word: "fit", x: 0.74, y: 0.02 },
  { word: "fix", x: 0.47, y: 0.22 },
  { word: "fixed", x: 0.91, y: 0.90 },
  { word: "flag", x: 0.95, y: 0.57 },
  { word: "flair", x: 0.26, y: 0.69 },
  { word: "flame", x: 0.43, y: 0.63 },
  { word: "flat", x: 0.12, y: 0.29 },
  { word: "flaw", x: 0.73, y: 0.32 },
  { word: "flee", x: 0.16, y: 0.01 },
  { word: "flip", x: 0.86, y: 0.51 },
  { word: "float", x: 0.22, y: 0.07 },
  { word: "floor", x: 0.95, y: 0.06 },
  { word: "flow", x: 0.69, y: 0.40 },
  { word: "fluid", x: 0.14, y: 0.83 },
  { word: "flux", x: 0.82, y: 0.82 },
  { word: "fly", x: 0.01, y: 0.05 },
  { word: "focal", x: 0.67, y: 0.48 },
  { word: "focus", x: 0.50, y: 0.66 },
  { word: "fog", x: 0.01, y: 0.32 },
  { word: "folio", x: 0.41, y: 0.93 },
  { word: "font", x: 0.54, y: 0.80 },
  { word: "foray", x: 0.15, y: 0.04 },
  { word: "forge", x: 0.67, y: 0.04 },
  { word: "fork", x: 0.89, y: 0.65 },
  { word: "form", x: 0.76, y: 0.60 },
  { word: "frame", x: 0.80, y: 0.42 },
  { word: "free", x: 0.25, y: 0.16 },
  { word: "fresh", x: 0.31, y: 0.53 },
  { word: "fret", x: 0.18, y: 0.39 },
  { word: "frost", x: 0.11, y: 1.00 },
  { word: "fuel", x: 0.41, y: 0.19 },
  { word: "full", x: 0.50, y: 0.91 },
  { word: "func", x: 0.76, y: 0.50 },
  { word: "fury", x: 0.14, y: 0.32 },
  { word: "fuse", x: 0.45, y: 0.01 },
  { word: "fuzzy", x: 0.60, y: 0.46 },
  { word: "gain", x: 0.57, y: 0.68 },
  { word: "gamble", x: 0.69, y: 0.68 },
  { word: "gamma", x: 0.87, y: 0.80 },
  { word: "gap", x: 0.20, y: 0.11 },
  { word: "gape", x: 0.06, y: 0.79 },
  { word: "gate", x: 0.78, y: 0.11 },
  { word: "gauge", x: 0.69, y: 0.21 },
  { word: "gaze", x: 0.26, y: 0.38 },
  { word: "gear", x: 0.25, y: 0.19 },
  { word: "gentle", x: 0.12, y: 0.98 },
  { word: "genus", x: 0.32, y: 0.52 },
  { word: "get", x: 0.41, y: 0.74 },
  { word: "gift", x: 0.53, y: 0.71 },
  { word: "gist", x: 0.53, y: 0.96 },
  { word: "give", x: 0.68, y: 0.53 },
  { word: "gleam", x: 0.03, y: 0.93 },
  { word: "glide", x: 0.03, y: 0.11 },
  { word: "glitch", x: 0.43, y: 0.65 },
  { word: "gloom", x: 0.05, y: 0.28 },
  { word: "glow", x: 0.21, y: 0.92 },
  { word: "glyph", x: 0.52, y: 0.96 },
  { word: "gnaw", x: 0.13, y: 0.63 },
  { word: "gone", x: 0.07, y: 0.16 },
  { word: "good", x: 0.52, y: 0.71 },
  { word: "grab", x: 0.73, y: 0.14 },
  { word: "grace", x: 0.17, y: 0.63 },
  { word: "grade", x: 0.73, y: 0.27 },
  { word: "gram", x: 0.83, y: 0.84 },
  { word: "grant", x: 0.57, y: 0.27 },
  { word: "graph", x: 0.96, y: 0.62 },
  { word: "grasp", x: 0.66, y: 0.53 },
  { word: "gray", x: 0.25, y: 0.31 },
  { word: "grid", x: 0.73, y: 0.30 },
  { word: "grief", x: 0.21, y: 0.63 },
  { word: "grim", x: 0.00, y: 0.48 },
  { word: "grind", x: 0.06, y: 0.38 },
  { word: "grip", x: 0.52, y: 0.42 },
  { word: "grit", x: 0.16, y: 0.58 },
  { word: "groove", x: 0.98, y: 0.15 },
  { word: "ground", x: 0.46, y: 0.91 },
  { word: "grow", x: 0.27, y: 0.50 },
  { word: "guard", x: 0.12, y: 0.56 },
  { word: "guess", x: 0.39, y: 0.67 },
  { word: "gui", x: 0.98, y: 0.69 },
  { word: "guide", x: 0.42, y: 0.97 },
  { word: "guilt", x: 0.16, y: 0.64 },
  { word: "habit", x: 0.32, y: 0.72 },
  { word: "hail", x: 0.21, y: 0.86 },
  { word: "halt", x: 0.77, y: 0.68 },
  { word: "hang", x: 0.12, y: 0.58 },
  { word: "hard", x: 0.71, y: 0.68 },
  { word: "hardy", x: 0.17, y: 0.56 },
  { word: "harsh", x: 0.04, y: 0.26 },
  { word: "hash", x: 0.94, y: 0.50 },
  { word: "hatch", x: 0.90, y: 0.13 },
  { word: "haul", x: 0.50, y: 0.21 },
  { word: "haunt", x: 0.05, y: 0.36 },
  { word: "haven", x: 0.17, y: 0.99 },
  { word: "haze", x: 0.14, y: 0.40 },
  { word: "hazy", x: 0.67, y: 0.37 },
  { word: "head", x: 0.80, y: 0.01 },
  { word: "heal", x: 0.20, y: 0.42 },
  { word: "heap", x: 0.94, y: 0.63 },
  { word: "heart", x: 0.17, y: 0.57 },
  { word: "heat", x: 0.58, y: 0.36 },
  { word: "heavy", x: 0.34, y: 0.44 },
  { word: "helix", x: 0.97, y: 0.15 },
  { word: "help", x: 0.07, y: 0.65 },
  { word: "herb", x: 0.22, y: 0.85 },
  { word: "hertz", x: 0.92, y: 0.84 },
  { word: "hide", x: 0.11, y: 0.62 },
  { word: "hike", x: 0.09, y: 0.04 },
  { word: "hinge", x: 0.46, y: 0.58 },
  { word: "hint", x: 0.74, y: 0.44 },
  { word: "hitch", x: 0.48, y: 0.59 },
  { word: "hold", x: 0.49, y: 0.32 },
  { word: "honor", x: 0.58, y: 0.93 },
  { word: "hop", x: 0.22, y: 0.02 },
  { word: "hope", x: 0.12, y: 0.31 },
  { word: "hose", x: 0.81, y: 0.57 },
  { word: "hover", x: 0.23, y: 0.34 },
  { word: "hub", x: 0.86, y: 0.20 },
  { word: "hue", x: 0.17, y: 0.77 },
  { word: "hunch", x: 0.61, y: 0.50 },
  { word: "hunt", x: 0.34, y: 0.04 },
  { word: "hurry", x: 0.06, y: 0.07 },
  { word: "hurt", x: 0.08, y: 0.59 },
  { word: "hush", x: 0.02, y: 0.91 },
  { word: "hymn", x: 0.14, y: 0.95 },
  { word: "ice", x: 0.07, y: 0.98 },
  { word: "idea", x: 0.48, y: 0.31 },
  { word: "impulse", x: 0.33, y: 0.47 },
  { word: "index", x: 0.40, y: 0.22 },
  { word: "infer", x: 0.57, y: 0.52 },
  { word: "ink", x: 0.53, y: 0.77 },
  { word: "inner", x: 0.02, y: 0.61 },
  { word: "input", x: 0.81, y: 0.32 },
  { word: "itch", x: 0.06, y: 0.29 },
  { word: "item", x: 0.74, y: 0.58 },
  { word: "ivory", x: 0.20, y: 0.76 },
  { word: "jade", x: 0.14, y: 0.90 },
  { word: "jam", x: 0.59, y: 0.54 },
  { word: "jaunt", x: 0.20, y: 0.18 },
  { word: "job", x: 0.43, y: 0.04 },
  { word: "join", x: 0.44, y: 0.25 },
  { word: "joint", x: 0.96, y: 0.02 },
  { word: "joule", x: 0.99, y: 0.95 },
  { word: "joy", x: 0.03, y: 0.82 },
  { word: "judge", x: 0.46, y: 0.51 },
  { word: "just", x: 0.34, y: 0.32 },
  { word: "kappa", x: 0.81, y: 0.92 },
  { word: "keen", x: 0.17, y: 0.31 },
  { word: "keep", x: 0.53, y: 0.52 },
  { word: "kelvin", x: 0.98, y: 0.95 },
  { word: "kernel", x: 0.96, y: 0.39 },
  { word: "key", x: 0.58, y: 0.57 },
  { word: "kick", x: 0.46, y: 0.15 },
  { word: "kill", x: 0.88, y: 0.48 },
  { word: "kind", x: 0.27, y: 0.65 },
  { word: "knack", x: 0.30, y: 0.37 },
  { word: "knit", x: 0.48, y: 0.11 },
  { word: "knot", x: 0.30, y: 0.58 },
  { word: "know", x: 0.41, y: 0.60 },
  { word: "labor", x: 0.21, y: 0.62 },
  { word: "laden", x: 0.39, y: 0.99 },
  { word: "lag", x: 0.02, y: 0.73 },
  { word: "lambda", x: 0.90, y: 0.90 },
  { word: "lapse", x: 0.18, y: 0.35 },
  { word: "latent", x: 0.81, y: 0.75 },
  { word: "launch", x: 0.14, y: 0.07 },
  { word: "law", x: 0.69, y: 0.56 },
  { word: "layer", x: 0.99, y: 0.07 },
  { word: "lead", x: 0.64, y: 0.91 },
  { word: "leaf", x: 0.09, y: 0.95 },
  { word: "lean", x: 0.25, y: 0.40 },
  { word: "leap", x: 0.26, y: 0.25 },
  { word: "learn", x: 0.39, y: 0.72 },
  { word: "leave", x: 0.02, y: 0.01 },
  { word: "ledge", x: 0.83, y: 0.10 },
  { word: "ledger", x: 0.99, y: 0.78 },
  { word: "legacy", x: 0.29, y: 0.76 },
  { word: "lens", x: 0.44, y: 0.33 },
  { word: "lesson", x: 0.33, y: 0.79 },
  { word: "level", x: 0.91, y: 0.10 },
  { word: "lever", x: 0.94, y: 0.13 },
  { word: "lexeme", x: 0.37, y: 0.97 },
  { word: "lift", x: 0.15, y: 0.22 },
  { word: "light", x: 0.54, y: 0.70 },
  { word: "limber", x: 0.11, y: 0.92 },
  { word: "limit", x: 0.58, y: 0.63 },
  { word: "linger", x: 0.01, y: 0.63 },
  { word: "link", x: 0.75, y: 0.23 },
  { word: "list", x: 0.91, y: 0.46 },
  { word: "liter", x: 0.80, y: 0.93 },
  { word: "lithe", x: 0.08, y: 0.90 },
  { word: "load", x: 0.46, y: 0.07 },
  { word: "lock", x: 0.54, y: 0.75 },
  { word: "locus", x: 0.34, y: 0.31 },
  { word: "log", x: 0.36, y: 0.23 },
  { word: "logic", x: 0.63, y: 0.56 },
  { word: "logos", x: 0.74, y: 0.85 },
  { word: "lone", x: 0.17, y: 0.72 },
  { word: "long", x: 0.03, y: 0.48 },
  { word: "loop", x: 0.83, y: 0.39 },
  { word: "loose", x: 0.04, y: 0.09 },
  { word: "lore", x: 0.47, y: 0.70 },
  { word: "loss", x: 0.68, y: 0.68 },
  { word: "lost", x: 0.20, y: 0.56 },
  { word: "lucid", x: 0.73, y: 0.28 },
  { word: "luck", x: 0.46, y: 0.72 },
  { word: "lull", x: 0.04, y: 0.90 },
  { word: "luster", x: 0.21, y: 0.89 },
  { word: "lyric", x: 0.16, y: 0.95 },
  { word: "magic", x: 0.11, y: 0.78 },
  { word: "make", x: 0.73, y: 0.23 },
  { word: "map", x: 0.31, y: 0.06 },
  { word: "march", x: 0.22, y: 0.14 },
  { word: "mark", x: 0.37, y: 0.17 },
  { word: "mask", x: 0.07, y: 0.68 },
  { word: "mass", x: 0.27, y: 0.55 },
  { word: "match", x: 0.49, y: 0.14 },
  { word: "max", x: 0.96, y: 0.79 },
  { word: "maxim", x: 0.25, y: 0.65 },
  { word: "mean", x: 0.84, y: 0.84 },
  { word: "meaning", x: 0.75, y: 1.00 },
  { word: "means", x: 0.62, y: 0.47 },
  { word: "meek", x: 0.11, y: 0.52 },
  { word: "mend", x: 0.03, y: 0.74 },
  { word: "mercy", x: 0.14, y: 0.36 },
  { word: "merge", x: 0.50, y: 0.70 },
  { word: "merit", x: 0.95, y: 0.93 },
  { word: "meter", x: 0.93, y: 0.82 },
  { word: "method", x: 0.71, y: 0.75 },
  { word: "metric", x: 0.90, y: 0.88 },
  { word: "might", x: 0.02, y: 0.36 },
  { word: "mild", x: 0.16, y: 0.70 },
  { word: "min", x: 0.92, y: 0.76 },
  { word: "mind", x: 0.57, y: 0.81 },
  { word: "mine", x: 0.71, y: 0.66 },
  { word: "mist", x: 0.10, y: 0.89 },
  { word: "misty", x: 0.31, y: 0.26 },
  { word: "mix", x: 0.73, y: 0.25 },
  { word: "mock", x: 0.46, y: 0.12 },
  { word: "mode", x: 0.94, y: 0.93 },
  { word: "model", x: 0.61, y: 0.17 },
  { word: "mole", x: 0.82, y: 0.78 },
  { word: "mood", x: 0.20, y: 0.36 },
  { word: "moral", x: 0.40, y: 0.88 },
  { word: "morph", x: 0.66, y: 0.44 },
  { word: "moss", x: 0.03, y: 0.84 },
  { word: "motif", x: 0.30, y: 0.50 },
  { word: "motor", x: 0.96, y: 0.43 },
  { word: "mount", x: 0.32, y: 0.03 },
  { word: "mourn", x: 0.09, y: 0.63 },
  { word: "move", x: 0.23, y: 0.11 },
  { word: "murky", x: 0.02, y: 0.56 },
  { word: "muster", x: 0.30, y: 0.14 },
  { word: "myth", x: 0.38, y: 0.34 },
  { word: "nadir", x: 0.91, y: 0.92 },
  { word: "nag", x: 0.05, y: 0.31 },
  { word: "nail", x: 0.91, y: 0.00 },
  { word: "neat", x: 0.59, y: 0.49 },
  { word: "need", x: 0.05, y: 0.41 },
  { word: "nerve", x: 0.04, y: 0.55 },
  { word: "net", x: 0.30, y: 0.62 },
  { word: "neural", x: 0.78, y: 0.67 },
  { word: "new", x: 0.28, y: 0.63 },
  { word: "nexus", x: 0.30, y: 0.59 },
  { word: "node", x: 0.73, y: 0.35 },
  { word: "noise", x: 0.43, y: 0.69 },
  { word: "nomos", x: 0.50, y: 0.76 },
  { word: "norm", x: 0.37, y: 0.71 },
  { word: "notch", x: 0.78, y: 0.11 },
  { word: "note", x: 0.68, y: 0.02 },
  { word: "notion", x: 0.67, y: 0.50 },
  { word: "novel", x: 0.64, y: 0.37 },
  { word: "novelty", x: 0.34, y: 0.74 },
  { word: "nozzle", x: 0.99, y: 0.66 },
  { word: "nub", x: 0.26, y: 0.76 },
  { word: "numb", x: 0.21, y: 0.29 },
  { word: "odd", x: 0.68, y: 0.41 },
  { word: "ode", x: 0.04, y: 0.94 },
  { word: "offer", x: 0.45, y: 0.32 },
  { word: "omega", x: 0.92, y: 0.78 },
  { word: "onset", x: 0.37, y: 0.49 },
  { word: "onyx", x: 0.14, y: 0.88 },
  { word: "opal", x: 0.09, y: 0.85 },
  { word: "open", x: 0.21, y: 0.19 },
  { word: "opus", x: 0.35, y: 0.90 },
  { word: "orbit", x: 0.58, y: 0.49 },
  { word: "order", x: 0.92, y: 0.76 },
  { word: "origin", x: 0.71, y: 0.65 },
  { word: "out", x: 0.00, y: 0.18 },
  { word: "output", x: 0.66, y: 0.45 },
  { word: "over", x: 0.24, y: 0.22 },
  { word: "pace", x: 0.09, y: 0.14 },
  { word: "page", x: 0.70, y: 0.96 },
  { word: "pain", x: 0.11, y: 0.26 },
  { word: "pair", x: 0.84, y: 0.43 },
  { word: "pale", x: 0.06, y: 0.75 },
  { word: "panel", x: 0.75, y: 0.23 },
  { word: "panic", x: 0.10, y: 0.52 },
  { word: "param", x: 0.46, y: 0.00 },
  { word: "parse", x: 0.95, y: 0.58 },
  { word: "part", x: 0.35, y: 0.44 },
  { word: "pascal", x: 1.00, y: 0.95 },
  { word: "pass", x: 0.62, y: 0.36 },
  { word: "paste", x: 0.88, y: 0.34 },
  { word: "patch", x: 0.96, y: 0.69 },
  { word: "path", x: 0.81, y: 0.31 },
  { word: "pause", x: 0.17, y: 0.38 },
  { word: "peace", x: 0.09, y: 0.95 },
  { word: "peak", x: 0.86, y: 0.05 },
  { word: "pearl", x: 0.02, y: 0.94 },
  { word: "petal", x: 0.19, y: 0.80 },
  { word: "phase", x: 0.44, y: 0.47 },
  { word: "phrase", x: 0.38, y: 0.81 },
  { word: "physis", x: 0.35, y: 0.88 },
  { word: "pick", x: 0.63, y: 0.03 },
  { word: "piece", x: 0.38, y: 0.67 },
  { word: "pier", x: 0.95, y: 0.07 },
  { word: "pin", x: 0.94, y: 0.19 },
  { word: "ping", x: 0.88, y: 0.40 },
  { word: "pipe", x: 0.89, y: 0.57 },
  { word: "piston", x: 0.87, y: 0.39 },
  { word: "pith", x: 0.57, y: 0.89 },
  { word: "pity", x: 0.03, y: 0.58 },
  { word: "pivot", x: 0.52, y: 0.74 },
  { word: "place", x: 0.87, y: 0.99 },
  { word: "placid", x: 0.22, y: 0.84 },
  { word: "plain", x: 0.63, y: 0.31 },
  { word: "plan", x: 0.42, y: 0.15 },
  { word: "play", x: 0.42, y: 0.33 },
  { word: "plot", x: 0.37, y: 0.06 },
  { word: "pluck", x: 0.21, y: 0.55 },
  { word: "pod", x: 0.84, y: 0.33 },
  { word: "point", x: 0.81, y: 0.12 },
  { word: "poise", x: 0.02, y: 0.94 },
  { word: "pole", x: 0.97, y: 0.21 },
  { word: "ponder", x: 0.17, y: 0.40 },
  { word: "pool", x: 0.02, y: 0.92 },
  { word: "port", x: 0.85, y: 0.14 },
  { word: "pose", x: 0.53, y: 0.30 },
  { word: "posit", x: 0.55, y: 0.30 },
  { word: "post", x: 0.95, y: 0.03 },
  { word: "power", x: 0.63, y: 0.68 },
  { word: "praxis", x: 0.72, y: 0.94 },
  { word: "pray", x: 0.10, y: 0.53 },
  { word: "prep", x: 0.57, y: 0.07 },
  { word: "press", x: 0.35, y: 0.18 },
  { word: "price", x: 0.61, y: 0.63 },
  { word: "pride", x: 0.00, y: 0.52 },
  { word: "prime", x: 0.67, y: 0.02 },
  { word: "prism", x: 0.71, y: 0.28 },
  { word: "probe", x: 0.50, y: 0.09 },
  { word: "profit", x: 0.93, y: 0.77 },
  { word: "prompt", x: 0.98, y: 0.32 },
  { word: "proof", x: 0.63, y: 0.49 },
  { word: "proper", x: 0.65, y: 0.62 },
  { word: "prose", x: 0.38, y: 0.91 },
  { word: "prove", x: 0.37, y: 0.03 },
  { word: "proxy", x: 0.76, y: 0.42 },
  { word: "pull", x: 0.52, y: 0.19 },
  { word: "pulse", x: 0.19, y: 0.72 },
  { word: "pump", x: 0.29, y: 0.11 },
  { word: "pure", x: 0.55, y: 0.96 },
  { word: "push", x: 0.41, y: 0.00 },
  { word: "qualia", x: 0.59, y: 0.78 },
  { word: "quality", x: 0.58, y: 0.91 },
  { word: "query", x: 0.38, y: 0.22 },
  { word: "quest", x: 0.21, y: 0.15 },
  { word: "queue", x: 0.86, y: 0.71 },
  { word: "quick", x: 0.16, y: 0.09 },
  { word: "quiet", x: 0.25, y: 0.99 },
  { word: "quirk", x: 0.40, y: 0.45 },
  { word: "quota", x: 0.88, y: 0.93 },
  { word: "rage", x: 0.07, y: 0.41 },
  { word: "rail", x: 0.83, y: 0.14 },
  { word: "rain", x: 0.18, y: 0.87 },
  { word: "rally", x: 0.58, y: 0.23 },
  { word: "range", x: 0.22, y: 0.08 },
  { word: "rank", x: 0.69, y: 0.24 },
  { word: "rapid", x: 0.29, y: 0.55 },
  { word: "rapt", x: 0.00, y: 0.88 },
  { word: "rare", x: 0.35, y: 0.36 },
  { word: "rate", x: 0.40, y: 0.01 },
  { word: "ratio", x: 0.46, y: 0.30 },
  { word: "ration", x: 0.82, y: 0.95 },
  { word: "raw", x: 0.24, y: 0.51 },
  { word: "reach", x: 0.40, y: 0.13 },
  { word: "react", x: 0.30, y: 0.69 },
  { word: "read", x: 0.83, y: 0.49 },
  { word: "ready", x: 0.49, y: 0.23 },
  { word: "real", x: 0.29, y: 0.83 },
  { word: "realm", x: 0.29, y: 0.28 },
  { word: "reason", x: 0.34, y: 0.43 },
  { word: "recall", x: 0.61, y: 0.58 },
  { word: "reel", x: 0.96, y: 0.14 },
  { word: "relay", x: 0.94, y: 0.32 },
  { word: "rend", x: 0.47, y: 0.54 },
  { word: "rerun", x: 0.67, y: 0.15 },
  { word: "rest", x: 0.13, y: 0.42 },
  { word: "result", x: 0.48, y: 0.73 },
  { word: "retain", x: 0.59, y: 0.29 },
  { word: "review", x: 0.75, y: 0.83 },
  { word: "rhythm", x: 0.26, y: 0.81 },
  { word: "ridge", x: 0.95, y: 0.04 },
  { word: "right", x: 0.52, y: 0.74 },
  { word: "rigid", x: 0.29, y: 0.68 },
  { word: "rigor", x: 0.06, y: 0.69 },
  { word: "rim", x: 0.93, y: 0.08 },
  { word: "ring", x: 0.92, y: 0.25 },
  { word: "ripe", x: 0.49, y: 0.95 },
  { word: "rise", x: 0.10, y: 0.05 },
  { word: "risk", x: 0.42, y: 0.43 },
  { word: "rivet", x: 0.80, y: 0.17 },
  { word: "roam", x: 0.28, y: 0.30 },
  { word: "rod", x: 0.86, y: 0.14 },
  { word: "role", x: 0.67, y: 0.18 },
  { word: "roof", x: 0.87, y: 0.08 },
  { word: "root", x: 0.55, y: 0.26 },
  { word: "rough", x: 0.13, y: 0.39 },
  { word: "route", x: 0.79, y: 0.28 },
  { word: "rove", x: 0.24, y: 0.08 },
  { word: "ruby", x: 0.09, y: 0.94 },
  { word: "rule", x: 0.33, y: 0.29 },
  { word: "ruler", x: 0.83, y: 0.90 },
  { word: "run", x: 0.05, y: 0.13 },
  { word: "rune", x: 0.47, y: 0.97 },
  { word: "rush", x: 0.18, y: 0.01 },
  { word: "saga", x: 0.34, y: 0.28 },
  { word: "sage", x: 0.42, y: 0.77 },
  { word: "sail", x: 0.20, y: 0.00 },
  { word: "salve", x: 0.18, y: 0.47 },
  { word: "sample", x: 0.57, y: 0.46 },
  { word: "save", x: 0.34, y: 0.60 },
  { word: "savvy", x: 0.71, y: 0.91 },
  { word: "say", x: 0.63, y: 0.87 },
  { word: "scale", x: 0.49, y: 0.45 },
  { word: "scan", x: 0.56, y: 0.20 },
  { word: "schema", x: 1.00, y: 0.60 },
  { word: "school", x: 0.28, y: 0.78 },
  { word: "scope", x: 0.88, y: 0.51 },
  { word: "score", x: 0.84, y: 0.92 },
  { word: "scorn", x: 0.01, y: 0.33 },
  { word: "scout", x: 0.07, y: 0.16 },
  { word: "screw", x: 0.87, y: 0.06 },
  { word: "script", x: 0.43, y: 0.85 },
  { word: "sdk", x: 0.92, y: 0.39 },
  { word: "seal", x: 0.70, y: 0.42 },
  { word: "seam", x: 0.85, y: 0.16 },
  { word: "search", x: 0.67, y: 0.74 },
  { word: "see", x: 0.45, y: 0.51 },
  { word: "seek", x: 0.36, y: 0.11 },
  { word: "select", x: 0.64, y: 0.16 },
  { word: "self", x: 0.18, y: 0.39 },
  { word: "send", x: 0.55, y: 0.17 },
  { word: "sense", x: 0.63, y: 0.90 },
  { word: "serene", x: 0.09, y: 0.76 },
  { word: "server", x: 0.84, y: 0.26 },
  { word: "set", x: 0.37, y: 0.23 },
  { word: "setup", x: 0.62, y: 0.14 },
  { word: "shade", x: 0.25, y: 0.89 },
  { word: "shaft", x: 0.88, y: 0.01 },
  { word: "shame", x: 0.25, y: 0.42 },
  { word: "shape", x: 0.11, y: 0.82 },
  { word: "shard", x: 0.54, y: 0.54 },
  { word: "share", x: 0.42, y: 0.25 },
  { word: "sharp", x: 0.24, y: 0.53 },
  { word: "shear", x: 0.57, y: 0.40 },
  { word: "sheen", x: 0.02, y: 0.81 },
  { word: "shelf", x: 0.85, y: 0.07 },
  { word: "shield", x: 0.09, y: 0.26 },
  { word: "shift", x: 0.64, y: 0.27 },
  { word: "shine", x: 0.11, y: 0.75 },
  { word: "ship", x: 0.37, y: 0.03 },
  { word: "shock", x: 0.11, y: 0.70 },
  { word: "shout", x: 0.43, y: 0.76 },
  { word: "show", x: 0.47, y: 0.92 },
  { word: "shrewd", x: 0.31, y: 0.80 },
  { word: "shrink", x: 0.69, y: 0.47 },
  { word: "sieve", x: 0.67, y: 0.30 },
  { word: "sift", x: 0.28, y: 0.19 },
  { word: "sigil", x: 0.61, y: 0.94 },
  { word: "sigma", x: 0.82, y: 0.82 },
  { word: "sign", x: 0.54, y: 0.51 },
  { word: "signal", x: 0.84, y: 0.56 },
  { word: "silk", x: 0.18, y: 0.88 },
  { word: "simple", x: 0.47, y: 0.39 },
  { word: "sketch", x: 0.60, y: 0.68 },
  { word: "skew", x: 0.81, y: 0.89 },
  { word: "skill", x: 0.66, y: 0.72 },
  { word: "skip", x: 0.11, y: 0.01 },
  { word: "slab", x: 0.88, y: 0.18 },
  { word: "sleet", x: 0.12, y: 0.78 },
  { word: "slice", x: 0.59, y: 0.61 },
  { word: "slide", x: 0.23, y: 0.22 },
  { word: "slim", x: 0.36, y: 0.32 },
  { word: "slip", x: 0.13, y: 0.04 },
  { word: "slot", x: 0.99, y: 0.17 },
  { word: "slow", x: 0.01, y: 0.47 },
  { word: "smear", x: 0.71, y: 0.29 },
  { word: "smooth", x: 0.15, y: 0.96 },
  { word: "snag", x: 0.26, y: 0.52 },
  { word: "snap", x: 0.56, y: 0.70 },
  { word: "snow", x: 0.07, y: 0.82 },
  { word: "soar", x: 0.16, y: 0.14 },
  { word: "soft", x: 0.16, y: 1.00 },
  { word: "solid", x: 0.67, y: 0.65 },
  { word: "solve", x: 0.70, y: 0.05 },
  { word: "song", x: 0.08, y: 0.76 },
  { word: "soothe", x: 0.03, y: 0.73 },
  { word: "sore", x: 0.22, y: 0.50 },
  { word: "sorrow", x: 0.10, y: 0.25 },
  { word: "sort", x: 0.29, y: 0.12 },
  { word: "soul", x: 0.09, y: 0.69 },
  { word: "sound", x: 0.42, y: 0.31 },
  { word: "space", x: 0.16, y: 0.10 },
  { word: "span", x: 0.70, y: 0.35 },
  { word: "spark", x: 0.64, y: 0.38 },
  { word: "sparse", x: 0.45, y: 0.55 },
  { word: "spawn", x: 0.97, y: 0.47 },
  { word: "speak", x: 0.40, y: 0.76 },
  { word: "speech", x: 0.33, y: 0.83 },
  { word: "speed", x: 0.02, y: 0.06 },
  { word: "spell", x: 0.10, y: 0.95 },
  { word: "sphere", x: 0.59, y: 0.39 },
  { word: "spin", x: 0.09, y: 0.05 },
  { word: "spire", x: 0.99, y: 0.04 },
  { word: "spite", x: 0.24, y: 0.35 },
  { word: "split", x: 0.39, y: 0.65 },
  { word: "spool", x: 0.93, y: 0.13 },
  { word: "spot", x: 0.52, y: 0.46 },
  { word: "spread", x: 0.90, y: 0.80 },
  { word: "spur", x: 0.51, y: 0.23 },
  { word: "sql", x: 0.83, y: 0.54 },
  { word: "stack", x: 1.00, y: 0.13 },
  { word: "stage", x: 0.73, y: 0.68 },
  { word: "stake", x: 0.71, y: 0.50 },
  { word: "stall", x: 0.21, y: 0.54 },
  { word: "stamp", x: 0.31, y: 0.50 },
  { word: "stand", x: 0.09, y: 0.42 },
  { word: "stare", x: 0.11, y: 0.90 },
  { word: "stark", x: 0.07, y: 0.30 },
  { word: "start", x: 0.70, y: 0.06 },
  { word: "state", x: 0.33, y: 0.53 },
  { word: "steam", x: 0.54, y: 0.36 },
  { word: "steel", x: 0.08, y: 0.59 },
  { word: "stem", x: 0.24, y: 0.87 },
  { word: "step", x: 0.21, y: 0.15 },
  { word: "stern", x: 0.15, y: 0.40 },
  { word: "stew", x: 0.19, y: 0.42 },
  { word: "stiff", x: 0.27, y: 0.26 },
  { word: "still", x: 0.25, y: 0.82 },
  { word: "stitch", x: 0.38, y: 0.20 },
  { word: "stoke", x: 0.59, y: 0.07 },
  { word: "store", x: 0.48, y: 0.41 },
  { word: "story", x: 0.37, y: 0.41 },
  { word: "strain", x: 0.39, y: 0.32 },
  { word: "stray", x: 0.02, y: 0.02 },
  { word: "strict", x: 0.89, y: 0.93 },
  { word: "strive", x: 0.62, y: 0.33 },
  { word: "strong", x: 0.03, y: 0.64 },
  { word: "strut", x: 0.83, y: 0.23 },
  { word: "study", x: 0.35, y: 0.08 },
  { word: "stuff", x: 0.59, y: 0.62 },
  { word: "stun", x: 0.04, y: 0.40 },
  { word: "style", x: 0.69, y: 0.47 },
  { word: "suffer", x: 0.12, y: 0.30 },
  { word: "sum", x: 0.49, y: 0.20 },
  { word: "supple", x: 0.02, y: 0.92 },
  { word: "sure", x: 0.51, y: 0.94 },
  { word: "surge", x: 0.25, y: 0.21 },
  { word: "swap", x: 0.81, y: 0.47 },
  { word: "sway", x: 0.04, y: 0.18 },
  { word: "sweep", x: 0.65, y: 0.22 },
  { word: "sweet", x: 0.13, y: 0.95 },
  { word: "swift", x: 0.03, y: 0.07 },
  { word: "symbol", x: 0.93, y: 0.75 },
  { word: "sync", x: 0.83, y: 0.55 },
  { word: "syntax", x: 0.30, y: 0.82 },
  { word: "tag", x: 0.33, y: 0.51 },
  { word: "tale", x: 0.26, y: 0.64 },
  { word: "talk", x: 0.54, y: 0.83 },
  { word: "tally", x: 0.36, y: 0.03 },
  { word: "tap", x: 0.38, y: 0.34 },
  { word: "tape", x: 0.95, y: 0.33 },
  { word: "task", x: 0.75, y: 0.25 },
  { word: "taxa", x: 0.53, y: 0.65 },
  { word: "tcp", x: 0.79, y: 0.42 },
  { word: "teach", x: 0.74, y: 0.91 },
  { word: "tell", x: 0.51, y: 0.87 },
  { word: "telos", x: 0.65, y: 0.83 },
  { word: "tempo", x: 0.17, y: 0.33 },
  { word: "tender", x: 0.18, y: 0.77 },
  { word: "tenet", x: 0.70, y: 0.59 },
  { word: "tense", x: 0.22, y: 0.54 },
  { word: "test", x: 0.54, y: 0.28 },
  { word: "text", x: 0.41, y: 0.93 },
  { word: "theme", x: 0.64, y: 0.51 },
  { word: "theory", x: 0.63, y: 0.35 },
  { word: "thesis", x: 0.52, y: 0.71 },
  { word: "theta", x: 0.88, y: 0.98 },
  { word: "thick", x: 0.60, y: 0.50 },
  { word: "thin", x: 0.38, y: 0.41 },
  { word: "thing", x: 0.39, y: 0.53 },
  { word: "think", x: 0.59, y: 0.68 },
  { word: "thrill", x: 0.01, y: 0.56 },
  { word: "tic", x: 0.40, y: 0.50 },
  { word: "tide", x: 0.01, y: 0.98 },
  { word: "tidy", x: 0.58, y: 0.27 },
  { word: "tier", x: 0.83, y: 0.22 },
  { word: "tight", x: 0.90, y: 0.79 },
  { word: "tile", x: 0.92, y: 0.08 },
  { word: "timer", x: 0.94, y: 0.47 },
  { word: "tint", x: 0.24, y: 0.77 },
  { word: "tip", x: 0.91, y: 0.08 },
  { word: "toil", x: 0.08, y: 0.49 },
  { word: "token", x: 0.94, y: 0.55 },
  { word: "tome", x: 0.47, y: 0.87 },
  { word: "tone", x: 0.57, y: 0.87 },
  { word: "tool", x: 0.81, y: 0.48 },
  { word: "top", x: 0.95, y: 0.19 },
  { word: "total", x: 0.65, y: 0.05 },
  { word: "touch", x: 0.16, y: 0.55 },
  { word: "tough", x: 0.18, y: 0.29 },
  { word: "tower", x: 0.98, y: 0.03 },
  { word: "trace", x: 0.72, y: 0.03 },
  { word: "track", x: 0.52, y: 0.18 },
  { word: "trade", x: 0.69, y: 0.27 },
  { word: "train", x: 0.39, y: 0.15 },
  { word: "trait", x: 0.66, y: 0.70 },
  { word: "trap", x: 0.54, y: 0.53 },
  { word: "tree", x: 0.92, y: 0.51 },
  { word: "trek", x: 0.20, y: 0.17 },
  { word: "trend", x: 0.81, y: 0.99 },
  { word: "trial", x: 0.48, y: 0.30 },
  { word: "trim", x: 0.51, y: 0.48 },
  { word: "true", x: 0.75, y: 0.93 },
  { word: "truss", x: 0.95, y: 0.22 },
  { word: "trust", x: 0.51, y: 0.64 },
  { word: "truth", x: 0.49, y: 0.87 },
  { word: "try", x: 0.25, y: 0.08 },
  { word: "tube", x: 0.95, y: 0.32 },
  { word: "tune", x: 0.35, y: 0.11 },
  { word: "tuple", x: 0.80, y: 0.36 },
  { word: "turn", x: 0.07, y: 0.23 },
  { word: "tutor", x: 0.47, y: 0.98 },
  { word: "tweak", x: 0.68, y: 0.06 },
  { word: "twist", x: 0.25, y: 0.68 },
  { word: "type", x: 0.60, y: 0.70 },
  { word: "udp", x: 0.99, y: 0.60 },
  { word: "unit", x: 0.75, y: 0.40 },
  { word: "urge", x: 0.19, y: 0.67 },
  { word: "utter", x: 0.73, y: 0.80 },
  { word: "vague", x: 0.54, y: 0.54 },
  { word: "valid", x: 0.70, y: 0.14 },
  { word: "valor", x: 0.19, y: 0.31 },
  { word: "value", x: 0.80, y: 0.79 },
  { word: "valve", x: 0.85, y: 0.51 },
  { word: "vast", x: 0.06, y: 0.01 },
  { word: "vector", x: 0.85, y: 0.36 },
  { word: "veer", x: 0.16, y: 0.15 },
  { word: "veil", x: 0.21, y: 0.29 },
  { word: "verb", x: 0.44, y: 0.89 },
  { word: "verge", x: 0.42, y: 0.48 },
  { word: "verify", x: 0.79, y: 0.92 },
  { word: "verse", x: 0.12, y: 0.92 },
  { word: "vibe", x: 0.11, y: 0.68 },
  { word: "vice", x: 0.32, y: 0.83 },
  { word: "view", x: 0.74, y: 0.58 },
  { word: "vigor", x: 0.55, y: 0.43 },
  { word: "vine", x: 0.22, y: 0.83 },
  { word: "virtue", x: 0.72, y: 0.79 },
  { word: "vision", x: 0.66, y: 0.56 },
  { word: "vivid", x: 0.49, y: 0.45 },
  { word: "voice", x: 0.72, y: 0.88 },
  { word: "void", x: 0.74, y: 0.51 },
  { word: "vouch", x: 0.98, y: 0.97 },
  { word: "wager", x: 0.53, y: 0.44 },
  { word: "wail", x: 0.14, y: 0.55 },
  { word: "wait", x: 0.96, y: 0.56 },
  { word: "wall", x: 0.81, y: 0.20 },
  { word: "wander", x: 0.07, y: 0.26 },
  { word: "want", x: 0.19, y: 0.44 },
  { word: "ward", x: 0.05, y: 0.65 },
  { word: "warm", x: 0.61, y: 0.05 },
  { word: "warp", x: 0.32, y: 0.31 },
  { word: "waste", x: 0.26, y: 0.52 },
  { word: "wave", x: 0.01, y: 0.80 },
  { word: "way", x: 0.30, y: 0.57 },
  { word: "weave", x: 0.23, y: 0.37 },
  { word: "web", x: 0.66, y: 0.53 },
  { word: "weep", x: 0.21, y: 0.73 },
  { word: "weigh", x: 0.45, y: 0.16 },
  { word: "weight", x: 0.63, y: 0.72 },
  { word: "weird", x: 0.32, y: 0.70 },
  { word: "weld", x: 0.49, y: 0.05 },
  { word: "wheel", x: 0.81, y: 0.16 },
  { word: "whole", x: 0.59, y: 0.82 },
  { word: "wide", x: 0.08, y: 0.07 },
  { word: "wild", x: 0.14, y: 0.17 },
  { word: "will", x: 0.12, y: 0.65 },
  { word: "wing", x: 0.06, y: 0.15 },
  { word: "wire", x: 0.77, y: 0.47 },
  { word: "wisdom", x: 0.67, y: 0.83 },
  { word: "wish", x: 0.16, y: 0.26 },
  { word: "wit", x: 0.52, y: 0.97 },
  { word: "woe", x: 0.12, y: 0.47 },
  { word: "wonder", x: 0.18, y: 0.66 },
  { word: "word", x: 0.60, y: 0.78 },
  { word: "worry", x: 0.06, y: 0.31 },
  { word: "worth", x: 0.99, y: 0.90 },
  { word: "wound", x: 0.10, y: 0.33 },
  { word: "wrath", x: 0.06, y: 0.60 },
  { word: "write", x: 0.79, y: 0.28 },
  { word: "xml", x: 0.85, y: 0.55 },
  { word: "yearn", x: 0.01, y: 0.57 },
  { word: "yell", x: 0.50, y: 0.97 },
  { word: "yield", x: 0.42, y: 0.60 },
  { word: "zone", x: 0.44, y: 0.61 },
];

// ── State names for corner label ───────────────────────────
const STATE_NAMES = [
  '', 'GENESIS', 'MEASURE', 'DARK MATTER', 'CONSTRAINTS',
  'FADING PATHS', 'HOMOGENIZATION', 'RISING FLOOR', 'LIBERATION', 'LIMITATIONS',
];

// ── Interfaces ─────────────────────────────────────────────

interface BaseParticle {
  id: number;
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  size: number;
  alpha: number;
  alive: boolean;
  label: string;
  labelAlpha: number;
  labelTimer: number;
  trailX: number[];
  trailY: number[];
  trapped: boolean;
  trappedByAI: number; // AI id, -1 if not trapped
}

interface UnconstrainedParticle extends BaseParticle {
  type: 'unconstrained';
}

interface ConstrainedParticle extends BaseParticle {
  type: 'constrained';
  anchorX: number;
  anchorY: number;
  haloPhase: number;
  gravityRadius: number;
  gravityStrength: number;
}

interface SemiConstrainedParticle extends BaseParticle {
  type: 'semi-constrained';
  anchorX: number;
  anchorY: number;
  wanderRadius: number;    // max distance from anchor
  wanderAngle: number;     // current wander angle
  wanderSpeed: number;     // angular speed of wander
  haloPhase: number;       // pulsing halo like constrained
  entryStartX: number;     // X position at start of float-in (off-screen edge)
  entryStartY: number;     // Y position at start of float-in (off-screen edge)
  entryProgress: number;   // 0→1 float-in animation progress
  settled: boolean;        // true once fully arrived at anchor
}

interface AIGeneratedParticle extends BaseParticle {
  type: 'ai-generated';
  parentAIId: number;
  orbitAngle: number;
  orbitSpeed: number;
  breakFreeProgress: number;  // 0→1: accumulates on outer orbits, triggers conversion at 1
}

type Particle = UnconstrainedParticle | ConstrainedParticle | SemiConstrainedParticle | AIGeneratedParticle;

interface AIEntity {
  id: number;
  x: number; y: number;           // physics (grid-plane) coordinates
  screenX: number; screenY: number; // projected screen coordinates for drawing
  vx: number; vy: number;
  radius: number;
  screenRadius: number;   // perspective-scaled radius for drawing
  screenGravRadius: number; // perspective-scaled gravity radius for drawing
  gravityRadius: number;
  gravityStrength: number;
  alpha: number;
  trappedIds: Set<number>;
  spawnTimer: number;
  spawnRate: number;
  entrySection: number;
  entryProgress: number;
  active: boolean;
}

interface Bond {
  idA: number;
  idB: number;
  strength: number;
  persistent: boolean;
  age: number;
}

interface GridState {
  alpha: number;
  amberBlend: number; // 0=invisible, 1=amber
  rotationX: number;  // 0=flat, PI/2=edge-on
  concavityX: number; concavityY: number; concavityR: number; concavityD: number;
  convexityX: number; convexityY: number; convexityR: number; convexityH: number;
}

// ── Main class ─────────────────────────────────────────────

export class ParticleSimulation {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dpr: number;
  private w = 0;
  private h = 0;

  // State
  private scrollProgress = 0;
  private phase = 0; // elapsed time in seconds
  private running = false;
  private rafId = 0;
  private lastTime = 0;

  // Entities
  private particles: Particle[] = [];
  private aiEntities: AIEntity[] = [];
  private bonds: Bond[] = [];
  private semiConstrainedSpawned = 0;
  private grid: GridState;
  private nextId = 0;

  // Mouse
  private mouseX = -1000;
  private mouseY = -1000;

  // Config
  private isMobile: boolean;
  private maxParticles: number;
  private maxBonds = 60;

  // Section III — grid rotation freeze + post-rotation perspective projection
  // Particles freeze in place as the grid rotates, then resume physics on the tilted grid plane.
  // After rotation, physics operates in flat grid space; positions are projected to screen for drawing.
  private gridRotFrozen = false;          // true while grid is actively rotating in Section III
  private gridRotDone = false;            // true once the rotation completed and particles were released
  private gridRotAnchors: Map<number, { x: number; y: number }> = new Map(); // particle id → frozen flat-grid position
  private gridPlanePositions: Map<number, { x: number; y: number }> = new Map(); // flat-plane position for perspective projection after rotation

  // Section VII — freeze & rotate
  private floorY = 0;
  // Screen-space floor particles: drawn directly along the projected floor line
  private floorDots: { x: number; size: number; alpha: number; phase: number }[] = [];
  private physicsStopped = false;
  private s7Frozen = false;  // true once all particles have been snapshot-frozen
  private frozenAnchors: Map<number, { x: number; y: number }> = new Map(); // particle id → frozen position
  private frozenAI: Map<number, { x: number; y: number }> = new Map(); // AI entity id → frozen position

  // Section VIII
  private zoomFactor = 1;
  private zoomCenterX = 0;
  private zoomCenterY = 0;
  private focusParticleId = -1;  // the lone white particle we zoom into
  private liberationStarted = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false })!;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.isMobile = window.innerWidth < 768;
    this.maxParticles = this.isMobile ? 120 : 200;

    this.grid = {
      alpha: 0, amberBlend: 0, rotationX: 0,
      concavityX: 0, concavityY: 0, concavityR: 0, concavityD: 0,
      convexityX: 0, convexityY: 0, convexityR: 0, convexityH: 0,
    };

    this.resize();
    this.initParticles();
    this.initAIEntities();

    window.addEventListener('resize', this.onResize);
    canvas.addEventListener('mousemove', this.onMouse);
    canvas.addEventListener('mouseleave', this.onMouseLeave);
  }

  // ── Lifecycle ──────────────────────────────────────────

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.tick();
  }

  destroy(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    this.canvas.removeEventListener('mousemove', this.onMouse);
    this.canvas.removeEventListener('mouseleave', this.onMouseLeave);
  }

  setScrollProgress(progress: number): void {
    const prev = this.scrollProgress;
    this.scrollProgress = Math.max(0, Math.min(9, progress));

    // Reset liberation state if scrolling back before Section IX (liberation starts at sp 8.0)
    if (prev >= 8.0 && this.scrollProgress < 8.0) {
      this.liberationStarted = false;
      this.focusParticleId = -1;
      this.zoomFactor = 1;
    }

    // Reset freeze state if scrolling back before Section VII (freeze starts at sp ~6.3)
    // Without this, s7Frozen and physicsStopped stay true and block all forces
    // (mouse turbulence, repulsion, gravity, AI entities, etc.) on earlier sections.
    if (prev >= 6 && this.scrollProgress < 6) {
      this.s7Frozen = false;
      this.physicsStopped = false;
      this.frozenAnchors.clear();
      this.frozenAI.clear();
      this.floorY = 0;
      this.floorDots.length = 0;
    }

    // Reset grid rotation state if scrolling back before Section III (rotation zone sp 2.3–2.7)
    // Without this, gridRotFrozen can stay true and block all physics in Scenes I–II.
    if (prev >= 2 && this.scrollProgress < 2) {
      this.gridRotFrozen = false;
      this.gridRotDone = false;
      this.gridRotAnchors.clear();
      this.gridPlanePositions.clear();
    }
  }

  // ── Setup ──────────────────────────────────────────────

  private resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.w = rect.width;
    this.h = rect.height;
    this.canvas.width = this.w * this.dpr;
    this.canvas.height = this.h * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  private onResize = (): void => {
    this.resize();
    // Reposition constrained particles
    this.particles.forEach(p => {
      if (p.type === 'constrained') {
        p.anchorX = p.anchorX / this.w * this.w; // stays proportional via re-init if needed
        p.anchorY = p.anchorY / this.h * this.h;
      }
    });
  };

  private onMouse = (e: MouseEvent): void => {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;
  };

  private onMouseLeave = (): void => {
    this.mouseX = -1000;
    this.mouseY = -1000;
  };

  private initParticles(): void {
    const count = this.isMobile ? 40 : 80;
    const used = new Set<string>();
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createUnconstrained(undefined, undefined, used));
    }
  }

  /** Collect all labels currently visible on screen (flashing + permanent constrained) */
  private getActiveLabels(): Set<string> {
    const active = new Set<string>();
    for (const p of this.particles) {
      if (p.alive && p.label && (p.labelTimer > 0 || (p.type === 'constrained' && p.labelAlpha > 0))) {
        active.add(p.label);
      }
    }
    return active;
  }

  private createUnconstrained(x?: number, y?: number, exclude?: Set<string>): UnconstrainedParticle {
    const px = x ?? Math.random() * this.w;
    const py = y ?? Math.random() * this.h;
    const lbl = this.semanticLabel(px, py, exclude);
    if (exclude) exclude.add(lbl); // prevent next creation in same batch from reusing
    // Scale spawn velocity to match current scene (slow in Scene I, faster later)
    const sp = this.scrollProgress;
    const spawnMul = sp < 1 ? 0.45 : sp < 2 ? 0.45 + (sp - 1) * 0.30 : 1;
    return {
      id: this.nextId++,
      type: 'unconstrained',
      x: px,
      y: py,
      z: 0,
      vx: (Math.random() - 0.5) * 120 * spawnMul * (this.w / 1200),
      vy: (Math.random() - 0.5) * 120 * spawnMul * (this.w / 1200),
      vz: 0,
      size: 1.5 + Math.random() * 1.5,
      alpha: 0.4 + Math.random() * 0.4,
      alive: true,
      label: lbl,
      labelAlpha: 0,
      labelTimer: 0,
      trailX: [], trailY: [],
      trapped: false,
      trappedByAI: -1,
    };
  }

  private createConstrained(x: number, y: number, exclude?: Set<string>): ConstrainedParticle {
    const lbl = this.semanticLabel(x, y, exclude);
    if (exclude) exclude.add(lbl); // prevent next creation in same batch from reusing
    return {
      id: this.nextId++,
      type: 'constrained',
      x, y, z: 0,
      vx: 0, vy: 0, vz: 0,
      size: 5,
      alpha: 0,  // start invisible, fade in during physics update
      alive: true,
      label: lbl,
      labelAlpha: 0,
      labelTimer: 0,
      trailX: [], trailY: [],
      trapped: false,
      trappedByAI: -1,
      anchorX: x,
      anchorY: y,
      haloPhase: Math.random() * Math.PI * 2,
      gravityRadius: 140,
      gravityStrength: 18,
    };
  }

  private createAIGenerated(parentId: number, x: number, y: number): AIGeneratedParticle {
    const angle = Math.random() * Math.PI * 2;
    // Orbital radius: 2-5× the AI sphere radius (18px) — tight cluster around parent
    const orbitR = 18 * (2 + Math.random() * 3); // 36–90px
    return {
      id: this.nextId++,
      type: 'ai-generated',
      x: x + Math.cos(angle) * orbitR,
      y: y + Math.sin(angle) * orbitR,
      z: 0,
      vx: 0, vy: 0, vz: 0, // velocity set by orbit mechanics, not initial push
      size: 1.5 + Math.random() * 1,
      alpha: 0.5 + Math.random() * 0.3,
      alive: true,
      label: '',
      labelAlpha: 0,
      labelTimer: 0,
      trailX: [], trailY: [],
      trapped: false,
      trappedByAI: -1,
      parentAIId: parentId,
      orbitAngle: angle,
      orbitSpeed: 0.3 + Math.random() * 0.8,
      breakFreeProgress: 0,
    };
  }

  private initAIEntities(): void {
    // 4 AI entities, enter at different scroll positions
    const entries = [
      { section: 3, progress: 0.7 }, // 1st AI in Section IV
      { section: 4, progress: 0.2 }, // 2nd AI in Section V
      { section: 4, progress: 0.7 }, // 3rd AI in Section V
      { section: 5, progress: 0.3 }, // 4th AI in Section VI
    ];

    entries.forEach((entry, i) => {
      this.aiEntities.push({
        id: i,
        x: -100, y: this.h / 2,
        screenX: -100, screenY: this.h / 2,
        vx: 0, vy: 0,
        radius: 18,
        screenRadius: 18,
        screenGravRadius: 150,
        gravityRadius: 150,
        gravityStrength: 25,
        alpha: 0,
        trappedIds: new Set(),
        spawnTimer: 0,
        spawnRate: 2, // particles per second
        entrySection: entry.section,
        entryProgress: entry.progress,
        active: false,
      });
    });
  }

  // ── Main loop ──────────────────────────────────────────

  private tick = (): void => {
    if (!this.running) return;
    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;
    this.phase += dt;

    this.update(dt);
    this.draw();

    this.rafId = requestAnimationFrame(this.tick);
  };

  // ── Update ─────────────────────────────────────────────

  private update(dt: number): void {
    const sp = this.scrollProgress;
    const section = Math.floor(sp) + 1; // 1-8
    const sectionProgress = sp - Math.floor(sp);

    // Activate AI entities based on scroll position
    this.updateAIActivation(sp);

    // Safety: ensure freeze flags are cleared if scroll position is before Section VII.
    // This handles edge cases where setScrollProgress didn't cross the threshold cleanly.
    if (sp < 6 && this.s7Frozen) {
      this.s7Frozen = false;
      this.physicsStopped = false;
      this.frozenAnchors.clear();
      this.frozenAI.clear();
      this.floorY = 0;
      this.floorDots.length = 0;
    }

    // ── Restore flat grid-plane positions before physics ──
    // After the Section III rotation completes, particles live on the tilted grid plane.
    // Their screen positions were projected last frame; restore flat coords so physics
    // operates in grid-plane space. Runs until Section VII freezes everything.
    if (this.gridRotDone && !this.s7Frozen && !this.gridRotFrozen) {
      this.restoreGridPlanePositions();
    }

    // Section III: grid rotation freeze — freezes particles during the initial rotation
    if (sp >= 2 && sp < 3) this.updateGridRotationFreeze(dt, sp);

    // Section III: grid state (also IV-VII)
    if (sp >= 2 && sp < 7) this.updateGrid(dt, sp);

    // Always: basic physics (skip when frozen during grid rotation or Section VII)
    if ((!this.physicsStopped || sp < 6) && !this.gridRotFrozen) {
      this.updateParticlePhysics(dt, section, sectionProgress);
    }

    // Always update constrained/semi-constrained perspective — even when physics stopped
    // so they track the grid rotation through Section VII
    if (this.physicsStopped && sp >= 6) {
      this.updateAnchoredParticlePerspective(dt, sp);
    }

    // Section I+ (always): mouse turbulence (skip when frozen)
    if (sp >= 0 && !this.s7Frozen && !this.gridRotFrozen) this.applyMouseTurbulence(dt);

    // Section II+ : constrained particle gravity (skip when frozen)
    if (sp >= 1 && !this.s7Frozen && !this.gridRotFrozen) this.applyConstrainedGravity(dt);

    // Always: soft inter-particle repulsion to prevent clumping (skip when frozen)
    if (!this.s7Frozen && !this.gridRotFrozen) this.applyParticleRepulsion(dt);

    // Section III: concavity/convexity forces (skip when frozen)
    if (sp >= 2 && !this.s7Frozen && !this.gridRotFrozen) this.applyConcavityConvexity(dt, sectionProgress, sp);

    // Section IV+: spawn semi-constrained (extrinsic constraint)
    if (sp >= 3) this.spawnSemiConstrainedIfNeeded(sp);

    // Section IV+: gravitational corridor between semi-constrained particles (skip when frozen)
    if (sp >= 3 && !this.s7Frozen) this.applySemiConstrainedGravity(dt);

    // Active AI entities (skip when frozen — positions controlled by rotate projection)
    if (!this.s7Frozen) this.updateAIEntities(dt, sp);

    // Bonds
    this.updateBonds(dt, sp);

    // Section VII: rising floor / stochastic bounce (only during Section VII itself)
    if (sp >= 6 && sp < 7) this.updateRisingFloor(dt, sp);

    // Section VIII (bounce) + IX (liberation/zoom)
    if (sp >= 7 && sp < 9) this.updateZoom(dt, sp);

    // Boundary enforcement (skip during grid rotation freeze — positions are projected)
    if (!this.gridRotFrozen) this.enforceBoundaries();

    // Constrained particles: spawn if needed
    this.spawnConstrainedIfNeeded(sp);

    // ── Project particles to screen space for drawing ──
    // After all physics has run on flat grid-plane coords, project through the tilted
    // perspective. Active from post-rotation (gridRotDone) until Section VII freezes.
    // Once s7Frozen, Section VII's own projection takes over.
    if (this.gridRotDone && !this.gridRotFrozen && !this.s7Frozen && sp >= 2) {
      this.projectGridPlaneToScreen();
      this.projectAIEntitiesToScreen();
    } else {
      // No grid tilt — AI entities draw at their physics position with base radius
      for (const ai of this.aiEntities) {
        ai.screenX = ai.x;
        ai.screenY = ai.y;
        ai.screenRadius = ai.radius;
        ai.screenGravRadius = ai.gravityRadius;
      }
    }
  }

  private updateParticlePhysics(dt: number, section: number, sectionProgress: number): void {
    // Per-section velocity personality:
    //   Scene I   (sp 0–1): slowest, contemplative drift
    //   Scene II  (sp 1–2): slightly livelier as associations form
    //   Scene III (sp 2–3): grid appears, moderate speed
    //   Scene IV  (sp 3–4): AI enters — slow down slightly for clarity
    //   Scene V+  (sp 4+):  full speed
    const sp = this.scrollProgress;
    let sceneMul: number; // 0→1 multiplier on drift & maxV
    if (sp < 1) {
      sceneMul = 0.45; // Scene I: very slow
    } else if (sp < 2) {
      sceneMul = 0.45 + (sp - 1) * 0.30; // Scene II: ramp 0.45 → 0.75
    } else if (sp < 3) {
      sceneMul = 0.75; // Scene III: moderate
    } else if (sp < 4) {
      sceneMul = 0.70; // Scene IV: slightly slower — AI interactions need clarity
    } else {
      sceneMul = 0.70 + Math.min(1, (sp - 4) * 0.5) * 0.30; // V+: ramp 0.70 → 1.0
    }

    const baseDamping = 0.968;
    // Heavier damping in early scenes (lower multiplier = more damping needed)
    const damping = baseDamping - (1 - sceneMul) * 0.012; // 0.962 in Scene I → 0.968 at full
    const maxV = 130 * sceneMul * (this.w / 1200);

    // Velocity & drift scale with canvas width for more dynamic movement
    const wScale = this.w / 1200; // 1.0 at 1200px, larger on wider screens

    for (const p of this.particles) {
      if (!p.alive) continue;

      // Constrained particles sit on the grid plane — project through 3D perspective
      // During grid rotation freeze, they are handled by updateGridRotationFreeze instead
      if (p.type === 'constrained') {
        // Fade in over 1.5 seconds
        if (p.alpha < 0.85) {
          p.alpha = Math.min(0.85, p.alpha + dt * 0.57); // ~1.5s to reach 0.85
        }

        // Skip projection if grid rotation freeze is active — freeze handler projects them
        if (this.gridRotFrozen) {
          p.haloPhase += dt * 2;
          continue;
        }

        const g = this.grid;
        if (g.rotationX > 0.01) {
          // Same perspective math as drawGrid's warpPoint WITH concavity/convexity dz warp
          const tilt = -g.rotationX;
          const cosT = Math.cos(tilt);
          const sinT = Math.sin(tilt);
          const focalLen = this.h * 1.5;
          const cy = this.h * 0.5;

          // Concavity/convexity surface displacement at anchor position
          let dz = 0;
          if (g.concavityR > 2) {
            const ddx = p.anchorX - g.concavityX;
            const ddy = p.anchorY - g.concavityY;
            const dist = Math.sqrt(ddx * ddx + ddy * ddy);
            if (dist < g.concavityR * 2.5) {
              const tt = 1 - dist / (g.concavityR * 2.5);
              dz -= g.concavityD * tt * tt;
            }
          }
          if (g.convexityR > 2) {
            const ddx = p.anchorX - g.convexityX;
            const ddy = p.anchorY - g.convexityY;
            const dist = Math.sqrt(ddx * ddx + ddy * ddy);
            if (dist < g.convexityR * 2.5) {
              const tt = 1 - dist / (g.convexityR * 2.5);
              dz += g.convexityH * tt * tt;
            }
          }

          const relY = p.anchorY - cy;
          const y3d = relY * cosT - dz * sinT;
          const z3d = relY * sinT + dz * cosT;
          const scale = focalLen / (focalLen + z3d);
          p.x = this.w * 0.5 + (p.anchorX - this.w * 0.5) * scale;
          p.y = cy + y3d * scale;
          // Store perspective scale for size/halo scaling in draw
          p.z = scale;
        } else {
          p.x = p.anchorX;
          p.y = p.anchorY;
          p.z = 1;
        }
        p.haloPhase += dt * 2;

        // Constrained particles show fixed labels from Section II onward
        if (this.scrollProgress >= 1 && p.alpha > 0.1) {
          p.labelAlpha = Math.min(p.alpha, p.labelAlpha + dt * 0.5); // fade in with particle
          p.labelTimer = 999; // keep label alive permanently
        }

        continue;
      }

      // Semi-constrained: float in from nearest edge, then stay fixed on grid with perspective
      // During grid rotation freeze, they are handled by updateGridRotationFreeze
      if (p.type === 'semi-constrained') {
        const g = this.grid;

        // Float-in animation: slide from off-screen edge to anchor position
        if (!p.settled) {
          p.entryProgress = Math.min(1, p.entryProgress + dt * 0.6); // ~1.7s to arrive
          const ease = 1 - Math.pow(1 - p.entryProgress, 3);
          const rawX = p.entryStartX + (p.anchorX - p.entryStartX) * ease;
          const rawY = p.entryStartY + (p.anchorY - p.entryStartY) * ease;

          if (g.rotationX > 0.01) {
            const tilt = -g.rotationX;
            const cosT = Math.cos(tilt);
            const sinT = Math.sin(tilt);
            const focalLen = this.h * 1.5;
            const cy = this.h * 0.5;
            const relY = rawY - cy;
            const y3d = relY * cosT;
            const z3d = relY * sinT;
            const scale = focalLen / (focalLen + z3d);
            p.x = this.w * 0.5 + (rawX - this.w * 0.5) * scale;
            p.y = cy + y3d * scale;
            p.z = scale;
          } else {
            p.x = rawX;
            p.y = rawY;
            p.z = 1;
          }

          p.alpha = 0.9 * p.entryProgress;
          if (p.entryProgress >= 1) p.settled = true;
          p.haloPhase += dt * 2;
          continue;
        }

        // Skip projection if grid rotation freeze is active
        if (this.gridRotFrozen) {
          p.haloPhase += dt * 2;
          continue;
        }

        // Settled: maintain full alpha, stay FIXED at anchor
        if (p.alpha < 0.9) p.alpha = Math.min(0.9, p.alpha + dt * 0.6);

        // Apply perspective projection with concavity/convexity dz warp
        if (g.rotationX > 0.01) {
          const tilt = -g.rotationX;
          const cosT = Math.cos(tilt);
          const sinT = Math.sin(tilt);
          const focalLen = this.h * 1.5;
          const cy = this.h * 0.5;

          let dz = 0;
          if (g.concavityR > 2) {
            const ddx = p.anchorX - g.concavityX;
            const ddy = p.anchorY - g.concavityY;
            const dist = Math.sqrt(ddx * ddx + ddy * ddy);
            if (dist < g.concavityR * 2.5) {
              const tt = 1 - dist / (g.concavityR * 2.5);
              dz -= g.concavityD * tt * tt;
            }
          }
          if (g.convexityR > 2) {
            const ddx = p.anchorX - g.convexityX;
            const ddy = p.anchorY - g.convexityY;
            const dist = Math.sqrt(ddx * ddx + ddy * ddy);
            if (dist < g.convexityR * 2.5) {
              const tt = 1 - dist / (g.convexityR * 2.5);
              dz += g.convexityH * tt * tt;
            }
          }

          const relY = p.anchorY - cy;
          const y3d = relY * cosT - dz * sinT;
          const z3d = relY * sinT + dz * cosT;
          const scale = focalLen / (focalLen + z3d);
          p.x = this.w * 0.5 + (p.anchorX - this.w * 0.5) * scale;
          p.y = cy + y3d * scale;
          p.z = scale;
        } else {
          p.x = p.anchorX;
          p.y = p.anchorY;
          p.z = 1;
        }

        p.haloPhase += dt * 2;
        continue;
      }

      // AI-generated: orbit parent in a tight cluster; outer orbits gradually break free
      if (p.type === 'ai-generated') {
        const parent = this.aiEntities[p.parentAIId];
        if (parent && parent.active) {
          // Advance orbit angle
          p.orbitAngle += p.orbitSpeed * dt;
          // Orbital radius: 2-5× AI sphere radius, varied per particle
          const targetR = 18 * (2 + (p.id % 7) * 0.5); // 36–81px
          const outerThreshold = 18 * 3.5; // ~63px — orbits beyond this start breaking free

          // Outer orbit particles accumulate break-free progress
          if (targetR > outerThreshold) {
            // Rate scales with how far out the orbit is (outermost = fastest)
            const outerRatio = (targetR - outerThreshold) / (81 - outerThreshold);
            p.breakFreeProgress += dt * outerRatio * 0.12; // ~8-12s to break free
          }

          // As break-free progresses, orbit steering weakens and drift increases
          const bfp = p.breakFreeProgress;
          const steerFade = 1 - bfp * bfp; // quadratic: holds tight, then drops fast
          const steer = 5.0 * Math.max(0, steerFade);

          // Smoothly steer toward orbital position around parent's SCREEN position
          // (parent.x/y are grid-plane physics coords; screenX/Y are where it's actually drawn)
          const parentDrawX = parent.screenX ?? parent.x;
          const parentDrawY = parent.screenY ?? parent.y;
          const targetX = parentDrawX + Math.cos(p.orbitAngle) * targetR;
          const targetY = parentDrawY + Math.sin(p.orbitAngle) * targetR;
          p.vx += (targetX - p.x) * steer * dt;
          p.vy += (targetY - p.y) * steer * dt;

          // Add outward drift as break-free progresses
          if (bfp > 0.3) {
            const driftStrength = (bfp - 0.3) * 40;
            const dx = p.x - parentDrawX;
            const dy = p.y - parentDrawY;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            p.vx += (dx / dist) * driftStrength * dt;
            p.vy += (dy / dist) * driftStrength * dt;
          }

          // Dampen to keep orbits stable (looser as breaking free)
          p.vx *= 0.90 + bfp * 0.06; // 0.90 → 0.96
          p.vy *= 0.90 + bfp * 0.06;
          p.x += p.vx * dt;
          p.y += p.vy * dt;

          // Convert to unconstrained white particle once fully broken free
          if (bfp >= 1.0) {
            this.convertAIToUnconstrained(p);
          }

          continue; // skip generic drift/damping for AI particles
        }
      }

      // Coherent drift — each particle has a slowly-rotating drift direction
      // derived from its id and elapsed time, producing smooth traversal across
      // the canvas rather than Brownian jitter from pure random impulses.
      const driftMag = 40 * sceneMul * wScale;
      const driftAngle = this.phase * (0.15 + (p.id % 7) * 0.04) + p.id * 2.39;
      p.vx += Math.cos(driftAngle) * driftMag * dt;
      p.vy += Math.sin(driftAngle) * driftMag * dt;

      // Damping
      p.vx *= damping;
      p.vy *= damping;

      // Velocity cap
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > maxV) {
        p.vx = (p.vx / speed) * maxV;
        p.vy = (p.vy / speed) * maxV;
      }

      // Position
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Label timer decay — labels only flash briefly on collision
      if (p.labelTimer > 0) {
        p.labelTimer -= dt;
        p.labelAlpha = Math.max(0, p.labelTimer / 1.5); // 1.5s fade
      } else {
        p.labelAlpha = 0;
      }
    }

    // Collision detection (Section I-II)
    if (this.scrollProgress < 3) {
      this.detectCollisions(dt);
    }

    // Section I+: random label flashing — words appear and fade on particles
    // Only begins once the Section I heading has scrolled into view (sp > 0.05)
    // so labels don't appear on the title/hero screen.
    if (this.scrollProgress > 0.05 && this.scrollProgress < 4) {
      // Section I (sp 0.05–1): ramp from ~2% to ~8% chance/s per particle
      // Section II+ (sp 1–4): full 15% chance/s
      const ramp = this.scrollProgress < 1
        ? 0.02 + this.scrollProgress * 0.06   // 2%→8% during Section I
        : 0.15;                                // 15% during Section II+

      // Collect currently visible labels (flashing + permanent) so new assignments avoid duplicates
      const visibleLabels = this.getActiveLabels();

      for (const p of this.particles) {
        if (!p.alive || p.type === 'constrained' || p.type === 'semi-constrained') continue;
        if (p.labelTimer <= 0 && Math.random() < dt * ramp) {
          p.labelTimer = 2.0 + Math.random() * 1.0; // 2-3 second display
          // Assign a label avoiding words already on screen
          p.label = this.semanticLabel(p.x, p.y, visibleLabels);
          visibleLabels.add(p.label); // prevent same word in this frame
        }
      }
    }
  }

  /**
   * Update constrained & semi-constrained particle perspective when main physics is stopped.
   * Called during Section VII so these particles continue tracking the grid rotation
   * and fade out as the grid goes edge-on.
   */
  private updateAnchoredParticlePerspective(dt: number, sp: number): void {
    const g = this.grid;
    const s7 = Math.max(0, Math.min(1, sp - 6)); // 0→1 during Section VII

    for (const p of this.particles) {
      if (!p.alive) continue;

      if (p.type === 'constrained') {
        // Fade alpha with grid — constrained particles and halos disappear
        p.alpha = 0.85 * Math.max(0, 1 - s7 * 2.5); // fade out over first 40% of Section VII

        if (g.rotationX > 0.01) {
          const tilt = -g.rotationX;
          const cosT = Math.cos(tilt);
          const sinT = Math.sin(tilt);
          const focalLen = this.h * 1.5;
          const cy = this.h * 0.5;

          // Concavity/convexity dz warp
          let dz = 0;
          if (g.concavityR > 2) {
            const ddx = p.anchorX - g.concavityX;
            const ddy = p.anchorY - g.concavityY;
            const dist = Math.sqrt(ddx * ddx + ddy * ddy);
            if (dist < g.concavityR * 2.5) {
              const tt = 1 - dist / (g.concavityR * 2.5);
              dz -= g.concavityD * tt * tt;
            }
          }
          if (g.convexityR > 2) {
            const ddx = p.anchorX - g.convexityX;
            const ddy = p.anchorY - g.convexityY;
            const dist = Math.sqrt(ddx * ddx + ddy * ddy);
            if (dist < g.convexityR * 2.5) {
              const tt = 1 - dist / (g.convexityR * 2.5);
              dz += g.convexityH * tt * tt;
            }
          }

          const relY = p.anchorY - cy;
          const y3d = relY * cosT - dz * sinT;
          const z3d = relY * sinT + dz * cosT;
          const scale = focalLen / (focalLen + z3d);
          p.x = this.w * 0.5 + (p.anchorX - this.w * 0.5) * scale;
          p.y = cy + y3d * scale;
          p.z = scale;
        }
        p.haloPhase += dt * 2;
      }

      if (p.type === 'semi-constrained') {
        // Fade alpha with grid — semi-constrained particles and halos disappear
        p.alpha = 0.9 * Math.max(0, 1 - s7 * 2.5); // fade out over first 40% of Section VII

        if (g.rotationX > 0.01) {
          const tilt = -g.rotationX;
          const cosT = Math.cos(tilt);
          const sinT = Math.sin(tilt);
          const focalLen = this.h * 1.5;
          const cy = this.h * 0.5;

          // Concavity/convexity dz warp
          let dz = 0;
          if (g.concavityR > 2) {
            const ddx = p.anchorX - g.concavityX;
            const ddy = p.anchorY - g.concavityY;
            const dist = Math.sqrt(ddx * ddx + ddy * ddy);
            if (dist < g.concavityR * 2.5) {
              const tt = 1 - dist / (g.concavityR * 2.5);
              dz -= g.concavityD * tt * tt;
            }
          }
          if (g.convexityR > 2) {
            const ddx = p.anchorX - g.convexityX;
            const ddy = p.anchorY - g.convexityY;
            const dist = Math.sqrt(ddx * ddx + ddy * ddy);
            if (dist < g.convexityR * 2.5) {
              const tt = 1 - dist / (g.convexityR * 2.5);
              dz += g.convexityH * tt * tt;
            }
          }

          const relY = p.anchorY - cy;
          const y3d = relY * cosT - dz * sinT;
          const z3d = relY * sinT + dz * cosT;
          const scale = focalLen / (focalLen + z3d);
          p.x = this.w * 0.5 + (p.anchorX - this.w * 0.5) * scale;
          p.y = cy + y3d * scale;
          p.z = scale;
        }
        p.haloPhase += dt * 2;
      }
    }
  }

  /**
   * Section III grid rotation freeze:
   * - Before rotation starts: snapshot particle positions as grid-plane coordinates
   * - During rotation: project frozen positions through tilting perspective + smooth jitter
   * - After rotation: release particles — physics runs in grid-plane space, positions
   *   are projected through the tilted perspective for display
   */
  private updateGridRotationFreeze(dt: number, sp: number): void {
    // Grid rotation happens in Section III at sectionProgress 0.3–0.7
    // That's sp 2.3 → 2.7
    const rotStart = 2.3;   // sp when rotation begins
    const rotEnd = 2.7;     // sp when rotation reaches PI/3

    const isRotating = sp >= rotStart && sp < rotEnd;
    const pastRotation = sp >= rotEnd;

    // --- FREEZE: snapshot positions when rotation begins ---
    if (isRotating && !this.gridRotFrozen) {
      this.gridRotFrozen = true;
      this.gridRotDone = false;
      this.gridRotAnchors.clear();
      this.gridPlanePositions.clear();
      for (const p of this.particles) {
        if (!p.alive) continue;
        // Constrained & semi-constrained: freeze at their anchor positions
        if (p.type === 'constrained' || p.type === 'semi-constrained') {
          this.gridRotAnchors.set(p.id, { x: p.anchorX, y: p.anchorY });
          continue;
        }
        this.gridRotAnchors.set(p.id, { x: p.x, y: p.y });
        // Kill velocity so they don't resume with stale momentum
        p.vx = 0;
        p.vy = 0;
      }
    }

    // --- DURING ROTATION: project frozen positions through perspective + smooth jitter ---
    if (isRotating && this.gridRotFrozen) {
      const g = this.grid;
      const tilt = -g.rotationX;
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);
      const focalLen = this.h * 1.5;
      const cy = this.h * 0.5;
      const t = this.phase; // elapsed time for smooth oscillation

      for (const p of this.particles) {
        if (!p.alive) continue;
        const anchor = this.gridRotAnchors.get(p.id);
        if (!anchor) continue;

        // Concavity/convexity surface displacement (same as drawGrid warpPoint)
        let dz = 0;
        if (g.concavityR > 2) {
          const ddx = anchor.x - g.concavityX;
          const ddy = anchor.y - g.concavityY;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dist < g.concavityR * 2.5) {
            const tt = 1 - dist / (g.concavityR * 2.5);
            dz -= g.concavityD * tt * tt;
          }
        }
        if (g.convexityR > 2) {
          const ddx = anchor.x - g.convexityX;
          const ddy = anchor.y - g.convexityY;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dist < g.convexityR * 2.5) {
            const tt = 1 - dist / (g.convexityR * 2.5);
            dz += g.convexityH * tt * tt;
          }
        }

        // Project with warp (matches drawGrid warpPoint)
        const relY = anchor.y - cy;
        const y3d = relY * cosT - dz * sinT;
        const z3d = relY * sinT + dz * cosT;
        const scale = focalLen / (focalLen + z3d);
        p.x = this.w * 0.5 + (anchor.x - this.w * 0.5) * scale;
        p.y = cy + y3d * scale;
        p.z = scale;

        // Smooth jitter — sine-wave oscillation per particle (unique frequency from id)
        const freq1 = 1.5 + (p.id % 7) * 0.3;
        const freq2 = 1.8 + (p.id % 5) * 0.4;
        const phase1 = p.id * 1.37;
        const phase2 = p.id * 2.51;
        p.x += Math.sin(t * freq1 + phase1) * 4;
        p.y += Math.sin(t * freq2 + phase2) * 3;
      }
    }

    // --- RELEASE: rotation is done, seed grid-plane positions for post-rotation physics ---
    if (pastRotation && this.gridRotFrozen && !this.gridRotDone) {
      this.gridRotFrozen = false;
      this.gridRotDone = true;

      // Initialize grid-plane positions from frozen anchors AND set p.x/p.y to flat coords
      // Constrained/semi-constrained don't need grid-plane tracking — they use their own projection
      for (const p of this.particles) {
        if (!p.alive) continue;
        // Constrained, semi-constrained, AI-generated: skip — they use their own projection/orbit
        if (p.type === 'constrained' || p.type === 'semi-constrained' || p.type === 'ai-generated') continue;
        const anchor = this.gridRotAnchors.get(p.id);
        if (anchor) {
          this.gridPlanePositions.set(p.id, { x: anchor.x, y: anchor.y });
          // Critical: set p.x/p.y to flat grid-plane coords so physics doesn't
          // operate on the screen-projected values from the freeze phase
          p.x = anchor.x;
          p.y = anchor.y;
        } else {
          this.gridPlanePositions.set(p.id, { x: p.x, y: p.y });
        }
        // Give particles a small random velocity to resume natural movement
        if (p.type !== 'ai-generated') {
          p.vx = (Math.random() - 0.5) * 20;
          p.vy = (Math.random() - 0.5) * 20;
        }
      }
      this.gridRotAnchors.clear();
    }
  }

  /**
   * RESTORE: Before physics runs, restore particles from projected screen coords
   * back to flat grid-plane coords so forces operate in the correct space.
   */
  private restoreGridPlanePositions(): void {
    for (const p of this.particles) {
      if (!p.alive || p.type === 'constrained' || p.type === 'semi-constrained' || p.type === 'ai-generated') continue;
      const gp = this.gridPlanePositions.get(p.id);
      if (gp) {
        p.x = gp.x;
        p.y = gp.y;
      }
    }
  }

  /**
   * PROJECT: After all physics has run, project particles from flat grid-plane
   * coords to screen coords through the tilted perspective, INCLUDING the
   * concavity/convexity surface warp so particles sit ON the grid surface.
   * Uses the same warp math as drawGrid's warpPoint.
   */
  private projectGridPlaneToScreen(): void {
    const g = this.grid;
    if (g.rotationX < 0.01) return;

    const tilt = -g.rotationX;
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);
    const focalLen = this.h * 1.5;
    const cy = this.h * 0.5;

    for (const p of this.particles) {
      if (!p.alive || p.type === 'constrained' || p.type === 'semi-constrained' || p.type === 'ai-generated') continue;

      // Ensure we have a grid-plane entry
      let gp = this.gridPlanePositions.get(p.id);
      if (!gp) {
        // New particle spawned post-rotation — seed from current position
        gp = { x: p.x, y: p.y };
        this.gridPlanePositions.set(p.id, gp);
      }

      // Save flat-space position (physics has updated p.x/p.y in flat space)
      gp.x = p.x;
      gp.y = p.y;

      // Compute concavity/convexity surface displacement (same as drawGrid warpPoint)
      let dz = 0;
      if (g.concavityR > 2) {
        const dx = gp.x - g.concavityX;
        const dy = gp.y - g.concavityY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < g.concavityR * 2.5) {
          const t = 1 - dist / (g.concavityR * 2.5);
          dz -= g.concavityD * t * t; // depression into screen
        }
      }
      if (g.convexityR > 2) {
        const dx = gp.x - g.convexityX;
        const dy = gp.y - g.convexityY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < g.convexityR * 2.5) {
          const t = 1 - dist / (g.convexityR * 2.5);
          dz += g.convexityH * t * t; // bump toward viewer
        }
      }

      // 3D rotation + perspective (matches drawGrid warpPoint exactly)
      const relY = gp.y - cy;
      const y3d = relY * cosT - dz * sinT;
      const z3d = relY * sinT + dz * cosT;
      const scale = focalLen / (focalLen + z3d);
      p.x = this.w * 0.5 + (gp.x - this.w * 0.5) * scale;
      p.y = cy + y3d * scale;
      p.z = scale;
    }
  }

  /**
   * Project AI entity positions through the tilted grid perspective.
   * Makes them appear to traverse the grid surface rather than float above it.
   * Uses the same math as projectGridPlaneToScreen but also scales their radius.
   */
  private projectAIEntitiesToScreen(): void {
    const g = this.grid;
    if (g.rotationX < 0.01) {
      for (const ai of this.aiEntities) {
        ai.screenX = ai.x;
        ai.screenY = ai.y;
        ai.screenRadius = ai.radius;
        ai.screenGravRadius = ai.gravityRadius;
      }
      return;
    }

    const tilt = -g.rotationX;
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);
    const focalLen = this.h * 1.5;
    const cy = this.h * 0.5;

    for (const ai of this.aiEntities) {
      if (!ai.active) continue;

      // Compute surface displacement at AI position (concavity/convexity)
      let dz = 0;
      if (g.concavityR > 2) {
        const dx = ai.x - g.concavityX;
        const dy = ai.y - g.concavityY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < g.concavityR * 2.5) {
          const t = 1 - dist / (g.concavityR * 2.5);
          dz -= g.concavityD * t * t;
        }
      }
      if (g.convexityR > 2) {
        const dx = ai.x - g.convexityX;
        const dy = ai.y - g.convexityY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < g.convexityR * 2.5) {
          const t = 1 - dist / (g.convexityR * 2.5);
          dz += g.convexityH * t * t;
        }
      }

      // 3D rotation + perspective — write to screen coords, not physics coords
      const relY = ai.y - cy;
      const y3d = relY * cosT - dz * sinT;
      const z3d = relY * sinT + dz * cosT;
      const scale = focalLen / (focalLen + z3d);

      ai.screenX = this.w * 0.5 + (ai.x - this.w * 0.5) * scale;
      ai.screenY = cy + y3d * scale;
      ai.screenRadius = ai.radius * scale;
      ai.screenGravRadius = ai.gravityRadius * scale;
    }
  }

  private detectCollisions(dt: number): void {
    const particles = this.particles.filter(p => p.alive && p.type !== 'constrained');
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = a.size + b.size + 2;

        if (dist < minDist && dist > 0) {
          // Elastic collision + color flash
          const nx = dx / dist;
          const ny = dy / dist;
          const dvx = a.vx - b.vx;
          const dvy = a.vy - b.vy;
          const dvn = dvx * nx + dvy * ny;

          if (dvn > 0) {
            a.vx -= dvn * nx;
            a.vy -= dvn * ny;
            b.vx += dvn * nx;
            b.vy += dvn * ny;

            // Flash labels on collision
            a.labelTimer = 1.8;
            b.labelTimer = 1.8;

            // May form a brief bond
            if (Math.random() < 0.3) {
              this.tryFormBond(a.id, b.id, false);
            }
          }

          // Separate
          const overlap = minDist - dist;
          a.x -= nx * overlap * 0.5;
          a.y -= ny * overlap * 0.5;
          b.x += nx * overlap * 0.5;
          b.y += ny * overlap * 0.5;
        }
      }
    }
  }

  private applyMouseTurbulence(dt: number): void {
    if (this.mouseX < 0) return;
    const radius = 150;
    for (const p of this.particles) {
      if (!p.alive || p.type === 'constrained') continue;
      const dx = p.x - this.mouseX;
      const dy = p.y - this.mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < radius && dist > 5) {
        // Flow field: push particles in circular motion around cursor
        // This creates turbulence that forces collisions
        const t = 1 - dist / radius;
        const force = t * t * 80;
        // Tangential force (perpendicular to radius) + slight inward pull
        const nx = dx / dist;
        const ny = dy / dist;
        p.vx += (-ny * force * 0.8 - nx * force * 0.2) * dt;
        p.vy += (nx * force * 0.8 - ny * force * 0.2) * dt;
      }
    }
  }

  private applyConstrainedGravity(dt: number): void {
    const constrained = this.particles.filter(p => p.type === 'constrained' && p.alive);
    const repelRadius = 45; // particles closer than this get pushed away
    const sp = this.scrollProgress;

    for (const cp of constrained) {
      if (cp.type !== 'constrained') continue;
      for (const p of this.particles) {
        if (!p.alive || p.type === 'constrained') continue;
        // Skip AI-generated and trapped in Scenes I–III; allow in IV+ (gentle attraction)
        if (sp < 3 && (p.type === 'ai-generated' || p.trapped)) continue;
        const dx = cp.x - p.x;
        const dy = cp.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < repelRadius && dist > 1) {
          // Repulsion zone: push particles away from constrained center
          const repelForce = (1 - dist / repelRadius) * 60;
          p.vx -= (dx / dist) * repelForce * dt;
          p.vy -= (dy / dist) * repelForce * dt;
        } else if (dist < cp.gravityRadius && dist >= repelRadius) {
          // Attraction zone: pull toward constrained particle (but not too close)
          // Weaker pull for AI-generated particles (they have their own orbit mechanics)
          const gMul = p.type === 'ai-generated' ? 0.25 : 0.5;
          const force = cp.gravityStrength * (1 - dist / cp.gravityRadius) * gMul;
          p.vx += (dx / dist) * force * dt;
          p.vy += (dy / dist) * force * dt;

          // Scene IV+: form bonds between unconstrained/AI particles near constraints
          if (sp >= 3 && dist < cp.gravityRadius * 0.7 && Math.random() < dt * 0.5) {
            this.tryFormBond(p.id, cp.id, false);
          }
        }
      }
    }
  }

  /**
   * Soft inter-particle repulsion: prevents unconstrained particles from clumping.
   * Particles that get too close push each other apart gently.
   */
  private applyParticleRepulsion(dt: number): void {
    const repelDist = 40; // start repelling within this distance
    const repelStrength = 80;
    const particles = this.particles;
    const len = particles.length;

    for (let i = 0; i < len; i++) {
      const a = particles[i];
      if (!a.alive || a.type === 'constrained' || a.type === 'semi-constrained' || a.type === 'ai-generated') continue;
      for (let j = i + 1; j < len; j++) {
        const b = particles[j];
        if (!b.alive || b.type === 'constrained' || b.type === 'semi-constrained' || b.type === 'ai-generated') continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < repelDist * repelDist && distSq > 1) {
          const dist = Math.sqrt(distSq);
          const t = 1 - dist / repelDist;
          const force = t * repelStrength * dt;
          const nx = dx / dist;
          const ny = dy / dist;
          a.vx -= nx * force;
          a.vy -= ny * force;
          b.vx += nx * force;
          b.vy += ny * force;
        }
      }
    }
  }

  private constrainedSpawned = 0;
  // Pre-defined positions as fractions of (w, h) — spread across full visible canvas
  // Avoids right 25% (text column). 9 positions for Section II + IV, extras for VIII.
  private static readonly CONSTRAINED_POSITIONS = [
    // Section II — 5 particles spread across full grid
    { x: 0.06, y: 0.12 },   // top-left
    { x: 0.55, y: 0.08 },   // top-right
    { x: 0.35, y: 0.45 },   // center
    { x: 0.08, y: 0.78 },   // bottom-left
    { x: 0.62, y: 0.82 },   // bottom-right
    // Section IV — 4 more particles filling gaps
    { x: 0.28, y: 0.18 },   // upper-center-left
    { x: 0.68, y: 0.38 },   // right-center
    { x: 0.18, y: 0.52 },   // left-center
    { x: 0.50, y: 0.68 },   // lower-center
  ];

  private spawnConstrainedIfNeeded(sp: number): void {
    // Section II: 5 constrained particles
    const target2 = sp >= 1 ? 5 : 0;
    // Section IV: more constrained particles
    const target4 = sp >= 3 ? 9 : target2;
    const target = Math.max(target2, target4);
    const gridStep = 50;

    const activeLabels = this.getActiveLabels();
    while (this.constrainedSpawned < target) {
      const idx = this.constrainedSpawned;
      const pos = ParticleSimulation.CONSTRAINED_POSITIONS[idx];
      if (!pos) break;
      // Scale to canvas size and snap to grid
      const x = Math.round((pos.x * this.w) / gridStep) * gridStep;
      const y = Math.round((pos.y * this.h) / gridStep) * gridStep;
      this.particles.push(this.createConstrained(x, y, activeLabels));
      this.constrainedSpawned++;
    }
  }

  // ── Grid ───────────────────────────────────────────────

  private updateGrid(dt: number, sp: number): void {
    const sectionProgress = sp - 2; // 0-1 within section III, >1 for later sections

    // Mobile: scale down concavity/convexity features to fit shorter canvas
    const topoScale = this.isMobile ? 0.55 : 1;
    const cR = 160 * topoScale;
    const cD = 150 * topoScale;
    const vR = (this.isMobile ? 120 : 140) * topoScale;  // smaller convexity on mobile
    const vH = (this.isMobile ? 100 : 120) * topoScale;  // less height on mobile

    if (sp >= 2 && sp < 3) {
      // Section III: grid fades in, rotates in 3D, concavity/convexity emerge
      // Amber blend: 0→1 over first 30%
      this.grid.amberBlend = Math.min(1, sectionProgress / 0.3);
      this.grid.alpha = this.grid.amberBlend * 0.8;

      // Rotation: 0→PI/3 (60 degrees toward user) over 30-70%
      const rotProgress = Math.max(0, Math.min(1, (sectionProgress - 0.3) / 0.4));
      this.grid.rotationX = rotProgress * (Math.PI / 3);

      // Concavity/convexity: emerge at 50-100% (slightly earlier, more time to develop)
      const topoProgress = Math.max(0, Math.min(1, (sectionProgress - 0.5) / 0.5));
      this.grid.concavityR = topoProgress * cR;
      this.grid.concavityD = topoProgress * cD;
      this.grid.convexityR = topoProgress * vR;
      this.grid.convexityH = topoProgress * vH;

      // Position: both visible adjacent to text box (text is right-aligned)
      // Concavity upper-left of center, convexity lower — both in visible canvas area
      // Mobile: push convexity further back (more Y separation) and more to the right
      this.grid.concavityX = this.w * (this.isMobile ? 0.2 : 0.25);
      this.grid.concavityY = this.h * (this.isMobile ? 0.25 : 0.35);
      this.grid.convexityX = this.w * (this.isMobile ? 0.65 : 0.5);
      this.grid.convexityY = this.h * (this.isMobile ? 0.88 : 0.78);
    } else if (sp >= 3 && sp < 6) {
      // Sections IV-VI: grid persists at full visibility
      this.grid.alpha = 0.8;
      this.grid.amberBlend = 1;
      this.grid.rotationX = Math.PI / 3;
      // Maintain concavity/convexity
      this.grid.concavityR = cR;
      this.grid.concavityD = cD;
      this.grid.convexityR = vR;
      this.grid.convexityH = vH;
      this.grid.concavityX = this.w * (this.isMobile ? 0.2 : 0.25);
      this.grid.concavityY = this.h * (this.isMobile ? 0.25 : 0.35);
      this.grid.convexityX = this.w * (this.isMobile ? 0.65 : 0.5);
      this.grid.convexityY = this.h * (this.isMobile ? 0.88 : 0.78);
    } else if (sp >= 6 && sp < 7) {
      // Section VII: settle (0-30%), then rotate to edge-on + fade (30-100%)
      const s7 = sp - 6;
      const settleEnd = 0.3;

      if (s7 < settleEnd) {
        // Settle phase: grid stays at current rotation, begin fading concavity/convexity
        this.grid.rotationX = Math.PI / 3;
        this.grid.alpha = 0.8;
        const settleFade = 1 - (s7 / settleEnd); // 1→0 during settle
        this.grid.concavityR = cR * settleFade;
        this.grid.concavityD = cD * settleFade;
        this.grid.convexityR = vR * settleFade;
        this.grid.convexityH = vH * settleFade;
      } else {
        // Rotate phase: grid rotates PI/3 → PI/2, alpha fades to 0
        const rotP = (s7 - settleEnd) / (1 - settleEnd); // 0→1
        this.grid.rotationX = Math.PI / 3 + rotP * (Math.PI / 2 - Math.PI / 3);
        this.grid.alpha = 0.8 * (1 - rotP);
        // Concavity/convexity already gone
        this.grid.concavityR = 0;
        this.grid.concavityD = 0;
        this.grid.convexityR = 0;
        this.grid.convexityH = 0;
      }
    }
  }

  private applyConcavityConvexity(dt: number, sectionProgress: number, sp: number): void {
    if (sp < 2.6 || this.grid.concavityR < 5) return;

    for (const p of this.particles) {
      if (!p.alive || p.type === 'constrained' || p.type === 'semi-constrained' || p.type === 'ai-generated' || p.trapped) continue;

      // ── Concavity: gentle repulsion + mild orbital nudge ──
      // Particles near the depression get a soft push outward with a slight tangential
      // nudge so they drift around it rather than flying straight out or getting trapped.
      const dxC = p.x - this.grid.concavityX;
      const dyC = p.y - this.grid.concavityY;
      const distC = Math.sqrt(dxC * dxC + dyC * dyC);
      if (distC < this.grid.concavityR * 2 && distC > 5) {
        const t = 1 - distC / (this.grid.concavityR * 2);
        // Very gentle forces — just enough to deflect, not trap
        const radialForce = this.grid.concavityD * t * 0.04;
        const tangentialForce = this.grid.concavityD * t * 0.06;
        const nx = dxC / distC;
        const ny = dyC / distC;
        // Radial: push outward
        p.vx += nx * radialForce * dt;
        p.vy += ny * radialForce * dt;
        // Tangential: perpendicular to radial (clockwise orbit)
        p.vx += (-ny) * tangentialForce * dt;
        p.vy += (nx) * tangentialForce * dt;

        // Particles near concavity form bonds
        if (Math.random() < 0.01 * dt * 60) {
          const nearby = this.findNearbyParticle(p, 100);
          if (nearby) {
            this.tryFormBond(p.id, nearby.id, false);
          }
        }
      }

      // ── Convexity: GRAVITY + orbital capture ──
      // Particles approaching the convexity get pulled inward with a tangential component,
      // causing them to orbit around the convexity rather than just falling straight in.
      const dxV = this.grid.convexityX - p.x;
      const dyV = this.grid.convexityY - p.y;
      const distV = Math.sqrt(dxV * dxV + dyV * dyV);
      if (distV < this.grid.convexityR * 2.5 && distV > 5) {
        const t = 1 - distV / (this.grid.convexityR * 2.5);
        const radialForce = this.grid.convexityH * t * 0.08;
        // Tangential force — perpendicular, counter-clockwise orbit (stronger than radial)
        const tangentialForce = this.grid.convexityH * t * 0.30;
        const nx = dxV / distV;
        const ny = dyV / distV;
        // Radial: pull inward
        p.vx += nx * radialForce * dt;
        p.vy += ny * radialForce * dt;
        // Tangential: perpendicular to radial (counter-clockwise orbit)
        p.vx += (ny) * tangentialForce * dt;
        p.vy += (-nx) * tangentialForce * dt;
      }
    }
  }

  // ── Semi-constrained particles (extrinsic constraint) ──

  private createSemiConstrained(anchorX: number, anchorY: number, baseSize = 14): SemiConstrainedParticle {
    // Enter from the nearest canvas edge for a natural arrival
    const distTop = anchorY;
    const distBottom = this.h - anchorY;
    const distLeft = anchorX;
    const distRight = this.w - anchorX;
    const minDist = Math.min(distTop, distBottom, distLeft, distRight);
    let startX = anchorX;
    let startY = -60;
    if (minDist === distTop)         { startX = anchorX; startY = -60; }
    else if (minDist === distLeft)   { startX = -60; startY = anchorY; }
    else if (minDist === distBottom) { startX = anchorX; startY = this.h + 60; }
    else                             { startX = this.w + 60; startY = anchorY; }

    return {
      id: this.nextId++,
      type: 'semi-constrained',
      x: startX,
      y: startY,
      z: 1,             // perspective scale (updated in physics)
      vx: 0, vy: 0, vz: 0,
      size: baseSize,    // perspective-scaled per position (8 far, 10 mid, 14 near)
      alpha: 0,          // start invisible, fade in during float-in animation
      alive: true,
      label: '',
      labelAlpha: 0,
      labelTimer: 0,
      trailX: [], trailY: [],
      trapped: false,
      trappedByAI: -1,
      anchorX,
      anchorY,
      wanderRadius: (20 + Math.random() * 15) * (baseSize / 14),  // scale wander with size
      wanderAngle: Math.random() * Math.PI * 2,
      wanderSpeed: 0.3 + Math.random() * 0.4,
      haloPhase: Math.random() * Math.PI * 2,
      entryStartX: startX,
      entryStartY: startY,
      entryProgress: 0,
      settled: false,
    };
  }

  // Semi-constrained positions — placed to match visual layout
  // baseSize overrides the default 14 to fake stronger perspective depth cues
  private static readonly SEMI_CONSTRAINED_POSITIONS = [
    { x: 0.22, y: 0.0, baseSize: 5 },      // upper-left — far back on tilted grid, tiny
    { x: 0.85, y: 0.15, baseSize: 10 },   // upper-right — mid-distance
    { x: 0.15, y: 0.82, baseSize: 14 },   // lower-left — near, full size
  ];

  private spawnSemiConstrainedIfNeeded(sp: number): void {
    // Section IV: spawn 3 semi-constrained particles as extrinsic constraints
    const target = sp >= 3 ? 3 : 0;
    const gridStep = 50;
    while (this.semiConstrainedSpawned < target) {
      const idx = this.semiConstrainedSpawned;
      const pos = ParticleSimulation.SEMI_CONSTRAINED_POSITIONS[idx];
      if (!pos) break;
      const anchorX = Math.round((pos.x * this.w) / gridStep) * gridStep;
      const anchorY = Math.round((pos.y * this.h) / gridStep) * gridStep;
      this.particles.push(this.createSemiConstrained(anchorX, anchorY, pos.baseSize));
      this.semiConstrainedSpawned++;
    }
  }

  // ── Semi-constrained gravitational corridor ───────────

  private applySemiConstrainedGravity(dt: number): void {
    // Collect settled semi-constrained particles
    const semiPs: SemiConstrainedParticle[] = [];
    for (const p of this.particles) {
      if (p.type === 'semi-constrained' && p.alive && p.settled) {
        semiPs.push(p);
      }
    }
    if (semiPs.length === 0) return;

    // Individual gravitational pull — each red constraint attracts nearby particles
    const semiGravRadius = 120;
    const semiGravStrength = 15;
    for (const sp of semiPs) {
      for (const p of this.particles) {
        if (!p.alive || p.type === 'constrained' || p.type === 'semi-constrained' || p.trapped) continue;
        const dx = sp.x - p.x;
        const dy = sp.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < semiGravRadius && dist > 20) {
          const t = 1 - dist / semiGravRadius;
          const force = semiGravStrength * t * 0.5;
          p.vx += (dx / dist) * force * dt;
          p.vy += (dy / dist) * force * dt;
        }
      }
    }

    if (semiPs.length < 2) return;

    // For each pair of semi-constrained particles, create a gravitational corridor
    // that pulls unconstrained/AI particles toward the midpoint between them
    for (let i = 0; i < semiPs.length; i++) {
      for (let j = i + 1; j < semiPs.length; j++) {
        const a = semiPs[i];
        const b = semiPs[j];

        // Corridor midpoint and axis
        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2;
        const corridorDx = b.x - a.x;
        const corridorDy = b.y - a.y;
        const corridorLen = Math.sqrt(corridorDx * corridorDx + corridorDy * corridorDy);
        if (corridorLen < 1) continue;

        // Corridor influence radius: proportional to the distance between the pair
        const influenceR = corridorLen * 0.8;

        for (const p of this.particles) {
          if (!p.alive || p.type === 'constrained' || p.type === 'semi-constrained') continue;

          const dx = midX - p.x;
          const dy = midY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < influenceR && dist > 5) {
            // Pull toward the corridor midpoint — stronger near the edges, gentler at center
            const t = 1 - dist / influenceR;
            const force = t * 35 * dt;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }
      }
    }
  }

  // ── AI Entities ────────────────────────────────────────

  private updateAIActivation(sp: number): void {
    for (const ai of this.aiEntities) {
      const activationPoint = ai.entrySection + ai.entryProgress;

      if (!ai.active && sp >= activationPoint) {
        ai.active = true;
        // Enter from random edge — start just outside viewport
        const edge = Math.floor(Math.random() * 4);
        if (edge === 0) { ai.x = -40; ai.y = this.h * (0.3 + Math.random() * 0.4); }
        else if (edge === 1) { ai.x = this.w + 40; ai.y = this.h * (0.3 + Math.random() * 0.4); }
        else if (edge === 2) { ai.x = this.w * (0.3 + Math.random() * 0.4); ai.y = -40; }
        else { ai.x = this.w * (0.3 + Math.random() * 0.4); ai.y = this.h + 40; }
        ai.screenX = ai.x;
        ai.screenY = ai.y;
        // Gentle initial velocity toward the center — drift, not rocket
        const targetX = this.w * (0.3 + Math.random() * 0.4);
        const targetY = this.h * (0.3 + Math.random() * 0.4);
        const dx = targetX - ai.x;
        const dy = targetY - ai.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const entrySpeed = 30; // gentle px/s
        ai.vx = (dx / dist) * entrySpeed;
        ai.vy = (dy / dist) * entrySpeed;
      } else if (ai.active && sp < activationPoint) {
        // Deactivate on scroll-back: fade out entity and kill its spawned particles
        ai.active = false;
        ai.alpha = 0;
        for (const p of this.particles) {
          if (p.alive && p.type === 'ai-generated' && p.parentAIId === ai.id) {
            p.alive = false;
            p.alpha = 0;
          }
        }
      }
    }
  }

  private updateAIEntities(dt: number, sp: number): void {
    for (const ai of this.aiEntities) {
      if (!ai.active) continue;

      // Fade in — higher alpha cap so AI spheres are clearly visible
      ai.alpha = Math.min(0.6, ai.alpha + dt * 0.4);

      // Soft center pull — only activates near edges to keep AI on-screen
      // Much weaker than before so AI can roam freely across the canvas
      const centerX = this.w * 0.5;
      const centerY = this.h * 0.5;
      const dcx = centerX - ai.x;
      const dcy = centerY - ai.y;
      const dcDist = Math.sqrt(dcx * dcx + dcy * dcy);
      const margin = Math.min(this.w, this.h) * 0.4; // wider margin = activates later
      // Only pull when very far from center (near edges)
      if (dcDist > margin) {
        const pullStrength = (dcDist - margin) * 0.008; // was 0.02
        ai.vx += (dcx / dcDist) * pullStrength * dt * 60;
        ai.vy += (dcy / dcDist) * pullStrength * dt * 60;
      }

      // Bond-seeking: find nearest bond and move toward midpoint (weakened)
      let bondPullX = 0, bondPullY = 0;
      let closestBondDist = Infinity;
      for (const bond of this.bonds) {
        const pA = this.getParticleById(bond.idA);
        const pB = this.getParticleById(bond.idB);
        if (!pA || !pB) continue;
        const midX = (pA.x + pB.x) / 2;
        const midY = (pA.y + pB.y) / 2;
        const dx = midX - ai.x;
        const dy = midY - ai.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < closestBondDist && dist < ai.gravityRadius * 2) {
          closestBondDist = dist;
          bondPullX = dx / dist;
          bondPullY = dy / dist;
        }
      }

      if (closestBondDist < Infinity) {
        ai.vx += bondPullX * 6 * dt; // was 15 — weaker so AI doesn't anchor to bonds
        ai.vy += bondPullY * 6 * dt;
      }

      // Repel from other AI entities — prevent overlap
      for (const other of this.aiEntities) {
        if (other.id === ai.id || !other.active) continue;
        const rdx = ai.x - other.x;
        const rdy = ai.y - other.y;
        const rDist = Math.sqrt(rdx * rdx + rdy * rdy);
        const minSep = (ai.radius + other.radius) * 4;
        if (rDist < minSep && rDist > 1) {
          const repelForce = (1 - rDist / minSep) * 60;
          ai.vx += (rdx / rDist) * repelForce * dt;
          ai.vy += (rdy / rDist) * repelForce * dt;
        }
      }

      // Coherent directional drift — same pattern as unconstrained particles
      // Each AI entity rotates its heading slowly, producing real traversal
      const aiDriftMag = 40;
      const aiDriftAngle = this.phase * (0.08 + (ai.id % 3) * 0.03) + ai.id * 1.57;
      ai.vx += Math.cos(aiDriftAngle) * aiDriftMag * dt;
      ai.vy += Math.sin(aiDriftAngle) * aiDriftMag * dt;

      // Damping — lower than before for sustained momentum
      ai.vx *= 0.985; // was 0.97
      ai.vy *= 0.985;

      // Speed cap
      const speed = Math.sqrt(ai.vx * ai.vx + ai.vy * ai.vy);
      if (speed > 80) { // was 50
        ai.vx = (ai.vx / speed) * 80;
        ai.vy = (ai.vy / speed) * 80;
      }

      ai.x += ai.vx * dt;
      ai.y += ai.vy * dt;

      // Soft boundary — push back from edges instead of hard bounce
      const edgeMargin = 60;
      const edgePush = 30;
      if (ai.x < edgeMargin) ai.vx += (edgeMargin - ai.x) * edgePush / edgeMargin * dt;
      if (ai.x > this.w - edgeMargin) ai.vx -= (ai.x - (this.w - edgeMargin)) * edgePush / edgeMargin * dt;
      if (ai.y < edgeMargin) ai.vy += (edgeMargin - ai.y) * edgePush / edgeMargin * dt;
      if (ai.y > this.h - edgeMargin) ai.vy -= (ai.y - (this.h - edgeMargin)) * edgePush / edgeMargin * dt;

      // Gravitational pull on particles
      for (const p of this.particles) {
        if (!p.alive || p.type === 'constrained' || p.type === 'semi-constrained') continue;
        const dx = ai.x - p.x;
        const dy = ai.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < ai.gravityRadius && dist > 5) {
          const force = ai.gravityStrength * (1 - dist / ai.gravityRadius) * 0.4;
          p.vx += (dx / dist) * force * dt;
          p.vy += (dy / dist) * force * dt;
        }

        // Trapping: particle enters AI gravity radius
        if (dist < ai.radius * 3 && !p.trapped) {
          p.trapped = true;
          p.trappedByAI = ai.id;
          ai.trappedIds.add(p.id);
          // Give trapped particle an orbit angle based on current position
          const angle = Math.atan2(dy, dx);
          p.vx = 0;
          p.vy = 0;
          // Reuse label field to store orbit angle (trapped particles don't show labels)
          if (p.type === 'unconstrained' || p.type === 'ai-generated') {
            (p as any)._trapAngle = angle;
            (p as any)._trapSpeed = 0.4 + Math.random() * 0.6;
          }
        }

        // Trapped particles orbit close to AI sphere
        if (p.trapped && p.trappedByAI === ai.id) {
          const orbitR = ai.radius * (1.8 + (p.id % 5) * 0.6); // 32–86px from center
          const trapAngle = ((p as any)._trapAngle || 0) as number;
          const trapSpeed = ((p as any)._trapSpeed || 0.5) as number;
          (p as any)._trapAngle = trapAngle + trapSpeed * dt;
          const tgtX = ai.x + Math.cos((p as any)._trapAngle) * orbitR;
          const tgtY = ai.y + Math.sin((p as any)._trapAngle) * orbitR;
          p.x += (tgtX - p.x) * 0.08;
          p.y += (tgtY - p.y) * 0.08;
          // Weaken bonds between trapped particles
          this.weakenTrappedBonds(p.id, dt);
        }
      }

      // Spawn purple particles
      ai.spawnTimer += dt;
      const aiParticleCount = this.particles.filter(
        p => p.type === 'ai-generated' && p.parentAIId === ai.id && p.alive
      ).length;
      if (ai.spawnTimer > 1 / ai.spawnRate && aiParticleCount < 20 && this.particles.length < this.maxParticles) {
        ai.spawnTimer = 0;
        this.particles.push(this.createAIGenerated(ai.id, ai.x, ai.y));
      }
    }
  }

  /**
   * Convert an AI-generated particle into a free unconstrained (white) particle.
   * Preserves position and gives an outward push. Assigns a semantic label.
   */
  private convertAIToUnconstrained(p: AIGeneratedParticle): void {
    const idx = this.particles.indexOf(p);
    if (idx < 0) return;

    // Collect all active labels (flashing + permanent) for dedup
    const visibleLabels = this.getActiveLabels();

    const newParticle: UnconstrainedParticle = {
      id: p.id, // keep same id so bonds survive
      type: 'unconstrained',
      x: p.x, y: p.y, z: 0,
      vx: p.vx * 1.5, vy: p.vy * 1.5, vz: 0, // outward momentum boost
      size: p.size,
      alpha: p.alpha,
      alive: true,
      label: this.semanticLabel(p.x, p.y, visibleLabels),
      labelAlpha: 0,
      labelTimer: 2.5, // immediately show label — the semantic association moment
      trailX: [], trailY: [],
      trapped: false,
      trappedByAI: -1,
    };

    this.particles[idx] = newParticle;
  }

  private weakenTrappedBonds(particleId: number, dt: number): void {
    for (const bond of this.bonds) {
      if (bond.idA === particleId || bond.idB === particleId) {
        // Once trapped by AI, ALL bonds weaken — including persistent ones
        bond.strength -= dt * 0.3;
        // Persistent bonds become non-persistent when trapped
        if (bond.persistent) {
          bond.persistent = false;
          bond.strength = Math.min(bond.strength, 0.4);
        }
      }
    }
  }

  // ── Bonds ──────────────────────────────────────────────

  private tryFormBond(idA: number, idB: number, persistent: boolean): void {
    // Check if bond already exists
    const exists = this.bonds.some(
      b => (b.idA === idA && b.idB === idB) || (b.idA === idB && b.idB === idA)
    );
    if (exists) return;

    // Per-particle bond limit: max 3 bonds per particle
    const maxPerParticle = 3;
    let countA = 0, countB = 0;
    for (const b of this.bonds) {
      if (b.idA === idA || b.idB === idA) countA++;
      if (b.idA === idB || b.idB === idB) countB++;
    }
    if (countA >= maxPerParticle || countB >= maxPerParticle) return;

    if (this.bonds.length >= this.maxBonds) {
      // Remove oldest non-persistent bond
      const idx = this.bonds.findIndex(b => !b.persistent);
      if (idx >= 0) this.bonds.splice(idx, 1);
      else return;
    }
    // If either particle is trapped by AI, bonds are weak
    const pA = this.getParticleById(idA);
    const pB = this.getParticleById(idB);
    const eitherTrapped = (pA?.trapped || pB?.trapped);
    const bothTrappedSameAI = pA?.trapped && pB?.trapped && pA.trappedByAI === pB.trappedByAI;

    // Don't form bonds between particles trapped by same AI
    if (bothTrappedSameAI) return;

    // Trapped particles only form weak bonds
    const strength = eitherTrapped ? Math.min(0.25, persistent ? 0.25 : 0.15)
      : persistent ? 1 : 0.6;
    this.bonds.push({ idA, idB, strength, persistent: eitherTrapped ? false : persistent, age: 0 });
  }

  private updateBonds(dt: number, sp: number): void {
    // Age bonds, remove dead ones
    for (let i = this.bonds.length - 1; i >= 0; i--) {
      const bond = this.bonds[i];
      bond.age += dt;

      // Section VII frozen phase: aggressively fade ALL bonds (including persistent)
      if (this.s7Frozen) {
        bond.strength -= dt * 1.2; // fade out over ~0.8s
        bond.persistent = false;
      } else {
        if (!bond.persistent) {
          bond.strength -= dt * 0.15;
        }

        // Section V+: gently reduce very distant bonds (>180px)
        if (sp >= 4) {
          const pA = this.getParticleById(bond.idA);
          const pB = this.getParticleById(bond.idB);
          if (pA && pB) {
            const dist = Math.sqrt((pA.x - pB.x) ** 2 + (pA.y - pB.y) ** 2);
            if (dist > 180 && !bond.persistent) {
              bond.strength -= dt * 0.08; // was 0.15 — slower decay for distant bonds
            }
          }
        }
      }

      // Remove dead bonds
      if (bond.strength <= 0) {
        this.bonds.splice(i, 1);
      }
    }

    // Section II+: try forming new bonds — but not during frozen phase
    // Higher formation rate in Sections IV–VI (AI interactions + fading paths)
    let bondFormRate: number;
    if (sp >= 3 && sp < 4) {
      bondFormRate = 0.18; // Scene IV: highest — AI content bonds need to form visibly
    } else if (sp >= 4 && sp < 6) {
      bondFormRate = 0.12; // Scenes V–VI: compensate for distant-bond decay
    } else {
      bondFormRate = 0.05; // Scenes I–III
    }
    if (sp >= 1 && !this.s7Frozen && Math.random() < bondFormRate) {
      // Include AI-generated particles as bond sources during Scene IV+
      const includeAI = sp >= 3;
      const particles = this.particles.filter(p =>
        p.alive && !p.trapped && p.type !== 'constrained' &&
        (includeAI || p.type !== 'ai-generated')
      );
      if (particles.length > 1) {
        const a = particles[Math.floor(Math.random() * particles.length)];
        // Target constrained particles more often — 50% in Scene IV, 35% otherwise
        const constrainedChance = (sp >= 3 && sp < 5) ? 0.50 : 0.35;
        if (Math.random() < constrainedChance) {
          const candidate = this.findDistantParticle(a, 40, 280, true);
          if (candidate) {
            this.tryFormBond(a.id, candidate.id, false);
          }
        } else {
          const candidate = this.findDistantParticle(a, 40, 280);
          if (candidate) {
            this.tryFormBond(a.id, candidate.id, false);
          }
        }
      }
    }

    // Scene IV bonus: extra bond attempts specifically between AI-generated and white particles
    if (sp >= 3 && sp < 5 && !this.s7Frozen && Math.random() < dt * 3) {
      const aiParticles = this.particles.filter(p => p.alive && p.type === 'ai-generated');
      const whiteParticles = this.particles.filter(p => p.alive && p.type === 'unconstrained' && !p.trapped);
      if (aiParticles.length > 0 && whiteParticles.length > 0) {
        const ai = aiParticles[Math.floor(Math.random() * aiParticles.length)];
        const nearby = this.findNearbyParticle(ai, 150);
        if (nearby && nearby.type === 'unconstrained') {
          this.tryFormBond(ai.id, nearby.id, false);
        }
      }
    }
  }

  // ── Section VII: Settle → Freeze → Rotate ──────────────

  private updateRisingFloor(dt: number, sp: number): void {
    const s7 = sp - 6; // 0→1

    // Sub-phase boundary: 0–0.3 = settle, 0.3–1.0 = rotate
    const settleEnd = 0.3;

    if (s7 < settleEnd) {
      // ── SETTLE PHASE: particles decelerate to a stop ──
      this.physicsStopped = false; // let normal physics run but damp heavily
      this.s7Frozen = false;

      // Heavy damping — all particles drift to a stop
      const dampFactor = 1 - (s7 / settleEnd); // 1→0 over settle phase
      for (const p of this.particles) {
        if (!p.alive || p.type === 'constrained' || p.type === 'semi-constrained') continue;
        // Rapidly damp velocity
        const damp = 0.85 + dampFactor * 0.1; // 0.95→0.85
        p.vx *= damp;
        p.vy *= damp;
        // Also reduce any ongoing forces by shrinking velocity cap
        const maxV = 20 * dampFactor;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > maxV && speed > 0.1) {
          p.vx = (p.vx / speed) * maxV;
          p.vy = (p.vy / speed) * maxV;
        }
      }

      // Damp AI entities too
      for (const ai of this.aiEntities) {
        if (!ai.active) continue;
        const damp = 0.85 + dampFactor * 0.1;
        ai.vx *= damp;
        ai.vy *= damp;
      }

    } else {
      // ── ROTATE PHASE: everything frozen, project through grid perspective ──
      this.physicsStopped = true;

      // Snapshot positions once at the freeze boundary
      // All positions must be stored as flat grid-plane coords so the frozen projection
      // (which projects flat→screen) produces correct results without double-projecting.
      if (!this.s7Frozen) {
        this.s7Frozen = true;
        this.frozenAnchors.clear();
        this.frozenAI.clear();

        // Reverse-projection helper: screen → flat grid-plane
        // Needed for particles not in the gridPlanePositions pipeline
        const g = this.grid;
        const revTilt = -g.rotationX;
        const revCosT = Math.cos(revTilt);
        const revSinT = Math.sin(revTilt);
        const revFocal = this.h * 1.5;
        const revCy = this.h * 0.5;

        for (const p of this.particles) {
          if (!p.alive) continue;
          if (p.type === 'constrained' || p.type === 'semi-constrained') continue;

          const gp = this.gridPlanePositions.get(p.id);
          if (gp) {
            // Particle in the flat-plane pipeline — use its tracked flat position
            this.frozenAnchors.set(p.id, { x: gp.x, y: gp.y });
          } else {
            // Particle NOT in flat-plane pipeline (e.g. AI-spawned) — reverse-project
            // screen coords back to flat grid space so frozen projection doesn't double-project
            if (g.rotationX > 0.01) {
              // Approximate reverse: given screen (sx, sy), recover flat (gx, gy)
              // From: sy = cy + (gy - cy) * cosT * focal / (focal + (gy - cy) * sinT)
              // Solve iteratively (2 Newton steps is enough for smooth result)
              let flatY = p.y; // start from screen Y as initial guess
              for (let iter = 0; iter < 3; iter++) {
                const relY = flatY - revCy;
                const y3d = relY * revCosT;
                const z3d = relY * revSinT;
                const scale = revFocal / (revFocal + z3d);
                const projY = revCy + y3d * scale;
                const projX = this.w * 0.5 + (flatY - this.w * 0.5) * scale; // just for derivative
                flatY += (p.y - projY) * 1.2; // overshoot slightly for faster convergence
              }
              // Recover flat X from screen X using the scale at the solved flatY
              const relY = flatY - revCy;
              const z3d = relY * revSinT;
              const scale = revFocal / (revFocal + z3d);
              const flatX = this.w * 0.5 + (p.x - this.w * 0.5) / scale;
              this.frozenAnchors.set(p.id, { x: flatX, y: flatY });
            } else {
              this.frozenAnchors.set(p.id, { x: p.x, y: p.y });
            }
          }
        }
        for (const ai of this.aiEntities) {
          if (!ai.active) continue;
          // AI entities are also in screen space — reverse-project
          if (g.rotationX > 0.01) {
            let flatY = ai.y;
            for (let iter = 0; iter < 3; iter++) {
              const relY = flatY - revCy;
              const y3d = relY * revCosT;
              const z3d = relY * revSinT;
              const scale = revFocal / (revFocal + z3d);
              const projY = revCy + y3d * scale;
              flatY += (ai.y - projY) * 1.2;
            }
            const relY = flatY - revCy;
            const z3d = relY * revSinT;
            const scale = revFocal / (revFocal + z3d);
            const flatX = this.w * 0.5 + (ai.x - this.w * 0.5) / scale;
            this.frozenAI.set(ai.id, { x: flatX, y: flatY });
          } else {
            this.frozenAI.set(ai.id, { x: ai.x, y: ai.y });
          }
        }

        // Clear grid-plane tracking — Section VII's own projection takes over
        this.gridPlanePositions.clear();
      }

      // Rotation progress within rotate phase: 0→1
      const rotP = (s7 - settleEnd) / (1 - settleEnd);

      // Project ALL frozen particles through grid's 3D perspective
      const g = this.grid;
      const tilt = -g.rotationX;
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);
      const focalLen = this.h * 1.5;
      const cy = this.h * 0.5;

      const t = this.phase; // elapsed time for smooth oscillation

      // ── Rising floor: a line that rises from the bottom, pushing particles up ──
      // Floor starts off-screen below and rises to ~40% from the top as rotation progresses
      const floorStart = this.h + 20;           // below canvas
      const floorEnd = this.h * 0.35;           // final resting position (upper third)
      const floorEase = rotP * rotP;             // accelerating rise
      this.floorY = floorStart + (floorEnd - floorStart) * floorEase;

      // Spawn screen-space floor dots that accumulate along the projected floor line
      // High spawn rate so the floor fills up visibly with purple particles
      const floorSpawnRate = 8 + rotP * 20; // 8→28 per second as floor rises
      if (rotP > 0.05 && Math.random() < dt * floorSpawnRate) {
        this.floorDots.push({
          x: Math.random() * this.w,
          size: 2 + Math.random() * 2,
          alpha: 0.3 + Math.random() * 0.3,
          phase: Math.random() * Math.PI * 2,
        });
      }

      for (const p of this.particles) {
        if (!p.alive) continue;
        // Constrained/semi-constrained handled by updateAnchoredParticlePerspective
        if (p.type === 'constrained' || p.type === 'semi-constrained') continue;

        const anchor = this.frozenAnchors.get(p.id);
        if (!anchor) continue;

        // Floor pushes frozen anchors upward — particles below the floor get lifted
        if (anchor.y > this.floorY) {
          anchor.y = this.floorY - Math.random() * 8;
        }

        // Project frozen position through grid perspective
        const relY = anchor.y - cy;
        const y3d = relY * cosT;
        const z3d = relY * sinT;
        const scale = focalLen / (focalLen + z3d);
        p.x = this.w * 0.5 + (anchor.x - this.w * 0.5) * scale;
        p.y = cy + y3d * scale;
        p.z = scale;

        // Increasing vertical bounce — all particles bounce, white higher than purple
        // Use irrational multipliers on p.id to spread frequencies continuously, avoiding coupling
        const idHash = p.id * 2654435761 >>> 0; // Knuth multiplicative hash for uniform spread
        const h0 = (idHash & 0xFF) / 255;         // 0–1
        const h1 = ((idHash >> 8) & 0xFF) / 255;
        const h2 = ((idHash >> 16) & 0xFF) / 255;
        const h3 = ((idHash >> 24) & 0xFF) / 255;
        const freq1 = 1.2 + h0 * 1.6;    // 1.2–2.8 (continuous, no clustering)
        const freq2 = 1.5 + h1 * 1.8;    // 1.5–3.3
        const freq3 = 0.5 + h2 * 0.8;    // 0.5–1.3
        const phase1 = h0 * Math.PI * 2;
        const phase2 = h1 * Math.PI * 2;
        const phase3 = h2 * Math.PI * 2;
        // Per-particle amplitude variation (±40%) from hash
        const ampVar = 0.6 + h3 * 0.8;

        if (p.type === 'unconstrained') {
          // White particles: bounce HIGH with extra per-particle variation
          const bounceAmp = (3 + rotP * 30) * ampVar;
          const horizJitter = (2 + rotP * 5) * ampVar;
          const freq4 = 0.3 + h3 * 0.6; // unique slow drift per particle
          p.x += Math.sin(t * freq1 + phase1) * horizJitter
               + Math.sin(t * freq3 + phase3) * horizJitter * 0.4
               + Math.sin(t * freq4 + phase2) * horizJitter * 0.25;
          p.y += Math.sin(t * freq2 * 1.5 + phase2) * bounceAmp
               + Math.sin(t * freq3 * 0.8 + phase1) * bounceAmp * 0.3
               + Math.cos(t * freq4 * 1.2 + phase3) * bounceAmp * 0.15;
          p.alpha = 0.7;
        } else {
          // AI-generated (purple): bounce LOWER, stay visible
          const bounceAmp = (2 + rotP * 14) * ampVar; // ~half the white bounce
          const horizJitter = (1.5 + rotP * 3) * ampVar;
          p.x += Math.sin(t * freq1 + phase1) * horizJitter
               + Math.sin(t * freq3 + phase3) * horizJitter * 0.3;
          p.y += Math.sin(t * freq2 * 1.3 + phase2) * bounceAmp
               + Math.sin(t * freq3 * 0.6 + phase1) * bounceAmp * 0.25;
          p.alpha = 0.6; // stay visible — no fade
        }
      }

      // Project AI entity spheres — fade out (the orbs themselves disappear, particles stay)
      for (const ai of this.aiEntities) {
        if (!ai.active) continue;
        const anchor = this.frozenAI.get(ai.id);
        if (!anchor) continue;

        const relY = anchor.y - cy;
        const y3d = relY * cosT;
        const z3d = relY * sinT;
        const scale = focalLen / (focalLen + z3d);
        ai.x = this.w * 0.5 + (anchor.x - this.w * 0.5) * scale;
        ai.y = cy + y3d * scale;
        ai.alpha = 0.6 * (1 - rotP); // orbs fade, but their spawned particles don't
      }
    }
  }

  // ── Section VIII: Bounce continuation → Section IX: Liberation/Zoom ──

  private updateZoom(dt: number, sp: number): void {
    const s8 = sp - 7; // 0–2 (spans Section VIII 0-1 and Section IX 1-2)

    // ── BOUNCE CONTINUATION: entire Section VIII (sp 7.0–8.0) ──
    // The noisy bouncing from Section VII persists through all of Section VIII.
    // Liberation/zoom doesn't begin until Section IX.
    const bounceEnd = 1.0; // bounce fills entire Section VIII

    if (s8 < bounceEnd) {
      // Keep frozen state active — Section VII bounce continues
      this.physicsStopped = true;
      // The s7Frozen flag stays true; frozenAnchors are still populated

      // If user scrolled back from liberation, clean up spawned particles and reset state
      if (this.liberationStarted) {
        this.liberationStarted = false;
        this.zoomFactor = 1;
        // Clear focus particle's label so it gets a fresh one on re-entry
        const prevFocus = this.particles.find(p => p.id === this.focusParticleId);
        if (prevFocus) {
          prevFocus.label = '';
          prevFocus.labelAlpha = 0;
          prevFocus.labelTimer = 0;
        }
        this.focusParticleId = -1;
        // Kill any particles that were spawned during liberation (no frozen anchor)
        for (const p of this.particles) {
          if (!p.alive) continue;
          if (p.type === 'constrained' || p.type === 'semi-constrained') continue;
          if (!this.frozenAnchors.has(p.id)) {
            p.alive = false;
            p.alpha = 0;
          }
        }
      }

      // Grid continues fading / gone
      this.grid.alpha = 0;

      // Floor stays at its final position from Section VII
      this.floorY = this.h * 0.35; // same as floorEnd from Section VII
      // Continue spawning screen-space floor dots at a steady rate
      if (Math.random() < dt * 8) {
        this.floorDots.push({
          x: Math.random() * this.w,
          size: 2 + Math.random() * 2,
          alpha: 0.25 + Math.random() * 0.2,
          phase: Math.random() * Math.PI * 2,
        });
      }

      const g = this.grid;
      const tilt = -g.rotationX;
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);
      const focalLen = this.h * 1.5;
      const cy = this.h * 0.5;
      const t = this.phase;

      // Bounce amplitude: continues growing from where Section VII left off
      // At s7=1.0 (s8=0), rotP was 1.0 → bounceAmp was 28px. Keep growing.
      const bounceProgress = s8 / bounceEnd; // 0→1 during continuation
      const baseAmp = 28; // where Section VII ended

      for (const p of this.particles) {
        if (!p.alive) continue;

        // Label timer decay (physics loop is skipped in Scene 8)
        if (p.labelTimer > 0) {
          p.labelTimer -= dt;
          p.labelAlpha = Math.max(0, p.labelTimer / 1.5);
        } else {
          p.labelAlpha = 0;
        }

        if (p.type === 'constrained' || p.type === 'semi-constrained') {
          // Already faded out by Section VII — keep invisible
          p.alpha = 0;
          continue;
        }

        const anchor = this.frozenAnchors.get(p.id);
        if (!anchor) continue;

        // Project frozen position through grid perspective
        const relY = anchor.y - cy;
        const y3d = relY * cosT;
        const z3d = relY * sinT;
        const scale = focalLen / (focalLen + z3d);
        p.x = this.w * 0.5 + (anchor.x - this.w * 0.5) * scale;
        p.y = cy + y3d * scale;
        p.z = scale;

        // Same Knuth hash as Section VII for continuous per-particle frequency spread
        const idHash = p.id * 2654435761 >>> 0;
        const h0 = (idHash & 0xFF) / 255;
        const h1 = ((idHash >> 8) & 0xFF) / 255;
        const h2 = ((idHash >> 16) & 0xFF) / 255;
        const h3 = ((idHash >> 24) & 0xFF) / 255;
        const freq1 = 1.2 + h0 * 1.6;
        const freq2 = 1.5 + h1 * 1.8;
        const freq3 = 0.5 + h2 * 0.8;
        const phase1 = h0 * Math.PI * 2;
        const phase2 = h1 * Math.PI * 2;
        const phase3 = h2 * Math.PI * 2;
        const ampVar = 0.6 + h3 * 0.8;

        if (p.type === 'unconstrained') {
          // White particles: continue high bouncing with fully decoupled motion
          const bounceAmp = (baseAmp + bounceProgress * 12) * ampVar; // 28→40px
          const horizJitter = (6 + bounceProgress * 3) * ampVar;
          const freq4 = 0.3 + h3 * 0.6;
          p.x += Math.sin(t * freq1 + phase1) * horizJitter
               + Math.sin(t * freq3 + phase3) * horizJitter * 0.4
               + Math.sin(t * freq4 + phase2) * horizJitter * 0.25;
          p.y += Math.sin(t * freq2 * 1.5 + phase2) * bounceAmp
               + Math.sin(t * freq3 * 0.8 + phase1) * bounceAmp * 0.3
               + Math.cos(t * freq4 * 1.2 + phase3) * bounceAmp * 0.15;
          p.alpha = 0.7;
        } else {
          // Purple particles: lower bounce, stay visible
          const purpleBaseAmp = 14; // where Section VII ended for purple
          const bounceAmp = (purpleBaseAmp + bounceProgress * 6) * ampVar;
          const horizJitter = (3 + bounceProgress * 2) * ampVar;
          p.x += Math.sin(t * freq1 + phase1) * horizJitter
               + Math.sin(t * freq3 + phase3) * horizJitter * 0.3;
          p.y += Math.sin(t * freq2 * 1.3 + phase2) * bounceAmp
               + Math.sin(t * freq3 * 0.6 + phase1) * bounceAmp * 0.25;
          p.alpha = 0.6; // stay visible
        }
      }

      // AI entity spheres: already faded, stay faded
      for (const ai of this.aiEntities) {
        ai.alpha = 0;
      }

      return; // Don't proceed to zoom/liberation during bounce phase
    }

    // ── LIBERATION: zoom phase begins at Section IX (sp >= 8) ──
    // Floor fades away gradually during early liberation
    const libProgress = (s8 - bounceEnd) / (2.0 - bounceEnd); // 0→1
    const floorFade = Math.max(0, 1 - libProgress * 4); // fades to 0 by libProgress 0.25
    if (floorFade > 0.01) {
      this.floorY = this.h * 0.35; // keep at same position as Section VIII
      // Fade out floor dot alphas
      for (const dot of this.floorDots) {
        dot.alpha *= floorFade;
      }
    } else {
      this.floorY = 0;
      this.floorDots.length = 0;
    }

    // One-time setup: pick focus particle, keep frozen state active for smooth transition
    if (!this.liberationStarted) {
      this.liberationStarted = true;
      // Pick the most isolated white particle as focus
      const whites = this.particles.filter(p => p.type === 'unconstrained' && p.alive);
      if (whites.length > 0) {
        // Choose one near center of canvas for best visual
        let best = whites[0];
        let bestScore = Infinity;
        const cx = this.w * 0.5, cy2 = this.h * 0.4;
        for (const w of whites) {
          const dx = w.x - cx, dy = w.y - cy2;
          const score = dx * dx + dy * dy;
          if (score < bestScore) { bestScore = score; best = w; }
        }
        this.focusParticleId = best.id;
        // Assign curated final label immediately
        const FINAL_WORDS = [
          'trust', 'limit', 'mindful', 'attention', 'examine', 'aware',
          'knowledge', 'mirror', 'collision', 'attend', 'detect', 'endeavor',
          'strive', 'collapse', 'aspire', 'reach', 'training', 'judge',
          'alternative', 'options', 'foothold', 'arise', 'awaken',
        ];
        best.label = FINAL_WORDS[Math.floor(Math.random() * FINAL_WORDS.length)];
        best.labelAlpha = 0; // will be ramped up in the per-frame loop
        best.labelTimer = 999;
      }
    }

    // Keep frozen state — we still project from frozenAnchors for smooth fading
    this.physicsStopped = true;
    this.grid.alpha = 0;

    const g = this.grid;
    const tilt = -g.rotationX;
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);
    const focalLen = this.h * 1.5;
    const cy = this.h * 0.5;
    const t = this.phase;

    // Focus particle position (track it for zoom center)
    let focusX = this.w * 0.5;
    let focusY = this.h * 0.5;

    // Phase breakdown within liberation (gradual):
    //   0.0–0.4: particles gently fade except focus, bounce slows, zoom begins slowly
    //   0.4–0.65: zoom deepens on lone focus particle, bounce fully fades ~0.67
    //   0.65–1.0: new constrained particles appear in distance, new bonds form ~0.78+

    for (const p of this.particles) {
      if (!p.alive) continue;

      // Label timer decay (physics loop is skipped in Scene 8, so do it here)
      // Focus particle's label is managed manually below — skip generic decay
      if (p.id !== this.focusParticleId) {
        if (p.labelTimer > 0) {
          p.labelTimer -= dt;
          p.labelAlpha = Math.max(0, p.labelTimer / 1.5);
        } else {
          p.labelAlpha = 0;
        }
      }

      if (p.type === 'constrained' || p.type === 'semi-constrained') {
        // Constrained/semi stay invisible during transition
        // New constrained particles spawned later in liberation start faded
        if (libProgress < 0.65) {
          p.alpha = 0;
        }
        continue;
      }

      const anchor = this.frozenAnchors.get(p.id);
      const isFocus = p.id === this.focusParticleId;

      if (anchor) {
        // Project frozen position through perspective (same as bounce)
        const relY = anchor.y - cy;
        const y3d = relY * cosT;
        const z3d = relY * sinT;
        const scale = focalLen / (focalLen + z3d);
        p.x = this.w * 0.5 + (anchor.x - this.w * 0.5) * scale;
        p.y = cy + y3d * scale;
        p.z = scale;

        // Bounce slows down as liberation progresses
        const bounceDamp = Math.max(0, 1 - libProgress * 1.5); // fades to 0 by libProgress 0.67
        const idHash = p.id * 2654435761 >>> 0;
        const h0 = (idHash & 0xFF) / 255;
        const h1 = ((idHash >> 8) & 0xFF) / 255;
        const h2 = ((idHash >> 16) & 0xFF) / 255;
        const h3 = ((idHash >> 24) & 0xFF) / 255;
        const freq1 = 1.2 + h0 * 1.6;
        const freq2 = 1.5 + h1 * 1.8;
        const freq3 = 0.5 + h2 * 0.8;
        const phase1 = h0 * Math.PI * 2;
        const phase2 = h1 * Math.PI * 2;
        const phase3 = h2 * Math.PI * 2;
        const ampVar = 0.6 + h3 * 0.8;

        if (p.type === 'unconstrained') {
          // Match Section VIII ending: bounceAmp=40*ampVar, horizJitter=9*ampVar
          const bounceAmp = 40 * ampVar * bounceDamp;
          const horizJitter = 9 * ampVar * bounceDamp;
          const freq4 = 0.3 + h3 * 0.6;
          p.x += Math.sin(t * freq1 + phase1) * horizJitter
               + Math.sin(t * freq3 + phase3) * horizJitter * 0.4
               + Math.sin(t * freq4 + phase2) * horizJitter * 0.25;
          p.y += Math.sin(t * freq2 * 1.5 + phase2) * bounceAmp
               + Math.sin(t * freq3 * 0.8 + phase1) * bounceAmp * 0.3
               + Math.cos(t * freq4 * 1.2 + phase3) * bounceAmp * 0.15;
        } else {
          // Purple/AI particles — match Section VIII ending: 20*ampVar, 5*ampVar
          const bounceAmp = 20 * ampVar * bounceDamp;
          const horizJitter = 5 * ampVar * bounceDamp;
          p.x += Math.sin(t * freq1 + phase1) * horizJitter
               + Math.sin(t * freq3 + phase3) * horizJitter * 0.3;
          p.y += Math.sin(t * freq2 * 1.3 + phase2) * bounceAmp
               + Math.sin(t * freq3 * 0.6 + phase1) * bounceAmp * 0.25;
        }
      }

      // Persistent jitter — only the focus particle keeps noticeable motion;
      // non-focus particles scale jitter with their alpha so they fade to stillness.
      if (isFocus) {
        const idHash = p.id * 2654435761 >>> 0;
        const h0 = (idHash & 0xFF) / 255;
        const h1 = ((idHash >> 8) & 0xFF) / 255;
        const h2 = ((idHash >> 16) & 0xFF) / 255;
        const h3 = ((idHash >> 24) & 0xFF) / 255;
        const freq1 = 1.2 + h0 * 1.6;
        const freq2 = 1.5 + h1 * 1.8;
        const freq3 = 0.5 + h2 * 0.8;
        const phase1 = h0 * Math.PI * 2;
        const phase2 = h1 * Math.PI * 2;
        const phase3 = h2 * Math.PI * 2;
        const ampVar = 0.6 + h3 * 0.8;

        const jitterAmp = 5 * ampVar;
        const jitterH = 2.5 * ampVar;
        p.x += Math.sin(t * freq1 * 0.8 + phase1) * jitterH
             + Math.sin(t * freq3 * 0.5 + phase3) * jitterH * 0.4;
        p.y += Math.sin(t * freq2 * 0.6 + phase2) * jitterAmp
             + Math.sin(t * freq3 * 0.4 + phase1) * jitterAmp * 0.3;
      }

      // Collect active labels ONCE before cycling, so no two particles get the same word
      const activeLabels = this.getActiveLabels();

      // Alpha: focus stays bright, pre-liberation particles fade out,
      // late-liberation spawns (no frozen anchor) gently fade in as "new world"
      if (isFocus) {
        // Ramp alpha from Section VIII level (0.7) to 0.8 over first 20% of liberation
        const focusAlpha = libProgress < 0.2 ? 0.7 + libProgress * 0.5 : 0.8;
        p.alpha = focusAlpha;
        focusX = p.x;
        focusY = p.y;
        // Label was assigned from FINAL_WORDS in the one-time setup above.
        // Fade the label out in the final 30% of liberation
        if (libProgress < 0.7) {
          p.labelAlpha = 0.85;
          p.labelTimer = 999; // keep alive
        } else {
          const fadeT = (libProgress - 0.7) / 0.3; // 0→1 over last 30%
          p.labelAlpha = 0.85 * (1 - fadeT * fadeT); // quadratic ease-out fade
          p.labelTimer = 999;
        }
      } else if (anchor) {
        // Pre-liberation particle (has frozen anchor): fade out gradually
        const fadeSpeed = 1.2;
        p.alpha = Math.max(0, p.alpha - dt * fadeSpeed);
      } else {
        // Late-liberation spawn (no frozen anchor): gently fade in, don't flash
        const targetAlpha = 0.45;
        if (p.alpha < targetAlpha) {
          p.alpha = Math.min(targetAlpha, p.alpha + dt * 0.8); // slow fade-in over ~0.5s
        }
      }
    }

    // AI entity spheres stay invisible
    for (const ai of this.aiEntities) {
      ai.alpha = 0;
    }

    // Zoom: ramp up centered on focus particle
    // Slow start → accelerate → plateau
    const zoomT = Math.min(1, libProgress * 1.2); // reaches max by ~83% through liberation
    const eased = zoomT * zoomT * (3 - 2 * zoomT); // smoothstep
    this.zoomFactor = 1 + eased * 2.5; // up to 3.5×
    this.zoomCenterX = focusX;
    this.zoomCenterY = focusY;

    // ── Late liberation: new elements appear in zoomed view ──

    const spawnLabels = this.getActiveLabels();

    // Unfreeze physics for new particles (spawned after liberation start)
    if (libProgress > 0.65) {
      // New constrained particles appear in distance
      if (this.constrainedSpawned < 14 && Math.random() < dt * 2) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.min(this.w, this.h) * (0.3 + Math.random() * 0.15);
        const x = focusX + Math.cos(angle) * dist;
        const y = focusY + Math.sin(angle) * dist;
        const cp = this.createConstrained(
          Math.max(0, Math.min(this.w, x)),
          Math.max(0, Math.min(this.h, y)),
          spawnLabels
        );
        cp.alpha = 0; // will fade in via normal constrained fade-in
        this.particles.push(cp);
        this.constrainedSpawned++;
      }
    }

    if (libProgress > 0.78 && Math.random() < dt * 2.5) {
      if (this.particles.length < this.maxParticles) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 80 + Math.random() * 150;
        const np = this.createUnconstrained(
          focusX + Math.cos(angle) * dist,
          focusY + Math.sin(angle) * dist,
          spawnLabels
        );
        np.alpha = 0;   // start invisible, fade in via late-liberation alpha logic
        np.labelTimer = 2.0;
        this.particles.push(np);

        // Try to form bonds with existing nearby white particles
        const nearby = this.findNearbyParticle(np, 120);
        if (nearby && nearby.type === 'unconstrained') {
          this.tryFormBond(np.id, nearby.id, false);
        }
      }
    }
  }

  // ── Boundaries ─────────────────────────────────────────

  private enforceBoundaries(): void {
    for (const p of this.particles) {
      if (!p.alive || p.type === 'constrained' || p.type === 'semi-constrained') continue;
      if (p.x < 0) { p.x = 0; p.vx *= -0.7; }
      if (p.x > this.w) { p.x = this.w; p.vx *= -0.7; }
      if (p.y < 0) { p.y = 0; p.vy *= -0.7; }
      if (p.y > this.h) { p.y = this.h; p.vy *= -0.7; }
    }
  }

  // ── Helpers ────────────────────────────────────────────

  /**
   * Pick a word from the semantic map based on particle position.
   * Words whose (x,y) in the semantic map are close to the particle's
   * normalized canvas position are more likely to be chosen.
   * Excludes words already visible on screen to prevent duplicate labels.
   * Picks from the 12 nearest non-excluded words with inverse-distance weighting.
   */
  private semanticLabel(px: number, py: number, exclude?: Set<string>): string {
    const nx = this.w > 0 ? px / this.w : 0.5;
    const ny = this.h > 0 ? py / this.h : 0.5;

    // Score all words by Euclidean distance in semantic space
    const scored: { word: string; dist: number }[] = [];
    for (const sw of SEMANTIC_WORDS) {
      if (exclude && exclude.has(sw.word)) continue; // skip visible duplicates
      const dx = sw.x - nx;
      const dy = sw.y - ny;
      scored.push({ word: sw.word, dist: dx * dx + dy * dy });
    }
    scored.sort((a, b) => a.dist - b.dist);

    // Pick from top 12 with inverse-distance weighting for variety
    const top = scored.slice(0, 12);
    if (top.length === 0) {
      // All words in use — fall back to any random word
      return SEMANTIC_WORDS[Math.floor(Math.random() * SEMANTIC_WORDS.length)].word;
    }
    const weights = top.map(s => 1 / (s.dist + 0.001));
    const totalW = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * totalW;
    for (let i = 0; i < top.length; i++) {
      r -= weights[i];
      if (r <= 0) return top[i].word;
    }
    return top[0].word;
  }

  private getParticleById(id: number): Particle | undefined {
    return this.particles.find(p => p.id === id);
  }

  private findNearbyParticle(p: Particle, maxDist: number): Particle | undefined {
    let closest: Particle | undefined;
    let closestDist = maxDist;
    for (const other of this.particles) {
      if (other.id === p.id || !other.alive || other.type === 'constrained') continue;
      const dx = other.x - p.x;
      const dy = other.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < closestDist) {
        closestDist = dist;
        closest = other;
      }
    }
    return closest;
  }

  // Find a particle at medium-to-far distance — bonds form between distant associations
  private findDistantParticle(p: Particle, minDist: number, maxDist: number, includeConstrained = false): Particle | undefined {
    const candidates: { particle: Particle; dist: number }[] = [];
    for (const other of this.particles) {
      if (other.id === p.id || !other.alive) continue;
      if (!includeConstrained && other.type === 'constrained') continue;
      // Skip if both particles are trapped by same AI — prevent dense AI-cluster bonds
      if (p.trapped && other.trapped && p.trappedByAI === other.trappedByAI) continue;
      const dx = other.x - p.x;
      const dy = other.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist >= minDist && dist <= maxDist) {
        candidates.push({ particle: other, dist });
      }
    }
    if (candidates.length === 0) return undefined;
    // Weight selection toward farther particles (distant associations)
    candidates.sort((a, b) => b.dist - a.dist);
    // Pick from top third (farthest candidates)
    const topN = Math.max(1, Math.floor(candidates.length / 3));
    return candidates[Math.floor(Math.random() * topN)].particle;
  }

  // ── Draw ───────────────────────────────────────────────

  private draw(): void {
    const ctx = this.ctx;
    const sp = this.scrollProgress;
    const section = Math.floor(sp) + 1;

    // Clear frame (no trails)
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, this.w, this.h);

    // Apply zoom transform for Section IX liberation
    const zoomActive = this.liberationStarted && this.zoomFactor > 1.01;
    if (zoomActive) {
      ctx.save();
      ctx.translate(this.w / 2, this.h / 2);
      ctx.scale(this.zoomFactor, this.zoomFactor);
      ctx.translate(-(this.zoomCenterX || this.w / 2), -(this.zoomCenterY || this.h / 2));
    }

    // Grid
    if (this.grid.alpha > 0.01) this.drawGrid();

    // Rising floor line (Section VII rotate phase)
    if (this.floorY > 0 && this.floorY < this.h + 10 && this.s7Frozen) {
      this.drawFloorLine();
    }

    // Bonds
    this.drawBonds();

    // AI entities
    this.drawAIEntities();

    // Particles
    this.drawParticles();

    // Restore zoom
    if (zoomActive) {
      ctx.restore();
    }

    // Labels — drawn OUTSIDE zoom transform so they stay at readable pixel size
    if (zoomActive) {
      this.drawLabels();
    }

    // State label (corner)
    this.drawStateLabel(section);
  }

  private drawGrid(): void {
    const ctx = this.ctx;
    const g = this.grid;
    const step = this.isMobile ? 30 : 50;
    const w = this.w;
    const h = this.h;

    ctx.save();

    const amberR = Math.round(210 * g.amberBlend);
    const amberG = Math.round(170 * g.amberBlend);
    const amberB = Math.round(50 * g.amberBlend);

    // Perspective projection parameters
    // rotationX: 0 = face-on, PI/2 = edge-on
    const tilt = -g.rotationX; // negative = looking down from above
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);
    const focalLength = h * 1.5; // perspective depth
    const cy = h * 0.5; // vanishing point Y

    // Warp function: takes flat grid (gx, gy) → screen (sx, sy)
    // 1. Apply concavity (depression) / convexity (bump) displacement
    // 2. Tilt the grid plane in 3D
    // 3. Perspective-project to screen
    const warpPoint = (gx: number, gy: number): [number, number] => {
      // Concavity = depression (negative Z), Convexity = bump (positive Z)
      let dz = 0;
      if (g.concavityR > 2) {
        const dx = gx - g.concavityX;
        const dy = gy - g.concavityY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < g.concavityR * 2.5) {
          const t = 1 - dist / (g.concavityR * 2.5);
          dz -= g.concavityD * t * t; // depression (negative Z = into screen)
        }
      }
      if (g.convexityR > 2) {
        const dx = gx - g.convexityX;
        const dy = gy - g.convexityY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < g.convexityR * 2.5) {
          const t = 1 - dist / (g.convexityR * 2.5);
          dz += g.convexityH * t * t; // bump (positive Z = toward viewer)
        }
      }

      // 3D rotation around horizontal axis through center
      const relY = gy - cy;
      const y3d = relY * cosT - dz * sinT;
      const z3d = relY * sinT + dz * cosT;

      // Perspective projection
      const scale = focalLength / (focalLength + z3d);
      const sx = w * 0.5 + (gx - w * 0.5) * scale;
      const sy = cy + y3d * scale;

      return [sx, sy];
    };

    // Draw grid lines with perspective + warping
    // Extend grid well beyond viewport so tilted perspective fills the screen
    const lineAlpha = g.alpha * 0.45;
    ctx.lineWidth = 0.6;
    const extendY = h * 2; // extend grid 2x viewport height in each direction
    const extendX = w * 0.5; // extend horizontally too for wide perspective

    // Horizontal lines
    const segmentsH = Math.ceil((w + extendX * 2) / 8);
    for (let gy = -extendY; gy <= h + extendY; gy += step) {
      ctx.beginPath();
      for (let i = 0; i <= segmentsH; i++) {
        const gx = -extendX + (i / segmentsH) * (w + extendX * 2);
        const [sx, sy] = warpPoint(gx, gy);
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = `rgba(${amberR}, ${amberG}, ${amberB}, ${lineAlpha})`;
      ctx.stroke();
    }

    // Vertical lines
    const segmentsV = Math.ceil((h + extendY * 2) / 8);
    for (let gx = -extendX; gx <= w + extendX; gx += step) {
      ctx.beginPath();
      for (let i = 0; i <= segmentsV; i++) {
        const gy = -extendY + (i / segmentsV) * (h + extendY * 2);
        const [sx, sy] = warpPoint(gx, gy);
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = `rgba(${amberR}, ${amberG}, ${amberB}, ${lineAlpha})`;
      ctx.stroke();
    }

    // Highlight rings around concavity (warped) — topographic contour lines
    // Mobile: tighter rings (less spread) to avoid intersecting with convexity
    const concavRingStart = this.isMobile ? 14 : 30;
    const concavRingStep = this.isMobile ? 22 : 45;
    const concavRingExtent = this.isMobile ? 1.3 : 2;  // how far rings extend relative to radius

    const convexRingStart = this.isMobile ? 16 : 30;
    const convexRingStep = this.isMobile ? 24 : 45;
    const convexRingExtent = this.isMobile ? 1.4 : 2;

    if (g.concavityR > 5) {
      const ringAlpha = g.alpha * 1.2;
      ctx.lineWidth = 1;
      for (let r = concavRingStart; r < g.concavityR * concavRingExtent; r += concavRingStep) {
        const a = ringAlpha * (1 - r / (g.concavityR * concavRingExtent));
        ctx.strokeStyle = `rgba(${amberR}, ${amberG}, ${amberB}, ${a})`;
        ctx.beginPath();
        for (let angle = 0; angle <= Math.PI * 2 + 0.1; angle += 0.12) {
          const gx = g.concavityX + Math.cos(angle) * r;
          const gy = g.concavityY + Math.sin(angle) * r;
          const [sx, sy] = warpPoint(gx, gy);
          if (angle === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      }
    }

    // Highlight rings around convexity (warped) — topographic contour lines
    if (g.convexityR > 5) {
      const ringAlpha = g.alpha * 0.9;
      ctx.lineWidth = 0.8;
      for (let r = convexRingStart; r < g.convexityR * convexRingExtent; r += convexRingStep) {
        const a = ringAlpha * (r / (g.convexityR * convexRingExtent));
        ctx.strokeStyle = `rgba(${amberR}, ${amberG}, ${amberB}, ${a})`;
        ctx.beginPath();
        for (let angle = 0; angle <= Math.PI * 2 + 0.1; angle += 0.12) {
          const gx = g.convexityX + Math.cos(angle) * r;
          const gy = g.convexityY + Math.sin(angle) * r;
          const [sx, sy] = warpPoint(gx, gy);
          if (angle === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  private drawBonds(): void {
    const ctx = this.ctx;
    const maxDist = 300;
    const fadeInDuration = 1.5; // seconds for bond to fade in

    for (const bond of this.bonds) {
      const pA = this.getParticleById(bond.idA);
      const pB = this.getParticleById(bond.idB);
      if (!pA || !pB || !pA.alive || !pB.alive) continue;

      const dx = pB.x - pA.x;
      const dy = pB.y - pA.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > maxDist) continue;

      // Fade in: bonds grow from 0 to full alpha over fadeInDuration
      const fadeIn = Math.min(1, bond.age / fadeInDuration);

      // Inverted color: distant = bright white, close = faded grey
      const t = Math.min(dist / maxDist, 1);
      const grey = Math.round(128 + t * 127);
      const alpha = bond.strength * (0.1 + t * 0.6) * fadeIn;

      ctx.strokeStyle = `rgba(${grey}, ${grey}, ${grey}, ${alpha})`;
      ctx.lineWidth = (0.5 + t * 1.5) * fadeIn;
      ctx.beginPath();
      ctx.moveTo(pA.x, pA.y);
      ctx.lineTo(pB.x, pB.y);
      ctx.stroke();
    }
  }

  /**
   * Draw the rising floor line — a faint purple horizontal line that rises
   * during Section VII, representing the compression of creative output space.
   */
  private drawFloorLine(): void {
    const ctx = this.ctx;
    // Project the floor Y through the grid perspective (same as particle projection)
    const g = this.grid;
    const tilt = -g.rotationX;
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);
    const focalLen = this.h * 1.5;
    const cy = this.h * 0.5;

    const relY = this.floorY - cy;
    const y3d = relY * cosT;
    const z3d = relY * sinT;
    const scale = focalLen / (focalLen + z3d);
    const screenFloorY = cy + y3d * scale;

    // How visible the floor is (fades in as it rises onto the canvas)
    const visibility = Math.min(1, Math.max(0, (this.h - this.floorY) / (this.h * 0.5)));

    // How far the floor has risen (0 = just started, 1 = at final position)
    // Used to scale bounce amplitude — particles jitter more as the floor compresses them
    const floorProgress = Math.max(0, Math.min(1,
      (this.h + 20 - this.floorY) / (this.h + 20 - this.h * 0.35)));
    // Bounce amplitude for floor dots: grows with floor progress, stays below white particle bounce
    // White particles bounce up to ~33px; floor dots max out at ~10px
    const dotBounceAmp = floorProgress * 10;
    const t = this.phase;

    ctx.save();

    // Floor dots: purple particles with vertical jitter along the floor line
    for (const dot of this.floorDots) {
      const dotAlpha = dot.alpha * visibility;
      if (dotAlpha < 0.01) continue;

      // Per-dot oscillation using its unique phase
      const freq1 = 1.4 + (dot.phase * 0.5);
      const freq2 = 0.9 + (dot.phase * 0.3);
      const bounce = Math.sin(t * freq1 + dot.phase) * dotBounceAmp
                   + Math.sin(t * freq2 + dot.phase * 2.3) * dotBounceAmp * 0.3;
      const dotY = screenFloorY + bounce;

      ctx.fillStyle = `${C.purple} ${dotAlpha})`;
      ctx.beginPath();
      ctx.arc(dot.x, dotY, dot.size, 0, Math.PI * 2);
      ctx.fill();

      // Small glow
      if (dotAlpha > 0.15) {
        ctx.fillStyle = `${C.purple} ${dotAlpha * 0.3})`;
        ctx.beginPath();
        ctx.arc(dot.x, dotY, dot.size + 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  private drawAIEntities(): void {
    const ctx = this.ctx;
    for (const ai of this.aiEntities) {
      if (!ai.active || ai.alpha < 0.01) continue;

      const sx = ai.screenX;
      const sy = ai.screenY;
      const r = ai.screenRadius;
      const gr = ai.screenGravRadius;

      // Gravitational field indicator
      ctx.save();
      const fieldGrad = ctx.createRadialGradient(
        sx, sy, r,
        sx, sy, gr
      );
      fieldGrad.addColorStop(0, `${C.purple} ${ai.alpha * 0.25})`);
      fieldGrad.addColorStop(1, `${C.purple} 0)`);
      ctx.fillStyle = fieldGrad;
      ctx.beginPath();
      ctx.arc(sx, sy, gr, 0, Math.PI * 2);
      ctx.fill();

      // Sphere body — brighter core for visibility
      const bodyGrad = ctx.createRadialGradient(
        sx - r * 0.3, sy - r * 0.3, 0,
        sx, sy, r
      );
      bodyGrad.addColorStop(0, `${C.purple} ${Math.min(1, ai.alpha * 2)})`);
      bodyGrad.addColorStop(0.7, `${C.purple} ${ai.alpha * 1.2})`);
      bodyGrad.addColorStop(1, `${C.purple} ${ai.alpha * 0.5})`);
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();

      // Pulsing ring
      const pulse = 0.7 + Math.sin(this.phase * 2 + ai.id) * 0.3;
      ctx.strokeStyle = `${C.purple} ${ai.alpha * pulse * 0.5})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(sx, sy, r * (1.3 + pulse * 0.3), 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    }
  }

  private drawParticles(): void {
    const ctx = this.ctx;
    const sp = this.scrollProgress;
    const gridVisible = this.grid.alpha > 0.05;

    for (const p of this.particles) {
      if (!p.alive || p.alpha < 0.01) continue;

      const isAI = p.type === 'ai-generated';
      const isConstrained = p.type === 'constrained';
      const isSemiConstrained = p.type === 'semi-constrained';

      // Perspective scale: constrained & semi-constrained store it in p.z, others use 1
      const pScale = (isConstrained || isSemiConstrained) ? Math.max(0.2, p.z) : 1;
      const drawSize = p.size * pScale;

      // Color: constrained = faint yellow, semi-constrained = pastel red, AI = purple→white transition, others = white
      let color: string;
      if (isConstrained) {
        color = C.yellow;
      } else if (isSemiConstrained) {
        color = C.red;
      } else if (isAI) {
        const bfp = p.breakFreeProgress;
        if (bfp < 0.2) {
          color = C.purple;
        } else {
          // Blend purple→white with flicker during transition
          const t = Math.min(1, (bfp - 0.2) / 0.6); // 0→1 over bfp 0.2→0.8
          // Flicker: random white flashes that increase in frequency
          const flickerChance = t * t * 0.4; // up to 40% chance of white flash per frame
          const flicker = Math.random() < flickerChance;
          if (flicker) {
            color = C.white;
          } else {
            // Interpolate RGB: purple(180,140,220) → white(255,255,255)
            const r = Math.round(180 + t * 75);
            const g = Math.round(140 + t * 115);
            const b = Math.round(220 + t * 35);
            color = `rgba(${r}, ${g}, ${b},`;
          }
        }
      } else {
        color = C.white;
      }
      const a = p.alpha * Math.min(1, pScale + 0.2); // fade distant particles slightly

      // Drop shadow when grid is visible — particles float above the grid plane
      if (gridVisible) {
        const shadowOff = (4 + drawSize) * pScale;
        const shadowAlpha = this.grid.alpha * a * 0.25;
        ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x + shadowOff * 0.5, p.y + shadowOff, drawSize + 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Particle body
      ctx.fillStyle = `${color} ${a})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
      ctx.fill();

      // Glow
      if (a > 0.3) {
        ctx.fillStyle = `${color} ${a * 0.15})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, drawSize + 4 * pScale, 0, Math.PI * 2);
        ctx.fill();
      }

      // Constrained particle: pulsing halo (scaled by perspective, yellow-tinted)
      if (isConstrained && p.type === 'constrained') {
        const haloAlpha = (0.15 + Math.sin(p.haloPhase) * 0.1) * Math.min(1, pScale);
        ctx.strokeStyle = `${C.yellow} ${haloAlpha})`;
        ctx.lineWidth = Math.max(0.5, 1 * pScale);
        ctx.beginPath();
        ctx.arc(p.x, p.y, drawSize + (8 + Math.sin(p.haloPhase) * 2) * pScale, 0, Math.PI * 2);
        ctx.stroke();

        // Second halo ring
        ctx.strokeStyle = `${C.yellow} ${haloAlpha * 0.4})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, drawSize + (15 + Math.sin(p.haloPhase * 0.7) * 3) * pScale, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Semi-constrained particle: pulsing halo (scaled by perspective, red-tinted)
      if (isSemiConstrained && p.type === 'semi-constrained') {
        const haloAlpha = (0.15 + Math.sin(p.haloPhase) * 0.1) * Math.min(1, pScale);
        ctx.strokeStyle = `${C.red} ${haloAlpha})`;
        ctx.lineWidth = Math.max(0.5, 1 * pScale);
        ctx.beginPath();
        ctx.arc(p.x, p.y, drawSize + (8 + Math.sin(p.haloPhase) * 2) * pScale, 0, Math.PI * 2);
        ctx.stroke();

        // Second halo ring
        ctx.strokeStyle = `${C.red} ${haloAlpha * 0.4})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, drawSize + (15 + Math.sin(p.haloPhase * 0.7) * 3) * pScale, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Label (flash for unconstrained, permanent for constrained)
      // Skip labels here when zoom is active — they're drawn separately in drawLabels()
      if (!this.liberationStarted && p.labelAlpha > 0.01 && p.label) {
        this.drawLabelAt(ctx, p, isConstrained, drawSize);
      }
    }
  }

  /** Draw a single label pill + text for a particle */
  private drawLabelAt(ctx: CanvasRenderingContext2D, p: Particle, isConstrained: boolean, drawSize: number): void {
    const labelSize = isConstrained ? 10 : 9;
    const labelOffset = isConstrained ? drawSize + 14 : p.size + 8;
    ctx.font = `${labelSize}px monospace`;
    ctx.textAlign = 'center';
    const lx = p.x;
    const ly = p.y - labelOffset;
    const tw = ctx.measureText(p.label).width;

    // Dark pill behind text
    ctx.fillStyle = `rgba(0, 0, 0, ${p.labelAlpha * 0.6})`;
    ctx.beginPath();
    ctx.roundRect(lx - tw / 2 - 4, ly - 8, tw + 8, 13, 3);
    ctx.fill();

    // Label text — constrained uses yellow tint, others white
    const labelColor = isConstrained ? C.yellow : C.white;
    ctx.fillStyle = `${labelColor} ${p.labelAlpha * 0.85})`;
    ctx.fillText(p.label, lx, ly);
  }

  /** Draw labels outside zoom transform — positions are manually projected to screen space */
  private drawLabels(): void {
    const ctx = this.ctx;
    const z = this.zoomFactor;
    const cx = this.zoomCenterX || this.w / 2;
    const cy = this.zoomCenterY || this.h / 2;

    for (const p of this.particles) {
      if (!p.alive || p.alpha < 0.01 || p.labelAlpha < 0.01 || !p.label) continue;

      const isConstrained = p.type === 'constrained';
      const isSemiConstrained = p.type === 'semi-constrained';
      const pScale = (isConstrained || isSemiConstrained) ? Math.max(0.2, p.z) : 1;
      const drawSize = p.size * pScale;

      // Convert world-space particle position to screen-space (mimics the canvas zoom transform)
      const screenX = (p.x - cx) * z + this.w / 2;
      const screenY = (p.y - cy) * z + this.h / 2;

      // Skip labels that are off-screen
      if (screenX < -50 || screenX > this.w + 50 || screenY < -30 || screenY > this.h + 30) continue;

      const labelSize = isConstrained ? 10 : 9;
      const labelOffset = (isConstrained ? drawSize + 14 : p.size + 8) * z; // offset scales with zoom so it stays above particle
      ctx.font = `${labelSize}px monospace`;
      ctx.textAlign = 'center';
      const lx = screenX;
      const ly = screenY - labelOffset;
      const tw = ctx.measureText(p.label).width;

      // Dark pill behind text
      ctx.fillStyle = `rgba(0, 0, 0, ${p.labelAlpha * 0.6})`;
      ctx.beginPath();
      ctx.roundRect(lx - tw / 2 - 4, ly - 8, tw + 8, 13, 3);
      ctx.fill();

      // Label text — constrained uses yellow tint, others white
      const labelColor = isConstrained ? C.yellow : C.white;
      ctx.fillStyle = `${labelColor} ${p.labelAlpha * 0.85})`;
      ctx.fillText(p.label, lx, ly);
    }
  }

  private drawStateLabel(section: number): void {
    if (section < 1 || section > 9) return;
    const ctx = this.ctx;
    const name = STATE_NAMES[section] || '';

    ctx.save();
    ctx.font = '10px monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.textAlign = 'left';
    ctx.fillText(name, 16, 24);

    ctx.textAlign = 'right';
    ctx.fillText(`${section}/9`, this.w - 16, 24);
    ctx.restore();
  }
}
