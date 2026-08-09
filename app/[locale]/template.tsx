/**
 * A template re-mounts on every navigation (unlike layout, which persists), so
 * wrapping page content here gives each route a fresh DOM node — which replays
 * the CSS page-enter cross-fade. Header/Footer live in the layout and stay put,
 * so only the page content transitions. No client JS needed.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
