export function ProgressBar({ progress }) {
  return (
    <div className="h-1 flex-1 rounded-full bg-white/15">
      <div
        className="h-full rounded-full bg-white transition-none"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
