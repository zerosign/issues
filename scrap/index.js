const fetch = require('node-fetch');
const cluster = require('cluster');
const octokit = require('@octokit/rest')({
  timeout: 5,
  headers: {
    accept: 'application/vnd.github.v3+json',
    'user-agent': 'issues v1.0'
  },
  baseUrl: 'https://api.github.com'
});

process.on('message', (message) => {
  console.log('message from parent (scrap)', message);
});

if(cluster.isMaster) {
  // manage the entire worker childs
} else {
  // child process
}
