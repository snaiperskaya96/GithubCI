const GitHubApi = require('octonode');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync(__dirname + '/../config.json', 'utf8')).GITHUB;

const github = new GitHubApi.client(config.CLIENT_TOKEN);

module.exports = github;
