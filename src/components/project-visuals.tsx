// Animated SVG scenes for project covers. Pure SVG + SMIL (no JS per frame);
// AnimatedCover pauses them off-screen. Colors: `currentColor` is the project hue.
// Each scene is 320×200 and sliced to fill the cover.

export type VisualKey = "finance" | "blueprint" | "dashboard" | "infra" | "wheel" | "posters";

const svgProps = {
  viewBox: "0 0 320 200",
  preserveAspectRatio: "xMidYMid slice",
  className: "h-full w-full",
  "aria-hidden": true,
} as const;

const mono = { fontFamily: "var(--font-jetbrains), monospace" };

/** Polyline points → smooth-ish path string. */
const toPath = (pts: number[][]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");

// ---------------------------------------------------------------------------

function Finance() {
  const line = [[20, 150], [50, 136], [80, 142], [110, 116], [140, 122], [170, 96], [200, 102], [230, 78]];
  const forecast = [[230, 78], [260, 66], [290, 52]];
  const linePath = toPath(line);
  const area = `${linePath} L230 180 L20 180 Z`;
  const candles = [52, 30, 64, 40, 72, 48, 58, 36, 66];
  return (
    <svg {...svgProps}>
      <defs>
        <linearGradient id="fin-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[50, 90, 130, 170].map((y) => (
        <line key={y} x1="0" x2="320" y1={y} y2={y} className="stroke-foreground/10" strokeDasharray="2 6" />
      ))}
      {candles.map((h, i) => (
        <rect key={i} x={26 + i * 30} width="10" rx="2" fill="currentColor" opacity="0.22" y={180 - h} height={h}>
          <animate attributeName="height" values={`${h};${h * 0.55};${h}`} dur="3.2s" begin={`${i * 0.18}s`} repeatCount="indefinite" />
          <animate attributeName="y" values={`${180 - h};${180 - h * 0.55};${180 - h}`} dur="3.2s" begin={`${i * 0.18}s`} repeatCount="indefinite" />
        </rect>
      ))}
      <path d={area} fill="url(#fin-area)">
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.35;0.85;1" dur="5s" repeatCount="indefinite" />
      </path>
      <path d={linePath} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="320" strokeDashoffset="320">
        <animate attributeName="stroke-dashoffset" values="320;0;0;320" keyTimes="0;0.35;0.85;1" dur="5s" repeatCount="indefinite" />
      </path>
      <path d={toPath(forecast)} fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 5" opacity="0">
        <animate attributeName="opacity" values="0;0;0.9;0.9;0" keyTimes="0;0.35;0.45;0.85;1" dur="5s" repeatCount="indefinite" />
      </path>
      <circle r="4.5" fill="currentColor">
        <animateMotion path={linePath} dur="5s" keyPoints="0;1;1;1" keyTimes="0;0.35;0.85;1" calcMode="linear" repeatCount="indefinite" />
      </circle>
      <g transform="translate(18 18)">
        <rect width="94" height="24" rx="12" className="fill-background/70 stroke-foreground/15" />
        <circle cx="13" cy="12" r="3.5" fill="currentColor">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite" />
        </circle>
        <text x="24" y="16" fontSize="10" className="fill-foreground" style={mono}>forecast</text>
      </g>
    </svg>
  );
}

function Blueprint() {
  const boxes = [
    { x: 46, y: 38, w: 58, h: 48, label: "room", t: 0.15 },
    { x: 150, y: 100, w: 34, h: 26, label: "door", t: 0.55 },
    { x: 214, y: 128, w: 54, h: 34, label: "stairs", t: 0.75 },
  ];
  return (
    <svg {...svgProps}>
      <defs>
        <pattern id="bp-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M16 0H0V16" fill="none" stroke="currentColor" strokeOpacity="0.12" />
        </pattern>
        <linearGradient id="bp-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="0.85" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#bp-grid)" />
      {/* Floor plan walls */}
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" opacity="0.85">
        <path d="M36 28H284V172H36Z" />
        <path d="M36 96H140M176 96H200V28M200 96H284M128 96V172M200 120V172" />
      </g>
      {/* Door swings */}
      <g fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.6">
        <path d="M140 96A36 36 0 0 1 176 96" strokeDasharray="3 3" />
        <path d="M128 140A20 20 0 0 1 148 120" strokeDasharray="3 3" />
      </g>
      {/* Detection boxes appear as the scan passes */}
      {boxes.map((b) => (
        <g key={b.label} opacity="0">
          <animate attributeName="opacity" values="0;0;1;1;0" keyTimes={`0;${b.t};${b.t + 0.06};0.92;1`} dur="4s" repeatCount="indefinite" />
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="3" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 3" />
          <rect x={b.x} y={b.y - 14} width={b.label.length * 7 + 10} height="13" rx="3" fill="currentColor" />
          <text x={b.x + 5} y={b.y - 4} fontSize="9" fill="#fff" style={mono}>{b.label}</text>
        </g>
      ))}
      <rect x="0" y="-40" width="320" height="40" fill="url(#bp-beam)">
        <animateTransform attributeName="transform" type="translate" values="0 0;0 240" dur="4s" repeatCount="indefinite" />
      </rect>
    </svg>
  );
}

