const restify = require('restify');
const pullRequestHandler = require('./handlers/pull_request');

let server = restify.createServer();
server.post('/', (request, response, next) => {
	if (request.header('HTTP_X_GITHUB_EVENT') == 'pull_request') {
		pullRequestHandler(response);
	} else if (request.header('HTTP_X_GITHUB_EVENT') == 'status') {

	}
	next();
});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
