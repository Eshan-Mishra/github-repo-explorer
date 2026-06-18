import { formatCount, formatDate } from '../lib/format';

function RepoCard({ repo }) {
  return (
    <li className="rounded-lg border border-gray-200 bg-white p-4">
      <a
        href={repo.htmlUrl}
        target="_blank"
        rel="noreferrer"
        className="font-medium text-blue-700 hover:underline"
      >
        {repo.name}
      </a>

      {repo.description && (
        <p className="mt-1 text-sm text-gray-700">{repo.description}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
        {repo.language && <span>{repo.language}</span>}
        <span>★ {formatCount(repo.stars)}</span>
        <span>Updated {formatDate(repo.updatedAt)}</span>
      </div>
    </li>
  );
}

export default RepoCard;
