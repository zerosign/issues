const micro = require('micro');
const Router = require('micro-http-router');

const router = new Router({ debug : false});

process.on('message', (message) => {
  console.log('message from parent (api)', message);
});

router.route({
  path: '/',
  method: 'GET',
  handler: (request, response) => {
    return '/';
  }
});

const server = micro((request, response) => router.handle(request, response));
const port = 3000;
server.listen(port);
console.log(`issues server is listening on port ${ port }`);
