export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="ascii-badge"><span aria-hidden="true">[</span><span>{children}</span><span aria-hidden="true">]</span></span>;
}
