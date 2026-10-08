/** Every screen eases in when you move between them (a template remounts on navigation). */
export default function AppTemplate({ children }: { children: React.ReactNode }) {
  return <div className="animate-rise">{children}</div>;
}
