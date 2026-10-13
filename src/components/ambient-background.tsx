export default function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="bg-grid absolute inset-0" />
      <div
        className="blob-a absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full blur-3xl sm:left-[30%]"
        style={{ background: "radial-gradient(circle, var(--glow-1), transparent 65%)" }}
      />
      <div
        className="blob-b absolute -top-20 right-[-10rem] hidden h-[30rem] w-[30rem] rounded-full blur-3xl sm:block"
        style={{ background: "radial-gradient(circle, var(--glow-2), transparent 65%)" }}
      />
    </div>
  );
}
