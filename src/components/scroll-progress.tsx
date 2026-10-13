// Driven by a CSS scroll timeline (globals.css): no scroll listeners, runs off the main thread.
export function ScrollProgress() {
  return (
    <div
      className="scroll-progress fixed inset-x-0 top-0 z-[60] h-0.5 bg-gradient-to-r from-accent to-cyan-400"
      aria-hidden
    />
  );
}
