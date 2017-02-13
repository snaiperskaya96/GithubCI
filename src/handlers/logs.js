const config = require('../config').WEB;

module.exports = (request, response, next) => {
	let url = config.URL + ':' + config.PORT + '/logs/' + request.params.sha + '/raw';
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
				function sendUpdateRequest() {
					httpRequest.open('GET', '${url}');
					httpRequest.send();
				}
				sendUpdateRequest();
				setInterval(sendUpdateRequest, 2500);
			</script>
			</body>
		</html>`;
	response.writeHead(200, {
	  'Content-Length': Buffer.byteLength(body),
	  'Content-Type': 'text/html'
	});
	response.write(body);
	response.end();
	return next();
}
