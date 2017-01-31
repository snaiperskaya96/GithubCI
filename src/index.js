const dockerClient = require('./clients/docker');
const fs = require('fs');
global._ = require('underscore');

dockerClient.listImages((error, list) => {
	isUbuntuPresent = false;
	list.forEach(image => {
		if (image.RepoTags && image.RepoTags.indexOf('ubuntu:latest') > -1) {
			isUbuntuPresent = true;
		}
	});

	if (!isUbuntuPresent) {
		console.log ('Downloading ubuntu image, please wait, it will only takes a few minutes');
		dockerClient.createImage({fromImage: 'ubuntu:latest'}, (err, stream) => {
			const writeStream = fs.createWriteStream('/tmp/GithubCI.log');
			stream.pipe(writeStream, {end: true});
			console.log('Please don\'t trigger any Pull Request...')
	        stream.on('end', () => {
				console.log('Done! You\'re now good to go!');
	        });
		});
	}
});


let server = require('./restify');
