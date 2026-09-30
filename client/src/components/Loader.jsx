export default function Loader({ label = 'Loading…' }) {
  return <div className="inline-loader"><div className="loader small" /><span>{label}</span></div>;
}
