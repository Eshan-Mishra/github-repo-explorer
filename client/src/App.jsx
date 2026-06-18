import { useMemo, useState } from 'react';
import { useGithubUser } from './hooks/useGithubUser';
import SearchBar from './components/SearchBar';
import ProfileCard from './components/ProfileCard';
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
  const { user, repos, status, error, search } = useGithubUser();
  const [sort, setSort] = useState('updated');

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

        <SearchBar onSearch={search} loading={status === 'loading'} />

        <div className="mt-6">
          {status === 'idle' && <EmptyState />}
          {status === 'loading' && <Loading />}
          {status === 'error' && <ErrorMessage message={error} />}
          {status === 'success' && user && (
            <div className="grid gap-6">
              <ProfileCard user={user} />
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Repositories</h3>
                <SortControls value={sort} onChange={setSort} />
              </div>
              <RepoList repos={sortedRepos} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
