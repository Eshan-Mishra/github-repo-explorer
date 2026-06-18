# GitHub Repo Explorer

Search any GitHub user and browse their public profile and repositories. The
React frontend talks only to a small Express backend, which proxies and caches
the GitHub API.

> Work in progress. Setup and API documentation will be completed as the project
> develops.

## Structure

```
client/   React + Vite frontend
server/   Express backend (GitHub API proxy + cache)
```

## Running locally

```bash
# backend
cd server
npm install
npm run dev

# frontend (in a second terminal)
cd client
npm install
npm run dev
```
