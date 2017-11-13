/* eslint consistent-return:0 */

const express = require('express');
const open = require('open');
const logger = require('./logger');

const argv = require('./argv');
const port = require('./port');
const setup = require('./middlewares/frontendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;
const resolve = require('path').resolve;
const app = express();
const http = require('http');
const request = require('request');
const bodyParser = require('body-parser');

const parseOptions = {
    inflate: true,
    limit: '500kb',
    type: '*/*'
};
app.use(bodyParser.raw(parseOptions));
// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

const proxyRouter = express.Router();
const apiDomain = 'localhost'
const apiPort = '52668';

function ProxyToApi(options, req, res) {
    let data = '';
    const creq = http.request(options, (cres) => {
        // set encoding
        cres.setEncoding('utf8');

        // wait for data
        cres.on('data', (chunk) => {
            data += chunk;
        });

        cres.on('close', () => {
            // closed, let's end client request as well
            for (oldkey in cres.headers) {
                var newkey = oldkey.replace(/((?:^|-)[a-z])/g, (val) => { return val.toUpperCase(); });
                if (newkey === 'Etag') {
                    newkey = 'ETag';
                }
                // custom hack for X-Parse-Os-Version ==> X-Parse-OS-Version
                newkey = newkey.replace(/(-Os-)/g, (val) => { return val.toUpperCase(); });
                cres.headers[newkey] = cres.headers[oldkey];

                delete cres.headers[oldkey];
            }
            res.writeHead(cres.statusCode, 'OK', cres.headers);
            res.write(data);

            res.end();
        });

        cres.on('end', function(){
            // finished, let's finish client request as well
            for (oldkey in cres.headers) {
                var newkey = oldkey.replace(/((?:^|-)[a-z])/g, function(val) { return val.toUpperCase(); });
                if (newkey == 'Etag')
                {
                    newkey = 'ETag';
                }
                // custom hack for X-Parse-Os-Version ==> X-Parse-OS-Version
                newkey = newkey.replace(/(-Os-)/g, function(val) { return val.toUpperCase(); });
                cres.headers[newkey] = cres.headers[oldkey];

                delete cres.headers[oldkey];
            }

            res.writeHead(cres.statusCode, 'OK', cres.headers);
            res.write(data, 'binary');
            res.end();
        });

    }).on('error', function(e) {
        // we got an error, return 500 error to client and log error
        console.log(e);
        res.writeHead(500, '', req.headers);
        res.end();
    });

    if (req.body.length > 0)
    {
        creq.write(req.body);
    }    
    creq.end();
}

const HandleRequest = (req, res, isDatalab) => {
    let qs = '';

    const i = req.originalUrl.indexOf('?');
    if (i !== -1){
        qs = `?${req.originalUrl.substr(i + 1)}`;
    }

    req.headers['x-proxied-ip'] = req.ip;

    const options = {
        // host to forward to
        hostName: `${apiDomain}`,
        // port to forward to
        port: apiPort,
        // path to forward to
        path: `${req.path}${qs}`,
        // request method
        method: req.method,
        // headers to send
        headers: req.headers
    };

    const logData = `${options.method}: ${options.hostName}:${options.port}${options.path}`;
    console.log(logData);
    ProxyToApi(options, req, res);
}


proxyRouter.get('/*', (req, res) => {
    let qs = '';

    const i = req.originalUrl.indexOf('?');
    if (i !== -1){
        qs = `?${req.originalUrl.substr(i + 1)}`;
    }

    req.headers['x-proxied-ip'] = req.ip;

    const url = `http://$${apiDomain}:${apiPort}${req.path}${qs}`;
    console.log(`GET: ${url}`);
    request(
        {
            headers: req.headers,
            uri: url,
            method: 'GET'
        }
    ).on('error', (e) => {
        // we got an error, return 500 error to client and log error
        console.log(e);
        res.writeHead(500, '', req.headers);
        res.end();
    }).pipe(res);
});

proxyRouter.post('/*', (req, res) => {
    HandleRequest(req, res, false);
});

proxyRouter.put('/*', (req, res) => {
    HandleRequest(req, res, false);
});

proxyRouter.delete('/*', (req, res) => {
    HandleRequest(req, res, false);
});
app.use('/xy/', proxyRouter);
// Start your app.
app.listen(port, host, (err) => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    ngrok.connect(port, (innerErr, url) => {
      if (innerErr) {
        return logger.error(innerErr);
      }

      logger.appStarted(port, prettyHost, url);
      open('http://localhost:' + port);
    });
  } else {
    logger.appStarted(port, prettyHost);
    open('http://localhost:' + port);
  }
});
