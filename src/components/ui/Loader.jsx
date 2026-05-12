/**
 * Loader component — full-screen spinner for async states.
 * @param {{ message: string }} props
 */
export default function Loader({ message = 'Loading...' }) {
  return (
    <div className="full-loader">
      <div className="spinner" />
      <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{message}</p>
    </div>
  );
}
