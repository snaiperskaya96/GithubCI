const restify = require('restify');
const pullRequestHandler = require('./handlers/pull_request');
const logsHandler = require('./handlers/logs');
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

server.get('/logs/:sha/raw', (request, response, next) => {
	logsHandler(request, response, next);
});

server.get('/logs/:sha', (request, response, next) => {
	let url = config.URL + '/logs/' + request.params.sha + '/raw';
	const body = `
		<html>
			<head></head>
			<body>
			<pre id="container" style="background-color: black;color: white;padding: 40px;"></pre>
			<script>
				var container = document.getElementById('container');
				var httpRequest = new XMLHttpRequest();
				var lastResponse = '';
				httpRequest.onreadystatechange = function() {
					if (httpRequest.readyState === XMLHttpRequest.DONE) {
						if (httpRequest.status === 200) {
							var response = httpRequest.responseText;
							if (response != lastResponse && response != '') {
								container.innerHTML += response.replace(lastResponse, '');
								lastResponse = response;
								window.scrollTo(0, document.body.scrollHeight);
							}
						}
					}
				};
				setInterval(function() {
					httpRequest.open('GET', '${url}');
					httpRequest.send();
				}, 2500);
			</script>
			</body>
		</html>`;
	response.writeHead(200, {
	  'Content-Length': Buffer.byteLength(body),
	  'Content-Type': 'text/html'
	});
	response.write(body);
	response.end();
});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

module.exports = server;
