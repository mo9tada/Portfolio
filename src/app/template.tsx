// Re-mounts on every navigation; the CSS entrance runs on first paint without waiting for JS.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
