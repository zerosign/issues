const { fork } = require('child_process');

const api = fork('api/index.js');
const scrap = fork('scrap/index.js');
const gui = fork('gui/index.js');

api.on('message', (message) => {
  console.log('message from child (api)', message);
});

scrap.on('message', (message) => {
  console.log('message from child (scrap)', message);
});

gui.on('message', (message) => {
  console.log('message from child (gui)', message);
});
