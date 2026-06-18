# GitHub Repo Explorer

A small full-stack app for **Exercise 3** of the Studio Graphene assessment. You
type a GitHub username and the app shows that user's public profile and their
public repositories. The React frontend never calls GitHub directly — a small
Express backend proxies every request, caches responses for 60 seconds to stay
under GitHub's rate limit, and is the place an API token would live in a real
deployment.

## Live Demo

- **Frontend:** _added after deployment_
- **Backend:** _added after deployment_

## Tech Stack

| Area | Choice | Why |
|---|---|---|
| Frontend | React 19 + Vite | Fast dev server, simple build, functional components with hooks |
| Styling | Tailwind CSS | Quick, consistent styling without a separate CSS file per component |
| Charts | Recharts | Small amount of code for the language breakdown pie chart |
| Backend | Node.js + Express 5 | Minimal, well-understood HTTP layer for the proxy |
| HTTP | Native `fetch` | Built into modern Node, no extra dependency |
| Cache | In-memory `Map` | The only server state needed; a 60s TTL is enough for this use case |

## How to Run Locally

You only need Node.js installed (v18+).

```bash
# 1. Backend
cd server
npm install
npm run dev          # starts on http://localhost:4000

# 2. Frontend (in a second terminal)
cd client
npm install
npm run dev          # starts on http://localhost:5173
```

The frontend talks to `http://localhost:4000` by default. To point it elsewhere,
create `client/.env` with:

```
VITE_API_BASE_URL=http://localhost:4000
```

The backend works without any configuration. Optionally, copy
`server/.env.example` to `server/.env` and set `GITHUB_TOKEN` to raise the rate
limit from 60 to 5,000 requests per hour.

## API Documentation

All endpoints are served by the backend under `/api`. Responses (except
`/health`) are cached for 60 seconds per path.

### `GET /api/health`
Liveness check.
```json
{ "status": "ok" }
```

### `GET /api/users/:username`
The user's public profile.
```json
{
  "login": "octocat",
  "name": "The Octocat",
  "avatarUrl": "https://...",
  "bio": "…",
  "followers": 1234,
  "following": 9,
  "publicRepos": 8,
  "htmlUrl": "https://github.com/octocat"
}
```

### `GET /api/users/:username/repos`
One page (30) of the user's public repositories.

Query params: `page` (default `1`), `sort` (`updated` \| `created` \| `pushed` \| `full_name`, default `updated`).
```json
[
  {
    "id": 1296269,
    "name": "Hello-World",
    "description": "My first repository",
    "language": "JavaScript",
    "stars": 80,
    "updatedAt": "2024-01-01T00:00:00Z",
    "openIssues": 0,
    "defaultBranch": "main",
    "htmlUrl": "https://github.com/octocat/Hello-World"
  }
]
```

### `GET /api/repos/:owner/:repo`
Extra detail for a single repository (used when a repo card is expanded).
```json
{
  "id": 1296269,
  "name": "Hello-World",
  "description": "My first repository",
  "language": "JavaScript",
  "stars": 80,
  "updatedAt": "2024-01-01T00:00:00Z",
  "openIssues": 0,
  "defaultBranch": "main",
  "htmlUrl": "https://github.com/octocat/Hello-World",
  "watchers": 80,
  "forks": 9,
  "license": "MIT License",
  "topics": ["octocat", "example"]
}
```

### Error responses
| Status | When | Body |
|---|---|---|
| `404` | Username does not exist | `{ "error": "User not found" }` |
| `429` | GitHub rate limit hit | `{ "error": "GitHub rate limit exceeded. Please try again later.", "resetAt": "<iso>" }` |
| `502` | GitHub unreachable / failed | `{ "error": "Could not reach GitHub. Please try again." }` |

## Project Structure

```
github-repo-explorer/
├── client/                       React + Vite frontend
│   └── src/
│       ├── components/           SearchBar, ProfileCard, RepoList, RepoCard,
│       │                         SortControls, LanguageChart, RecentSearches,
│       │                         Loading, ErrorMessage, EmptyState
│       ├── hooks/                useGithubUser, useDebounce, useRecentSearches
│       ├── lib/                  api.js (calls our backend), format.js
│       └── App.jsx
└── server/                       Express backend (layered)
    └── src/
        ├── index.js              entry: starts the server
        ├── app.js                express app: middleware + routes
        ├── routes/               endpoint definitions
        ├── controllers/          request/response handling
        ├── services/             GitHub fetch + caching
        ├── middleware/           error normalization
        └── utils/cache.js        in-memory 60s cache
```

## Notes & Next Steps

- **Sorting by stars/name is done on the client.** GitHub's repo endpoint can
  only sort by created/updated/pushed/name, so star and name sorting happen on
  the already-loaded repositories.
- **The language chart uses each repo's primary `language` field** rather than
  calling GitHub's per-repo `/languages` endpoint, which would mean one extra
  request per repository and would exhaust the unauthenticated rate limit.

If I had more time:

- Add a couple of meaningful backend tests (Vitest) around the cache and the
  error mapping.
- Wire up the optional `GITHUB_TOKEN` path end-to-end (the client is ready).
- Sort across all pages rather than only the loaded ones.
