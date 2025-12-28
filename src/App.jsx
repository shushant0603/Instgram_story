import { useCallback, useEffect, useState } from "react";
import { useStories } from "./hooks/useStories";
import { Header } from "./components/Header";
import { StoryStrip } from "./components/StoryStrip";
import { StoryViewer } from "./components/StoryViewer";

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
      <Header />

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
