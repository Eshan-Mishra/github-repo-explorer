import { useEffect, useMemo, useState } from 'react';
import { useGithubUser } from './hooks/useGithubUser';
import { useDebounce } from './hooks/useDebounce';
import { useRecentSearches } from './hooks/useRecentSearches';
import SearchBar from './components/SearchBar';
import RecentSearches from './components/RecentSearches';
import ProfileCard from './components/ProfileCard';
import LanguageChart from './components/LanguageChart';
import RepoList from './components/RepoList';
import SortControls from './components/SortControls';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';
import EmptyState from './components/EmptyState';

// GitHub's repo endpoint can't sort by stars, so we sort the loaded repos here.
function sortRepos(repos, sort) {
  const copy = [...repos];
  if (sort === 'stars') return copy.sort((a, b) => b.stars - a.stars);
  if (sort === 'name') return copy.sort((a, b) => a.name.localeCompare(b.name));
  return copy.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

function App() {
  const { user, repos, status, error, hasMore, loadingMore, search, loadMore } =
    useGithubUser();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('updated');

  const debouncedQuery = useDebounce(query, 500);
  const { items: recent, add: addRecent, clear: clearRecent } = useRecentSearches();

  // Search-as-you-type: run a search once typing settles.
  useEffect(() => {
    if (debouncedQuery.trim()) search(debouncedQuery);
  }, [debouncedQuery, search]);

  // Remember successful searches.
  useEffect(() => {
    if (status === 'success' && user) addRecent(user.login);
  }, [status, user, addRecent]);

  const sortedRepos = useMemo(() => sortRepos(repos, sort), [repos, sort]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">GitHub Repo Explorer</h1>
          <p className="text-gray-500">
            Search a user to view their profile and public repositories.
          </p>
        </header>

        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={() => search(query)}
          loading={status === 'loading'}
        />
        <RecentSearches items={recent} onSelect={setQuery} onClear={clearRecent} />

        <div className="mt-6">
          {status === 'idle' && <EmptyState />}
          {status === 'loading' && <Loading />}
          {status === 'error' && <ErrorMessage message={error} />}
          {status === 'success' && user && (
            <div className="grid gap-6">
              <ProfileCard user={user} />
              <LanguageChart repos={repos} />

              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  Repositories{' '}
                  <span className="text-gray-400">
                    ({repos.length} of {user.publicRepos})
                  </span>
                </h3>
                <SortControls value={sort} onChange={setSort} />
              </div>

              <RepoList owner={user.login} repos={sortedRepos} />

              {hasMore && (
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="mx-auto rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  {loadingMore ? 'Loading…' : 'Load more'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
