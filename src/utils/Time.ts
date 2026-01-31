export const durationToMs = (duration: string, fallbackMs: number) => {
  const raw = (duration || "").trim();
  if (!raw) return fallbackMs;
  const match = raw.match(/^([0-9]+)\s*([smhd])?$/i);
  if (!match) return fallbackMs;

  const value = Number(match[1]);
  if (!Number.isFinite(value)) return fallbackMs;

  const unit = (match[2] || "ms").toLowerCase();
  switch (unit) {
    case "s": return value * 1000;
    case "m": return value * 60 * 1000;
    case "h": return value * 60 * 60 * 1000;
    case "d": return value * 24 * 60 * 60 * 1000;
    default: return value;
  }
};