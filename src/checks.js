const dockerClient = require('./clients/docker');
const config = require('./config').DEPLOYMENT;
const fs = require('fs');

dockerClient.version((error, list) => {
	if (error) {
		console.log('Cannot get docker\'s version. Make sure docker is correctly installed and working');
		process.exit(1);
	}
	dockerClient.listImages((error, list) => {
		isImagePresent = false;
		list.forEach(image => {
			if (image.RepoTags && image.RepoTags.indexOf(config.DOCKER_IMAGE) > -1) {
				isImagePresent = true;
			}
		});

		if (!isImagePresent) {
			console.log ('Downloading ubuntu image, please wait, it will only takes a few minutes');
			dockerClient.createImage({fromImage: config.DOCKER_IMAGE}, (err, stream) => {
				if (err) {
					console.log('There was an error while trying to create/download', config.DOCKER_IMAGE);
					console.log(err);
					process.exit(1);
				}
				const writeStream = fs.createWriteStream('/tmp/GithubCI.log');
				stream.pipe(writeStream, {end: true});
				console.log('Please don\'t trigger any Pull Request...')
		        stream.on('end', () => {
					console.log('Done! You\'re now good to go!');
		        });
			});
		}
	});
});
