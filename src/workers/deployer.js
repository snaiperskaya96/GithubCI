const dockerClient = require('../clients/docker');
const githubClient = require('../clients/github');
const fs = require('fs');
const config = require('../config').GITHUB;
const configUrl = require('../config').WEB.URL;
const _ = require('../globals')._;
const stream = require('stream');
const ansiUp = require('ansi_up');

class StreamHandler extends stream.Writable {
	constructor(sha) {
		super();
		this.sha = sha;
		this.file = fs.createWriteStream(__dirname + '/../logs/' + sha);
	}

	_write(chunk, enc, next) {
		this.file.write(ansiUp.ansi_to_html(chunk.toString()));
		next();
	}

	close(message) {
		if (message) {
			this.file.write(message);
		}
		this.file.close();
	}
}

module.exports = pullRequest => {
	const streamHandler = new StreamHandler(pullRequest.sha);
	let deployScript = fs.readFileSync(__dirname + '/../data/deploy-script.sh', 'utf8')
		.replace('$DEPLOYER_TOKEN$', config.DEPLOYER_TOKEN)
		.replace('$REPO_NAME$', pullRequest.repo.full_name)
		.replace('$COMMIT_SHA$', pullRequest.sha);
	dockerClient.run('ubuntu', deployScript.trim().split('\n'), streamHandler, (error, data, container) => {
		if (error) {
			console.log(error);
		}
		if (data) {
			let requestData = {
				'state': 'success',
				'target_url': configUrl + '/logs/' + pullRequest.sha, // Always prepend http/https
				'description': 'Successfully deployed!'
			};

			if (data.StatusCode != 0) {
				requestData.state = 'failure';
				requestData.description = 'Deployment failed!';
			}

			const githubRepo = githubClient.repo(pullRequest.repo.full_name);
			githubRepo.status(pullRequest.sha, requestData);

			console.log('Container returned status code', data.StatusCode);
			streamHandler.close('The deployment returned ' + data.StatusCode);
			container.remove();
		}
	});
}
