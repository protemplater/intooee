var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var mime = require('mime-types')
var baseDirectory = __dirname.replace('bin', '');  // or whatever base directory you want

var port = 9009;

http.createServer(function (request, response) {
    try {
        const requestUrl = url.parse(request.url === '/' ? '/sample/index.html' : (request.url.indexOf('/src/') === -1 && request.url.indexOf('node_modules') === -1 ? '/sample/' + request.url: request.url));

        console.log(request.url);
        // need to use path.normalize so people can't access directories underneath baseDirectory
        const fsPath = baseDirectory+path.normalize(requestUrl.pathname);

        const urlMime = request.url.lastIndexOf('?') !== -1 ? request.url.substr(0, request.url.lastIndexOf('?')) :  request.url;
        response.writeHead(200, {"content-type": mime.lookup(urlMime)});
        const fileStream = fs.createReadStream(fsPath);
        fileStream.pipe(response);
        fileStream.on('error',function(e) {
            response.writeHead(404);     // assume the file doesn't exist
            response.end()
        })
    } catch(e) {
        response.writeHead(500)
        response.end()     // end the response so browsers don't hang
        console.log(e.stack)
    }
}).listen(port)

console.log("listening on port "+port)