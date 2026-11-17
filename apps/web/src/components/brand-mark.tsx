const bars = [
  { x: 11, y: 16, h: 92, fill: "#ff1744" },
  { x: 25, y: 34, h: 74, fill: "#ff6d00" },
  { x: 39, y: 52, h: 56, fill: "#ffd600" },
  { x: 55, y: 72, h: 36, fill: "#00e676" },
  { x: 71, y: 52, h: 56, fill: "#00a8ff" },
  { x: 85, y: 34, h: 74, fill: "#5b3dff" },
  { x: 99, y: 16, h: 92, fill: "#c026d3" },
] as const;

/** The Spectrum Signal mark. Bar order and colors are fixed by the brand rules. */
export function BrandMark({ size = 32, title }: { size?: number; title?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {bars.map((b) => (
        <rect key={b.x} x={b.x} y={b.y} width="10" height={b.h} rx="5" fill={b.fill} />
      ))}
    </svg>
  );
}

/** Mark plus the lowercase Unbounded wordmark. */
export function Lockup({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <BrandMark size={size} />
      <span
        className="font-display font-extrabold tracking-tight text-ink"
        style={{ fontSize: size * 0.72 }}
      >
        amplivid
      </span>
    </span>
  );
}
