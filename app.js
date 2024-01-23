const http = require('http');
const fs = require('fs');
const url = require('url');
const router = require('./router.js');
const{ logger } = require('./controller.js');
const port = 8080;

const server = http.createServer((req,res) => {
    const {query, pathname} = url.parse(req.url,true);
    router.route(req.method,pathname,query,res);
}).listen(port);

logger.info(`Listening on port: ${port}.`);
