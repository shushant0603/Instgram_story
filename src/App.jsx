import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const STORY_DURATION = 5000; // ms

function useStories() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch("/data/stories.json")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load stories");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setUsers(data);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { users, loading, error };
}

function ProgressBar({ progress }) {
  return (
    <div className="h-1 flex-1 rounded-full bg-white/15">
      <div
        className="h-full rounded-full bg-white transition-none"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}

function StoryViewer({ user, storyIndex, onNext, onPrev }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const currentStory = user.stories[storyIndex];

  // Reset on story change
  useEffect(() => {
    setImageLoaded(false);
    setProgress(0);
    startRef.current = null;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  }, [currentStory?.id]);

  // Autoplay once image is ready
  useEffect(() => {
    if (!imageLoaded) return;

    const step = (timestamp) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const pct = Math.min(elapsed / STORY_DURATION, 1);
      setProgress(pct);
      if (pct >= 1) {
        onNext();
        return;
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [imageLoaded, onNext]);

  const handleImageLoad = () => setImageLoaded(true);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-subtle story-shadow">
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/40 pointer-events-none" />

      <div className="absolute top-0 inset-x-0 z-20 flex gap-1 px-3 pt-3">
        {user.stories.map((story, idx) => (
          <ProgressBar
            key={story.id}
            progress={
              idx < storyIndex ? 1 : idx === storyIndex ? progress : 0
            }
          />
        ))}
      </div>

      <div className="relative h-[620px] w-full select-none" role="presentation">
        <div className="absolute inset-0" onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const midpoint = rect.left + rect.width / 2;
          if (e.clientX < midpoint) onPrev();
          else onNext();
        }}>
          <img
            key={currentStory.id}
            src={currentStory.image}
            alt={currentStory.title}
            className="h-full w-full object-cover transition-opacity duration-300"
            onLoad={handleImageLoad}
          />
        </div>

        {!imageLoaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 flex items-end justify-between p-5 text-left">
          <div className="pointer-events-auto space-y-1" aria-live="polite">
            <div className="inline-flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              story
            </div>
            <h2 className="text-2xl font-bold drop-shadow-md">{user.author}</h2>
            <p className="text-sm text-white/85 drop-shadow">{currentStory.title}</p>
            <p className="text-xs text-white/60 drop-shadow">
              {storyIndex + 1} / {user.stories.length}
            </p>
          </div>
          <div className="pointer-events-auto hidden flex-col items-end gap-2 text-sm md:flex">
            <button
              type="button"
              onClick={onPrev}
              className="rounded-full bg-black/45 px-4 py-2 font-semibold text-white shadow-card backdrop-blur transition hover:bg-black/65"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={onNext}
              className="rounded-full bg-white/85 px-4 py-2 font-semibold text-black shadow-card transition hover:bg-white"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StoryStrip({ users, activeUserIndex, onSelect, loading }) {
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

export default function App() {
  const { users, loading, error } = useStories();
  const [activeUserIndex, setActiveUserIndex] = useState(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  useEffect(() => {
    if (!loading && users.length > 0 && activeUserIndex === null) {
      setActiveUserIndex(0);
      setActiveStoryIndex(0);
    }
  }, [loading, users, activeUserIndex]);

  const handleNext = useCallback(() => {
    if (users.length === 0 || activeUserIndex === null) return;
    
    const currentUser = users[activeUserIndex];
    const isLastStory = activeStoryIndex >= currentUser.stories.length - 1;

    if (isLastStory) {
      // Move to next user
      const nextUserIndex = (activeUserIndex + 1) % users.length;
      setActiveUserIndex(nextUserIndex);
      setActiveStoryIndex(0);
    } else {
      // Move to next story of current user
      setActiveStoryIndex(activeStoryIndex + 1);
    }
  }, [users, activeUserIndex, activeStoryIndex]);

  const handlePrev = useCallback(() => {
    if (users.length === 0 || activeUserIndex === null) return;

    if (activeStoryIndex > 0) {
      // Go to previous story of current user
      setActiveStoryIndex(activeStoryIndex - 1);
    } else {
      // Go to previous user's last story
      const prevUserIndex = activeUserIndex - 1 < 0 ? users.length - 1 : activeUserIndex - 1;
      const prevUser = users[prevUserIndex];
      setActiveUserIndex(prevUserIndex);
      setActiveStoryIndex(prevUser.stories.length - 1);
    }
  }, [users, activeUserIndex, activeStoryIndex]);

  const handleUserSelect = useCallback((userIndex) => {
    setActiveUserIndex(userIndex);
    setActiveStoryIndex(0);
  }, []);

  const showViewer = !loading && users.length > 0 && activeUserIndex !== null;

  return (
    <main className="mx-auto flex max-w-[520px] flex-col gap-4 rounded-3xl bg-black/25 p-4 backdrop-blur">
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

      <StoryStrip
        users={users}
        activeUserIndex={activeUserIndex}
        onSelect={handleUserSelect}
        loading={loading}
      />

      {error && (
        <div className="rounded-2xl bg-red-500/15 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {showViewer ? (
        <StoryViewer
          user={users[activeUserIndex]}
          storyIndex={activeStoryIndex}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      ) : (
        <div className="flex h-[620px] items-center justify-center rounded-3xl border border-white/10 bg-subtle text-white/60">
          {loading ? "Loading stories..." : "No stories available."}
        </div>
      )}

      <p className="text-center text-xs text-white/50">
        Tap right to skip, left to go back. Stories auto-advance every 5 seconds.
      </p>
    </main>
  );
}
