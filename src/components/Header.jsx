export function Header() {
  return (
    <header className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-white/60">
          Stories
        </p>
        <h1 className="text-2xl font-bold">Moments</h1>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
        24h
      </div>
    </header>
  );
}
