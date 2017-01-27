const GitHubApi = require("github");
const fs = require('fs');
const config = JSON.parse(fs.readFileSync(__dirname + '/../config.json', 'utf8')).GITHUB;

let github = new GitHubApi({
    // optional
    debug: true,
    protocol: "https",
    host: "api.github.com",
    pathPrefix: "/api/v3",
    headers: {
        "user-agent": "Skayahack-CI"
    },
    Promise: require('bluebird'),
    followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
    timeout: 5000
});

github.authenticate({
    type: "oauth",
    key: config.CLIENT_ID,
    secret: config.CLIENT_SECRET
});

module.exports = github;
