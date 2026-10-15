// Pure-CSS 3D orb: server-rendered, so it paints with the first HTML. Every animation is
// transform/opacity only (compositor-friendly), which keeps it smooth on phones.
// Used as the fallback hero on devices that can't run the WebGL scene, and as the
// stand-in while that scene loads.

// Deterministic particle layout on a ring (no Math.random → identical on server and client).
const particles = Array.from({ length: 42 }, (_, i) => {
  const a = (i / 42) * Math.PI * 2 + (i % 3) * 0.35;
  const r = 34 + ((i * 37) % 14); // % of the disc radius
  return {
    left: 50 + Math.cos(a) * r,
    top: 50 + Math.sin(a) * r,
    size: 2 + (i % 3),
  };
});
// Three twinkle groups instead of 42 separate animations (fewer compositor layers).
const groups = [0, 1, 2].map((g) => particles.filter((_, i) => i % 3 === g));

export function CssOrb({ paused = false }: { paused?: boolean }) {
  return (
    <div className="orb" data-paused={paused || undefined} aria-hidden>
      <div className="orb-glow" />

      {/* Particle disc — tilted in 3D, spins as one composited layer */}
      <div className="orb-disc">
        {groups.map((group, g) => (
          <div key={g} className="orb-twinkle" style={{ animationDelay: `${g}s` }}>
            {group.map((p, i) => (
              <span key={i} className="orb-particle" style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }} />
            ))}
          </div>
        ))}
      </div>

      <div className="orb-ring orb-ring-a">
        <span className="orb-satellite" />
      </div>
      <div className="orb-ring orb-ring-b">
        <span className="orb-satellite" />
      </div>

      {/* Geodesic lattice */}
      <svg className="orb-lattice" viewBox="-50 -50 100 100">
        <g fill="none" stroke="currentColor" strokeWidth="0.4">
          <circle r="46" />
          <ellipse rx="46" ry="16" />
          <ellipse rx="16" ry="46" />
          <ellipse rx="46" ry="16" transform="rotate(60)" />
          <ellipse rx="46" ry="16" transform="rotate(-60)" />
          <path d="M0-46L40 23L-40 23Z M0 46L40-23L-40-23Z" />
        </g>
      </svg>

      <div className="orb-float">
        <div className="orb-core">
          <div className="orb-sheen" />
          <div className="orb-highlight" />
        </div>
      </div>
    </div>
  );
}
