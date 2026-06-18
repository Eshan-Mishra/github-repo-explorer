// Talks to the GitHub REST API on the frontend's behalf.
// Responses are cached for 60 seconds so repeated searches don't burn through
// the rate limit. Errors from GitHub are turned into errors with a `status`
// that the error middleware knows how to format.

const cache = require('../utils/cache');

const GITHUB_API = 'https://api.github.com';
const CACHE_TTL_MS = 60 * 1000;
const ALLOWED_SORTS = ['updated', 'created', 'pushed', 'full_name'];

function buildHeaders() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'github-repo-explorer',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  // Optional: raises the rate limit from 60/hr to 5,000/hr when present.
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

function httpError(status, message, extra = {}) {
  const error = new Error(message);
  error.status = status;
  Object.assign(error, extra);
  return error;
}

async function githubFetch(path) {
  const cached = cache.get(path);
  if (cached) return cached;

  let response;
  try {
    response = await fetch(`${GITHUB_API}${path}`, { headers: buildHeaders() });
  } catch {
    throw httpError(502, 'Could not reach GitHub. Please try again.');
  }

  if (response.status === 404) {
    throw httpError(404, 'User not found');
  }

  // GitHub signals a depleted rate limit with 403 + remaining=0 (or 429).
  const remaining = response.headers.get('x-ratelimit-remaining');
  if (response.status === 429 || (response.status === 403 && remaining === '0')) {
    const reset = response.headers.get('x-ratelimit-reset');
    throw httpError(429, 'GitHub rate limit exceeded. Please try again later.', {
      resetAt: reset ? new Date(Number(reset) * 1000).toISOString() : null,
    });
  }

  if (!response.ok) {
    throw httpError(502, 'GitHub request failed.');
  }

  const data = await response.json();
  cache.set(path, data, CACHE_TTL_MS);
  return data;
}

function mapRepo(repo) {
  return {
    id: repo.id,
    name: repo.name,
    description: repo.description,
    language: repo.language,
    stars: repo.stargazers_count,
    updatedAt: repo.updated_at,
    openIssues: repo.open_issues_count,
    defaultBranch: repo.default_branch,
    htmlUrl: repo.html_url,
  };
}

async function getUser(username) {
  const user = await githubFetch(`/users/${encodeURIComponent(username)}`);
  return {
    login: user.login,
    name: user.name,
    avatarUrl: user.avatar_url,
    bio: user.bio,
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos,
    htmlUrl: user.html_url,
  };
}

async function getUserRepos(username, { page = 1, sort = 'updated' } = {}) {
  const safeSort = ALLOWED_SORTS.includes(sort) ? sort : 'updated';
  const repos = await githubFetch(
    `/users/${encodeURIComponent(username)}/repos?per_page=30&page=${page}&sort=${safeSort}`
  );
  return repos.map(mapRepo);
}

async function getRepo(owner, name) {
  const repo = await githubFetch(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`
  );
  return {
    ...mapRepo(repo),
    watchers: repo.watchers_count,
    forks: repo.forks_count,
    license: repo.license ? repo.license.name : null,
    topics: repo.topics || [],
  };
}

module.exports = { getUser, getUserRepos, getRepo };
