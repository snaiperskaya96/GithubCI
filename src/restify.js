const restify = require('restify');
const pullRequestHandler = require('./handlers/pull-request');
const rawLogsHandler = require('./handlers/raw-logs');
const logsHandler = require('./handlers/logs')
const config = require('./config').WEB;

let server = restify.createServer();
server.use(restify.bodyParser({ mapParams: true }));

server.post('/', (request, response, next) => {
	const event = request.header('X-GitHub-Event');
	if (event == 'pull_request') {
		pullRequestHandler(request, response, next);
	} else if (event == 'status') {
		response.send(200);
		return next();
	} else {
		response.send(200);
		return next();
	}
});

server.get('/logs/:sha/raw', rawLogsHandler);

server.get('/logs/:sha', logsHandler);

server.listen(config.PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});

module.exports = server;
