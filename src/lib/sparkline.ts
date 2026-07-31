export interface Sparkline {
  d: string;
  lastX: number;
  lastY: number;
  min: number;
  max: number;
}

export function sparkline(
  values: number[],
  width = 480,
  height = 120,
  pad = 5,
): Sparkline {
  if (values.length < 2) {
    throw new Error(`sparkline needs >= 2 points, got ${values.length}`);
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min;
  const step = (width - 2 * pad) / (values.length - 1);
  const y = (v: number) =>
    span === 0 ? height / 2 : height - pad - ((v - min) / span) * (height - 2 * pad);
  const pts = values.map((v, i) => [pad + i * step, y(v)] as const);
  const d = pts
    .map(([px, py], i) => `${i === 0 ? "M" : "L"}${px.toFixed(1)} ${py.toFixed(1)}`)
    .join(" ");
  const [lastX, lastY] = pts[pts.length - 1]!;
  return { d, lastX, lastY, min, max };
}