function Dashboard() {
  const bars = [44, 70, 52, 86, 62, 96, 74];
  return (
    <svg {...svgProps}>
      <rect x="22" y="18" width="276" height="164" rx="10" className="fill-background/60 stroke-foreground/15" />
      <circle cx="36" cy="31" r="3" className="fill-foreground/25" />
      <circle cx="46" cy="31" r="3" className="fill-foreground/25" />
      <circle cx="56" cy="31" r="3" className="fill-foreground/25" />
      {/* Sidebar */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x="34" y={52 + i * 20} width={i === 1 ? 40 : 32} height="8" rx="4" fill={i === 1 ? "currentColor" : undefined} className={i === 1 ? "" : "fill-foreground/15"} />
      ))}
      {/* KPI tiles */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${92 + i * 64} 48)`}>
          <rect width="56" height="34" rx="6" className="fill-foreground/5 stroke-foreground/10" />
          <rect x="8" y="8" width="22" height="5" rx="2.5" className="fill-foreground/25" />
          <rect x="8" y="19" width="34" height="8" rx="4" fill="currentColor" opacity={0.85 - i * 0.2}>
            <animate attributeName="width" values="18;38;34" dur="2.4s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
          </rect>
        </g>
      ))}
      {/* Bar chart */}
      {bars.map((h, i) => {
        const y = 168 - h * 0.7;
        return (
          <rect key={i} x={96 + i * 18} width="10" rx="3" fill="currentColor" opacity="0.75" y={y} height={h * 0.7}>
            <animate attributeName="height" values={`${h * 0.7};${h * 0.35};${h * 0.7}`} dur="2.8s" begin={`${i * 0.15}s`} repeatCount="indefinite" />
            <animate attributeName="y" values={`${y};${168 - h * 0.35};${y}`} dur="2.8s" begin={`${i * 0.15}s`} repeatCount="indefinite" />
          </rect>
        );
      })}
      {/* Donut */}
      <g transform="translate(256 130)">
        <circle r="24" fill="none" className="stroke-foreground/10" strokeWidth="8" />
        <circle r="24" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeDasharray="151" strokeDashoffset="60" transform="rotate(-90)">
          <animate attributeName="stroke-dashoffset" values="151;40;60" dur="3s" repeatCount="indefinite" />
        </circle>
      </g>
      {/* Members popping in */}
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={240 + i * 13} cy="58" r="7" fill="currentColor" opacity={1 - i * 0.18} className="stroke-background" strokeWidth="2">
          <animate attributeName="r" values="0;8;7;7" keyTimes="0;0.1;0.15;1" dur="4s" begin={`${i * 0.25}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

