import { useState } from 'react';
import { formatCount, formatDate } from '../lib/format';
import { getRepo } from '../lib/api';

function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-gray-400">{label}</dt>
      <dd className="text-gray-800">{value}</dd>
    </div>
  );
}

function RepoCard({ owner, repo }) {
  const [expanded, setExpanded] = useState(false);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function toggle() {
    const next = !expanded;
    setExpanded(next);

    // Fetch detail the first time the card is opened.
    if (next && !detail && !loading) {
      setLoading(true);
      setError(null);
      try {
        setDetail(await getRepo(owner, repo.name));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <li className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <a
          href={repo.htmlUrl}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-blue-700 hover:underline"
        >
          {repo.name}
        </a>
        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          className="shrink-0 text-sm text-gray-500 hover:text-gray-900"
        >
          {expanded ? 'Hide' : 'Details'}
        </button>
      </div>

      {repo.description && (
        <p className="mt-1 text-sm text-gray-700">{repo.description}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
        {repo.language && <span>{repo.language}</span>}
        <span>★ {formatCount(repo.stars)}</span>
        <span>Updated {formatDate(repo.updatedAt)}</span>
      </div>

      {expanded && (
        <div className="mt-3 border-t border-gray-100 pt-3 text-sm">
          {loading && <p className="text-gray-500">Loading details…</p>}
          {error && <p className="text-red-600">{error}</p>}
          {detail && (
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Detail label="Open issues" value={formatCount(detail.openIssues)} />
              <Detail label="Default branch" value={detail.defaultBranch} />
              <Detail label="Forks" value={formatCount(detail.forks)} />
              <Detail label="License" value={detail.license || '—'} />
            </dl>
          )}
        </div>
      )}
    </li>
  );
}

export default RepoCard;
