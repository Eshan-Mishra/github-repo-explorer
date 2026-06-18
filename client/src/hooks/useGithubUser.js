import { useState, useCallback } from 'react';
import { getUser, getUserRepos } from '../lib/api';

// Owns the search lifecycle: profile + first page of repos, plus the
// status/error the UI renders around.
export function useGithubUser() {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState(null);

  const search = useCallback(async (username) => {
    const trimmed = username.trim();
    if (!trimmed) return;

    setStatus('loading');
    setError(null);
    setUser(null);
    setRepos([]);

    try {
      const [userData, repoData] = await Promise.all([
        getUser(trimmed),
        getUserRepos(trimmed, { page: 1, sort: 'updated' }),
      ]);
      setUser(userData);
      setRepos(repoData);
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }, []);

  return { user, repos, status, error, search };
}
