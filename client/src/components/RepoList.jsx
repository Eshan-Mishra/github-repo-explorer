import RepoCard from './RepoCard';

function RepoList({ owner, repos }) {
  if (repos.length === 0) {
    return <p className="text-gray-500">This user has no public repositories.</p>;
  }

  return (
    <ul className="grid gap-3">
      {repos.map((repo) => (
        <RepoCard key={repo.id} owner={owner} repo={repo} />
      ))}
    </ul>
  );
}

export default RepoList;
