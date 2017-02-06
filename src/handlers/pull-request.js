const githubClient = require('../clients/github');
const deployer = require('../workers/deployer');
const webConfig = require('../config').WEB;
const _ = require('../globals')._;

module.exports = (request, response, next) => {
	const payload = JSON.parse(request.params.payload);
	const pullRequest = payload.pull_request;
	const repo = pullRequest.head.repo;
	const githubRepo = githubClient.repo(repo.full_name);
	githubRepo.status(pullRequest.head.sha, {
		'state': 'pending',
		'target_url': webConfig.URL + ':' + webConfig.PORT + '/logs/' + pullRequest.head.sha,
		'description': 'Deployment in progress...',
		'context': 'continous-integration/gci'
	});
	_.defer(deployer(pullRequest.head));
	response.send(200);
	return next();
}
