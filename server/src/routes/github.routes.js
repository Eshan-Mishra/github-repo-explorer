const express = require('express');
const controller = require('../controllers/github.controller');

const router = express.Router();

router.get('/users/:username', controller.getUser);
router.get('/users/:username/repos', controller.getUserRepos);
router.get('/repos/:owner/:repo', controller.getRepo);

module.exports = router;
