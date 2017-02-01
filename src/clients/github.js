const GitHubApi = require('octonode');
const config = require('../config').GITHUB;

const github = new GitHubApi.client(config.CLIENT_TOKEN);

module.exports = github;
