import { useMemo } from "react";

export function StoryStrip({ users, activeUserIndex, onSelect, loading }) {
  const placeholders = useMemo(() => new Array(6).fill(null), []);

  return (
    <div className="mb-4">
      <h3 className="mb-2 text-sm font-semibold tracking-wide text-white/70">
        Stories
      </h3>
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
        {loading
          ? placeholders.map((_, idx) => (
              <div
                key={idx}
                className="h-20 w-20 shrink-0 animate-pulse rounded-2xl bg-white/5"
              />
            ))
          : users.map((user, idx) => (
              <button
                key={user.id}
                onClick={() => onSelect(idx)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition focus:outline-none focus:ring-2 focus:ring-accent ${
                  activeUserIndex === idx
                    ? "border-white shadow-card"
                    : "border-white/20 hover:border-white/50"
                }`}
                aria-label={`Open stories by ${user.author}`}
              >
                <img
                  src={user.avatar}
                  alt={user.author}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute bottom-1 left-1 right-1 truncate text-left text-xs font-semibold text-white drop-shadow">
                  {user.author}
                </span>
                {user.stories.length > 1 && (
                  <span className="absolute top-1 right-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {user.stories.length}
                  </span>
                )}
              </button>
            ))}
      </div>
    </div>
  );
}
