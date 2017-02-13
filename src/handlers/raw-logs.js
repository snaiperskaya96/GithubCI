const _ = require('../globals')._;
const fs = require('fs');
const config = require('../config').GITHUB;

module.exports = (request, response, next) => {
	const sha = request.params.sha;
	let log = null;
	if (!sha.match(/[0-9a-f]{40}/)) {
		response.send(200);
		return next();
	}
	try {
		log = fs.readFileSync(__dirname + '/../logs/' + sha, 'utf8');
	} catch (exception) {
		response.send(200);
		return next();
	}
	response.writeHead(200, {
	  'Content-Length': Buffer.byteLength(log),
	  'Content-Type': 'text/html'
	});
	response.write(log);
	response.end();
	return next();
}
