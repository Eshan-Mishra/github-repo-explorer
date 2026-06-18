// All network calls go through our own backend, never directly to GitHub.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

async function request(path) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`);
  } catch {
    throw new Error('Could not reach the server. Is the backend running?');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong.');
  }

  return data;
}

export function getUser(username) {
  return request(`/api/users/${encodeURIComponent(username)}`);
}

export function getUserRepos(username, { page = 1, sort = 'updated' } = {}) {
  return request(
    `/api/users/${encodeURIComponent(username)}/repos?page=${page}&sort=${sort}`
  );
}

export function getRepo(owner, repo) {
  return request(
    `/api/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`
  );
}
