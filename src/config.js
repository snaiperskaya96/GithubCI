const fs = require('fs');

let config = null;
try {
	let configFile = fs.readFileSync(__dirname + '/data/config.json', 'utf8');
	config = JSON.parse(configFile);
} catch (exception) {
	let configFile = fs.readFileSync(__dirname + '/data/config.json.dist', 'utf8');
	config = JSON.parse(configFile);
}

config.GITHUB.CLIENT_TOKEN = process.env.GCI_CLIENT_TOKEN || config.GITHUB.CLIENT_TOKEN;
config.GITHUB.DEPLOYER_TOKEN = process.env.GCI_DEPLOYER_TOKEN || config.GITHUB.DEPLOYER_TOKEN;
config.WEB.URL = process.env.GCI_URL || config.WEB.URL;

module.exports = config;
