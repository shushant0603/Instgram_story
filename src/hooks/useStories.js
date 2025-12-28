import { useEffect, useState } from "react";

export function useStories() {
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
