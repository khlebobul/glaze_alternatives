export function Card({ children }: { children: React.ReactNode }) {
  return <div className="ascii-card relative overflow-hidden border border-border bg-background"><div aria-hidden="true" className="ascii-pattern">░</div><div className="relative z-10">{children}</div></div>;
}
