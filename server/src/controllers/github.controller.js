// Thin controllers: read the request, call the service, send the response.
// Anything that throws is forwarded to the error middleware via next().

const githubService = require('../services/github.service');

async function getUser(req, res, next) {
  try {
    const user = await githubService.getUser(req.params.username);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function getUserRepos(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const sort = req.query.sort || 'updated';
    const repos = await githubService.getUserRepos(req.params.username, { page, sort });
    res.json(repos);
  } catch (err) {
    next(err);
  }
}

async function getRepo(req, res, next) {
  try {
    const repo = await githubService.getRepo(req.params.owner, req.params.repo);
    res.json(repo);
  } catch (err) {
    next(err);
  }
}

module.exports = { getUser, getUserRepos, getRepo };