function Infra() {
  const center = [160, 100];
  const nodes = [
    { x: 58, y: 46, label: "VPS" },
    { x: 262, y: 46, label: "DNS" },
    { x: 58, y: 154, label: "MAIL" },
    { x: 262, y: 154, label: "BACKUP" },
  ];
  return (
    <svg {...svgProps}>
      {nodes.map((n, i) => {
        const d = `M${center[0]} ${center[1]} L${n.x} ${n.y}`;
        return (
          <g key={n.label}>
            <path d={d} stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="4 6">
              <animate attributeName="stroke-dashoffset" values="0;-20" dur="1s" repeatCount="indefinite" />
            </path>
            <circle r="3.5" fill="currentColor">
              <animateMotion path={i % 2 ? d : `M${n.x} ${n.y} L${center[0]} ${center[1]}`} dur="2.2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}
      {nodes.map((n) => (
        <g key={n.label} transform={`translate(${n.x} ${n.y})`}>
          <rect x={-n.label.length * 4 - 12} y="-14" width={n.label.length * 8 + 24} height="28" rx="8" className="fill-background/80" stroke="currentColor" strokeOpacity="0.5" />
          <text textAnchor="middle" y="4" fontSize="10" className="fill-foreground" style={mono}>{n.label}</text>
        </g>
      ))}
      <g transform={`translate(${center[0]} ${center[1]})`}>
        <circle r="26" fill="none" stroke="currentColor" strokeWidth="1.5">
          <animate attributeName="r" values="26;46" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0" dur="2s" repeatCount="indefinite" />
        </circle>
        <rect x="-30" y="-22" width="60" height="44" rx="12" fill="currentColor" />
        <text textAnchor="middle" y="4" fontSize="11" fontWeight="700" fill="#fff" style={mono}>APP</text>
      </g>
    </svg>
  );
}

function Wheel() {
  const cx = 112, cy = 104, r = 68, n = 8;
  const seg = (i: number) => {
    const a0 = (i / n) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2;
    const p = (a: number) => `${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`;
    return `M${cx} ${cy} L${p(a0)} A${r} ${r} 0 0 1 ${p(a1)} Z`;
  };
  return (
    <svg {...svgProps}>
      <g>
        {/* Spin, ease out, rest — ends on a full turn so the loop is seamless */}
        <animateTransform attributeName="transform" type="rotate" values={`0 ${cx} ${cy};1080 ${cx} ${cy};1080 ${cx} ${cy}`} keyTimes="0;0.7;1" calcMode="spline" keySplines="0.2 0.7 0.25 1;0 0 1 1" dur="5s" repeatCount="indefinite" />
        {Array.from({ length: n }, (_, i) => (
          <path key={i} d={seg(i)} fill="currentColor" opacity={i % 2 ? 0.35 : 0.85} className="stroke-background" strokeWidth="2" />
        ))}
        {Array.from({ length: n }, (_, i) => {
          const a = ((i + 0.5) / n) * Math.PI * 2 - Math.PI / 2;
          return <circle key={i} cx={cx + Math.cos(a) * r * 0.68} cy={cy + Math.sin(a) * r * 0.68} r="4" fill="#fff" opacity="0.8" />;
        })}
      </g>
      <circle cx={cx} cy={cy} r="12" className="fill-background" stroke="currentColor" strokeWidth="3" />
      <path d={`M${cx - 9} ${cy - r - 14} L${cx + 9} ${cy - r - 14} L${cx} ${cy - r + 4} Z`} className="fill-foreground" />
      {/* Booking calendar */}
      <g transform="translate(206 60)">
        <text y="-8" fontSize="9" className="fill-foreground/60" style={mono}>bookings</text>
        {Array.from({ length: 20 }, (_, i) => (
          <rect key={i} x={(i % 4) * 24} y={Math.floor(i / 4) * 24} width="20" height="20" rx="4" fill="currentColor" opacity="0.12">
            {[1, 6, 9, 14, 19].includes(i) && (
              <animate attributeName="opacity" values="0.12;0.9;0.9;0.12" keyTimes="0;0.1;0.8;1" dur="5s" begin={`${(i % 5) * 0.6}s`} repeatCount="indefinite" />
            )}
          </rect>
        ))}
      </g>
    </svg>
  );
}

function Posters() {
  const posters = [
    { rot: -14, x: 108, phase: 0 },
    { rot: 12, x: 212, phase: 1.2 },
    { rot: 0, x: 160, phase: 0.6 },
  ];
  return (
    <svg {...svgProps}>
      {posters.map((p, i) => (
        <g key={i} transform={`translate(${p.x} 104) rotate(${p.rot})`}>
          <g>
            <animateTransform attributeName="transform" type="translate" values="0 0;0 -8;0 0" dur="3.6s" begin={`${p.phase}s`} repeatCount="indefinite" />
            <rect x="-38" y="-54" width="76" height="108" rx="6" className="fill-background stroke-foreground/15" />
            <rect x="-30" y="-46" width="60" height="70" rx="3" fill="currentColor" opacity={0.25 + i * 0.25} />
            {i === 0 && <circle cx="0" cy="-14" r="18" fill="#fff" opacity="0.5" />}
            {i === 1 && <path d="M-30 24 L-6 -18 L10 6 L18 -6 L30 24 Z" fill="#fff" opacity="0.5" />}
            {i === 2 && (
              <g fill="#fff" opacity="0.6">
                <circle cx="-8" cy="-20" r="12" />
                <rect x="-2" y="-8" width="26" height="26" rx="2" opacity="0.7" />
              </g>
            )}
            <rect x="-30" y="32" width="40" height="5" rx="2.5" className="fill-foreground/40" />
            <rect x="-30" y="42" width="24" height="5" rx="2.5" className="fill-foreground/20" />
          </g>
        </g>
      ))}
      <g transform="translate(284 164)">
        <circle r="16" fill="currentColor" />
        <path d="M-7 -4 H8 L6 4 H-5 Z M-9 -7 H-6 L-4 4" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
        <g opacity="0">
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.5;0.6" dur="3s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="translate" values="0 0;0 -14;0 -14" keyTimes="0;0.5;1" dur="3s" repeatCount="indefinite" />
          <text x="10" y="-14" fontSize="11" fontWeight="700" fill="currentColor" style={mono}>+1</text>
        </g>
      </g>
    </svg>
  );
}

export const projectVisuals: Record<VisualKey, () => React.JSX.Element> = {
  finance: Finance,
  blueprint: Blueprint,
  dashboard: Dashboard,
  infra: Infra,
  wheel: Wheel,
  posters: Posters,
};
