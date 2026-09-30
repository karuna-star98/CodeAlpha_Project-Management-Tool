export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;
  return <div className="error-banner"><span>{message}</span>{onRetry && <button onClick={onRetry}>Retry</button>}</div>;
}
