import { useEffect, useRef, useState } from "react";
import { ProgressBar } from "./ProgressBar";

const STORY_DURATION = 5000; 

export function StoryViewer({ user, storyIndex, onNext, onPrev }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const currentStory = user.stories[storyIndex];

 
  useEffect(() => {
    setImageLoaded(false);
    setProgress(0);
    startRef.current = null;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  }, [currentStory?.id]);


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
