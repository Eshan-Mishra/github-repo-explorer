import { useState, useCallback } from 'react';
import { getUser, getUserRepos } from '../lib/api';

const PER_PAGE = 30;

// Owns the search lifecycle: profile + repos (paginated), plus the
// status/error the UI renders around.
export function useGithubUser() {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setUsername(trimmed);
    setStatus('loading');
    setError(null);
    setUser(null);
    setRepos([]);
    setPage(1);
    setHasMore(false);

    try {
      const [userData, repoData] = await Promise.all([
        getUser(trimmed),
        getUserRepos(trimmed, { page: 1, sort: 'updated' }),
      ]);
      setUser(userData);
      setRepos(repoData);
      setHasMore(repoData.length === PER_PAGE);
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const more = await getUserRepos(username, { page: nextPage, sort: 'updated' });
      setRepos((current) => [...current, ...more]);
      setPage(nextPage);
      setHasMore(more.length === PER_PAGE);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }, [username, page, hasMore, loadingMore]);

  return { user, repos, status, error, hasMore, loadingMore, search, loadMore };
}
