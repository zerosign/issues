const { app, BrowserWindow, protocol } = require('electron');
const pug = require('pug');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const EventEmitter = require('events');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const emitter = new EventEmitter();

async function *list_views(dir) {
  try {
    let { error, nodes } = await readdir(dir);

    if(error != null) {
      throw error;
    }

    for (let inode of nodes) {
      try {
        let { error, status } = await stat(inode);

        if(error != null) {
          throw error;
        }

        if(stat.isDirectory()) {
          await list_views(path.join(dir, inode));
        } else {
          if(inode.endsWith(".pug")) {
            yield path.join(dir, inode);
          } else {
            console.log(`${inode} are being ignored`);
          }
        }
      } catch (e) {
        console.log(`error when foreach ${inode}`, e);
      }
    }

  } catch (e) {
    console.log("error when readdir", e);
  }
};

// contains all views compiled
let views = {};

// preload all the views
(async (views) =>  {
  console.log(`compiling all views`);
  let templates = await list_views();
  for (let template of templates) {
    console.log(`detected ${template}, try to compile pug to html`);
    views[path.parse(template).name] = pug.compileFile(template);
  }

  emitter.emit('views_loaded');
})(views);

// watch all views
fs.watch('./views', { encoding: 'UTF-8' }, (event, filename) => {
  views[path.parse(template).name] = pug.compileFile(filename);
});

process.on('message', (message) => {
  console.log('message from parent (api)', message);
});

let windows = {};

app.on('ready', () => {
  let main = windows['main'] = new BrowserWindow({width: 350, height: 600});

  protocol.registerBufferProtocol('views', (request, send) => {
    let url = new URL(request);

    send({
      mimeType: 'text/html',
      data: new Buffer(views[url.pathname](url.searchParams)),
      charset: 'UTF-8'
    });

  }, (error) => {
    if(error) console.error('Failed to register protocol');
  });

  emitter.on('views_loaded', (err) => {
    main.loadFile(url.format({
      pathname: 'index',
      protocol: 'views:',
      slashes: true
    }));
  });
});
