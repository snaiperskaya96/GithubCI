const fs = require('fs');
const cache = require('memory-cache');

let config = cache.get('config');

if (config == null) {
	config = readConfig();
	cache.put('config', config);
}

module.exports = config;

function readConfig() {
	let fileConfig = null;
	try {
		let configFile = fs.readFileSync(__dirname + '/data/config.json', 'utf8');
		fileConfig = JSON.parse(configFile);
	} catch (exception) {
		let configFile = fs.readFileSync(__dirname + '/data/config.json.dist', 'utf8');
		fileConfig = JSON.parse(configFile);
	}

	fileConfig.GITHUB.CLIENT_TOKEN = process.env.GCI_CLIENT_TOKEN || fileConfig.GITHUB.CLIENT_TOKEN;
	fileConfig.GITHUB.DEPLOYER_TOKEN = process.env.GCI_DEPLOYER_TOKEN || fileConfig.GITHUB.DEPLOYER_TOKEN;
	fileConfig.WEB.URL = process.env.GCI_URL || fileConfig.WEB.URL;
	fileConfig.WEB.PORT = process.env.GCI_PORT || fileConfig.WEB.PORT;
	fileConfig.DEPLOYMENT.DOCKER_IMAGE = process.env.GCI_DOCKER_IMAGE || fileConfig.DEPLOYMENT.DOCKER_IMAGE;

	return fileConfig;
}
