const docker = require('dockerode')({ socketPath: '/var/run/docker.sock' });

module.exports = docker;
