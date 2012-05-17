var static = require('node-static');
var fileServer = new static.Server('./webroot');

var port = 8080;

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response);
    });
}).listen(port);

console.log('Running on http://localhost:' + port);
